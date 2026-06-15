const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || "0.0.0.0";
const settingsPath = path.join(root, "data", "site-settings.json");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

loadEnvFile();

const settings = {
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  blockingCalendarIds: splitCalendarIds(process.env.BLOCKING_CALENDAR_IDS || process.env.GOOGLE_CALENDAR_ID || "primary"),
  videoCalendarId: process.env.VIDEO_SURVEY_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID || "primary",
  physicalCalendarId: process.env.PHYSICAL_SURVEY_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID || "primary",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
  timeZone: process.env.BUSINESS_TIMEZONE || "Europe/London",
  daysAhead: Number(process.env.SURVEY_DAYS_AHEAD || 10),
  workdayStart: process.env.SURVEY_WORKDAY_START || "09:00",
  workdayEnd: process.env.SURVEY_WORKDAY_END || "17:00",
  slotStepMinutes: Number(process.env.SURVEY_SLOT_STEP_MINUTES || 30),
  videoDurationMinutes: Number(process.env.VIDEO_SURVEY_DURATION_MINUTES || 30),
  physicalDurationMinutes: Number(process.env.PHYSICAL_SURVEY_DURATION_MINUTES || 60),
  mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
};

const emailSettings = {
  resendApiKey: process.env.RESEND_API_KEY || "",
  from: process.env.ESTIMATE_REQUEST_FROM || "iMove Website <onboarding@resend.dev>",
  to: process.env.ESTIMATE_REQUEST_TO || process.env.CONTACT_EMAIL || "info@myimove.co.uk"
};

const mockBookings = [];
const mockEstimateRequests = [];
const mockQuoteRequests = [];
const mockContactRequests = [];

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    if (requestUrl.pathname === "/api/survey-availability" && req.method === "GET") {
      const availability = await getSurveyAvailability();
      sendJson(res, 200, {
        source: hasGoogleCredentials() ? "google-calendar" : "demo",
        availability
      });
      return;
    }

    if (requestUrl.pathname === "/api/survey-bookings" && req.method === "POST") {
      const booking = await readJson(req);
      const result = await createSurveyBooking(booking);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if (requestUrl.pathname === "/api/estimate-requests" && req.method === "POST") {
      const request = await readJson(req);
      const result = await createEstimateRequest(request);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if (requestUrl.pathname === "/api/quote-requests" && req.method === "POST") {
      const request = await readJson(req);
      const result = await createQuoteRequest(request);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if (requestUrl.pathname === "/api/estimate-distance" && req.method === "POST") {
      const request = await readJson(req);
      const result = await estimateMoveDistance(request);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if (requestUrl.pathname === "/api/contact-requests" && req.method === "POST") {
      const request = await readJson(req);
      const result = await createContactRequest(request);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if (requestUrl.pathname === "/api/site-settings" && req.method === "GET") {
      sendJson(res, 200, await readSiteSettings());
      return;
    }

    if (requestUrl.pathname === "/api/admin/site-settings" && req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await readSiteSettings());
      return;
    }

    if (requestUrl.pathname === "/api/admin/site-settings" && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const nextSettings = await readJson(req);
      const result = await saveSiteSettings(nextSettings);
      sendJson(res, result.ok ? 200 : 400, result);
      return;
    }

    if ((requestUrl.pathname === "/admin" || requestUrl.pathname === "/admin.html") && req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      serveStatic(requestUrl.pathname, res);
      return;
    }

    serveStatic(requestUrl.pathname, res);
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      message: "Something went wrong while processing the request.",
      detail: error.message
    });
  }
});

globalThis.imovePreviewServer = server;

globalThis.imovePreviewServer = server;

server.listen(port, host, () => {
  console.log(`iMove website running on ${host}:${port}`);
});

function serveStatic(urlPath, res) {
  const requested = urlPath === "/" ? "index.html" : urlPath === "/admin" ? "admin.html" : decodeURIComponent(urlPath).slice(1);
  const filePath = path.resolve(root, requested);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    res.end(data);
  });
}

