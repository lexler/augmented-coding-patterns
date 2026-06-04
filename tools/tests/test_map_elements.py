import sys
from pathlib import Path
import pytest

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / "tools"))

from process_map import Position, BoundingBox, SvgShape, SvgText, MapElement, MapElements, identify_shapes_from_svg, identify_labels_from_svg, match_nearest_label, build_map_elements, calculate_distance, separate_legend_items, map_element_to_svg_group, identify_map_elements, load_svg_tree, save_svg_tree, restructure_svg
from svg_fixtures import create_shape_group, create_text_group, create_multi_line_text_group
import xml.etree.ElementTree as ET


def test_position_stores_coordinates():
    position = Position(100.5, 200.7)

    assert position.x == 100.5
    assert position.y == 200.7


def test_position_calculates_distance():
    position1 = Position(0, 0)
    position2 = Position(3, 4)

    distance = position1.distance_to(position2)

    assert distance == 5.0


def test_position_has_readable_representation():
    position = Position(100.5, 200.7)

    result = repr(position)

    assert result == "Position(100.5, 200.7)"


def test_calculate_distance_returns_pythagorean_distance():
    distance = calculate_distance(0, 0, 3, 4)

    assert distance == 5.0


def test_calculate_distance_works_with_floats():
    distance = calculate_distance(1.5, 2.5, 4.5, 6.5)

    assert distance == 5.0


def test_calculate_distance_is_zero_for_same_point():
    distance = calculate_distance(100, 200, 100, 200)

    assert distance == 0.0


def test_svg_shape_stores_element_position_and_color():
    element = "mock_element"
    position = Position(50, 100)
    color = "#b2f2bb"

    shape = SvgShape(element, position, color)

    assert shape.element == "mock_element"
    assert shape.position == position
    assert shape.color == "#b2f2bb"


def test_svg_shape_exposes_position_coordinates():
    position = Position(150, 250)
    shape = SvgShape("element", position, "#ffec99")

    assert shape.position.x == 150
    assert shape.position.y == 250


def test_svg_text_stores_element_position_and_content():
    element = "text_element"
    position = Position(75, 125)
    content = "Context Management"

    text = SvgText(element, position, content)

    assert text.element == "text_element"
    assert text.position == position
    assert text.content == "Context Management"


def test_svg_text_exposes_position_coordinates():
    position = Position(80, 90)
    text = SvgText("elem", position, "Test")

    assert text.position.x == 80
    assert text.position.y == 90


def test_map_element_determines_obstacle_from_color():
    shape = SvgShape("shape_elem", Position(0, 0), "#ffc9c9")

    element = MapElement(shape)

    assert element.node_type == 'obstacle'


def test_map_element_determines_pattern_from_color():
    shape = SvgShape("shape_elem", Position(0, 0), "#b2f2bb")

    element = MapElement(shape)

    assert element.node_type == 'pattern'


def test_map_element_determines_antipattern_from_color():
    shape = SvgShape("shape_elem", Position(0, 0), "#ffec99")

    element = MapElement(shape)

    assert element.node_type == 'antipattern'


def test_map_element_determines_pitstop_from_color():
    shape = SvgShape("shape_elem", Position(0, 0), "#a5d8ff")

    element = MapElement(shape)

    assert element.node_type == 'pitstop'
def test_map_element_with_no_texts_has_none_name():
    shape = SvgShape("shape", Position(0, 0), "#b2f2bb")

    element = MapElement(shape)

    assert element.name is None


def test_map_element_with_single_text_combines_to_name():
    shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
    text = SvgText("text_elem", Position(5, 5), "Context Management")

    element = MapElement(shape, texts=[text])

    assert element.name == "Context Management"


def test_map_element_with_multiple_texts_combines_with_spaces():
    shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
    text1 = SvgText("text1", Position(5, 5), "Knowledge")
    text2 = SvgText("text2", Position(5, 10), "Document")

    element = MapElement(shape, texts=[text1, text2])

    assert element.name == "Knowledge Document"


