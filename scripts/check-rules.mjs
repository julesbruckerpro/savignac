/**
 * Contrôles automatiques avant livraison (cahier 17.3) :
 *   aucune couleur hors tokens · deux polices seulement · pas de dégradé · pas de crochets « [À FOURNIR ».
 * Usage : node scripts/check-rules.mjs   (après `next build` pour le contrôle des crochets)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'raw', 'pack'].includes(f)) continue;
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const src = ['app', 'components', 'lib', 'content'].flatMap((d) => walk(path.join(root, d))).filter((f) => /\.(tsx?|css)$/.test(f));
const errors = [];
const rel = (f) => path.relative(root, f);

for (const file of src) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const inTokens = (i) => file.endsWith('globals.css') && i < lines.findIndex((l) => l.includes('--ease:'));
  lines.forEach((line, i) => {
    // couleurs : seuls les tokens de :root portent des valeurs hexadécimales (themeColor = --paper)
    const hex = line.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    for (const h of hex) if (!inTokens(i) && !/themeColor/.test(line) && !/&#|href=|url\(|#\$\{|['"`]#[a-z-]+['"`]|#[a-z]+-/.test(line)) errors.push(`couleur hors tokens ${h} — ${rel(file)}:${i + 1}`);
    if (/\b(rgb|hsl)a?\(/.test(line) && !/expect|toBe/.test(line)) errors.push(`couleur hors tokens — ${rel(file)}:${i + 1}`);
    if (/(linear|radial|conic)-gradient/.test(line)) errors.push(`dégradé — ${rel(file)}:${i + 1}`);
    const family = line.match(/font-family:\s*([^;]+)/);
    if (family && !/var\(--font-(serif|sans|caslon|jost)\)|inherit/.test(family[1])) errors.push(`police non autorisée « ${family[1].trim()} » — ${rel(file)}:${i + 1}`);
    if (/Cormorant|Bodoni|Caslon_Display|Playfair|Inter\b|Geist/.test(line) && !/Interdits|rejet/.test(line)) errors.push(`police non autorisée — ${rel(file)}:${i + 1}`);
    if (!file.endsWith('.css') && /rounded-(?!none)|shadow-(?!none)/.test(line) && !/!rounded-full/.test(line)) errors.push(`coin arrondi ou ombre — ${rel(file)}:${i + 1}`);
  });
}

// crochets : aucune chaîne « [À FOURNIR » dans le HTML généré quand les emplacements sont masqués
const out = path.join(root, '.next', 'server', 'app');
if (existsSync(out) && process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== 'true') {
  for (const file of walk(out).filter((f) => f.endsWith('.html'))) if (readFileSync(file, 'utf8').includes('[À FOURNIR')) errors.push(`crochets rendus — ${rel(file)}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} écart(s) aux règles absolues.`);
  process.exit(1);
}
console.log(`Règles respectées sur ${src.length} fichiers : couleurs, polices, dégradés, crochets.`);
