const adminNote = document.querySelector("[data-admin-note]");
const saveButton = document.querySelector("[data-admin-save]");
const addGalleryButton = document.querySelector("[data-gallery-add]");
const galleryList = document.querySelector("[data-admin-gallery-list]");
let adminSettings;

const estimatorTables = {
  properties: [
    ["label", "Property"],
    ["volume", "Volume"],
    ["price", "Base price"]
  ],
  furnished: [
    ["label", "Option"],
    ["description", "Description"],
    ["multiplier", "Multiplier"]
  ],
  distances: [
    ["label", "Band"],
    ["description", "Description"],
    ["distance", "Miles shown"],
    ["price", "Price add-on"]
  ],
  extras: [
    ["label", "Extra"],
    ["volume", "Volume"],
    ["price", "Price add-on"]
  ]
};

const galleryLayouts = ["normal", "wide", "tall"];
const galleryCategories = ["moves", "packing", "specialist", "storage", "vehicles"];

const setAdminNote = (message, isError = false) => {
  if (!adminNote) return;
  adminNote.textContent = message;
  adminNote.classList.toggle("is-error", isError);
};

const toNumberIfNeeded = (key, value) => {
  if (["volume", "price", "multiplier", "distance", "highEstimateMinimum", "highEstimatePercent"].includes(key)) {
    return Number(value);
  }

  return value;
};

const createInput = (value, onInput, type = "text", step = "") => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value ?? "";
  if (step) input.step = step;
  input.addEventListener("input", () => onInput(input.value));
  return input;
};

const renderEstimatorTable = (key) => {
  const table = document.querySelector(`[data-admin-estimator-table="${key}"]`);
  const items = adminSettings.estimator[key];
  const columns = estimatorTables[key];
  if (!table) return;

  table.innerHTML = "";

  const header = document.createElement("div");
  header.className = "admin-table-row admin-table-head";
  columns.forEach(([, label]) => {
    const cell = document.createElement("strong");
    cell.textContent = label;
    header.append(cell);
  });
  table.append(header);

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "admin-table-row";

    columns.forEach(([field]) => {
      const isNumber = typeof item[field] === "number";
      row.append(createInput(
        item[field],
        (value) => {
          item[field] = toNumberIfNeeded(field, value);
        },
        isNumber ? "number" : "text",
        field === "multiplier" ? "0.01" : "1"
      ));
    });

    table.append(row);
  });
};

const renderEstimatorSettings = () => {
  document.querySelectorAll("[data-estimator-setting]").forEach((input) => {
    const key = input.dataset.estimatorSetting;
    input.value = adminSettings.estimator[key];
    input.addEventListener("input", () => {
      adminSettings.estimator[key] = toNumberIfNeeded(key, input.value);
    });
  });

  Object.keys(estimatorTables).forEach(renderEstimatorTable);
};

const renderGallerySettings = () => {
  if (!galleryList) return;
  galleryList.innerHTML = "";

  adminSettings.gallery.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "admin-gallery-card";

    const preview = document.createElement("img");
    preview.src = item.image;
    preview.alt = item.alt || item.title || "Gallery preview";

    const fields = document.createElement("div");
    fields.className = "admin-gallery-fields";

    const number = document.createElement("span");
    number.className = "admin-gallery-number";
    number.textContent = `#${index + 1}`;

    const title = createInput(item.title, (value) => {
      item.title = value;
      item.alt = value;
      preview.alt = value;
    });

    const image = createInput(item.image, (value) => {
      item.image = value;
      preview.src = value;
    });

    const category = document.createElement("select");
    galleryCategories.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = item.category === value;
      category.append(option);
    });
    category.addEventListener("change", () => {
      item.category = category.value;
    });

    const layout = document.createElement("select");
    galleryLayouts.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = (item.layout || "normal") === value;
      layout.append(option);
    });
    layout.addEventListener("change", () => {
      item.layout = layout.value;
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-dark";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      adminSettings.gallery.splice(index, 1);
      renderGallerySettings();
    });

    fields.append(
      number,
      labelledField("Description", title),
      labelledField("Image path", image),
      labelledField("Category", category),
      labelledField("Layout", layout),
      deleteButton
    );

    card.append(preview, fields);
    galleryList.append(card);
  });
};

const labelledField = (labelText, field) => {
  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(span, field);
  return label;
};

const loadSettings = async () => {
  const response = await fetch("/api/admin/site-settings");

  if (!response.ok) {
    throw new Error(response.status === 403
      ? "Admin password is not configured yet. Add ADMIN_PASSWORD to .env or Railway variables."
      : "Admin login is required or settings could not be loaded.");
  }

  adminSettings = await response.json();
  renderEstimatorSettings();
  renderGallerySettings();
  setAdminNote("Settings loaded.");
};

const saveSettings = async () => {
  setAdminNote("Saving settings...");
  saveButton.disabled = true;

  try {
    const response = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(adminSettings)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Settings could not be saved.");
    }

    setAdminNote(result.message);
  } catch (error) {
    setAdminNote(error.message, true);
  } finally {
    saveButton.disabled = false;
  }
};

addGalleryButton?.addEventListener("click", () => {
  const nextNumber = adminSettings.gallery.length + 1;
  adminSettings.gallery.push({
    title: "New gallery item",
    category: "moves",
    image: `assets/gallery/${nextNumber}.jpeg`,
    alt: "New gallery item",
    layout: "normal"
  });
  renderGallerySettings();
});

saveButton?.addEventListener("click", saveSettings);

loadSettings().catch((error) => {
  setAdminNote(error.message, true);
});