def test_map_element_is_interactive_for_pattern_without_legend_label():
    shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
    text = SvgText("text", Position(5, 5), "Context Management")
    element = MapElement(shape, texts=[text])

    assert element.is_interactive() is True


def test_map_element_is_not_interactive_for_pitstop():
    shape = SvgShape("shape", Position(0, 0), "#a5d8ff")
    element = MapElement(shape)

    assert element.is_interactive() is False


def test_map_element_is_not_interactive_when_name_is_obstacle():
    shape = SvgShape("shape", Position(0, 0), "#ffc9c9")
    text = SvgText("text", Position(5, 5), "Obstacle")
    element = MapElement(shape, texts=[text])

    assert element.is_interactive() is False


def test_map_element_is_not_interactive_when_name_is_antipattern():
    shape = SvgShape("shape", Position(0, 0), "#ffec99")
    text = SvgText("text", Position(5, 5), "Anti-Pattern")
    element = MapElement(shape, texts=[text])

    assert element.is_interactive() is False


def test_map_element_is_not_interactive_when_name_is_pattern():
    shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
    text = SvgText("text", Position(5, 5), "Pattern")
    element = MapElement(shape, texts=[text])

    assert element.is_interactive() is False


def test_identify_shapes_extracts_shape_with_position_and_color():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')
    root.append(create_shape_group(500, 300, '#b2f2bb'))

    shapes = identify_shapes_from_svg(root)

    assert len(shapes) == 1
    assert shapes[0].position.x == 500
    assert shapes[0].position.y == 300
    assert shapes[0].color == '#b2f2bb'


def test_identify_shapes_returns_empty_when_no_shapes():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')

    shapes = identify_shapes_from_svg(root)

    assert shapes == []


def test_identify_labels_extracts_single_line_text():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')
    root.append(create_text_group(100, 200, 'Context Management'))

    labels = identify_labels_from_svg(root)

    assert len(labels) == 1
    assert labels[0].content == 'Context Management'
    assert labels[0].position.x == 148.8
    assert labels[0].position.y == 217.6
def test_identify_labels_combines_multi_line_text():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')
    root.append(create_multi_line_text_group(200, 150, 'Knowledge', 'Document'))

    labels = identify_labels_from_svg(root)

    assert len(labels) == 1
    assert labels[0].content == 'Knowledge Document'


def test_identify_labels_extracts_digit():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')
    root.append(create_text_group(625, 302, '1'))

    labels = identify_labels_from_svg(root)

    assert len(labels) == 1
    assert labels[0].content == '1'


def test_match_nearest_label_finds_closest_within_distance():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    label1 = SvgText("text1", Position(110, 105), "Far Label")
    label2 = SvgText("text2", Position(102, 101), "Close Label")
    labels = [label1, label2]

    matched = match_nearest_label(shape, labels, max_distance=150)

    assert matched == label2
def test_match_nearest_label_returns_none_when_too_far():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    label = SvgText("text", Position(300, 300), "Far Label")

    matched = match_nearest_label(shape, [label], max_distance=50)

    assert matched is None


def test_build_map_elements_creates_element_with_matched_labels():
    shape = SvgShape("shape", Position(500, 300), '#b2f2bb')
    name_label = SvgText("text1", Position(505, 305), 'Context Management')
    number_label = SvgText("text2", Position(498, 318), '1')

    shapes = [shape]
    labels = [name_label, number_label]

    elements = build_map_elements(shapes, labels)

    assert len(elements) == 1
    assert elements[0].shape == shape
    assert elements[0].name == 'Context Management'
    assert elements[0].node_type == 'pattern'


def test_build_map_elements_separates_name_from_number():
    shape = SvgShape("shape", Position(500, 300), '#b2f2bb')
    name1 = SvgText("t1", Position(505, 305), 'Knowledge')
    name2 = SvgText("t2", Position(505, 320), 'Document')
    number = SvgText("t3", Position(498, 318), '2')

    shapes = [shape]
    labels = [name1, name2, number]

    elements = build_map_elements(shapes, labels)

    assert len(elements) == 1
    assert elements[0].name == 'Knowledge'


