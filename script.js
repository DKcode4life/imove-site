const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const counters = document.querySelectorAll("[data-count]");
const stepButtons = document.querySelectorAll("[data-step]");
const stepPanel = document.querySelector("[data-step-panel]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const heroBooking = document.querySelector(".hero-booking");
const surveyForm = document.querySelector("[data-survey-form]");
const surveyChoice = document.querySelector(".survey-choice");
const surveyDate = document.querySelector("[data-survey-date]");
const timeSlots = document.querySelector("[data-time-slots]");
const appointmentTime = document.querySelector("[data-appointment-time]");
const surveyNote = document.querySelector("[data-survey-note]");
const bookingSubmit = document.querySelector("[data-booking-submit]");
const addressFields = document.querySelector("[data-address-fields]");
const addressRequiredFields = document.querySelectorAll("[data-address-required]");
const estimator = document.querySelector("[data-estimator]");
const estimatorSteps = document.querySelectorAll("[data-estimator-step]");
const estimatorProgressSteps = document.querySelectorAll("[data-progress-step]");
const estimatorStage = document.querySelector("[data-estimator-stage]");
const estimatorPrice = document.querySelector("[data-estimator-price]");
const estimatorVolume = document.querySelector("[data-estimator-volume]");
const estimatorSummary = document.querySelector("[data-estimator-summary]");
const estimatorReview = document.querySelector("[data-estimator-review]");
const estimatorFrom = document.querySelector("[data-estimator-from]");
const estimatorTo = document.querySelector("[data-estimator-to]");
const estimatorDistanceNote = document.querySelector("[data-estimator-distance-note]");
const estimatorContactForm = document.querySelector("[data-estimator-contact-form]");
const estimatorNote = document.querySelector("[data-estimator-note]");
const estimatorSubmit = document.querySelector("[data-estimator-submit]");
const estimatorSuccess = document.querySelector("[data-estimator-success]");
const quoteRequestForm = document.querySelector("[data-quote-request-form]");
const quotePropertyType = document.querySelectorAll("[data-quote-property-type]");
const quoteFlatFields = document.querySelector("[data-quote-flat-fields]");
const quoteFlatRequiredFields = document.querySelectorAll("[data-quote-flat-required]");
const quoteNote = document.querySelector("[data-quote-note]");
const quoteSubmit = document.querySelector("[data-quote-submit]");
let galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
const galleryFilterButtons = document.querySelectorAll("[data-gallery-filter]");
const galleryLightbox = document.querySelector("[data-gallery-lightbox]");
const galleryLightboxImage = document.querySelector("[data-gallery-lightbox-image]");
const galleryLightboxTitle = document.querySelector("[data-gallery-lightbox-title]");
const galleryLightboxCount = document.querySelector("[data-gallery-lightbox-count]");
const galleryClose = document.querySelector("[data-gallery-close]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatFallbackDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatFallbackDateLabel = (date) => new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short"
}).format(date);

const minutesToTime = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");

  return `${hours}:${mins}`;
};

const buildFallbackSlots = (date, durationMinutes) => {
  const slots = [];
  const now = new Date();
  const dayStart = 9 * 60;
  const dayEnd = 17 * 60;

  for (let minute = dayStart; minute + durationMinutes <= dayEnd; minute += 30) {
    const slot = new Date(date);
    slot.setHours(Math.floor(minute / 60), minute % 60, 0, 0);

    if (slot > now) {
      slots.push(minutesToTime(minute));
    }
  }

  return slots;
};

