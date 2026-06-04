import xml.etree.ElementTree as ET
import re
import math
from pathlib import Path

EXCLUDED_SHAPE_PROXIMITY_THRESHOLD = 80
TEXT_TO_SHAPE_MAX_DISTANCE = 15
NUMBER_TO_SHAPE_MAX_DISTANCE = 15

WHITE = '#ffffff'
PIT_STOP_TEXT = 'Pit Stop'

LEGEND_ITEM_LABELS = ['Obstacle', 'Anti-Pattern', 'Pattern', PIT_STOP_TEXT]

SVG_GROUP_TAG = 'g'
SVG_TEXT_TAG = 'text'
SVG_PATH_TAG = 'path'

class Position:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance_to(self, other):
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2)

    def __repr__(self):
        return f"Position({self.x}, {self.y})"


class BoundingBox:
    def __init__(self, min_x, min_y, max_x, max_y):
        self.min_x = min_x
        self.min_y = min_y
        self.max_x = max_x
        self.max_y = max_y

    def distance_to(self, other):
        dx = max(other.min_x - self.max_x, self.min_x - other.max_x, 0)
        dy = max(other.min_y - self.max_y, self.min_y - other.max_y, 0)
        return math.hypot(dx, dy)


def point_bounds(position):
    return BoundingBox(position.x, position.y, position.x, position.y)


class SvgShape:
    def __init__(self, element, position, color, bounds=None):
        self.element = element
        self.position = position
        self.color = color
        self.bounds = bounds if bounds is not None else point_bounds(position)


class SvgText:
    def __init__(self, element, position, content, bounds=None):
        self.element = element
        self.position = position
        self.content = content
        self.bounds = bounds if bounds is not None else point_bounds(position)


class MapElement:
    def __init__(self, shape, texts=None, number=None):
        self.shape = shape
        self.node_type = self._determine_type(shape.color)
        self.texts = texts or []
        self.number = number
        self.name = self._combine_texts()

    def _determine_type(self, color):
        if '#ffc9c9' in color:
            return 'obstacle'
        elif '#b2f2bb' in color:
            return 'pattern'
        elif '#ffec99' in color:
            return 'antipattern'
        elif '#a5d8ff' in color:
            return 'pitstop'
        return 'unknown'

    def _combine_texts(self):
        if not self.texts:
            return None
        return ' '.join(text.content for text in self.texts)

    def is_interactive(self):
        if self.node_type == 'pitstop' or self.name in ['Obstacle', 'Anti-Pattern', 'Pattern']:
            return False
        return True


class MapElements:
    def __init__(self, legend, interactive):
        self.legend = legend
        self.interactive = interactive

    def legend_count(self):
        return len(self.legend)

    def interactive_count(self):
        return len(self.interactive)


def identify_shapes_from_svg(root):
    shapes = []

    for element in root.iter():
        tag = get_tag_name(element)

        if tag == SVG_GROUP_TAG and is_shape_group_element(element):
            transform = element.attrib.get('transform', '')
            coords = parse_translate(transform)

            if coords:
                x, y = coords
                fill_color = find_fill_color(element)

                if fill_color:
                    position = Position(x, y)
                    bounds = parse_bounds(transform, position)
                    shape = SvgShape(element, position, fill_color, bounds)
                    shapes.append(shape)

    return shapes


def extract_text_with_position(element):
    text_contents = []
    text_x = 0
    text_y = 0

    for child in element:
        if get_tag_name(child) == SVG_TEXT_TAG:
            content = extract_text_content(child)
            if content:
                text_contents.append(content)
                text_x = float(child.attrib.get('x', 0))
                text_y = float(child.attrib.get('y', 0))

    if not text_contents:
        return None, 0, 0

    combined_content = ' '.join(text_contents)
    return combined_content, text_x, text_y

def identify_labels_from_svg(root):
    labels = []

    for element in root.iter():
        tag = get_tag_name(element)

        if tag == SVG_GROUP_TAG and element_has_text_child(element):
            transform = element.attrib.get('transform', '')
            coords = parse_translate(transform)

            if coords:
                x, y = coords
                combined_content, text_x, text_y = extract_text_with_position(element)

                if combined_content:
                    actual_x = x + text_x
                    actual_y = y + text_y
                    position = Position(actual_x, actual_y)
                    bounds = parse_bounds(transform, Position(x, y))
                    label = SvgText(element, position, combined_content, bounds)
                    labels.append(label)

    return labels