def test_separate_legend_items_returns_empty_when_no_legend_labels():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    label = SvgText("text", Position(105, 105), 'Context Management')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([shape], [label])

    assert legend_labels == []
    assert legend_shapes == []
    assert regular_labels == [label]
    assert regular_shapes == [shape]


def test_separate_legend_items_identifies_obstacle_label():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    regular_label = SvgText("text1", Position(105, 105), 'Context Management')
    legend_label = SvgText("text2", Position(200, 200), 'Obstacle')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([shape], [regular_label, legend_label])

    assert legend_labels == [legend_label]
    assert regular_labels == [regular_label]


def test_separate_legend_items_identifies_antipattern_label():
    legend_label = SvgText("text", Position(200, 200), 'Anti-Pattern')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([], [legend_label])

    assert legend_labels == [legend_label]
    assert regular_labels == []


def test_separate_legend_items_identifies_pattern_label():
    legend_label = SvgText("text", Position(200, 200), 'Pattern')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([], [legend_label])

    assert legend_labels == [legend_label]


def test_separate_legend_items_identifies_pitstop_label():
    legend_label = SvgText("text", Position(200, 200), 'Pit Stop')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([], [legend_label])

    assert legend_labels == [legend_label]



def test_separate_legend_items_identifies_shape_near_legend_label():
    legend_label = SvgText("text", Position(100, 100), 'Obstacle')
    nearby_shape = SvgShape("shape1", Position(120, 110), '#b2f2bb')
    far_shape = SvgShape("shape2", Position(500, 500), '#ffc9c9')

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items([nearby_shape, far_shape], [legend_label])

    assert legend_shapes == [nearby_shape]
    assert regular_shapes == [far_shape]


def test_convert_interactive_map_element_to_svg_group_with_class():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    text_elem = ET.Element('g')
    text = SvgText(text_elem, Position(100, 100), 'Builder')
    element = MapElement(shape, [text])

    group = map_element_to_svg_group(element)

    assert group.get('class') == 'interactive-node'


def test_set_data_label_attribute_to_map_element_name():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    text_elem = ET.Element('g')
    text = SvgText(text_elem, Position(100, 100), 'Builder')
    element = MapElement(shape, [text])

    group = map_element_to_svg_group(element)

    assert group.get('data-label') == 'Builder'


def test_set_data_color_attribute_based_on_node_type():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    element = MapElement(shape)

    group = map_element_to_svg_group(element)

    assert group.get('data-color') == 'pattern'


def test_include_shape_element_in_group():
    shape_elem = ET.Element('g')
    shape_elem.set('id', 'shape-123')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    element = MapElement(shape)

    group = map_element_to_svg_group(element)

    children = list(group)
    assert len(children) == 1
    assert children[0].get('id') == 'shape-123'


def test_include_text_elements_in_group():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    text_elem1 = ET.Element('g')
    text_elem1.set('id', 'text-1')
    text1 = SvgText(text_elem1, Position(100, 100), 'Builder')
    text_elem2 = ET.Element('g')
    text_elem2.set('id', 'text-2')
    text2 = SvgText(text_elem2, Position(100, 110), 'Pattern')
    element = MapElement(shape, [text1, text2])

    group = map_element_to_svg_group(element)

    children = list(group)
    assert len(children) == 3
    assert children[0] == shape_elem
    assert children[1].get('id') == 'text-1'
    assert children[2].get('id') == 'text-2'


def test_convert_non_interactive_map_element_to_svg_group():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#a5d8ff')
    text_elem = ET.Element('g')
    text = SvgText(text_elem, Position(100, 100), 'Pit Stop')
    element = MapElement(shape, [text])

    group = map_element_to_svg_group(element)

    assert group.get('class') == 'non-interactive-element'
    assert group.get('data-type') == 'Pit Stop'


