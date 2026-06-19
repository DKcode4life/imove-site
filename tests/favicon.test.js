const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

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

test("favicon asset is available and linked from every HTML page", () => {
  assert.ok(fs.existsSync("favicon.png"), "favicon.png should exist at the website root");

  const htmlFiles = listHtmlFiles();
  assert.ok(htmlFiles.length > 0, "expected HTML pages to check");

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, "utf8");
    assert.match(
      html,
      /<link rel="icon" type="image\/png" href="\/favicon\.png">/,
      `${filePath} should link to the favicon`
    );
  }
});