async function readSiteSettings() {
  const data = await fs.promises.readFile(settingsPath, "utf8");
  return JSON.parse(data);
}

async function saveSiteSettings(nextSettings) {
  const validation = validateSiteSettings(nextSettings);

  if (!validation.ok) {
    return validation;
  }

  await fs.promises.mkdir(path.dirname(settingsPath), { recursive: true });
  await fs.promises.writeFile(settingsPath, `${JSON.stringify(nextSettings, null, 2)}\n`);

  return {
    ok: true,
    message: "Settings saved. Refresh the public pages to see the update."
  };
}

function validateSiteSettings(nextSettings) {
  if (!nextSettings || typeof nextSettings !== "object") {
    return { ok: false, message: "Settings payload is missing." };
  }

  const estimator = nextSettings.estimator || {};

  for (const key of ["properties", "furnished", "extras", "distances"]) {
    if (!Array.isArray(estimator[key]) || !estimator[key].length) {
      return { ok: false, message: `Estimator ${key} must contain at least one item.` };
    }
  }

  if (!Array.isArray(nextSettings.gallery)) {
    return { ok: false, message: "Gallery settings must be a list." };
  }

  return { ok: true };
}

function requireAdmin(req, res) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "";

  if (!password) {
    sendJson(res, 403, {
      ok: false,
      message: "Admin password is not configured. Add ADMIN_PASSWORD to your .env or Railway variables."
    });
    return false;
  }

  const authHeader = req.headers.authorization || "";
  const encoded = authHeader.startsWith("Basic ") ? authHeader.slice(6) : "";
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  const sentUsername = separator >= 0 ? decoded.slice(0, separator) : "";
  const sentPassword = separator >= 0 ? decoded.slice(separator + 1) : "";

  if (sentUsername === username && sentPassword === password) {
    return true;
  }

  res.writeHead(401, {
    "Content-Type": "text/plain; charset=utf-8",
    "WWW-Authenticate": "Basic realm=\"iMove Admin\""
  });
  res.end("Admin login required");
  return false;
}

async function createSurveyBooking(booking) {
  const validation = validateBooking(booking);

  if (!validation.ok) {
    return validation;
  }

  const typeKey = booking.survey_type === "Physical survey" ? "physical" : "video";
  const availability = await getSurveyAvailability();
  const day = availability.find((item) => item.date === booking.survey_date);

  if (!day || !day[typeKey].includes(booking.appointment_time)) {
    return {
      ok: false,
      message: "That appointment time is no longer available. Please choose another slot."
    };
  }

  if (hasGoogleCredentials()) {
    await createGoogleCalendarEvent(booking, typeKey);
  } else {
    mockBookings.push({
      survey_date: booking.survey_date,
      appointment_time: booking.appointment_time,
      duration_minutes: getDurationMinutes(typeKey)
    });
  }

  const emailResult = await sendSurveyBookingEmails(booking);
  const bookingMessage = hasGoogleCredentials()
    ? "Survey booked in Google Calendar. The selected time is now blocked out."
    : "Demo booking saved locally. Add Google Calendar credentials to make this a real calendar booking.";

  return {
    ok: true,
    emailSent: emailResult.sent,
    message: emailResult.sent
      ? `${bookingMessage} Confirmation emails have been sent.`
      : bookingMessage
  };
}

async function createEstimateRequest(request) {
  const validation = validateEstimateRequest(request);

  if (!validation.ok) {
    return validation;
  }

  mockEstimateRequests.push({
    created_at: new Date().toISOString(),
    request
  });

  const emailResult = await sendEstimateRequestEmails(request);

  return {
    ok: true,
    emailSent: emailResult.sent,
    message: "Thank you, your request has been received and a member of staff will contact you very soon."
  };
}