def test_map_element_stores_number_label_separately():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    text_elem = ET.Element('g')
    text = SvgText(text_elem, Position(100, 100), 'Builder')
    number_elem = ET.Element('g')
    number = SvgText(number_elem, Position(100, 100), '5')
    element = MapElement(shape, [text], number)

    assert element.number == number
    assert element.texts == [text]


def test_include_number_element_in_svg_group():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    number_elem = ET.Element('g')
    number_elem.set('id', 'num-13')
    number = SvgText(number_elem, Position(100, 100), '13')
    element = MapElement(shape, [], number)

    group = map_element_to_svg_group(element)

    children = list(group)
    assert len(children) == 2
    assert children[0] == shape_elem
    assert children[1].get('id') == 'num-13'


def test_set_data_number_attribute_from_number_label():
    shape_elem = ET.Element('g')
    shape = SvgShape(shape_elem, Position(100, 100), '#b2f2bb')
    number_elem = ET.Element('g')
    number = SvgText(number_elem, Position(100, 100), '13')
    element = MapElement(shape, [], number)

    group = map_element_to_svg_group(element)

    assert group.get('data-number') == '13'


def test_build_map_elements_assigns_each_clustered_node_its_own_label():
    shape_playgrounds = SvgShape("s_playgrounds", Position(900, 450), '#b2f2bb', BoundingBox(900, 450, 950, 500))
    shape_unvalidated = SvgShape("s_unvalidated", Position(1000, 450), '#ffec99', BoundingBox(1000, 450, 1050, 500))
    shape_degrades = SvgShape("s_degrades", Position(1100, 450), '#ffc9c9', BoundingBox(1100, 450, 1170, 520))

    label_playgrounds = SvgText("l_playgrounds", Position(900, 505), 'Playgrounds', BoundingBox(900, 505, 950, 520))
    label_unvalidated = SvgText("l_unvalidated", Position(1000, 505), 'Unvalidated Leaps', BoundingBox(1000, 505, 1050, 520))
    label_degrades = SvgText("l_degrades", Position(1100, 525), 'Degrades Under Complexity', BoundingBox(1100, 525, 1170, 540))

    shapes = [shape_degrades, shape_unvalidated, shape_playgrounds]
    labels = [label_playgrounds, label_unvalidated, label_degrades]

    elements = build_map_elements(shapes, labels)

    assert len(elements) == 3

    elements_by_name = {e.name: e for e in elements}
    assert elements_by_name['Playgrounds'].shape == shape_playgrounds
    assert elements_by_name['Unvalidated Leaps'].shape == shape_unvalidated
    assert elements_by_name['Degrades Under Complexity'].shape == shape_degrades


def test_map_extracts_expected_node_type_counts():
    input_svg = project_root / "website" / "app" / "talk" / "map.svg"
    tree = ET.parse(str(input_svg))
    root = tree.getroot()

    all_shapes = identify_shapes_from_svg(root)
    all_labels = identify_labels_from_svg(root)

    legend_labels, regular_labels, legend_shapes, regular_shapes = separate_legend_items(all_shapes, all_labels)

    elements = build_map_elements(regular_shapes, regular_labels)

    counts = {'pattern': 0, 'antipattern': 0, 'obstacle': 0, 'pitstop': 0}
    for elem in elements:
        if elem.node_type in counts:
            counts[elem.node_type] += 1

    assert counts['pattern'] == 21
    assert counts['antipattern'] == 6
    assert counts['obstacle'] == 10
    assert counts['pitstop'] == 0


def test_map_elements_stores_legend_and_interactive_elements():
    legend = ["legend1", "legend2"]
    interactive = ["interactive1", "interactive2", "interactive3"]

    map_elements = MapElements(legend, interactive)

    assert map_elements.legend == legend
    assert map_elements.interactive == interactive


def test_map_elements_returns_legend_count():
    legend = ["legend1", "legend2"]
    interactive = ["interactive1", "interactive2", "interactive3"]
    map_elements = MapElements(legend, interactive)

    count = map_elements.legend_count()

    assert count == 2


