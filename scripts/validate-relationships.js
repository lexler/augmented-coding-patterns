#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Categories to scan
const CATEGORIES = ['patterns', 'anti-patterns', 'obstacles'];

// Path to documents directory
const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

// Path to relationships file
const RELATIONSHIPS_FILE = path.join(DOCUMENTS_DIR, 'relationships.mmd');

// Single source of truth for valid relationship types
const validTypes = require(path.join(__dirname, '..', 'website', 'config', 'relationship-types.json')).validTypes;

/**
 * Reads all markdown files from a category directory and returns slugs
 */
function readCategorySlugs(category) {
  const categoryDir = path.join(DOCUMENTS_DIR, category);

  if (!fs.existsSync(categoryDir)) {
    console.error(`Error: Category directory not found: ${categoryDir}`);
    process.exit(1);
  }

  try {
    const files = fs.readdirSync(categoryDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => `${category}/${path.basename(file, '.md')}`);
  } catch (error) {
    console.error(`Error reading category directory ${category}:`, error.message);
    process.exit(1);
  }
}

/**
 * Builds a Set of all valid slugs from all categories
 */
function buildValidSlugsSet() {
  const validSlugs = new Set();

  for (const category of CATEGORIES) {
    const slugs = readCategorySlugs(category);
    slugs.forEach(slug => validSlugs.add(slug));
  }

  return validSlugs;
}

/**
 * Parse relationship type from mermaid edge
 */
function parseRelationshipType(typeString) {
  if (validTypes.includes(typeString)) {
    return typeString;
  }

  throw new Error(
    `Invalid relationship type: "${typeString}". Valid types are: ${validTypes.join(', ')}`
  );
}

/**
 * Parses the relationships.mmd file and returns an array of relationships
 */
function parseRelationships(content) {
  const relationships = [];
  const lines = content.split('\n');

  // Regex patterns for unidirectional and bidirectional edges
  const unidirectionalPattern = /^\s*([a-zA-Z0-9/_-]+)\s+-->\s*\|([^|]+)\|\s*([a-zA-Z0-9/_-]+)\s*$/;
  const bidirectionalPattern = /^\s*([a-zA-Z0-9/_-]+)\s+<-->\s*\|([^|]+)\|\s*([a-zA-Z0-9/_-]+)\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (line === '') {
      continue;
    }

    // Skip comments (lines starting with %%)
    if (line.startsWith('%%')) {
      continue;
    }

    // Skip the graph declaration line
    if (line.startsWith('graph ')) {
      continue;
    }

    // Try bidirectional pattern first
    const bidirectionalMatch = line.match(bidirectionalPattern);
    if (bidirectionalMatch) {
      const [, from, typeStr, to] = bidirectionalMatch;
      const type = parseRelationshipType(typeStr.trim());

      // Create two relationships for bidirectional
      relationships.push({
        from: from.trim(),
        to: to.trim(),
        type,
        bidirectional: true,
        lineNumber: i + 1,
      });
      relationships.push({
        from: to.trim(),
        to: from.trim(),
        type,
        bidirectional: true,
        lineNumber: i + 1,
      });
      continue;
    }

    // Try unidirectional pattern
    const unidirectionalMatch = line.match(unidirectionalPattern);
    if (unidirectionalMatch) {
      const [, from, typeStr, to] = unidirectionalMatch;
      const type = parseRelationshipType(typeStr.trim());

      relationships.push({
        from: from.trim(),
        to: to.trim(),
        type,
        bidirectional: false,
        lineNumber: i + 1,
      });
      continue;
    }

    // If we reach here, the line didn't match any expected pattern
    throw new Error(
      `Malformed relationship line at line ${i + 1}: "${line}". Expected format: "A -->|type| B" or "A <-->|type| B"`
    );
  }

  return relationships;
}

/**
 * Validates relationships against a set of valid slugs
 */
function validateRelationships(relationships, validSlugs) {
  const errors = [];
  const seenErrors = new Set(); // To avoid duplicate error messages

  for (const rel of relationships) {
    const errorKey = `${rel.from}|${rel.to}|${rel.lineNumber}`;

    if (!validSlugs.has(rel.from) && !seenErrors.has(`from:${rel.from}`)) {
      errors.push({
        type: 'invalid-source',
        slug: rel.from,
        lineNumber: rel.lineNumber,
        message: `Invalid source slug: "${rel.from}" (line ${rel.lineNumber})`,
      });
      seenErrors.add(`from:${rel.from}`);
    }

    if (!validSlugs.has(rel.to) && !seenErrors.has(`to:${rel.to}`)) {
      errors.push({
        type: 'invalid-target',
        slug: rel.to,
        lineNumber: rel.lineNumber,
        message: `Invalid target slug: "${rel.to}" (line ${rel.lineNumber})`,
      });
      seenErrors.add(`to:${rel.to}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Main validation function
 */
function main() {
  console.log('Validating relationships...\n');

  // Step 1: Build set of valid slugs
  console.log('Step 1: Reading pattern files...');
  const validSlugs = buildValidSlugsSet();
  console.log(`Found ${validSlugs.size} valid patterns across ${CATEGORIES.length} categories\n`);

  // Step 2: Read and parse relationships file
  console.log('Step 2: Parsing relationships file...');
  if (!fs.existsSync(RELATIONSHIPS_FILE)) {
    console.error(`Error: Relationships file not found: ${RELATIONSHIPS_FILE}`);
    process.exit(1);
  }

  let content;
  try {
    content = fs.readFileSync(RELATIONSHIPS_FILE, 'utf8');
  } catch (error) {
    console.error(`Error reading relationships file:`, error.message);
    process.exit(1);
  }

  let relationships;
  try {
    relationships = parseRelationships(content);
    console.log(`Parsed ${relationships.length} relationships\n`);
  } catch (error) {
    console.error(`Error parsing relationships file:`, error.message);
    process.exit(1);
  }

  // Step 3: Validate relationships
  console.log('Step 3: Validating relationships...');
  const result = validateRelationships(relationships, validSlugs);

  if (result.valid) {
    console.log('\n✓ All relationships are valid!\n');
    process.exit(0);
  } else {
    console.error(`\n✗ Found ${result.errors.length} validation error(s):\n`);

    // Group errors by type
    const invalidSources = result.errors.filter(e => e.type === 'invalid-source');
    const invalidTargets = result.errors.filter(e => e.type === 'invalid-target');

    if (invalidSources.length > 0) {
      console.error('Invalid source slugs (patterns that don\'t exist):');
      invalidSources.forEach(err => {
        console.error(`  - ${err.message}`);
      });
      console.error('');
    }

    if (invalidTargets.length > 0) {
      console.error('Invalid target slugs (patterns that don\'t exist):');
      invalidTargets.forEach(err => {
        console.error(`  - ${err.message}`);
      });
      console.error('');
    }

    console.error('Please ensure all referenced patterns exist as markdown files in the documents directory.\n');
    process.exit(1);
  }
}

// Run the validation
main();
