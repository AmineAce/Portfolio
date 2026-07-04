import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT_DIR = path.join(SRC, 'data');
const OUT_FILE = path.join(OUT_DIR, 'islands.json');

/**
 * Regex to match Astro component tags that use client:* hydration directives.
 *
 * Breakdown:
 *   <            - opening angle bracket
 *   (\w[\w.-]+)  - capture group 1: tag/component name (e.g. ProjectCard, my-component)
 *   ([^>]*?)     - lazy match attributes without crossing into the next tag
 *   client:      - literal "client:" prefix
 *   (load|idle|visible|media|only) - capture group 2: the directive type
 *
 * [^>]*? instead of [\s\S]*? ensures we stay within a single tag by stopping
 * at the closing >, preventing cross-tag false positives (e.g. matching
 * <section>...<Component client:load /> and reporting "section" as the island).
 *
 * Limitations:
 *   - Does not skip HTML comments (<!-- ... client:load ... -->) but those
 *     are effectively never seen in real Astro island usage.
 *   - Does not validate that client:media / client:only have the required values;
 *     it only detects the presence of the directive keyword.
 */
const TAG_RE = /<(\w[\w.-]+)([^>]*?)client:(load|idle|visible|media|only)/g;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules, dist, hidden dirs
      if (!entry.name.startsWith('.')) files.push(...walk(full));
    } else if (entry.name.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = [];
  let m;

  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(content)) !== null) {
    const component = m[1];
    const directive = m[3];

    // 1-indexed line number: count newlines before the match position
    const line = (content.slice(0, m.index).match(/\n/g) || []).length + 1;

    matches.push({
      component,
      file: path.relative(SRC, filePath),
      directive,
      line,
    });
  }

  return matches;
}

function main() {
  const astroFiles = walk(SRC);
  const islands = astroFiles.flatMap(scanFile);

  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(islands, null, 2) + '\n');

  console.log(`\n  Scanned ${astroFiles.length} .astro files, found ${islands.length} island(s).\n`);

  if (islands.length > 0) {
    console.table(islands);
  }
}

main();