function validateEstimateRequest(request) {
  const customer = request.customer || {};
  const required = ["name", "phone", "email"];
  const missing = required.filter((key) => !String(customer[key] || "").trim());

  if (missing.length) {
    return {
      ok: false,
      message: "Please enter your name, contact number, and email address."
    };
  }

  if (!isValidEmail(customer.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address."
    };
  }

  if (!request.estimate || !request.property || !request.furnished || !request.distance) {
    return {
      ok: false,
      message: "Please complete the estimator before sending your request."
    };
  }

  return { ok: true };
}

async function sendEstimateRequestEmails(request) {
  const customer = request.customer || {};
  const estimate = request.estimate || {};
  const extras = Array.isArray(request.extras) && request.extras.length ? request.extras.join(", ") : "None selected";
  const adminText = [
    "New estimator enquiry from the iMove website.",
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Email: ${customer.email}`,
    `Message: ${customer.message || "No message provided"}`,
    "",
    `Estimate: £${estimate.low} - £${estimate.high}`,
    `Volume: ~${estimate.volume} cu ft`,
    `Property: ${request.property.label}`,
    `Furnished: ${request.furnished.label}`,
    `Distance: ${request.distance.label}`,
    `Extras: ${extras}`,
    "",
    "Source: iMove website estimator"
  ].join("\n");

  return sendSubmissionEmails({
    formName: "Instant Move Estimator",
    customerName: customer.name,
    customerEmail: customer.email,
    adminSubject: `iMove estimator enquiry - ${customer.name}`,
    adminText,
    customerSubject: "We have received your iMove estimate request",
    customerText: buildCustomerConfirmationText(customer.name, "estimate request"),
    customerHtml: buildCustomerConfirmationHtml({
      title: "Estimate Request Received",
      name: customer.name,
      intro: "Thank you for using the iMove instant estimator. We have received your estimate request and the team will review the details you provided.",
      cardLabel: "Estimated Move Details",
      cardText: `Estimated cost: \u00a3${estimate.low} - \u00a3${estimate.high}<br>Property: ${request.property.label}<br>Distance: ${request.distance.label}`,
      closing: "If we need anything else to provide a clearer quote, one of the team will contact you very soon."
    }),
    replyTo: customer.email
  });
}

async function createQuoteRequest(request) {
  const validation = validateQuoteRequest(request);

  if (!validation.ok) {
    return validation;
  }

  mockQuoteRequests.push({
    created_at: new Date().toISOString(),
    request
  });

  const emailResult = await sendQuoteRequestEmails(request);

  return {
    ok: true,
    emailSent: emailResult.sent,
    message: "Thank you, your quote request has been received and a member of staff will contact you very soon."
  };
}

function validateQuoteRequest(request) {
  const required = [
    "full_name",
    "email",
    "phone",
    "moving_from",
    "moving_to",
    "move_date",
    "property_type",
    "rooms"
  ];

  if (request.property_type === "Flat / apartment") {
    required.push("flat_floor", "has_lift");
  }

  const missing = required.filter((key) => !String(request[key] || "").trim());

  if (missing.length) {
    return {
      ok: false,
      message: "Please complete all required quote fields."
    };
  }

  if (!isValidEmail(request.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address."
    };
  }

  return { ok: true };
}

async function estimateMoveDistance(request) {
  const from = String(request.from || "").trim();
  const to = String(request.to || "").trim();

  if (!from || !to) {
    return {
      ok: false,
      message: "Please enter both moving from and moving to locations."
    };
  }

  const distance = settings.mapsApiKey
    ? await getGoogleDrivingDistance(from, to)
    : getApproximateDistance(from, to);

  if (!distance.ok) {
    return distance;
  }

  const tier = await getEstimatorDistanceTier(distance.miles);

  return {
    ok: true,
    source: distance.source,
    from,
    to,
    distance: Math.max(1, Math.round(distance.miles)),
    label: `${tier.label} - calculated from locations`,
    price: tier.price,
    tierLabel: tier.label
  };
}

async function getGoogleDrivingDistance(from, to) {
  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", from);
  url.searchParams.set("destinations", to);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("units", "imperial");
  url.searchParams.set("region", "uk");
  url.searchParams.set("key", settings.mapsApiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google distance lookup failed: ${response.status}`);
  }

  const data = await response.json();
  const element = data.rows?.[0]?.elements?.[0];

  if (data.status !== "OK" || element?.status !== "OK" || !element.distance?.value) {
    return {
      ok: false,
      message: "We could not calculate that distance. Please check the locations or choose a preset mileage."
    };
  }

  return {
    ok: true,
    source: "google-maps",
    miles: element.distance.value / 1609.344
  };
}