def test_map_elements_returns_interactive_count():
    legend = ["legend1", "legend2"]
    interactive = ["interactive1", "interactive2", "interactive3"]
    map_elements = MapElements(legend, interactive)

    count = map_elements.interactive_count()

    assert count == 3


def test_identify_map_elements_returns_map_elements_with_legend_and_interactive():
    root = ET.Element('svg')
    root.append(create_shape_group(10, 10, '#b2f2bb'))
    root.append(create_text_group(15, 15, 'Pattern'))
    root.append(create_shape_group(200, 200, '#b2f2bb'))
    root.append(create_text_group(205, 205, 'Test Pattern'))

    map_elements = identify_map_elements(root)

    assert isinstance(map_elements, MapElements)
    assert map_elements.legend_count() == 1
    assert map_elements.interactive_count() == 1


def test_load_svg_tree_returns_tree_and_root_from_file_path():
    svg_path = project_root / "website" / "app" / "talk" / "map.svg"

    tree, root = load_svg_tree(str(svg_path))

    assert tree is not None
    assert root is not None
    assert root.tag.endswith('svg')


def test_save_svg_tree_writes_tree_to_output_path(tmp_path):
    root = ET.Element('svg')
    root.append(create_shape_group(10, 10, '#b2f2bb'))
    tree = ET.ElementTree(root)
    output_path = tmp_path / "test_output.svg"

    save_svg_tree(tree, str(output_path))

    assert output_path.exists()


def test_restructure_svg_removes_original_elements_and_adds_semantic_groups():
    root = ET.Element('svg')
    shape_group = create_shape_group(200, 200, '#b2f2bb')
    text_group = create_text_group(205, 205, 'Test Pattern')
    root.append(shape_group)
    root.append(text_group)

    map_elements = identify_map_elements(root)
    original_child_count = len(list(root))

    restructure_svg(root, map_elements)

    new_child_count = len(list(root))
    assert new_child_count > 0
    groups_with_class = [child for child in root if 'class' in child.attrib]
    assert len(groups_with_class) > 0


def test_map_element_determines_obstacle_with_partial_color_match():
    shape = SvgShape("shape", Position(0, 0), "#ffc9c9ff")

    element = MapElement(shape)

    assert element.node_type == 'obstacle'


def test_map_element_determines_unknown_for_empty_color():
    shape = SvgShape("shape", Position(0, 0), "")

    element = MapElement(shape)

    assert element.node_type == 'unknown'


def test_position_calculates_distance_with_negative_coordinates():
    position1 = Position(-100, -200)
    position2 = Position(-97, -196)

    distance = position1.distance_to(position2)

    assert distance == 5.0


def test_position_calculates_distance_with_mixed_signs():
    position1 = Position(-10, 10)
    position2 = Position(10, -10)

    distance = position1.distance_to(position2)

    assert abs(distance - 28.284271247461902) < 0.0001


def test_parse_translate_returns_none_for_invalid_format():
    from process_map import parse_translate

    result = parse_translate("invalid_transform")

    assert result is None


def test_parse_translate_returns_none_for_empty_string():
    from process_map import parse_translate

    result = parse_translate("")

    assert result is None


def test_parse_translate_handles_negative_values():
    from process_map import parse_translate

    result = parse_translate("translate(-100.5 -200.7)")

    assert result == (-100.5, -200.7)


def test_extract_text_content_handles_whitespace_only_text():
    from process_map import extract_text_content
    svg_ns = "{http://www.w3.org/2000/svg}"
    text_element = ET.Element(f'{svg_ns}text')
    text_element.text = '   \t\n   '

    result = extract_text_content(text_element)

    assert result == ''


def test_identify_shapes_from_empty_svg_returns_empty_list():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')

    shapes = identify_shapes_from_svg(root)

    assert shapes == []


def test_identify_labels_from_empty_svg_returns_empty_list():
    svg_ns = "{http://www.w3.org/2000/svg}"
    root = ET.Element(f'{svg_ns}svg')

    labels = identify_labels_from_svg(root)

    assert labels == []


def test_build_map_elements_with_empty_shapes_returns_empty():
    elements = build_map_elements([], [])

    assert elements == []


