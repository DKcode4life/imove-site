const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const leadForms = [
  { file: "index.html", selector: "data-estimator-contact-form" },
  { file: "index.html", selector: "data-contact-form" },
  { file: "book-survey.html", selector: "data-survey-form" },
  { file: "get-quote.html", selector: "data-quote-request-form" }
];

test("public lead forms include a hidden honeypot field", () => {
  for (const { file, selector } of leadForms) {
    const html = fs.readFileSync(file, "utf8");
    const formMatch = html.match(new RegExp(`<form[^>]*${selector}[^>]*>[\\s\\S]*?<\\/form>`));

    assert.ok(formMatch, `${file} should contain ${selector}`);
    assert.match(formMatch[0], /name="website"/, `${file} ${selector} should include the website honeypot field`);
    assert.match(formMatch[0], /autocomplete="off"/, `${file} ${selector} should disable autocomplete on the honeypot`);
  }
});