const buildFallbackSurveyAvailability = () => {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.length < 10) {
    const weekday = cursor.getDay();

    if (weekday >= 1 && weekday <= 6) {
      const video = buildFallbackSlots(cursor, 30);
      const physical = buildFallbackSlots(cursor, 60);

      if (video.length || physical.length) {
        days.push({
          date: formatFallbackDateKey(cursor),
          label: formatFallbackDateLabel(cursor),
          video,
          physical
        });
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};

let surveyAvailability = buildFallbackSurveyAvailability();
let surveyAvailabilitySource = "demo";
let availabilityRefreshTimer;

const stepContent = {
  survey: {
    image: "https://myimove.co.uk/wp-content/uploads/2025/04/a99f7334-879c-46c5-ab7c-46b70f8e159e.jpg",
    alt: "Virtual home survey on a phone",
    eyebrow: "Step 1",
    title: "Book a house survey",
    body: "Choose a fast Zoom call for a less intrusive survey, or book an in-person home visit for a more personal quote experience.",
    primary: "Book a Zoom survey",
    secondary: "Book a home visit"
  },
  quotes: {
    image: "https://myimove.co.uk/wp-content/uploads/2025/04/photo-1631557777232-a2632ae3c67d-scaled.jpg",
    alt: "Planning a move and comparing quotes",
    eyebrow: "Step 2",
    title: "Get at least 3 quotes",
    body: "Compare what is actually included, not just the lowest number. Check packing, insurance, access, storage, and moving day support before choosing.",
    primary: "Request a quote",
    secondary: "Ask a question"
  },
  date: {
    image: "https://myimove.co.uk/wp-content/uploads/2025/04/choose-moving-day.jpg",
    alt: "Moving day circled on a calendar",
    eyebrow: "Step 3",
    title: "Secure your moving date",
    body: "Book early to reserve the team for your important day. iMove does not require a deposit to secure your moving date.",
    primary: "Reserve a date",
    secondary: "Call the team"
  },
  prepare: {
    image: "https://myimove.co.uk/wp-content/uploads/2025/04/moving-day.webp",
    alt: "Packed moving boxes labelled by room",
    eyebrow: "Step 4",
    title: "Prepare for the move",
    body: "Declutter first, pack non-essential items early, label boxes by room, and keep documents, valuables, and daily essentials in a separate bag.",
    primary: "Start with a quote",
    secondary: "View services"
  }
};

const estimatorState = {
  step: 1,
  property: null,
  furnished: null,
  distance: null,
  extras: new Map(),
  estimate: null
};

let estimatorSettings = {
  highEstimateMinimum: 190,
  highEstimatePercent: 0.26
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const renderEstimatorOptions = (settings) => {
  if (!estimator || !settings?.estimator) return;

  estimatorSettings = {
    highEstimateMinimum: Number(settings.estimator.highEstimateMinimum || 190),
    highEstimatePercent: Number(settings.estimator.highEstimatePercent || 0.26)
  };

  const propertyGrid = estimator.querySelector(".property-grid");
  const furnishedGrid = estimator.querySelector(".furnished-grid");
  const extrasGrid = estimator.querySelector(".extras-grid");
  const distanceGrid = estimator.querySelector(".distance-grid");

  if (propertyGrid) {
    propertyGrid.innerHTML = settings.estimator.properties.map((item) => `
      <button type="button" data-estimator-option="property" data-label="${escapeHtml(item.label)}" data-volume="${Number(item.volume)}" data-price="${Number(item.price)}">${escapeHtml(item.label)}</button>
    `).join("");
  }

  if (furnishedGrid) {
    furnishedGrid.innerHTML = settings.estimator.furnished.map((item) => `
      <button type="button" data-estimator-option="furnished" data-label="${escapeHtml(item.label)}" data-multiplier="${Number(item.multiplier)}"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.description)}</small></button>
    `).join("");
  }

  if (extrasGrid) {
    extrasGrid.innerHTML = settings.estimator.extras.map((item) => `
      <button type="button" data-estimator-extra="${escapeHtml(item.label)}" data-price="${Number(item.price)}" data-volume="${Number(item.volume)}">${escapeHtml(item.label)}</button>
    `).join("");
  }

  if (distanceGrid) {
    distanceGrid.innerHTML = settings.estimator.distances.map((item) => `
      <button type="button" data-estimator-option="distance" data-label="${escapeHtml(item.label)}" data-distance="${Number(item.distance)}" data-price="${Number(item.price)}"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.description)}</small></button>
    `).join("");
  }
};

const getGalleryLayoutClass = (layout) => ["wide", "tall"].includes(layout) ? layout : "";

const renderGalleryOptions = (settings) => {
  const galleryGrid = document.querySelector("[data-gallery-grid]");
  if (!galleryGrid || !Array.isArray(settings?.gallery)) return;

  galleryGrid.innerHTML = settings.gallery.map((item, index) => `
    <article class="gallery-tile ${getGalleryLayoutClass(item.layout)}" data-gallery-item data-category="${escapeHtml(item.category)}" data-title="${escapeHtml(item.title)}" data-index="${index}">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}">
      <button type="button"><span>${escapeHtml(item.category)}</span><strong>${escapeHtml(item.title)}</strong></button>
    </article>
  `).join("");

  galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
  bindGalleryItems();
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const formatMoney = (value) => `£${Math.round(value).toLocaleString("en-GB")}`;

const roundToTen = (value) => Math.round(value / 10) * 10;

const updateEstimatorProgress = () => {
  const visibleStep = Math.min(estimatorState.step, 3);

  estimatorProgressSteps.forEach((step) => {
    const stepNumber = Number(step.dataset.progressStep);
    step.classList.toggle("active", stepNumber === visibleStep);
    step.classList.toggle("complete", stepNumber < visibleStep);
  });
};

const updateEstimatorActions = () => {
  if (!estimator) return;

  const propertyReady = Boolean(estimatorState.property && estimatorState.furnished);
  const locationsReady = Boolean(estimatorFrom?.value.trim() && estimatorTo?.value.trim());
  const distanceReady = Boolean(estimatorState.distance || locationsReady);

  estimator.querySelectorAll("[data-estimator-step='1'] [data-estimator-next]")
    .forEach((button) => {
      button.disabled = !propertyReady;
    });

  estimator.querySelectorAll("[data-estimator-step='2'] [data-estimator-next]")
    .forEach((button) => {
      button.disabled = !distanceReady;
    });
};

const calculateEstimate = () => {
  const property = estimatorState.property;
  const furnished = estimatorState.furnished;
  const distance = estimatorState.distance;

  if (!property || !furnished || !distance) return;

  const extras = [...estimatorState.extras.values()];
  const extraPrice = extras.reduce((total, item) => total + item.price, 0);
  const extraVolume = extras.reduce((total, item) => total + item.volume, 0);
  const volume = Math.round((property.volume + extraVolume) * furnished.multiplier);
  const lowEstimate = roundToTen((property.price + distance.price + extraPrice) * furnished.multiplier);
  const highEstimate = roundToTen(lowEstimate + Math.max(estimatorSettings.highEstimateMinimum, lowEstimate * estimatorSettings.highEstimatePercent));
  const extrasLabel = extras.length ? ` - ${extras.map((item) => item.label).join(", ")}` : "";

  estimatorState.estimate = {
    low: lowEstimate,
    high: highEstimate,
    volume,
    extrasLabel
  };

  if (estimatorPrice) {
    estimatorPrice.textContent = `${formatMoney(lowEstimate)} - ${formatMoney(highEstimate)}`;
  }

  if (estimatorVolume) {
    estimatorVolume.textContent = `Based on ~${volume.toLocaleString("en-GB")} cu ft`;
  }

  if (estimatorSummary) {
    estimatorSummary.textContent = `${property.label} - ${furnished.label} - ${distance.label} (${distance.distance} miles)${extrasLabel}`;
  }
};

const clearTypedDistance = () => {
  if (estimatorFrom) estimatorFrom.value = "";
  if (estimatorTo) estimatorTo.value = "";
  if (estimatorDistanceNote) estimatorDistanceNote.textContent = "";
};

const clearPresetDistance = () => {
  estimator?.querySelectorAll("[data-estimator-option='distance']")
    .forEach((option) => option.classList.remove("active"));
  estimatorState.distance = null;
};

const calculateTypedDistance = async () => {
  const from = estimatorFrom?.value.trim();
  const to = estimatorTo?.value.trim();

  if (!from || !to) {
    return false;
  }

  if (estimatorDistanceNote) {
    estimatorDistanceNote.textContent = "Calculating distance from your locations...";
  }

  const response = await fetch("/api/estimate-distance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to })
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "We could not calculate that distance. Please choose a preset mileage.");
  }

  estimatorState.distance = {
    label: result.label,
    distance: Number(result.distance),
    price: Number(result.price)
  };

  if (estimatorDistanceNote) {
    estimatorDistanceNote.textContent = `Calculated around ${result.distance} miles (${result.tierLabel}).`;
  }

  updateEstimatorActions();
  return true;
};

const renderEstimatorReview = () => {
  if (!estimatorReview) return;

  const estimate = estimatorState.estimate;
  const property = estimatorState.property;
  const furnished = estimatorState.furnished;
  const distance = estimatorState.distance;
  const extras = [...estimatorState.extras.values()].map((item) => item.label).join(", ") || "None selected";

  if (!estimate || !property || !furnished || !distance) {
    estimatorReview.innerHTML = "";
    return;
  }

  estimatorReview.innerHTML = `
    <div><strong>Estimate:</strong> ${formatMoney(estimate.low)} - ${formatMoney(estimate.high)}</div>
    <div><strong>Property:</strong> ${property.label} - ${furnished.label} - ${distance.label}</div>
    <div><strong>Extras:</strong> ${extras}</div>
    <div><strong>Volume:</strong> ~${estimate.volume.toLocaleString("en-GB")} cu ft</div>
  `;
};

const showEstimatorStep = (nextStep) => {
  if (!estimator || nextStep === estimatorState.step) return;

  const previousStep = estimatorState.step;
  const nextPanel = estimator.querySelector(`[data-estimator-step="${nextStep}"]`);
  const currentPanel = estimator.querySelector(`[data-estimator-step="${previousStep}"]`);
  if (!nextPanel) return;

  estimatorState.step = nextStep;
  updateEstimatorProgress();

  if (nextStep === 3) {
    calculateEstimate();
  }

  if (nextStep === 4) {
    calculateEstimate();
    renderEstimatorReview();
  }

  currentPanel?.classList.remove("active", "from-left", "exit-left");
  if (nextStep < previousStep) {
    nextPanel.classList.add("from-left");
  }
  nextPanel.classList.add("active");
  window.requestAnimationFrame(() => {
    nextPanel.classList.remove("from-left");
  });

  if (estimatorStage) {
    estimatorStage.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }
};

const selectEstimatorOption = (button) => {
  const group = button.dataset.estimatorOption;
  if (!group) return;

  estimator?.querySelectorAll(`[data-estimator-option="${group}"]`)
    .forEach((option) => option.classList.remove("active"));
  button.classList.add("active");

  if (group === "property") {
    estimatorState.property = {
      label: button.dataset.label,
      price: Number(button.dataset.price),
      volume: Number(button.dataset.volume)
    };
    estimator?.classList.add("details-open");
  }

  if (group === "furnished") {
    estimatorState.furnished = {
      label: button.dataset.label,
      multiplier: Number(button.dataset.multiplier)
    };
  }

  if (group === "distance") {
    clearTypedDistance();
    estimatorState.distance = {
      label: button.dataset.label,
      distance: Number(button.dataset.distance),
      price: Number(button.dataset.price)
    };
  }

  updateEstimatorActions();
};

const toggleEstimatorExtra = (button) => {
  const label = button.dataset.estimatorExtra;
  if (!label) return;

  button.classList.toggle("active");

  if (button.classList.contains("active")) {
    estimatorState.extras.set(label, {
      label,
      price: Number(button.dataset.price),
      volume: Number(button.dataset.volume)
    });
  } else {
    estimatorState.extras.delete(label);
  }
};

estimator?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-estimator-option]");
  if (option) {
    selectEstimatorOption(option);
    return;
  }

  const extra = event.target.closest("[data-estimator-extra]");
  if (extra) {
    toggleEstimatorExtra(extra);
  }
});