async function getEstimatorDistanceTier(miles) {
  const siteSettings = await readSiteSettings();
  const distances = siteSettings.estimator?.distances || [];
  const thresholds = [10, 30, 60, 100, 200, Infinity];
  const index = thresholds.findIndex((maxMiles) => miles <= maxMiles);

  return distances[Math.max(index, 0)] || distances[distances.length - 1] || {
    label: `${Math.round(miles)} miles`,
    price: 0
  };
}

function getApproximateDistance(from, to) {
  const fromPoint = findKnownLocation(from);
  const toPoint = findKnownLocation(to);

  if (!fromPoint || !toPoint) {
    return {
      ok: false,
      message: "Exact typed-location distance needs Google Maps connected. Please choose a preset mileage for now."
    };
  }

  return {
    ok: true,
    source: "built-in-location-estimate",
    miles: haversineMiles(fromPoint, toPoint) * 1.22
  };
}

function findKnownLocation(value) {
  const normalised = String(value || "").toLowerCase();
  const postcodeMatch = normalised.match(/\b([a-z]{1,2}\d{1,2}[a-z]?)\s*\d?[a-z]{0,2}\b/i);
  const outwardCode = postcodeMatch?.[1]?.toLowerCase();
  const knownLocations = {
    mildenhall: [52.344, 0.510],
    "ip28": [52.344, 0.510],
    cambridge: [52.205, 0.121],
    "cb1": [52.195, 0.139],
    "cb2": [52.190, 0.120],
    "cb3": [52.213, 0.095],
    "cb4": [52.230, 0.125],
    london: [51.507, -0.128],
    "sw1a": [51.501, -0.142],
    norwich: [52.630, 1.297],
    "nr1": [52.626, 1.306],
    ipswich: [52.056, 1.148],
    "ip1": [52.064, 1.136],
    bury: [52.246, 0.711],
    "bury st edmunds": [52.246, 0.711],
    "ip33": [52.246, 0.711],
    ely: [52.399, 0.263],
    "cb7": [52.400, 0.263],
    newmarket: [52.245, 0.407],
    "cb8": [52.245, 0.407],
    thetford: [52.414, 0.751],
    "ip24": [52.414, 0.751],
    brandon: [52.448, 0.624],
    "ip27": [52.448, 0.624],
    peterborough: [52.570, -0.243],
    "pe1": [52.575, -0.241],
    "pe2": [52.563, -0.254],
    bedford: [52.136, -0.467],
    "mk40": [52.136, -0.467],
    milton: [52.040, -0.759],
    "milton keynes": [52.040, -0.759],
    "mk9": [52.040, -0.759],
    colchester: [51.895, 0.891],
    "co1": [51.895, 0.891]
  };

  if (outwardCode && knownLocations[outwardCode]) {
    return knownLocations[outwardCode];
  }

  return Object.entries(knownLocations)
    .find(([label]) => normalised.includes(label))?.[1] || null;
}

