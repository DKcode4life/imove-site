const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

test("flat floor is selected from fixed options on the quote form", () => {
  const html = fs.readFileSync("get-quote.html", "utf8");
  const fieldMatch = html.match(/<select[^>]*name="flat_floor"[\s\S]*?<\/select>/);

  assert.ok(fieldMatch, "flat_floor should be a select field");
  assert.equal(fieldMatch[0].includes("data-quote-flat-required"), true);

  const options = [...fieldMatch[0].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g)]
    .map(([, value, label]) => ({ value, label: label.trim() }));

  assert.deepEqual(options, [
    { value: "", label: "Select floor" },
    { value: "Ground", label: "Ground" },
    { value: "First", label: "First" },
    { value: "Second", label: "Second" },
    { value: "Third", label: "Third" },
    { value: "Fourth", label: "Fourth" },
    { value: "Fifth", label: "Fifth" }
  ]);
});