def match_nearest_label(shape, labels, max_distance):
    closest = None
    min_distance = float('inf')

    for label in labels:
        distance = shape.bounds.distance_to(label.bounds)
        if distance < max_distance and distance < min_distance:
            min_distance = distance
            closest = label

    return closest


def get_available_items(items, used_indices):
    return [item for i, item in enumerate(items) if i not in used_indices]

def mark_label_as_used(label, all_labels, used_indices):
    if label:
        index = all_labels.index(label)
        used_indices.add(index)

def separate_names_from_numbers(labels):
    pattern_names = [l for l in labels if not l.content.isdigit()]
    numbers = [l for l in labels if l.content.isdigit()]
    return pattern_names, numbers

def sort_shapes_by_proximity_to_names(shapes, pattern_names):
    shapes_with_nearest_distance = []
    for shape in shapes:
        nearest_name = match_nearest_label(shape, pattern_names, TEXT_TO_SHAPE_MAX_DISTANCE)
        min_distance = shape.position.distance_to(nearest_name.position) if nearest_name else float('inf')
        shapes_with_nearest_distance.append((shape, min_distance))

    return [shape for shape, _ in sorted(shapes_with_nearest_distance, key=lambda x: x[1])]

def build_map_elements(shapes, labels):
    pattern_names, numbers = separate_names_from_numbers(labels)
    used_numbers = set()
    used_names = set()
    elements = []

    sorted_shapes = sort_shapes_by_proximity_to_names(shapes, pattern_names)

    for shape in sorted_shapes:
        available_names = get_available_items(pattern_names, used_names)
        available_numbers = get_available_items(numbers, used_numbers)
        closest_name = match_nearest_label(shape, available_names, TEXT_TO_SHAPE_MAX_DISTANCE)
        matched_number = match_nearest_label(shape, available_numbers, NUMBER_TO_SHAPE_MAX_DISTANCE)

        if closest_name or matched_number:
            texts = [closest_name] if closest_name else []
            element = MapElement(shape, texts=texts, number=matched_number)

            mark_label_as_used(closest_name, pattern_names, used_names)
            mark_label_as_used(matched_number, numbers, used_numbers)

            elements.append(element)

    return elements


def identify_map_elements(root):
    shapes = identify_shapes_from_svg(root)
    labels = identify_labels_from_svg(root)

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items(shapes, labels)

    legend_elements = build_map_elements(legend_shapes, legend_labels)
    interactive_elements = build_map_elements(regular_shapes, regular_labels)

    return MapElements(legend_elements, interactive_elements)


def set_interactive_attributes(group, element):
    group.set('class', 'interactive-node')
    if element.name:
        group.set('data-label', element.name)
    group.set('data-color', element.node_type)
    if element.number:
        group.set('data-number', element.number.content)

def set_non_interactive_attributes(group, element):
    group.set('class', 'non-interactive-element')
    if element.name:
        group.set('data-type', element.name)

def map_element_to_svg_group(element):
    g = ET.Element('g')

    if element.is_interactive():
        set_interactive_attributes(g, element)
    else:
        set_non_interactive_attributes(g, element)

    g.append(element.shape.element)
    if element.number:
        g.append(element.number.element)
    for text in element.texts:
        g.append(text.element)
    return g


def add_map_elements_to_svg(root, map_elements):
    for element in map_elements:
        group = map_element_to_svg_group(element)
        root.append(group)


def partition_list(items, predicate):
    matching = []
    non_matching = []
    for item in items:
        if predicate(item):
            matching.append(item)
        else:
            non_matching.append(item)
    return matching, non_matching

def is_shape_near_any_label(shape, labels):
    return any(shape.position.distance_to(label.position) < EXCLUDED_SHAPE_PROXIMITY_THRESHOLD for label in labels)

def separate_legend_items(shapes, labels):
    legend_labels, regular_labels = partition_list(labels, lambda l: l.content in LEGEND_ITEM_LABELS)
    legend_shapes, regular_shapes = partition_list(shapes, lambda s: is_shape_near_any_label(s, legend_labels))

    return legend_labels, regular_labels, legend_shapes, regular_shapes