function haversineMiles([latA, lonA], [latB, lonB]) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const deltaLat = toRadians(latB - latA);
  const deltaLon = toRadians(lonB - lonA);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function sendQuoteRequestEmails(request) {
  const flatDetails = request.property_type === "Flat / apartment"
    ? [
        `Flat floor: ${request.flat_floor}`,
        `Lift available: ${request.has_lift}`
      ]
    : [];
  const adminText = [
    "New quote request from the iMove website.",
    "",
    `Name: ${request.full_name}`,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    "",
    `Moving from: ${request.moving_from}`,
    `Moving to: ${request.moving_to}`,
    `Move date: ${request.move_date}`,
    "",
    `Property type: ${request.property_type}`,
    `Rooms/property size: ${request.rooms}`,
    ...flatDetails,
    "",
    `Notes: ${request.notes || "No notes provided"}`,
    "",
    "Source: iMove website get a quote page"
  ].join("\n");

  return sendSubmissionEmails({
    formName: "Get a Quote",
    customerName: request.full_name,
    customerEmail: request.email,
    adminSubject: `iMove quote request - ${request.full_name}`,
    adminText,
    customerSubject: "We have received your iMove quote request",
    customerText: buildCustomerConfirmationText(request.full_name, "quote request"),
    customerHtml: buildCustomerConfirmationHtml({
      title: "Quote Request Received",
      name: request.full_name,
      intro: "Thank you for sending your move details. We have received your quote request and our team will review everything you submitted.",
      cardLabel: "Move Details",
      cardText: `From: ${request.moving_from}<br>To: ${request.moving_to}<br>Moving date: ${request.move_date}<br>Property: ${request.property_type}, ${request.rooms}`,
      closing: "If anything needs clarifying, our crew will get in touch with you very soon."
    }),
    replyTo: request.email
  });
}

async function createContactRequest(request) {
  const validation = validateContactRequest(request);

  if (!validation.ok) {
    return validation;
  }

  mockContactRequests.push({
    created_at: new Date().toISOString(),
    request
  });

  const adminText = [
    "New quick contact enquiry from the iMove website.",
    "",
    `Name: ${request.name}`,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    `Message: ${request.message}`,
    "",
    "Source: iMove website quick contact form"
  ].join("\n");
  const emailResult = await sendSubmissionEmails({
    formName: "Quick Contact",
    customerName: request.name,
    customerEmail: request.email,
    adminSubject: `iMove quick contact enquiry - ${request.name}`,
    adminText,
    customerSubject: "We have received your iMove enquiry",
    customerText: buildCustomerConfirmationText(request.name, "enquiry"),
    customerHtml: buildCustomerConfirmationHtml({
      title: "Enquiry Received",
      name: request.name,
      intro: "Thank you for contacting iMove. We have received your enquiry and a member of our team will review your message.",
      cardLabel: "Your Message",
      cardText: request.message,
      closing: "Our crew will get in touch with you very soon."
    }),
    replyTo: request.email
  });

  return {
    ok: true,
    emailSent: emailResult.sent,
    message: "Thank you, your enquiry has been received and a member of staff will contact you very soon."
  };
}

function validateContactRequest(request) {
  const required = ["name", "phone", "email", "message"];
  const missing = required.filter((key) => !String(request[key] || "").trim());

  if (missing.length) {
    return {
      ok: false,
      message: "Please enter your name, phone number, email address, and message."
    };
  }

  if (!isValidEmail(request.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address."
    };
  }

  return { ok: true };
}

