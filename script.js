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
const googleReviewSummary = document.querySelector("[data-google-review-summary]");
const googleReviewsGrid = document.querySelector("[data-google-reviews]");
const planningJourney = document.querySelector("[data-planning-journey]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const whatsappUrl = "https://wa.me/441638255255";
const heroCarouselImages = [
  "header-1.jpeg",
  "header-2.jpeg",
  "header-3.jpeg",
  "header-4.jpeg",
  "header-5.jpeg",
  "header-6.jpeg"
];

const addFloatingWhatsAppButton = () => {
  if (document.querySelector("[data-floating-whatsapp]")) return;

  const link = document.createElement("a");
  link.className = "floating-whatsapp";
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.title = "Chat with iMove on WhatsApp";
  link.setAttribute("aria-label", "Chat with iMove on WhatsApp");
  link.setAttribute("data-floating-whatsapp", "");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16.02 4.02c-6.62 0-12 5.29-12 11.8 0 2.22.64 4.38 1.84 6.25l-1.2 5.86 6.08-1.86a12.25 12.25 0 0 0 5.28 1.21c6.62 0 12-5.29 12-11.8s-5.38-11.46-12-11.46Zm0 21.16c-1.68 0-3.32-.44-4.76-1.27l-.34-.2-3.58 1.1.72-3.46-.23-.36a9.34 9.34 0 0 1-1.53-5.17c0-5.31 4.36-9.63 9.72-9.63s9.72 4.32 9.72 9.63-4.36 9.36-9.72 9.36Zm5.34-7.03c-.29-.15-1.72-.84-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.24-.45-2.36-1.44-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.15-.66-1.57-.9-2.15-.24-.56-.48-.49-.66-.5h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43s1.05 2.82 1.19 3.01c.15.19 2.07 3.12 5.02 4.38.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.72-.69 1.96-1.36.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.56-.34Z"/>
    </svg>`;

  document.body.appendChild(link);
};

addFloatingWhatsAppButton();

const getSiteImageUrl = (fileName) => {
  const assetPrefix = window.location.pathname.includes("/services/") ? "../" : "";
  return new URL(`${assetPrefix}assets/site-images/${fileName}`, window.location.href).href;
};

const initialiseHeroCarousels = () => {
  const heroSections = document.querySelectorAll([
    ".hero",
    ".booking-page-hero",
    ".quote-page-hero",
    ".gallery-hero",
    ".services-hero",
    ".planning-hero",
    ".single-service-hero"
  ].join(","));

  if (!heroSections.length) return;

  const imageUrls = heroCarouselImages.map(getSiteImageUrl);

  heroSections.forEach((section, sectionIndex) => {
    if (section.querySelector("[data-hero-carousel]")) return;

    const carousel = document.createElement("div");
    carousel.className = "hero-carousel";
    carousel.setAttribute("aria-hidden", "true");
    carousel.setAttribute("data-hero-carousel", "");

    const startIndex = Math.floor(Math.random() * imageUrls.length);
    const slides = imageUrls.map((imageUrl, imageIndex) => {
      const slide = document.createElement("span");
      slide.className = `hero-carousel-slide${imageIndex === startIndex ? " is-active" : ""}`;
      slide.style.backgroundImage = `url("${imageUrl}")`;
      carousel.appendChild(slide);
      return slide;
    });

    section.classList.add("has-hero-carousel");
    section.prepend(carousel);

    if (reduceMotion || slides.length < 2) return;

    let activeIndex = startIndex;
    window.setInterval(() => {
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add("is-active");
    }, 7000 + sectionIndex * 250);
  });
};

initialiseHeroCarousels();

const fallbackGoogleReviews = [
  {
    authorName: "Cara Mishra",
    rating: 5,
    text: "These guys really helped me out with my move. I was given very short notice and they were one of the only removal companies that could accommodate this.",
    relativeTime: ""
  },
  {
    authorName: "Malcolm Ewan",
    rating: 5,
    text: "Just used iMove again. Great job - efficient and friendly removal guys. Made the whole process almost pain-free.",
    relativeTime: ""
  },
  {
    authorName: "iMove customer",
    rating: 5,
    text: "Helpful, careful, and easy to deal with from start to finish.",
    relativeTime: ""
  }
];

const renderStars = (rating) => {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
  return `${"&#9733;".repeat(rounded)}${"&#9734;".repeat(5 - rounded)}`;
};

const googleLogoSvg = `
  <svg class="google-mark" viewBox="0 0 24 24" role="img" aria-label="Google">
    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.27-1.93-6.13-4.52H2.18v2.84A11 11 0 0 0 12 23Z"/>
    <path fill="#fbbc05" d="M5.87 14.11A6.62 6.62 0 0 1 5.5 12c0-.73.13-1.44.37-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.95l3.69-2.84Z"/>
    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.69 2.84C6.73 7.31 9.15 5.38 12 5.38Z"/>
  </svg>`;

const googleSummaryLogoSvg = googleLogoSvg.replace("google-mark", "google-summary-mark");

const formatRating = (rating) => {
  const numericRating = Number(rating || 0);
  return numericRating ? numericRating.toFixed(1) : "5.0";
};

const renderGoogleReviewSummary = (data = {}) => {
  if (!googleReviewSummary) return;

  const rating = Number(data.rating || 0);
  const totalReviews = Number(data.totalReviews || 0);
  const reviewUrl = data.placeUrl || "https://www.google.com/search?q=iMove+Removals+and+Storage+reviews";
  const reviewLabel = totalReviews
    ? `${totalReviews.toLocaleString("en-GB")} Google reviews`
    : "Read our Google reviews";

  googleReviewSummary.innerHTML = `
    ${googleSummaryLogoSvg}
    <div class="google-review-rating">
      <strong>${formatRating(rating)}</strong>
      <span class="review-stars" aria-label="${formatRating(rating)} out of 5 stars">${renderStars(rating || 5)}</span>
    </div>
    <a href="${escapeHtml(reviewUrl)}" target="_blank" rel="noopener">${escapeHtml(reviewLabel)}</a>`;
};

const renderGoogleReviews = (reviews) => {
  if (!googleReviewsGrid) return;

  const safeReviews = (Array.isArray(reviews) && reviews.length ? reviews : fallbackGoogleReviews).slice(0, 3);
  googleReviewsGrid.innerHTML = safeReviews.map((review) => {
    const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));
    const stars = renderStars(rating);

    return `
      <figure class="review-card reveal in-view">
        <div class="review-card-head">
          <div>
            <figcaption>${escapeHtml(review.authorName || "Google reviewer")}</figcaption>
            <span class="review-source">Google review${review.relativeTime ? ` &middot; ${escapeHtml(review.relativeTime)}` : ""}</span>
          </div>
          ${googleLogoSvg}
        </div>
        <div class="review-stars" aria-label="${rating || 5} out of 5 stars">${stars}</div>
        <blockquote>${escapeHtml(review.text || "Thank you for choosing iMove.")}</blockquote>
      </figure>`;
  }).join("");
};

const loadGoogleReviews = async () => {
  if (!googleReviewsGrid) return;

  try {
    const response = await fetch("/api/google-reviews", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Google reviews request failed");
    }

    const data = await response.json();
    renderGoogleReviewSummary(data);
    renderGoogleReviews(data.reviews);
  } catch (error) {
    renderGoogleReviewSummary();
    renderGoogleReviews(fallbackGoogleReviews);
  }
};

loadGoogleReviews();

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
    image: "assets/site-images/survey.jpg",
    alt: "Virtual home survey on a phone",
    eyebrow: "Step 1",
    title: "Book a house survey",
    body: "Choose a fast Zoom call for a less intrusive survey, or book an in-person home visit for a more personal quote experience.",
    primary: "Book a Zoom survey",
    secondary: "Book a home visit"
  },
  quotes: {
    image: "assets/site-images/quotes.jpg",
    alt: "Planning a move and comparing quotes",
    eyebrow: "Step 2",
    title: "Get at least 3 quotes",
    body: "Compare what is actually included, not just the lowest number. Check packing, insurance, access, storage, and moving day support before choosing.",
    primary: "Request a quote",
    secondary: "Ask a question"
  },
  date: {
    image: "assets/site-images/date.jpg",
    alt: "Moving day circled on a calendar",
    eyebrow: "Step 3",
    title: "Secure your moving date",
    body: "Book early to reserve the team for your important day. A low 10% deposit secures your moving date and keeps the plan moving.",
    primary: "Reserve a date",
    secondary: "Call the team"
  },
  prepare: {
    image: "assets/site-images/prepare.webp",
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

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
  ".planning-hero-copy",
  ".planning-hero-panel",
  ".planning-road-heading",
  ".planning-next-grid > *",
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

const initialisePlanningJourney = () => {
  if (!planningJourney) return;

  const scene = planningJourney.querySelector("[data-road-scene]");
  const path = planningJourney.querySelector("[data-road-path]");
  const van = planningJourney.querySelector("[data-road-van]");
  const stops = [...planningJourney.querySelectorAll("[data-journey-stop]")]
    .map((stop) => ({
      element: stop,
      progress: Number(stop.dataset.progress || 0)
    }));

  if (!scene || !path || !van || !stops.length) return;

  if (reduceMotion) {
    stops.forEach(({ element }) => element.classList.add("is-active", "is-passed", "is-revealed"));
    return;
  }

  const viewBoxWidth = 1000;
  const viewBoxHeight = 2600;
  const pathLength = path.getTotalLength();
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let ticking = false;

  const updateJourney = () => {
    ticking = false;

    const sceneRect = scene.getBoundingClientRect();
    const viewportAnchor = window.innerHeight * 0.5;
    const progress = clamp((viewportAnchor - sceneRect.top) / Math.max(sceneRect.height, 1), 0, 1);
    const pathPoint = path.getPointAtLength(pathLength * progress);
    const lookAheadPoint = path.getPointAtLength(clamp(pathLength * progress + 12, 0, pathLength));
    const angle = Math.atan2(lookAheadPoint.y - pathPoint.y, lookAheadPoint.x - pathPoint.x) * 180 / Math.PI;
    const relativeAngle = ((angle - 180 + 540) % 360) - 180;
    const driveAngle = clamp(relativeAngle * 0.18, -16, 16);
    const x = (pathPoint.x / viewBoxWidth) * scene.offsetWidth;
    const y = (pathPoint.y / viewBoxHeight) * scene.offsetHeight;

    van.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${driveAngle}deg)`;

    const nearestStop = stops.reduce((nearest, stop) => {
      const distance = Math.abs(progress - stop.progress);
      return distance < nearest.distance ? { ...stop, distance } : nearest;
    }, { element: stops[0].element, progress: stops[0].progress, distance: Infinity });

    stops.forEach(({ element, progress: stopProgress }) => {
      element.classList.toggle("is-active", element === nearestStop.element);
      element.classList.toggle("is-passed", progress >= stopProgress);
      if (progress >= stopProgress - 0.06) {
        element.classList.add("is-revealed");
      }
    });
  };

  const requestJourneyUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateJourney);
  };

  window.addEventListener("scroll", requestJourneyUpdate, { passive: true });
  window.addEventListener("resize", requestJourneyUpdate);
  updateJourney();
};

initialisePlanningJourney();

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

  if (!reduceMotion && typeof galleryLightboxImage.animate === "function") {
    galleryLightboxImage.animate([
      { opacity: 0.42, transform: "scale(0.985)" },
      { opacity: 1, transform: "scale(1)" }
    ], {
      duration: 320,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)"
    });
  }
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
