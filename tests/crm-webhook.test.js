const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const test = require("node:test");

const serverPort = 18080;
const crmPort = 18081;
const serverUrl = `http://127.0.0.1:${serverPort}`;
const crmUrl = `http://127.0.0.1:${crmPort}/api/intake`;

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

async function waitForWebsite() {
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${serverUrl}/api/survey-availability`, { cache: "no-store" });
      if (response.ok) return;
    } catch (_error) {
      // The child server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Website server did not start in time.");
}

async function postJson(path, payload) {
  const response = await fetch(`${serverUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  assert.equal(response.status, 200, `${path} should return 200: ${JSON.stringify(body)}`);
  assert.equal(body.ok, true, `${path} should return ok=true: ${JSON.stringify(body)}`);
  return body;
}

test("form submissions send best-effort CRM webhooks after existing handlers succeed", async (t) => {
  const received = [];
  const crmServer = http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      received.push({
        method: req.method,
        url: req.url,
        authorization: req.headers.authorization,
        contentType: req.headers["content-type"],
        body: JSON.parse(body || "{}")
      });

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "created", job_id: received.length, lead_source: "website" }));
    });
  });

  await listen(crmServer, crmPort);
  t.after(() => crmServer.close());

  const child = spawn(process.execPath, ["preview-server.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(serverPort),
      HOST: "127.0.0.1",
      CRM_API_URL: crmUrl,
      CRM_API_KEY: "test-crm-key",
      RESEND_API_KEY: ""
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(() => child.kill());

  child.once("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      throw new Error(`Website server exited early with code ${code} signal ${signal}`);
    }
  });

  await waitForWebsite();

  await postJson("/api/contact-requests", {
    website: "https://spam.example"
  });

  await postJson("/api/estimate-requests", {
    customer: {
      website: "https://spam.example"
    }
  });

  await postJson("/api/quote-requests", {
    website: "https://spam.example"
  });

  await postJson("/api/survey-bookings", {
    website: "https://spam.example"
  });

  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(received.length, 0, "honeypot submissions should not be sent to the CRM");

  await postJson("/api/contact-requests", {
    name: "Alice Contact",
    phone: "07111 111111",
    email: "alice@example.com",
    message: "Please call about a local move."
  });

  await postJson("/api/estimate-requests", {
    customer: {
      name: "Ben Estimate",
      phone: "07222 222222",
      email: "ben@example.com",
      message: "I may need packing help."
    },
    estimate: {
      low: 790,
      high: 1010,
      volume: 920
    },
    property: {
      label: "3 Bed House"
    },
    furnished: {
      label: "Average"
    },
    distance: {
      label: "11 - 30 miles"
    },
    extras: ["Garden", "Garage"]
  });

  await postJson("/api/quote-requests", {
    full_name: "Chloe Quote",
    phone: "07333 333333",
    email: "chloe@example.com",
    moving_from: "12 High St, Croydon, CR0 1AA",
    moving_to: "Cambridge",
    move_date: "August 2026",
    property_type: "Flat / apartment",
    rooms: "2 bedrooms",
    flat_floor: "2nd",
    has_lift: "Yes",
    notes: "Fragile mirrors and tight access."
  });

  const availability = await (await fetch(`${serverUrl}/api/survey-availability`)).json();
  const surveyDay = availability.availability.find((day) => day.video.length);
  assert.ok(surveyDay, "survey availability should include at least one video slot");

  await postJson("/api/survey-bookings", {
    survey_type: "Video survey",
    survey_date: surveyDay.date,
    appointment_time: surveyDay.video[0],
    name: "Dan Survey",
    phone: "07444 444444",
    email: "dan@example.com"
  });

  await new Promise((resolve) => setTimeout(resolve, 50));

  assert.equal(received.length, 4);
  assert.deepEqual(received.map((item) => item.body.form), ["contact", "callback", "quote", "survey"]);
  assert.ok(received.every((item) => item.method === "POST"));
  assert.ok(received.every((item) => item.url === "/api/intake"));
  assert.ok(received.every((item) => item.authorization === "Bearer test-crm-key"));
  assert.ok(received.every((item) => item.contentType === "application/json"));
  assert.ok(received.every((item) => /^[0-9a-f-]{36}$/i.test(item.body.submission_id)));

  assert.deepEqual(received[0].body, {
    form: "contact",
    submission_id: received[0].body.submission_id,
    full_name: "Alice Contact",
    email: "alice@example.com",
    phone: "07111 111111",
    message: "Please call about a local move."
  });

  assert.equal(received[1].body.full_name, "Ben Estimate");
  assert.equal(received[1].body.property_size, "3 Bed House");
  assert.match(received[1].body.message, /Estimate: GBP790 - GBP1010/);
  assert.match(received[1].body.message, /Extras: Garden, Garage/);

  assert.equal(received[2].body.from_address, "12 High St, Croydon, CR0 1AA");
  assert.equal(received[2].body.to_address, "Cambridge");
  assert.equal(received[2].body.preferred_move_date, "August 2026");
  assert.equal(received[2].body.property_size, "Flat / apartment, 2 bedrooms");
  assert.match(received[2].body.message, /Flat floor: 2nd/);
  assert.match(received[2].body.message, /Lift available: Yes/);

  assert.equal(received[3].body.full_name, "Dan Survey");
  assert.equal(received[3].body.preferred_move_date, surveyDay.date);
  assert.equal(received[3].body.survey_type, "video");
  assert.equal(received[3].body.survey_date, surveyDay.date);
  assert.equal(received[3].body.survey_time, surveyDay.video[0]);
  assert.match(received[3].body.survey_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(received[3].body.survey_time, /^\d{2}:\d{2}$/);
  assert.match(received[3].body.message, /Survey type: Video survey/);
  assert.match(received[3].body.message, new RegExp(`Time: ${surveyDay.video[0]}`));
});