async function sendSurveyBookingEmails(booking) {
  const details = [
    "New survey booking from the iMove website.",
    "",
    `Survey type: ${booking.survey_type}`,
    `Date: ${booking.survey_date}`,
    `Time: ${booking.appointment_time}`,
    "",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    booking.address ? `Address: ${booking.address}` : "",
    "",
    "Source: iMove website survey booking form"
  ].filter(Boolean).join("\n");

  return sendSubmissionEmails({
    formName: "Survey Booking",
    customerName: booking.name,
    customerEmail: booking.email,
    adminSubject: `iMove survey booking - ${booking.name}`,
    adminText: details,
    customerSubject: "Your iMove survey booking has been received",
    customerText: [
      `Hi ${booking.name},`,
      "",
      "Thank you. We have received your survey booking request.",
      "",
      `Survey type: ${booking.survey_type}`,
      `Date: ${booking.survey_date}`,
      `Time: ${booking.appointment_time}`,
      "",
      "Our crew will get in touch with you if we need to confirm any details before the appointment.",
      "",
      "Kind regards,",
      "The iMove team"
    ].join("\n"),
    customerHtml: buildCustomerConfirmationHtml({
      title: "Survey Booking Received",
      name: booking.name,
      intro: "Thank you for choosing iMove. Your survey booking request has been received and we look forward to helping you with your move.",
      cardLabel: "Survey Appointment",
      cardText: `${booking.survey_type}<br>${booking.survey_date} at ${booking.appointment_time}${booking.address ? `<br>${booking.address}` : ""}`,
      closing: "If you have any questions or need to rearrange, please do not hesitate to get in touch. We are always happy to help."
    }),
    replyTo: booking.email
  });
}

async function sendSubmissionEmails({ adminSubject, adminText, customerSubject, customerText, customerHtml, customerEmail, replyTo }) {
  if (!emailSettings.resendApiKey) {
    return { sent: false };
  }

  const emails = [
    sendEmail({
      to: emailSettings.to,
      subject: adminSubject,
      text: adminText,
      replyTo
    })
  ];

  if (customerEmail) {
    emails.push(sendEmail({
      to: customerEmail,
      subject: customerSubject,
      text: customerText,
      html: customerHtml
    }));
  }

  await Promise.all(emails);
  return { sent: true };
}