def test_match_nearest_label_with_multiple_equidistant_labels_returns_first():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    label1 = SvgText("text1", Position(105, 100), "Label 1")
    label2 = SvgText("text2", Position(95, 100), "Label 2")

    matched = match_nearest_label(shape, [label1, label2], max_distance=150)

    assert matched == label1


def test_build_map_elements_with_duplicate_labels():
    shape1 = SvgShape("shape1", Position(100, 100), '#b2f2bb')
    shape2 = SvgShape("shape2", Position(200, 200), '#ffc9c9')
    duplicate_label = SvgText("text", Position(105, 105), "Same Name")
    duplicate_label2 = SvgText("text2", Position(205, 205), "Same Name")

    elements = build_map_elements([shape1, shape2], [duplicate_label, duplicate_label2])

    assert len(elements) == 2
    assert elements[0].name == "Same Name"
    assert elements[1].name == "Same Name"


def test_build_map_elements_with_no_valid_name_labels():
    shape = SvgShape("shape", Position(100, 100), '#b2f2bb')
    number_only = SvgText("num", Position(102, 102), '42')

    elements = build_map_elements([shape], [number_only])

    assert len(elements) == 1
    assert elements[0].name is None
    assert elements[0].number.content == '42'


class TestBugMagnetSession20251114:
    def test_map_element_with_unicode_text(self):
        shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
        unicode_text = SvgText("text", Position(5, 5), "Café 北京 مرحبا 🎨")

        element = MapElement(shape, texts=[unicode_text])

        assert element.name == "Café 北京 مرحبا 🎨"

    def test_map_element_with_empty_string_text(self):
        shape = SvgShape("shape", Position(0, 0), "#b2f2bb")
        empty_text = SvgText("text", Position(5, 5), "")

        element = MapElement(shape, texts=[empty_text])

        assert element.name == ""

    def test_position_with_zero_coordinates(self):
        position = Position(0, 0)

        assert position.x == 0
        assert position.y == 0
        assert position.distance_to(Position(0, 0)) == 0

    def test_build_map_elements_with_overlapping_shapes_and_labels(self):
        shape1 = SvgShape("s1", Position(100, 100), '#b2f2bb')
        shape2 = SvgShape("s2", Position(102, 102), '#ffc9c9')
        label = SvgText("l1", Position(101, 101), "Shared Label")

        elements = build_map_elements([shape1, shape2], [label])

        assert len(elements) == 1
        assert elements[0].name == "Shared Label"

    def test_multiple_shapes_compete_for_same_number_label(self):
        shape1 = SvgShape("s1", Position(100, 100), '#b2f2bb')
        shape2 = SvgShape("s2", Position(105, 105), '#ffc9c9')
        number = SvgText("num", Position(102, 102), '1')

        elements = build_map_elements([shape1, shape2], [number])

        numbers_assigned = sum(1 for e in elements if e.number is not None)
        assert numbers_assigned == 1

    def test_extract_text_with_position_handles_multiple_text_elements(self):
        from process_map import extract_text_with_position
        svg_ns = "{http://www.w3.org/2000/svg}"
        group = ET.Element(f'{svg_ns}g')
        text1 = ET.SubElement(group, f'{svg_ns}text')
        text1.set('x', '10')
        text1.set('y', '20')
        text1.text = 'First'
        text2 = ET.SubElement(group, f'{svg_ns}text')
        text2.set('x', '30')
        text2.set('y', '40')
        text2.text = 'Second'

        content, x, y = extract_text_with_position(group)

        assert content == 'First Second'
        assert x == 30
        assert y == 40


def test_bounding_box_distance_is_zero_when_boxes_overlap():
    a = BoundingBox(0, 0, 10, 10)
    b = BoundingBox(5, 5, 15, 15)

    distance = a.distance_to(b)

    assert distance == 0.0


def test_bounding_box_distance_equals_horizontal_gap():
    a = BoundingBox(0, 0, 10, 10)
    b = BoundingBox(13, 0, 20, 10)

    distance = a.distance_to(b)

    assert distance == 3.0


