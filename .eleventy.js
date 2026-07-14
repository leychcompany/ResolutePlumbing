const fs = require("fs");
const CleanCSS = require("clean-css");

const cssCleaner = new CleanCSS({ level: 2 });

module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksGlobal("currentYear", new Date().getFullYear());

  eleventyConfig.addNunjucksGlobal("criticalCss", () => {
    const source = fs.readFileSync("src/css/critical.css", "utf8");
    return cssCleaner.minify(source).styles;
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