def get_tag_name(element):
    return element.tag.split('}')[-1] if '}' in element.tag else element.tag

def parse_translate(transform):
    match = re.search(r'translate\(([\d.-]+)\s+([\d.-]+)\)', transform)
    if match:
        return float(match.group(1)), float(match.group(2))
    return None

def parse_bounds(transform, position):
    match = re.search(r'rotate\([\d.-]+\s+([\d.-]+)\s+([\d.-]+)\)', transform)
    if not match:
        return point_bounds(position)
    half_width, half_height = float(match.group(1)), float(match.group(2))
    return BoundingBox(position.x, position.y,
                       position.x + 2 * half_width, position.y + 2 * half_height)

def calculate_distance(x1, y1, x2, y2):
    return Position(x1, y1).distance_to(Position(x2, y2))

def safe_remove_element(parent, element):
    try:
        parent.remove(element)
    except ValueError:
        pass

def has_colored_fill(fill):
    return fill and fill not in ['none', WHITE, 'white']

def extract_text_content(text_element):
    text_content = []
    for child in text_element:
        if child.text:
            text_content.append(child.text.strip())
    if not text_content and text_element.text:
        text_content = [text_element.text.strip()]
    return ' '.join(text_content)

def find_fill_color(element):
    for path in element:
        if get_tag_name(path) == SVG_PATH_TAG:
            fill = path.attrib.get('fill', '')
            if has_colored_fill(fill):
                return fill
    return None

def element_has_text_child(element):
    return any(get_tag_name(child) == SVG_TEXT_TAG for child in element)

def is_shape_group_element(element):
    return 'stroke-linecap' in element.attrib

def is_white_background_rectangle(rectangle):
    return rectangle.attrib.get('fill') == WHITE and rectangle.attrib.get('x') == '0' and rectangle.attrib.get('y') == '0'

def remove_white_background_rectangle(root):
    for rectangle in root.findall('.//{http://www.w3.org/2000/svg}rect'):
        if is_white_background_rectangle(rectangle):
            root.remove(rectangle)
            break

def remove_elements_from_parents(elements, parent_map):
    for element in elements:
        parent = parent_map.get(element.element)
        if parent is not None:
            safe_remove_element(parent, element.element)

def remove_original_elements_from_svg(root, shapes, labels):
    parent_map = {c: p for p in root.iter() for c in p}
    remove_elements_from_parents(shapes, parent_map)
    remove_elements_from_parents(labels, parent_map)

def to_semantic_map(root):
    map_elements = identify_map_elements(root)
    restructure_svg(root, map_elements)
    return map_elements.interactive_count(), map_elements.legend_count()

def load_svg_tree(svg_path):
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    tree = ET.parse(svg_path)
    root = tree.getroot()
    return tree, root

def save_svg_tree(tree, output_path):
    tree.write(output_path, encoding='utf-8', xml_declaration=True)

def restructure_svg(root, map_elements):
    shapes = identify_shapes_from_svg(root)
    labels = identify_labels_from_svg(root)

    remove_white_background_rectangle(root)
    remove_original_elements_from_svg(root, shapes, labels)

    add_map_elements_to_svg(root, map_elements.legend)
    add_map_elements_to_svg(root, map_elements.interactive)

def save_semantic_map(svg_path, output_path):
    tree, root = load_svg_tree(svg_path)

    interactive_count, legend_count = to_semantic_map(root)

    save_svg_tree(tree, output_path)
    print(f"Grouped SVG saved to: {output_path}")
    print(f"Created {interactive_count} interactive nodes and {legend_count} legend items")

if __name__ == "__main__":
    import argparse

    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    output_dir = repo_root / "website" / "public" / "maps"

    parser = argparse.ArgumentParser(description="Turn an Excalidraw map SVG into an interactive semantic map.")
    parser.add_argument("input", nargs="?", default=str(repo_root / "website" / "app" / "talk" / "map.svg"),
                        help="Input Excalidraw SVG (default: the v1 talk map)")
    parser.add_argument("output", nargs="?", default=str(output_dir / "semantic_map.svg"),
                        help="Output semantic SVG (default: public/maps/semantic_map.svg)")
    args = parser.parse_args()

    output_dir.mkdir(parents=True, exist_ok=True)
    save_semantic_map(args.input, args.output)