[estimatorFrom, estimatorTo].forEach((input) => {
  input?.addEventListener("input", () => {
    clearPresetDistance();
    if (estimatorDistanceNote) {
      estimatorDistanceNote.textContent = "";
    }
    updateEstimatorActions();
  });
});

estimator?.querySelectorAll("[data-estimator-next]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (estimatorState.step === 2 && !estimatorState.distance) {
      try {
        button.disabled = true;
        const calculated = await calculateTypedDistance();
        if (!calculated) return;
      } catch (error) {
        if (estimatorDistanceNote) {
          estimatorDistanceNote.textContent = error.message;
        }
        updateEstimatorActions();
        return;
      }
    }

    showEstimatorStep(estimatorState.step + 1);
  });
});

estimator?.querySelectorAll("[data-estimator-back]").forEach((button) => {
  button.addEventListener("click", () => showEstimatorStep(estimatorState.step - 1));
});

estimator?.querySelectorAll("[data-estimator-adjust]").forEach((button) => {
  button.addEventListener("click", () => {
    estimator.classList.remove("is-submitted");
    estimatorContactForm?.removeAttribute("hidden");
    if (estimatorSuccess) {
      estimatorSuccess.hidden = true;
    }
    showEstimatorStep(1);
  });
});

updateEstimatorActions();

estimatorContactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!estimatorState.estimate || !estimatorState.property || !estimatorState.furnished || !estimatorState.distance) {
    showEstimatorStep(1);
    return;
  }

  if (!estimatorContactForm.checkValidity()) {
    estimatorContactForm.reportValidity();
    return;
  }

  const formData = new FormData(estimatorContactForm);
  const extras = [...estimatorState.extras.values()].map((item) => item.label);
  const payload = {
    source: "iMove website estimator",
    customer: Object.fromEntries(formData.entries()),
    estimate: {
      low: estimatorState.estimate.low,
      high: estimatorState.estimate.high,
      volume: estimatorState.estimate.volume
    },
    property: estimatorState.property,
    furnished: estimatorState.furnished,
    distance: estimatorState.distance,
    extras
  };

  if (estimatorSubmit) {
    estimatorSubmit.disabled = true;
  }

  if (estimatorNote) {
    estimatorNote.textContent = "Sending your estimator request...";
  }

  try {
    const response = await fetch("/api/estimate-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "The estimator request could not be sent.");
    }

    estimatorContactForm.reset();
    estimatorContactForm.setAttribute("hidden", "");
    estimator?.classList.add("is-submitted");
    if (estimatorSuccess) {
      estimatorSuccess.hidden = false;
    }
    if (estimatorNote) {
      estimatorNote.textContent = "";
    }
  } catch (error) {
    if (estimatorNote) {
      estimatorNote.textContent = error.message;
    }
  } finally {
    if (estimatorSubmit) {
      estimatorSubmit.disabled = false;
    }
  }
});

