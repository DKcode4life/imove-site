const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const socialImageUrl = "https://www.myimove.co.uk/social-image.png";

function listHtmlFiles(directory = ".") {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listHtmlFiles(filePath);
      }

      return entry.isFile() && entry.name.endsWith(".html") ? [filePath] : [];
    })
    .filter((filePath) => !filePath.includes(`${path.sep}node_modules${path.sep}`));
}

test("social preview image is available and linked from every HTML page", () => {
  assert.ok(fs.existsSync("social-image.png"), "social-image.png should exist at the website root");

  const htmlFiles = listHtmlFiles();
  assert.ok(htmlFiles.length > 0, "expected HTML pages to check");

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, "utf8");

    assert.match(
      html,
      new RegExp(`<meta property="og:image" content="${socialImageUrl.replaceAll(".", "\\.")}">`),
      `${filePath} should include an Open Graph image`
    );
    assert.match(
      html,
      new RegExp(`<meta name="twitter:image" content="${socialImageUrl.replaceAll(".", "\\.")}">`),
      `${filePath} should include a Twitter image`
    );
    assert.match(
      html,
      /<meta name="twitter:card" content="summary_large_image">/,
      `${filePath} should use a large Twitter preview card`
    );
  }
});
