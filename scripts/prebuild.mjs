import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "src/assets");
const fontsDir = join(root, "src/fonts");

const fontFiles = [
  ["node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2", "montserrat-600.woff2"],
  ["node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2", "montserrat-700.woff2"],
  ["node_modules/@fontsource/montserrat/files/montserrat-latin-800-normal.woff2", "montserrat-800.woff2"],
  ["node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2", "source-sans-3-400.woff2"],
  ["node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff2", "source-sans-3-600.woff2"],
];

mkdirSync(fontsDir, { recursive: true });

for (const [src, dest] of fontFiles) {
  cpSync(join(root, src), join(fontsDir, dest));
}

async function writeResponsiveHero(baseName, input) {
  for (const width of [640, 800, 1200]) {
    const image = sharp(input).resize(width, null, { withoutEnlargement: true });
    await image.clone().avif({ quality: 48, effort: 4 }).toFile(join(assetsDir, `${baseName}-${width}.avif`));
    await image.clone().webp({ quality: 72 }).toFile(join(assetsDir, `${baseName}-${width}.webp`));
  }
}

async function writeLogo() {
  const logoPng = join(assetsDir, "logo.png");
  if (!existsSync(logoPng)) return;
  await sharp(logoPng).resize(400).webp({ quality: 80 }).toFile(join(assetsDir, "logo.webp"));
}

async function writeDisposalHero() {
  const disposalPng = join(assetsDir, "garbage-disposal-service-hero.png");
  if (!existsSync(disposalPng)) return;
  await sharp(disposalPng)
    .resize(1024, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(assetsDir, "garbage-disposal-service-hero.webp"));
}

const heroJpg = join(assetsDir, "resolute-plumbing-banner-image.jpg");
if (existsSync(heroJpg)) {
  await writeResponsiveHero("resolute-plumbing-banner-image", heroJpg);
}

await writeLogo();
await writeDisposalHero();

console.log("Prebuild complete: fonts copied and optimized images generated.");
