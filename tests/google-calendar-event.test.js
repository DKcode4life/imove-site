const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadServerHelpers() {
  const source = fs.readFileSync("preview-server.js", "utf8");
  const module = { exports: {} };
  const sandbox = {
    Buffer,
    URL,
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    fetch: async () => {
      throw new Error("fetch should not be called by these unit tests");
    },
    globalThis: {},
    module,
    process: {
      cwd: () => path.join(process.cwd(), ".test-no-env"),
      env: {}
    },
    require: (name) => {
      if (name === "http") {
        return {
          createServer: () => ({
            listen: () => {}
          })
        };
      }

      return require(name);
    }
  };

  vm.runInNewContext(`${source}
module.exports = {
  buildGoogleCalendarEventDescription: typeof buildGoogleCalendarEventDescription === "function"
    ? buildGoogleCalendarEventDescription
    : undefined
};`, sandbox, { filename: "preview-server.js" });

  return module.exports;
}

test("video survey Google Calendar notes include the Zoom link", () => {
  const { buildGoogleCalendarEventDescription } = loadServerHelpers();

  assert.equal(typeof buildGoogleCalendarEventDescription, "function");

  const description = buildGoogleCalendarEventDescription({
    name: "Video Client",
    phone: "07111 111111",
    email: "video@example.com"
  }, "video");

  assert.match(description, /Zoom link:/);
  assert.match(description, /https:\/\/us05web\.zoom\.us\/j\/5757163859/);
});

test("physical survey Google Calendar notes do not include the Zoom link", () => {
  const { buildGoogleCalendarEventDescription } = loadServerHelpers();

  assert.equal(typeof buildGoogleCalendarEventDescription, "function");

  const description = buildGoogleCalendarEventDescription({
    name: "Physical Client",
    phone: "07222 222222",
    email: "physical@example.com",
    address: "12 High Street"
  }, "physical");

  assert.doesNotMatch(description, /Zoom link:/);
});
