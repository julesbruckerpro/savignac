/**
 * Aligne messages/en.json, de.json et it.json sur les clés de fr.json.
 * Les valeurs non traduites valent « TODO » : l'affichage se replie sur le français (i18n/request.ts).
 * Les traductions déjà saisies sont conservées.
 * Usage : npx tsx scripts/sync-messages.ts
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

type Tree = { [key: string]: string | Tree };

function align(base: Tree, current: Tree | undefined): Tree {
  const out: Tree = {};
  for (const [k, v] of Object.entries(base)) {
    const c = current?.[k];
    out[k] = typeof v === 'string' ? (typeof c === 'string' && c ? c : 'TODO') : align(v, typeof c === 'object' ? c : undefined);
  }
  return out;
}

async function main() {
  const dir = path.join(process.cwd(), 'messages');
  const fr = JSON.parse(await readFile(path.join(dir, 'fr.json'), 'utf8')) as Tree;
  for (const locale of ['en', 'de', 'it']) {
    const file = path.join(dir, `${locale}.json`);
    const current = existsSync(file) ? (JSON.parse(await readFile(file, 'utf8')) as Tree) : undefined;
    await writeFile(file, JSON.stringify(align(fr, current), null, 2) + '\n');
  }
  console.log('messages alignés sur fr.json');
}
main();