def test_bounding_box_distance_equals_vertical_gap():
    a = BoundingBox(0, 0, 10, 10)
    b = BoundingBox(0, 14, 10, 20)

    distance = a.distance_to(b)

    assert distance == 4.0


def test_bounding_box_distance_is_diagonal_hypotenuse():
    a = BoundingBox(0, 0, 10, 10)
    b = BoundingBox(13, 14, 20, 20)

    distance = a.distance_to(b)

    assert distance == 5.0


def test_bounding_box_from_a_point_distances_like_a_point():
    point = BoundingBox(0, 0, 0, 0)
    other = BoundingBox(3, 4, 3, 4)

    distance = point.distance_to(other)

    assert distance == 5.0


def test_svg_shape_exposes_bounding_box():
    bounds = BoundingBox(0, 0, 50, 50)

    shape = SvgShape("elem", Position(0, 0), "#b2f2bb", bounds)

    assert shape.bounds is bounds


def test_svg_text_exposes_bounding_box():
    bounds = BoundingBox(0, 0, 90, 30)

    text = SvgText("elem", Position(0, 0), "Context Management", bounds)

    assert text.bounds is bounds


def test_match_nearest_label_uses_box_edge_not_anchor_distance():
    shape = SvgShape("shape", Position(0, 0), '#b2f2bb', BoundingBox(0, 0, 10, 10))
    near_edge_far_anchor = SvgText("a", Position(106, 5), "A", BoundingBox(12, 0, 200, 10))
    far_edge_near_anchor = SvgText("b", Position(5, 35), "B", BoundingBox(0, 30, 10, 40))

    matched = match_nearest_label(shape, [near_edge_far_anchor, far_edge_near_anchor], max_distance=150)

    assert matched.content == "A"


def test_identify_shapes_derives_bounds_from_transform():
    svg_ns = "http://www.w3.org/2000/svg"
    root = ET.Element(f'{{{svg_ns}}}svg')
    root.append(create_shape_group(100, 200, '#b2f2bb'))

    shapes = identify_shapes_from_svg(root)

    bounds = shapes[0].bounds
    assert (bounds.min_x, bounds.min_y, bounds.max_x, bounds.max_y) == (100, 200, 153.4, 252.4)


def test_identify_labels_derives_bounds_from_translate_origin():
    svg_ns = "http://www.w3.org/2000/svg"
    root = ET.Element(f'{{{svg_ns}}}svg')
    root.append(create_text_group(100, 200, 'Context Management'))

    labels = identify_labels_from_svg(root)

    bounds = labels[0].bounds
    assert (bounds.min_x, bounds.min_y, bounds.max_x, bounds.max_y) == (100, 200, 197.6, 250.2)


def test_parse_bounds_falls_back_to_point_when_transform_has_no_rotate():
    from process_map import parse_bounds

    bounds = parse_bounds("translate(10 20)", Position(10, 20))

    assert (bounds.min_x, bounds.min_y, bounds.max_x, bounds.max_y) == (10, 20, 10, 20)


def test_build_map_elements_does_not_let_a_large_shape_steal_a_neighbors_number():
    number = SvgText("n6", Position(105, 105), "6", BoundingBox(100, 100, 110, 110))
    small_name = SvgText("fn", Position(100, 120), "Focused Agent", BoundingBox(95, 120, 115, 130))
    large_name = SvgText("ln", Position(150, 90), "Limited Focus", BoundingBox(140, 80, 200, 140))
    small = SvgShape("s_small", Position(95, 95), '#b2f2bb', BoundingBox(95, 95, 115, 115))
    large = SvgShape("s_large", Position(140, 80), '#ffc9c9', BoundingBox(140, 80, 200, 140))

    elements = build_map_elements([large, small], [small_name, large_name, number])

    by_shape = {el.shape.element: el for el in elements}
    assert by_shape["s_small"].number is not None and by_shape["s_small"].number.content == "6"
    assert by_shape["s_large"].number is None
