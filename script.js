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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fallbackSurveyAvailability = [
  {
    date: "2026-04-27",
    label: "Mon 27 Apr",
    video: ["09:30", "11:00", "14:00", "16:30"],
    physical: ["10:00", "13:30"]
  },
  {
    date: "2026-04-28",
    label: "Tue 28 Apr",
    video: ["09:00", "12:00", "15:30"],
    physical: ["11:30", "14:30", "17:00"]
  },
  {
    date: "2026-04-29",
    label: "Wed 29 Apr",
    video: ["10:30", "13:00", "16:00"],
    physical: ["09:30", "12:30"]
  },
  {
    date: "2026-04-30",
    label: "Thu 30 Apr",
    video: ["09:30", "11:30", "15:00"],
    physical: ["10:30", "14:00"]
  }
];
let surveyAvailability = [...fallbackSurveyAvailability];
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

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

const revealSelectors = [
  ".hero-copy",
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

  if (item.matches(".gallery-board article, .quote-grid img, .service-detail-card, .service-quick-card, .service-photo-panel")) {
    item.classList.add("reveal-graphic");
  }

  if (item.matches(".gallery-copy, .contact-copy, .services-hero-copy, .single-service-copy, .service-story, .service-step-copy")) {
    item.classList.add("reveal-soft-left");
  }

  if (item.matches(".contact-form, .services-hero-card, .service-quick-card, .service-points")) {
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
    const response = await fetch("/api/survey-availability");

    if (!response.ok) {
      throw new Error("Availability request failed");
    }

    const data = await response.json();

    if (Array.isArray(data.availability) && data.availability.length) {
      surveyAvailability = data.availability;
      renderDates();
      renderTimes();

      if (surveyNote) {
        surveyNote.textContent = data.source === "google-calendar"
          ? "Live availability is coming from Google Calendar."
          : "Demo availability is active until Google Calendar credentials are added.";
      }
    }
  } catch (error) {
    surveyAvailability = [...fallbackSurveyAvailability];
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
    surveyNote.textContent = `${slots.length} ${surveyLabel} slots available on ${selectedDate?.label}.`;
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

renderDates();
updateAddressFields();
renderTimes();
loadSurveyAvailability();

if (surveyForm) {
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
    counter.textContent = Math.round(target * eased);

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
          <a class="btn btn-secondary" href="#contact">${content.primary}</a>
          <a class="btn btn-outline-dark" href="#contact">${content.secondary}</a>
        </div>
      </div>
    `;

    if (!reduceMotion) {
      stepPanel.classList.remove("in-view");
      requestAnimationFrame(() => stepPanel.classList.add("in-view"));
    }
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Thanks - this demo form is ready for a real enquiry endpoint when we build the next version.";
  contactForm.reset();
});