async function sendEmail({ to, subject, text, html, replyTo }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${emailSettings.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: emailSettings.from,
      to: [to],
      subject,
      text,
      html,
      reply_to: replyTo || undefined
    })
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed: ${response.status}`);
  }
}

function buildCustomerConfirmationText(name, requestType) {
  return [
    `Hi ${name},`,
    "",
    `Thank you. We have received your ${requestType}.`,
    "",
    "This email is to confirm it has been received by us, and our crew will get in touch with you very soon.",
    "",
    "Kind regards,",
    "The iMove team"
  ].join("\n");
}

function buildCustomerConfirmationHtml({ title, name, intro, cardLabel, cardText, closing }) {
  const safeTitle = escapeHtml(title);
  const safeName = escapeHtml(name);
  const safeIntro = escapeHtml(intro);
  const safeCardLabel = escapeHtml(cardLabel);
  const safeCardText = sanitizeEmailHtml(cardText);
  const safeClosing = escapeHtml(closing);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${safeTitle}</h1>
            <p style="margin:8px 0 0;color:#cffafe;font-size:14px;">iMove Relocations Ltd</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:16px;">Dear <strong>${safeName}</strong>,</p>
            <p style="margin:0 0 20px;">${safeIntro}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;margin:0 0 24px;">
              <tr>
                <td style="padding:24px 28px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0369a1;">${safeCardLabel}</p>
                  <p style="margin:0;font-size:18px;font-weight:700;color:#0c4a6e;line-height:1.5;">${safeCardText}</p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 24px;">${safeClosing}</p>
            <p style="margin:0;font-size:14px;color:#475569;">Kind regards,<br><strong>The iMove Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#475569;">iMove Relocations Ltd</p>
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">94C Hampstead Avenue, Mildenhall, Suffolk, IP28 7AS</p>
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              <a href="tel:01638255255" style="color:#0891b2;text-decoration:none;">01638 255 255</a>
              &nbsp;&middot;&nbsp;
              <a href="mailto:info@myimove.co.uk" style="color:#0891b2;text-decoration:none;">info@myimove.co.uk</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function sanitizeEmailHtml(value) {
  return String(value ?? "")
    .split("<br>")
    .map((part) => escapeHtml(part))
    .join("<br>");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validateBooking(booking) {
  const required = ["survey_type", "survey_date", "appointment_time", "name", "phone", "email"];

  if (booking.survey_type === "Physical survey") {
    required.push("address");
  }

  const missing = required.filter((key) => !String(booking[key] || "").trim());

  if (missing.length) {
    return {
      ok: false,
      message: "Please complete all required booking fields."
    };
  }

  if (!isValidEmail(booking.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address."
    };
  }

  return { ok: true };
}

async function getSurveyAvailability() {
  const calendarBusy = hasGoogleCredentials()
    ? await getGoogleBusyRanges()
    : [];
  const demoBusy = mockBookings.map((booking) => {
    const start = zonedTimeToUtc(`${booking.survey_date}T${booking.appointment_time}`, settings.timeZone);
    const end = new Date(start.getTime() + booking.duration_minutes * 60000);
    return { start, end };
  });
  const busyRanges = [...calendarBusy, ...demoBusy];
  const days = [];
  const now = new Date();
  let cursor = new Date();

  while (days.length < settings.daysAhead) {
    const dateKey = formatDateKey(cursor, settings.timeZone);
    const weekday = getWeekday(cursor, settings.timeZone);

    if (weekday >= 1 && weekday <= 6) {
      const video = buildSlots(dateKey, "video", busyRanges, now);
      const physical = buildSlots(dateKey, "physical", busyRanges, now);

      if (video.length || physical.length) {
        days.push({
          date: dateKey,
          label: formatDateLabel(cursor, settings.timeZone),
          video,
          physical
        });
      }
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function buildSlots(dateKey, typeKey, busyRanges, now) {
  const slots = [];
  const durationMinutes = getDurationMinutes(typeKey);
  const dayStart = parseMinutes(settings.workdayStart);
  const dayEnd = parseMinutes(settings.workdayEnd);

  for (let minute = dayStart; minute + durationMinutes <= dayEnd; minute += settings.slotStepMinutes) {
    const time = formatMinutes(minute);
    const start = zonedTimeToUtc(`${dateKey}T${time}`, settings.timeZone);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    if (start <= now) {
      continue;
    }

    if (!busyRanges.some((busy) => rangesOverlap(start, end, busy.start, busy.end))) {
      slots.push(time);
    }
  }

  return slots;
}

async function getGoogleBusyRanges() {
  const accessToken = await getGoogleAccessToken();
  const now = new Date();
  const rangeEnd = new Date(now.getTime());
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + settings.daysAhead + 7);
  const blockingBusy = await getBlockingCalendarEventRanges(accessToken, now, rangeEnd);
  const freeBusyCalendarIds = getFreeBusyCalendarIds();
  const freeBusy = freeBusyCalendarIds.length
    ? await getFreeBusyRanges(accessToken, now, rangeEnd, freeBusyCalendarIds)
    : [];

  return [...blockingBusy, ...freeBusy];
}

async function getFreeBusyRanges(accessToken, now, rangeEnd, calendarIds) {
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      timeMin: now.toISOString(),
      timeMax: rangeEnd.toISOString(),
      timeZone: settings.timeZone,
      items: calendarIds.map((id) => ({ id }))
    })
  });

  if (!response.ok) {
    throw new Error(`Google Freebusy failed: ${response.status}`);
  }

  const data = await response.json();
  const calendars = data.calendars || {};
  const erroredCalendar = calendarIds.find((id) => calendars[id]?.errors?.length);

  if (erroredCalendar) {
    throw new Error(`Google Calendar error for ${erroredCalendar}: ${calendars[erroredCalendar].errors[0].reason}`);
  }

  const busy = calendarIds.flatMap((id) => calendars[id]?.busy || []);
  return busy.map((item) => ({
    start: new Date(item.start),
    end: new Date(item.end)
  }));
}

async function getBlockingCalendarEventRanges(accessToken, now, rangeEnd) {
  const ranges = [];

  for (const calendarId of settings.blockingCalendarIds) {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
    url.searchParams.set("timeMin", now.toISOString());
    url.searchParams.set("timeMax", rangeEnd.toISOString());
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("showDeleted", "false");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Google Events list failed for ${calendarId}: ${response.status}`);
    }

    const data = await response.json();
    const eventRanges = (data.items || [])
      .filter((event) => event.status !== "cancelled")
      .map(getEventRange)
      .filter(Boolean);

    ranges.push(...eventRanges);
  }

  return ranges;
}

