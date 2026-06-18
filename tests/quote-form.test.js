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
    { value: "Ground floor", label: "Ground floor" },
    { value: "1st floor", label: "1st floor" },
    { value: "2nd floor", label: "2nd floor" },
    { value: "3rd floor", label: "3rd floor" },
    { value: "4th floor", label: "4th floor" },
    { value: "5th floor", label: "5th floor" }
  ]);
});
