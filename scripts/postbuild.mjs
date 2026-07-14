import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import CleanCSS from "clean-css";
import { minify as minifyJs } from "terser";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "_site");
const cssCleaner = new CleanCSS({ level: 2 });

const fonts = readFileSync(join(root, "src/css/fonts.css"), "utf8");
const mainPath = join(siteDir, "css/main.css");
const main = readFileSync(mainPath, "utf8");
writeFileSync(mainPath, cssCleaner.minify(`${fonts}\n${main}`).styles);

for (const file of ["css/critical.css", "css/fonts.css"]) {
  const path = join(siteDir, file);
  try {
    const source = readFileSync(path, "utf8");
    writeFileSync(path, cssCleaner.minify(source).styles);
  } catch {
    // optional passthrough files
  }
}

const jsPath = join(siteDir, "js/main.js");
try {
  const source = readFileSync(jsPath, "utf8");
  const { code } = await minifyJs(source, { compress: true, mangle: true });
  writeFileSync(jsPath, code);
} catch {
  // ignore
}

console.log("Postbuild complete: CSS and JS minified.");
