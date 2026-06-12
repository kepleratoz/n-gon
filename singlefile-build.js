const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);
const dist = path.join(root, 'dist');
const htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const commentRegex = /<!--([\s\S]*?)-->/g;
const cleanHtml = html.replace(commentRegex, '');
const scriptTagRegex = /<script\s+src=['"]([^'\"]+)['"]><\/script>/g;
let match;
let inlined = 0;
const replacements = [];
while ((match = scriptTagRegex.exec(cleanHtml)) !== null) {
  const src = match[1];
  const srcPath = path.join(root, src);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing script asset: ${srcPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(srcPath, 'utf8');
  replacements.push({
    match: match[0],
    replacement: `<script>${content}</script>`
  });
  inlined++;
}
if (inlined === 0) {
  console.warn('No external scripts found to inline.');
}
for (const {match, replacement} of replacements) {
  html = html.replace(match, replacement);
}

const outPath = path.join(dist, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Inlined ${inlined} scripts into ${outPath}`);
