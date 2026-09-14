// Development utility: move static interface language into typed content objects.
import ts from "typescript";
import fs from "node:fs";
const files = [
  ...fs
    .readdirSync("components")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/${f}`),
  "app/call/page.tsx",
  "app/privacy/page.tsx",
];
if (fs.existsSync("content/interface.ts"))
  throw new Error("Copy already exists. Edit content/interface.ts directly.");
const maps = {};
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  if (source.includes("interfaceCopy")) continue;
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  const entries = {};
  let sequence = 0;
  function add(text) {
    const present = Object.entries(entries).find(([, value]) => value === text);
    if (present) return present[0];
    const raw =
      text
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 6)
        .join("_")
        .toLowerCase() || "text";
    const slug = /^\d/.test(raw) ? "text_" + raw : raw;
    let key = slug;
    while (key in entries) key = slug + "_" + ++sequence;
    entries[key] = text;
    return key;
  }
  function walk(node) {
    if (ts.isJsxText(node)) {
      const lines = node.text.split(/\r?\n/);
      const text = lines
        .map((line, i) => {
          let value = line.replace(/\t/g, " ");
          if (i > 0) value = value.trimStart();
          if (i < lines.length - 1) value = value.trimEnd();
          return value;
        })
        .filter(Boolean)
        .join(" ");
      if (text.trim()) {
        const key = add(text);
        edits.push({
          start: node.getStart(tree),
          end: node.end,
          value: `{copy.${key}}`,
        });
      }
    } else if (ts.isStringLiteral(node)) {
      const parent = node.parent;
      const text = node.text;
      const attr = ts.isJsxAttribute(parent) ? parent.name.getText(tree) : null;
      const allowedAttr =
        attr && ["aria-label", "placeholder", "alt", "title"].includes(attr);
      const human =
        !attr &&
        !ts.isImportDeclaration(parent) &&
        !ts.isExportDeclaration(parent) &&
        !ts.isLiteralTypeNode(parent) &&
        !ts.isExpressionStatement(parent) &&
        /^[A-Z][a-z]/.test(text) &&
        !/[{}<>\[\]#]|^Content-Type$/.test(text);
      if (allowedAttr || human) {
        const key = add(text);
        edits.push({
          start: node.getStart(tree),
          end: node.end,
          value: attr ? `{copy.${key}}` : `copy.${key}`,
        });
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(tree);
  if (!edits.length) continue;
  let updated = source;
  for (const e of edits.sort((a, b) => b.start - a.start))
    updated = updated.slice(0, e.start) + e.value + updated.slice(e.end);
  const id = file
    .replace(/^components\//, "")
    .replace(/\.tsx$/, "")
    .replaceAll("/", "_");
  maps[id] = entries;
  const parsed = ts.createSourceFile(
    file,
    updated,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let offset = 0;
  for (const statement of parsed.statements) {
    if (ts.isImportDeclaration(statement)) offset = statement.end;
  }
  const declaration = `\nimport { interfaceCopy } from '@/content/interface';\nconst copy = interfaceCopy.${id};\n`;
  updated = updated.slice(0, offset) + declaration + updated.slice(offset);
  fs.writeFileSync(file, updated);
}
fs.writeFileSync(
  "content/interface.ts",
  `// Static interface copy. Business offers and industry facts have their own content files.\nexport const interfaceCopy = ${JSON.stringify(maps, null, 2)} as const;\n`,
);
console.log(
  `Centralized interface text for ${Object.keys(maps).length} components.`,
);