const updateQuoteFlatFields = () => {
  if (!quoteFlatFields) return;

  const selectedType = [...quotePropertyType].find((input) => input.checked)?.value || "";
  const isFlat = selectedType === "Flat / apartment";

  quoteFlatFields.hidden = !isFlat;
  quoteFlatRequiredFields.forEach((field) => {
    field.required = isFlat;
    if (!isFlat) {
      field.value = "";
    }
  });
};

quotePropertyType.forEach((input) => {
  input.addEventListener("change", updateQuoteFlatFields);
});

updateQuoteFlatFields();

quoteRequestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!quoteRequestForm.checkValidity()) {
    quoteRequestForm.reportValidity();
    return;
  }

  const payload = Object.fromEntries(new FormData(quoteRequestForm).entries());

  if (quoteSubmit) {
    quoteSubmit.disabled = true;
  }

  if (quoteNote) {
    quoteNote.textContent = "Sending your quote request...";
  }

  try {
    const response = await fetch("/api/quote-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "The quote request could not be sent.");
    }

    quoteRequestForm.reset();
    updateQuoteFlatFields();

    if (quoteNote) {
      quoteNote.textContent = result.message || "Thank you, your quote request has been received and a member of staff will contact you very soon.";
    }
  } catch (error) {
    if (quoteNote) {
      quoteNote.textContent = error.message;
    }
  } finally {
    if (quoteSubmit) {
      quoteSubmit.disabled = false;
    }
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

const revealSelectors = [
  ".hero-copy",
  ".hero-estimator",
  ".booking-page-copy",
  ".services-hero-copy",
  ".services-hero-card",
  ".single-service-copy",
  ".service-quick-card",
  ".service-story",
  ".service-points",
  ".service-cta-panel",
  ".service-photo-panel",
  ".mini-step-card",
  ".related-services a",
  ".section-heading",
  ".service-card",
  ".service-intro-grid > *",
  ".service-detail-card",
  ".service-band-grid > *",
  ".service-step-copy",
  ".service-step-list span",
  ".stats-grid > div",
  ".gallery-copy",
  ".gallery-board article",
  ".urgent-grid > *",
  ".step-tabs button",
  ".step-panel",
  ".review-card",
  ".quote-grid > *",
  ".contact-copy",
  ".contact-form",
  ".gallery-hero-copy",
  ".gallery-feature-card",
  ".gallery-page-heading",
  ".quote-page-copy",
  ".quote-request-card",
  ".quote-help-card",
  ".contact-map",
  ".gallery-filter-bar button",
  ".gallery-tile",
  ".gallery-cta-grid > *",
  ".footer-grid > div"
].join(", ");

const revealItems = [...document.querySelectorAll(revealSelectors)];

if (heroBooking) {
  if (reduceMotion) {
    heroBooking.style.opacity = "1";
    heroBooking.style.transform = "none";
  } else {
    heroBooking.classList.add("booking-slide-in");
  }
}

revealItems.forEach((item) => {
  const siblingIndex = [...item.parentElement.children].indexOf(item);
  const delay = Math.min((siblingIndex % 4) * 150, 450);
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${delay}ms`);

  if (item.matches(".gallery-board article, .gallery-tile, .quote-grid img, .service-detail-card, .service-quick-card, .service-photo-panel")) {
    item.classList.add("reveal-graphic");
  }

  if (item.matches(".gallery-copy, .gallery-hero-copy, .gallery-page-heading, .contact-copy, .services-hero-copy, .single-service-copy, .service-story, .service-step-copy")) {
    item.classList.add("reveal-soft-left");
  }

  if (item.matches(".contact-form, .gallery-feature-card, .services-hero-card, .service-quick-card, .service-points")) {
    item.classList.add("reveal-soft-right");
  }
});

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -6% 0px",
    threshold: 0.22
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const getSurveyType = () => {
  const selected = surveyForm?.querySelector("input[name='survey_type']:checked");
  return selected?.value === "Physical survey" ? "physical" : "video";
};

const expandBookingForm = () => {
  surveyForm?.classList.add("is-expanded");
};

const renderDates = () => {
  if (!surveyDate) return;

  surveyDate.innerHTML = surveyAvailability
    .map((slot) => `<option value="${slot.date}">${slot.label}</option>`)
    .join("");
};

const loadSurveyAvailability = async () => {
  try {
    const response = await fetch("/api/survey-availability", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Availability request failed");
    }

    const data = await response.json();

    if (Array.isArray(data.availability) && data.availability.length) {
      surveyAvailability = data.availability;
      surveyAvailabilitySource = data.source || "demo";
      renderDates();
      renderTimes();

      if (surveyNote) {
        if (data.source === "calendar-error") {
          surveyNote.textContent = "Live calendar availability could not be checked, so bookings will be treated as provisional and manually confirmed by the team.";
        } else {
          surveyNote.textContent = data.source === "google-calendar"
            ? "Live availability is coming from Google Calendar."
            : "Demo availability is active until Google Calendar credentials are added.";
        }
      }
    }
  } catch (error) {
    surveyAvailability = buildFallbackSurveyAvailability();
    surveyAvailabilitySource = "demo";
    renderDates();
    renderTimes();

    if (surveyNote) {
      surveyNote.textContent = "Demo availability is active while the calendar connection is being set up.";
    }
  }
};

const renderTimes = () => {
  if (!surveyDate || !timeSlots || !appointmentTime) return;

  const selectedDate = surveyAvailability.find((slot) => slot.date === surveyDate.value);
  const selectedType = getSurveyType();
  const slots = selectedDate?.[selectedType] || [];

  appointmentTime.value = "";
  timeSlots.innerHTML = slots
    .map((time) => `<button class="time-slot" type="button" data-time="${time}">${time}</button>`)
    .join("");

  if (surveyNote) {
    const surveyLabel = selectedType === "physical" ? "physical survey" : "video survey";
    surveyNote.textContent = surveyAvailabilitySource === "calendar-error"
      ? `${slots.length} provisional ${surveyLabel} slots available on ${selectedDate?.label}. The team will manually confirm your appointment.`
      : `${slots.length} ${surveyLabel} slots available on ${selectedDate?.label}.`;
  }

  updateBookingButton();
};

const updateAddressFields = () => {
  const needsAddress = getSurveyType() === "physical";

  if (addressFields) {
    addressFields.hidden = !needsAddress;
  }

  addressRequiredFields.forEach((field) => {
    field.required = needsAddress;

    if (!needsAddress) {
      field.value = "";
    }
  });

  updateBookingButton();
};

const updateBookingButton = () => {
  if (!surveyForm || !bookingSubmit) return;

  const visibleRequiredFields = [...surveyForm.querySelectorAll("[required]")]
    .filter((field) => !field.closest("[hidden]"));
  const requiredFieldsComplete = visibleRequiredFields.every((field) => field.value.trim() !== "");
  const contactFieldsValid = visibleRequiredFields.every((field) => field.checkValidity());
  const hasTimeSlot = Boolean(appointmentTime?.value);

  bookingSubmit.disabled = !(requiredFieldsComplete && contactFieldsValid && hasTimeSlot);
};

if (surveyForm) {
  renderDates();
  updateAddressFields();
  renderTimes();
  loadSurveyAvailability();
  availabilityRefreshTimer = window.setInterval(loadSurveyAvailability, 60000);

  window.addEventListener("focus", loadSurveyAvailability);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      loadSurveyAvailability();
    }
  });
}

surveyDate?.addEventListener("change", () => {
  renderTimes();
  updateBookingButton();
});

surveyForm?.querySelectorAll("input[name='survey_type']").forEach((input) => {
  input.addEventListener("change", () => {
    expandBookingForm();
    updateAddressFields();
    renderTimes();
  });
});

surveyChoice?.addEventListener("click", (event) => {
  if (event.target.closest("label")) {
    expandBookingForm();
  }
});

timeSlots?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-time]");
  if (!button) return;

  timeSlots.querySelectorAll(".time-slot").forEach((slot) => slot.classList.remove("active"));
  button.classList.add("active");
  appointmentTime.value = button.dataset.time;
  updateBookingButton();
});

surveyForm?.addEventListener("input", updateBookingButton);
surveyForm?.addEventListener("change", updateBookingButton);

surveyForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!appointmentTime.value) {
    surveyNote.textContent = "Choose an available appointment time before booking.";
    return;
  }

  const data = new FormData(surveyForm);
  const booking = Object.fromEntries(data.entries());
  bookingSubmit.disabled = true;
  surveyNote.textContent = "Checking availability and saving your survey booking...";

  fetch("/api/survey-bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(booking)
  })
    .then(async (response) => {
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "The booking could not be saved.");
      }

      const successMessage = result.message;
      surveyNote.textContent = successMessage;
      surveyForm.reset();
      surveyForm.classList.remove("is-expanded");
      updateAddressFields();
      return loadSurveyAvailability().then(() => {
        surveyNote.textContent = successMessage;
      });
    })
    .catch((error) => {
      surveyNote.textContent = error.message;
    })
    .finally(() => {
      updateBookingButton();
    });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString("en-GB");

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedStep = button.dataset.step;
    const content = stepContent[selectedStep];

    stepButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    stepPanel.innerHTML = `
      <img src="${content.image}" alt="${content.alt}">
      <div>
        <p class="eyebrow">${content.eyebrow}</p>
        <h3>${content.title}</h3>
        <p>${content.body}</p>
        <div class="panel-actions">
          <a class="btn btn-secondary" href="${selectedStep === "survey" || selectedStep === "date" ? "book-survey.html" : "get-quote.html"}">${content.primary}</a>
          <a class="btn btn-outline-dark" href="${selectedStep === "prepare" ? "services.html" : selectedStep === "survey" ? "book-survey.html" : "#contact"}">${content.secondary}</a>
        </div>
      </div>
    `;

    if (!reduceMotion) {
      stepPanel.classList.remove("in-view");
      requestAnimationFrame(() => stepPanel.classList.add("in-view"));
    }
  });
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(contactForm).entries());

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (formNote) {
    formNote.textContent = "Sending your enquiry...";
  }

  try {
    const response = await fetch("/api/contact-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "The enquiry could not be sent.");
    }

    if (formNote) {
      formNote.textContent = result.message || "Thank you, your enquiry has been received and a member of staff will contact you very soon.";
    }
    contactForm.reset();
  } catch (error) {
    if (formNote) {
      formNote.textContent = error.message;
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

let activeGalleryFilter = "all";
let currentGalleryItem = 0;

const getVisibleGalleryItems = () => galleryItems
  .filter((item) => !item.classList.contains("is-hidden"));

const updateGalleryLightbox = (item) => {
  if (!galleryLightbox || !galleryLightboxImage || !galleryLightboxTitle || !galleryLightboxCount || !item) return;

  const image = item.querySelector("img");
  const visibleItems = getVisibleGalleryItems();
  const visiblePosition = visibleItems.indexOf(item);

  galleryLightboxImage.src = image?.src || "";
  galleryLightboxImage.alt = image?.alt || item.dataset.title || "iMove gallery image";
  galleryLightboxTitle.textContent = item.dataset.title || image?.alt || "iMove gallery";
  galleryLightboxCount.textContent = `${visiblePosition + 1} of ${visibleItems.length}`;
};

const openGalleryLightbox = (item) => {
  if (!galleryLightbox || !item) return;

  const visibleItems = getVisibleGalleryItems();
  currentGalleryItem = Math.max(visibleItems.indexOf(item), 0);
  updateGalleryLightbox(visibleItems[currentGalleryItem]);
  galleryLightbox.hidden = false;
  document.body.classList.add("lightbox-open");
};

const closeGalleryLightbox = () => {
  if (!galleryLightbox) return;

  galleryLightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
};

const moveGalleryLightbox = (direction) => {
  const visibleItems = getVisibleGalleryItems();
  if (!visibleItems.length || galleryLightbox?.hidden) return;

  currentGalleryItem = (currentGalleryItem + direction + visibleItems.length) % visibleItems.length;
  updateGalleryLightbox(visibleItems[currentGalleryItem]);
};

const applyGalleryFilter = (filter) => {
  activeGalleryFilter = filter;

  galleryFilterButtons.forEach((button) => {
    const isActive = button.dataset.galleryFilter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  galleryItems.forEach((item) => {
    const shouldShow = filter === "all" || item.dataset.category === filter;
    item.classList.toggle("is-hidden", !shouldShow);
  });
};

const bindGalleryItems = () => {
  galleryItems.forEach((item) => {
    if (item.dataset.galleryBound === "true") return;

    item.dataset.galleryBound = "true";
    item.addEventListener("click", () => openGalleryLightbox(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGalleryLightbox(item);
      }
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open gallery image: ${item.dataset.title || "iMove photo"}`);
  });
};

galleryFilterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => applyGalleryFilter(button.dataset.galleryFilter || "all"));
});

galleryClose?.addEventListener("click", closeGalleryLightbox);
galleryPrev?.addEventListener("click", () => moveGalleryLightbox(-1));
galleryNext?.addEventListener("click", () => moveGalleryLightbox(1));

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) {
    closeGalleryLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!galleryLightbox || galleryLightbox.hidden) return;

  if (event.key === "Escape") {
    closeGalleryLightbox();
  }

  if (event.key === "ArrowLeft") {
    moveGalleryLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    moveGalleryLightbox(1);
  }
});

const loadPublicSettings = async () => {
  if (!estimator && !document.querySelector("[data-gallery-grid]")) {
    bindGalleryItems();
    return;
  }

  try {
    const response = await fetch("/api/site-settings");
    if (!response.ok) return;

    const settings = await response.json();
    renderEstimatorOptions(settings);
    renderGalleryOptions(settings);
    applyGalleryFilter(activeGalleryFilter);
  } catch (error) {
    // Public pages keep their built-in fallback settings if the JSON file is not available.
  } finally {
    bindGalleryItems();
  }
};

loadPublicSettings();