async function createGoogleCalendarEvent(booking, typeKey) {
  const accessToken = await getGoogleAccessToken();
  const targetCalendarId = getBookingCalendarId(typeKey);
  const startDate = zonedTimeToUtc(`${booking.survey_date}T${booking.appointment_time}`, settings.timeZone);
  const endDate = new Date(startDate.getTime() + getDurationMinutes(typeKey) * 60000);
  const surveyLabel = booking.survey_type === "Physical survey" ? "Physical survey" : "Video survey";
  const address = booking.address || "";
  const description = [
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    address ? `Address: ${address}` : "",
    "Source: iMove website booking form"
  ].filter(Boolean).join("\n");

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalendarId)}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      summary: `iMove ${surveyLabel} - ${booking.name}`,
      description,
      location: address || undefined,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: settings.timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: settings.timeZone
      },
      transparency: "opaque",
      visibility: "private"
    })
  });

  if (!response.ok) {
    throw new Error(`Google event creation failed: ${response.status}`);
  }

  return response.json();
}

async function getGoogleAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      refresh_token: settings.refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) {
    throw new Error(`Google token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

function hasGoogleCredentials() {
  return Boolean(settings.clientId && settings.clientSecret && settings.refreshToken && getAvailabilityCalendarIds().length);
}

function getAvailabilityCalendarIds() {
  return uniqueCalendarIds([
    ...settings.blockingCalendarIds,
    settings.videoCalendarId,
    settings.physicalCalendarId
  ]);
}

function getFreeBusyCalendarIds() {
  return uniqueCalendarIds([
    settings.videoCalendarId,
    settings.physicalCalendarId
  ]).filter((id) => !settings.blockingCalendarIds.includes(id));
}

function getBookingCalendarId(typeKey) {
  return typeKey === "physical" ? settings.physicalCalendarId : settings.videoCalendarId;
}

function splitCalendarIds(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueCalendarIds(ids) {
  return [...new Set(ids.filter(Boolean))];
}

function getEventRange(event) {
  const startValue = event.start?.dateTime || event.start?.date;
  const endValue = event.end?.dateTime || event.end?.date;

  if (!startValue || !endValue) {
    return null;
  }

  return {
    start: event.start?.dateTime ? new Date(startValue) : zonedTimeToUtc(`${startValue}T00:00`, settings.timeZone),
    end: event.end?.dateTime ? new Date(endValue) : zonedTimeToUtc(`${endValue}T00:00`, settings.timeZone)
  };
}

function getDurationMinutes(typeKey) {
  return typeKey === "physical" ? settings.physicalDurationMinutes : settings.videoDurationMinutes;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function parseMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDateKey(date, timeZone) {
  const parts = getDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatDateLabel(date, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(date);
}

function getWeekday(date, timeZone) {
  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short"
  }).format(date);
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(weekday) + 1;
}

function zonedTimeToUtc(localDateTime, timeZone) {
  const [datePart, timePart] = localDateTime.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset = getTimeZoneOffset(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offset);
}

function getTimeZoneOffset(date, timeZone) {
  const parts = getDateParts(date, timeZone, true);
  const asUtc = Date.UTC(parts.year, Number(parts.month) - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - date.getTime();
}

function getDateParts(date, timeZone, includeTime = false) {
  const options = {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.second = "2-digit";
    options.hourCycle = "h23";
  }

  return new Intl.DateTimeFormat("en-GB", options)
    .formatToParts(date)
    .reduce((parts, part) => {
      if (part.type !== "literal") {
        parts[part.type] = part.value;
      }
      return parts;
    }, {});
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

function loadEnvFile() {
  const envPath = path.resolve(root, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}
