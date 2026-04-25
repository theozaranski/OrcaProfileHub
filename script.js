const sb = window.supabase.createClient(
  "https://djpvihcznfxjgaedusfr.supabase.co",
  "sb_publishable_hNdoVYVVnP-uy2kGpFUGhQ_YlFyvbiF"
);

const state = {
  printers: [],
  variants: [],
  filaments: [],
  nozzles: [],
  profiles: [],
  selected: {
    printer: "",
    filament: "",
    nozzle: ""
  },
  language: "fr",
  currentUserId: null,
  isLoading: false
};

const STORAGE_LANGUAGE_KEY = "oph_language";

const translations = {
  fr: {
    meta: {
      title: "Orca Profile Hub"
    },
    header: {
      copyHtml:
        'Bibliotheque communautaire de profils <strong>3MF</strong> pour OrcaSlicer. Tu telecharges, tu importes le fichier dans OrcaSlicer, et les reglages sont appliques en 1 clic. <a href="https://www.orcaslicer.com/download/" target="_blank" rel="noopener noreferrer">Telecharger OrcaSlicer</a>'
    },
    auth: {
      login: "Connexion",
      logout: "Deconnexion"
    },
    hero: {
      title: "Des profils 3MF prets a importer dans OrcaSlicer.",
      subtitle: "Telecharge, importe, imprime.",
      stepsAriaLabel: "Comment ca marche",
      step1: "Telecharge un 3MF",
      step2: "Importe-le dans OrcaSlicer",
      step3: "Les reglages sont deja remplis",
      imageAlt: "Illustration premium d'une imprimante 3D noir et or imprimant un Benchy"
    },
    visual: {
      fastImport: "Import rapide",
      communityLabel: "Impression 3D",
      communityDetail: "Profil, filament, buse, variante"
    },
    toolbar: {
      addProfile: "+ Ajouter un profil d'impression",
      guestStatus: "Mode visiteur. Connecte-toi pour ajouter un profil.",
      loadingError: "Erreur de chargement des donnees."
    },
    filters: {
      kicker: "Explorer la bibliotheque",
      title: "Filtre par machine, matiere et buse",
      reset: "Reinitialiser",
      printerPlaceholder: "Toutes les imprimantes",
      filamentPlaceholder: "Tous les filaments",
      nozzlePlaceholder: "Toutes les buses"
    },
    profiles: {
      kicker: "Collection ouverte",
      title: "Profils partages",
      loading: "Chargement...",
      loadingList: "Chargement des profils...",
      noneAvailable: "Aucun profil disponible pour le moment.",
      noneForFilters: "Aucun profil trouve pour ces filtres.",
      loadError: "Impossible de charger les profils. {message}",
      initError: "Impossible d'initialiser l'application.",
      zeroSummary: "Aucun profil disponible",
      availableSummary: "{total} profil{plural} disponible{plural}",
      filteredSummary: "{filtered} / {total} profil{pluralTotal} affiche{pluralFiltered}",
      download: "Telecharger .3mf",
      unavailable: "3mf indisponible",
      delete: "Supprimer",
      deleteConfirm: "Supprimer ?",
      unknownPrinter: "Imprimante inconnue",
      noName: "Profil sans nom",
      fileReady: "Fichier 3MF pret",
      fileMissing: "Profil sans fichier",
      tagVariant: "Variante: {value}",
      tagFilament: "Filament: {value}",
      tagNozzle: "Buse: {value}"
    },
    modal: {
      title: "Ajouter un profil",
      nameLabel: "Nom du profil",
      namePlaceholder: "Nom du profil",
      fileLabel: "Fichier (.3mf)",
      printerLabel: "Imprimante",
      printerPlaceholder: "Choisir une imprimante",
      variantLabel: "Variante",
      variantPlaceholder: "Choisir une variante",
      filamentLabel: "Filament",
      filamentPlaceholder: "Choisir un filament",
      nozzleLabel: "Buse (optionnel)",
      send: "Envoyer",
      close: "Fermer"
    },
    alerts: {
      signInToUpload: "Connecte-toi pour envoyer un profil.",
      signInToAdd: "Connecte-toi pour ajouter un profil.",
      incompleteForm: "Formulaire incomplet.",
      invalidNozzle: "Choisis une buse existante dans la liste.",
      invalidFileType: "Le fichier doit etre au format .3mf.",
      fileTooLarge: "Fichier trop lourd (max 50MB)",
      uploadLimitReached: "Tu as atteint la limite de 6 uploads aujourd'hui.",
      uploadFailed: "Impossible d'envoyer le fichier.",
      deleteFailed: "Impossible de supprimer le profil."
    },
    labels: {
      unknown: "?",
      pluralS: "s"
    }
  },
  en: {
    meta: {
      title: "Orca Profile Hub"
    },
    header: {
      copyHtml:
        'Community library of <strong>3MF</strong> profiles for OrcaSlicer. Download a file, import it into OrcaSlicer, and the settings are applied in 1 click. <a href="https://www.orcaslicer.com/download/" target="_blank" rel="noopener noreferrer">Download OrcaSlicer</a>'
    },
    auth: {
      login: "Sign in",
      logout: "Sign out"
    },
    hero: {
      title: "3MF profiles ready to import into OrcaSlicer.",
      subtitle: "Download, import, print.",
      stepsAriaLabel: "How it works",
      step1: "Download a 3MF",
      step2: "Import it into OrcaSlicer",
      step3: "All settings are pre-configured",
      imageAlt: "Premium illustration of a black and gold 3D printer printing a Benchy"
    },
    visual: {
      fastImport: "Fast import",
      communityLabel: "3D printing",
      communityDetail: "Profile, filament, nozzle, variant"
    },
    toolbar: {
      addProfile: "+ Add a print profile",
      guestStatus: "You're browsing as a guest. Sign in to share a profile.",
      loadingError: "Data loading error."
    },
    filters: {
      kicker: "Browse the library",
      title: "Filter by machine, material and nozzle",
      reset: "Reset",
      printerPlaceholder: "All printers",
      filamentPlaceholder: "All filaments",
      nozzlePlaceholder: "All nozzles"
    },
    profiles: {
      kicker: "Open collection",
      title: "Shared profiles",
      loading: "Loading...",
      loadingList: "Loading profiles...",
      noneAvailable: "No profiles available yet.",
      noneForFilters: "No profiles found for these filters.",
      loadError: "Unable to load profiles. {message}",
      initError: "Unable to initialize the app.",
      zeroSummary: "No profiles available",
      availableSummary: "{total} profile{plural} available",
      filteredSummary: "{filtered} / {total} profile{pluralTotal} shown",
      download: "Download .3mf",
      unavailable: "3mf unavailable",
      delete: "Delete",
      deleteConfirm: "Delete?",
      unknownPrinter: "Unknown printer",
      noName: "Untitled profile",
      fileReady: "Ready-to-use 3MF file",
      fileMissing: "Profile without file",
      tagVariant: "Variant: {value}",
      tagFilament: "Filament: {value}",
      tagNozzle: "Nozzle: {value}"
    },
    modal: {
      title: "Add a profile",
      nameLabel: "Profile name",
      namePlaceholder: "Profile name",
      fileLabel: "File (.3mf)",
      printerLabel: "Printer",
      printerPlaceholder: "Choose a printer",
      variantLabel: "Variant",
      variantPlaceholder: "Choose a variant",
      filamentLabel: "Filament",
      filamentPlaceholder: "Choose a filament",
      nozzleLabel: "Nozzle (optional)",
      send: "Share profile",
      close: "Close"
    },
    alerts: {
      signInToUpload: "Sign in to upload a profile.",
      signInToAdd: "Sign in to add a profile.",
      incompleteForm: "Form is incomplete.",
      invalidNozzle: "Choose an existing nozzle from the list.",
      invalidFileType: "The file must be in .3mf format.",
      fileTooLarge: "File is too large (max 50MB)",
      uploadLimitReached: "You have reached the limit of 6 uploads today.",
      uploadFailed: "Unable to upload the file.",
      deleteFailed: "Unable to delete the profile."
    },
    labels: {
      unknown: "?",
      pluralS: "s"
    }
  }
};

const dom = {};

function getTranslationValue(key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[state.language]);
}

function t(key, variables = {}) {
  const template = getTranslationValue(key) ?? key;

  if (typeof template !== "string") {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? "");
}

function getPreferredLanguage() {
  const savedLanguage = window.localStorage.getItem(STORAGE_LANGUAGE_KEY);
  if (savedLanguage === "fr" || savedLanguage === "en") {
    return savedLanguage;
  }

  const browserLanguage = window.navigator.language?.toLowerCase() ?? "";
  return browserLanguage.startsWith("fr") ? "fr" : "en";
}

function updateLanguageButtons() {
  if (!dom.langFrBtn || !dom.langEnBtn) {
    return;
  }

  dom.langFrBtn.classList.toggle("is-active", state.language === "fr");
  dom.langEnBtn.classList.toggle("is-active", state.language === "en");
  dom.langFrBtn.setAttribute("aria-pressed", String(state.language === "fr"));
  dom.langEnBtn.setAttribute("aria-pressed", String(state.language === "en"));
}

function applyStaticTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("meta.title");

  if (dom.headerCopy) {
    dom.headerCopy.innerHTML = t("header.copyHtml");
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = t(element.dataset.i18nAlt);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  updateLanguageButtons();
}

function setLanguage(language, persist = true) {
  if (language !== "fr" && language !== "en") {
    return;
  }

  state.language = language;

  if (persist) {
    window.localStorage.setItem(STORAGE_LANGUAGE_KEY, language);
  }

  applyStaticTranslations();

  if (dom.toolbarStatus) {
    setToolbarStatus(state.currentUserId ? "" : t("toolbar.guestStatus"));
  }

  if (dom.profiles) {
    loadProfiles(false);
  }
}

function setButtonVisibility(button, isVisible) {
  button.hidden = !isVisible;
  button.style.display = isVisible ? "inline-flex" : "none";
}

function formatPrinterName(printer) {
  if (!printer) {
    return "";
  }

  return [printer.brand, printer.name].filter(Boolean).join(" ").trim();
}

function formatNozzleSize(nozzle) {
  const size = nozzle?.size;
  return size == null ? "" : `${size}mm`;
}

function normalizeText(value) {
  return (value ?? "").toString().trim().toLowerCase();
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getAuthRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function slugifyFileBaseName(fileName) {
  return (fileName ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "profil";
}

function findPrinterByLabel(label) {
  const normalized = normalizeText(label);
  return state.printers.find((printer) => normalizeText(printer.label) === normalized) ?? null;
}

function findFilamentByName(name) {
  const normalized = normalizeText(name);
  return state.filaments.find((filament) => normalizeText(filament.name) === normalized) ?? null;
}

function findNozzleByLabel(label) {
  const normalized = normalizeText(label);
  return state.nozzles.find((nozzle) => normalizeText(nozzle.label) === normalized) ?? null;
}

function getVariantsForPrinter(printerId) {
  return state.variants.filter((variant) => variant.printer_id === printerId);
}

function findVariantByNameAndPrinter(name, printerId) {
  const normalized = normalizeText(name);
  return getVariantsForPrinter(printerId).find(
    (variant) => normalizeText(variant.name) === normalized
  ) ?? null;
}

function getVariantOptions() {
  const printer = findPrinterByLabel(dom.printerUpload?.value ?? "");
  if (!printer) {
    return [];
  }

  return uniqueValues(getVariantsForPrinter(printer.id).map((variant) => variant.name));
}

function normalizeProfile(profile) {
  const printer = state.printers.find((item) => item.id === profile.printer_id) ?? null;
  const variant = state.variants.find((item) => item.id === profile.variant_id) ?? null;
  const filament = state.filaments.find((item) => item.id === profile.filament_id) ?? null;
  const nozzle = state.nozzles.find((item) => item.id === profile.nozzle_id) ?? null;

  return {
    ...profile,
    printer,
    variant,
    filament,
    nozzle,
    printerLabel: formatPrinterName(printer),
    variantLabel: variant?.name ?? "",
    filamentLabel: filament?.name ?? "",
    nozzleLabel: formatNozzleSize(nozzle)
  };
}

function matchesSelectedFilters(profile) {
  const printerFilter = normalizeText(state.selected.printer);
  const filamentFilter = normalizeText(state.selected.filament);
  const nozzleFilter = normalizeText(state.selected.nozzle);

  const matchesPrinter =
    !printerFilter || normalizeText(profile.printerLabel).includes(printerFilter);
  const matchesFilament =
    !filamentFilter || normalizeText(profile.filamentLabel).includes(filamentFilter);
  const matchesNozzle =
    !nozzleFilter || normalizeText(profile.nozzleLabel).includes(nozzleFilter);

  return matchesPrinter && matchesFilament && matchesNozzle;
}

function cacheDom() {
  dom.headerCopy = document.querySelector(".header-copy");
  dom.loginBtn = document.getElementById("loginBtn");
  dom.logoutBtn = document.getElementById("logoutBtn");
  dom.langFrBtn = document.getElementById("langFrBtn");
  dom.langEnBtn = document.getElementById("langEnBtn");
  dom.openModalBtn = document.getElementById("openModalBtn");
  dom.closeModalBtn = document.getElementById("closeModalBtn");
  dom.uploadBtn = document.getElementById("uploadBtn");
  dom.resetFiltersBtn = document.getElementById("resetFiltersBtn");
  dom.toolbarStatus = document.getElementById("toolbarStatus");
  dom.resultsSummary = document.getElementById("resultsSummary");
  dom.modal = document.getElementById("modal");
  dom.profiles = document.getElementById("profiles");
  dom.name = document.getElementById("name");
  dom.file = document.getElementById("file");
  dom.printerUpload = document.getElementById("printerUpload");
  dom.variantUpload = document.getElementById("variantUpload");
  dom.filamentUpload = document.getElementById("filamentUpload");
  dom.nozzleUpload = document.getElementById("nozzleUpload");
}

function setToolbarStatus(message = "") {
  dom.toolbarStatus.textContent = message;
}

function setResultsSummary(total, filtered) {
  if (!dom.resultsSummary) {
    return;
  }

  if (total === 0) {
    dom.resultsSummary.textContent = t("profiles.zeroSummary");
    return;
  }

  if (filtered === total) {
    dom.resultsSummary.textContent = t("profiles.availableSummary", {
      total,
      plural: total > 1 ? t("labels.pluralS") : ""
    });
    return;
  }

  dom.resultsSummary.textContent = t("profiles.filteredSummary", {
    filtered,
    total,
    pluralTotal: total > 1 ? t("labels.pluralS") : "",
    pluralFiltered: filtered > 1 ? t("labels.pluralS") : ""
  });
}

function renderProfilesMessage(message) {
  dom.profiles.replaceChildren();

  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;
  dom.profiles.appendChild(empty);
}

function renderProfilesList(profiles, currentUserId) {
  setResultsSummary(state.profiles.length, profiles.length);

  if (!profiles.length) {
    if (state.profiles.length > 0) {
      renderProfilesMessage(t("profiles.noneForFilters"));
    } else {
      renderProfilesMessage(t("profiles.noneAvailable"));
    }
    return;
  }

  dom.profiles.replaceChildren();
  profiles.forEach((profile, index) => {
    const card = createProfileCard(profile, currentUserId);
    card.style.animationDelay = `${Math.min(index * 70, 420)}ms`;
    dom.profiles.appendChild(card);
  });
}

async function applyFilters() {
  const filteredProfiles = state.profiles
    .map(normalizeProfile)
    .filter(matchesSelectedFilters);

  renderProfilesList(filteredProfiles, state.currentUserId);
}

async function login() {
  await sb.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl()
    }
  });
}

async function logout() {
  await sb.auth.signOut({
    scope: "local"
  });
  closeModal();
  hideDropdowns();
  window.location.replace(getAuthRedirectUrl());
}

async function getUser() {
  const { data, error } = await sb.auth.getUser();

  const missingSession =
    error?.name === "AuthSessionMissingError" ||
    error?.message === "Auth session missing!";

  if (error && !missingSession) {
    console.error("Erreur auth:", error);
  }

  const user = missingSession ? null : (data?.user ?? null);
  const isConnected = Boolean(user);
  state.currentUserId = user?.id ?? null;

  setButtonVisibility(dom.loginBtn, !isConnected);
  setButtonVisibility(dom.logoutBtn, isConnected);
  dom.openModalBtn.disabled = !isConnected;
  setToolbarStatus(
    isConnected ? "" : t("toolbar.guestStatus")
  );

  return user;
}

function hideDropdowns(exceptList = null) {
  document.querySelectorAll(".dropdown").forEach((list) => {
    if (list !== exceptList) {
      list.style.display = "none";
    }
  });
}

function renderDropdownItems(list, values, onSelect) {
  hideDropdowns(list);
  list.replaceChildren();

  if (!values.length) {
    list.style.display = "none";
    return;
  }

  values.forEach((value) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "dropdown-item";
    option.textContent = value;
    option.addEventListener("click", () => onSelect(value));
    list.appendChild(option);
  });

  list.style.display = "block";
}

function setupDropdown(type, getSource, inputId, listId, isFilter = true) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  function render(filter = "") {
    const normalized = normalizeText(filter);
    const values = getSource().filter((value) =>
      normalizeText(value).includes(normalized)
    );

    renderDropdownItems(list, values, (value) => {
      input.value = value;
      list.style.display = "none";

      if (isFilter) {
        state.selected[type] = value;
        applyFilters();
        return;
      }

      if (type === "printer") {
        dom.variantUpload.value = "";
      }

      checkUploadForm();
    });
  }

  input.addEventListener("focus", () => render(input.value));
  input.addEventListener("input", (event) => {
    if (isFilter) {
      state.selected[type] = event.target.value.trim();
      render(event.target.value);
      applyFilters();
      return;
    }

    if (type === "printer") {
      dom.variantUpload.value = "";
    }

    render(event.target.value);
    checkUploadForm();
  });
}

async function loadFilters() {
  const [
    { data: printers, error: printersError },
    { data: variants, error: variantsError },
    { data: filaments, error: filamentsError },
    { data: nozzles, error: nozzlesError }
  ] = await Promise.all([
    sb.from("printers").select("id, brand, name").order("brand").order("name"),
    sb.from("variants").select("id, printer_id, name").order("name"),
    sb.from("filaments").select("id, name").order("name"),
    sb.from("nozzles").select("id, size").order("size"),
  ]);

  const error = printersError || variantsError || filamentsError || nozzlesError;
  if (error) {
    throw error;
  }

  state.printers = (printers ?? []).map((printer) => ({
    ...printer,
    label: formatPrinterName(printer)
  }));
  state.variants = variants ?? [];
  state.filaments = filaments ?? [];
  state.nozzles = (nozzles ?? []).map((nozzle) => ({
    ...nozzle,
    label: formatNozzleSize(nozzle)
  }));
}

async function fetchProfiles() {
  const { data, error } = await sb
    .from("profiles")
    .select("id, name, file, user_id, printer_id, variant_id, filament_id, nozzle_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  state.profiles = data ?? [];
  return state.profiles;
}

function createTag(label) {
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.textContent = label;
  return tag;
}

function createProfileCard(profile, currentUserId) {
  const card = document.createElement("article");
  card.className = "card";

  const header = document.createElement("div");
  header.className = "card-header";

  const printerHeadline = document.createElement("p");
  printerHeadline.className = "card-printer";
  printerHeadline.textContent = profile.printerLabel || t("profiles.unknownPrinter");
  header.appendChild(printerHeadline);

  const title = document.createElement("h3");
  title.textContent = profile.name || t("profiles.noName");
  header.appendChild(title);

  const fileType = document.createElement("div");
  fileType.className = "card-format";
  fileType.textContent = profile.file ? t("profiles.fileReady") : t("profiles.fileMissing");
  header.appendChild(fileType);

  const body = document.createElement("div");
  body.className = "card-body";
  body.appendChild(createTag(t("profiles.tagVariant", { value: profile.variantLabel || t("labels.unknown") })));
  body.appendChild(createTag(t("profiles.tagFilament", { value: profile.filamentLabel || t("labels.unknown") })));
  body.appendChild(createTag(t("profiles.tagNozzle", { value: profile.nozzleLabel || t("labels.unknown") })));

  const footer = document.createElement("div");
  footer.className = "card-footer";

  if (profile.file) {
    const publicUrl = sb.storage.from("profiles").getPublicUrl(profile.file).data.publicUrl;
    const downloadLink = document.createElement("a");
    downloadLink.className = "btn download";
    downloadLink.href = publicUrl;
    downloadLink.target = "_blank";
    downloadLink.rel = "noopener noreferrer";
    downloadLink.download = profile.file;
    downloadLink.textContent = t("profiles.download");
    footer.appendChild(downloadLink);
  } else {
    const unavailable = document.createElement("span");
    unavailable.className = "btn unavailable";
    unavailable.textContent = t("profiles.unavailable");
    footer.appendChild(unavailable);
  }

  if (currentUserId && currentUserId === profile.user_id) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn delete";
    deleteButton.textContent = t("profiles.delete");
    deleteButton.addEventListener("click", () => {
      deleteProfile(profile.id, profile.file);
    });
    footer.appendChild(deleteButton);
  }

  card.append(header, body, footer);
  return card;
}

async function loadProfiles(refresh = true) {
  if (state.isLoading) {
    return;
  }

  state.isLoading = true;

  try {
    if (refresh) {
      renderProfilesMessage(t("profiles.loadingList"));
      await fetchProfiles();
    }

    const filteredProfiles = state.profiles
      .map(normalizeProfile)
      .filter(matchesSelectedFilters);

    renderProfilesList(filteredProfiles, state.currentUserId);
  } catch (error) {
    console.error("Erreur chargement profils:", error);
    setResultsSummary(0, 0);
    renderProfilesMessage(t("profiles.loadError", { message: error.message ?? "" }).trim());
  } finally {
    state.isLoading = false;
  }
}

function resetFilters() {
  state.selected.printer = "";
  state.selected.filament = "";
  state.selected.nozzle = "";

  document.getElementById("printerInput").value = "";
  document.getElementById("filamentInput").value = "";
  document.getElementById("nozzleInput").value = "";

  hideDropdowns();
  loadProfiles();
}

function checkUploadForm() {
  const file = dom.file.files[0];
  const name = dom.name.value.trim();
  const printer = findPrinterByLabel(dom.printerUpload.value);
  const variant = printer ? findVariantByNameAndPrinter(dom.variantUpload.value, printer.id) : null;
  const filament = findFilamentByName(dom.filamentUpload.value);
  const nozzleValue = dom.nozzleUpload.value.trim();
  const nozzle = !nozzleValue ? null : findNozzleByLabel(nozzleValue);
  const validExtension = !file || file.name.toLowerCase().endsWith(".3mf");
  const validNozzle = !nozzleValue || Boolean(nozzle);

  dom.uploadBtn.disabled = !(
    name &&
    file &&
    printer &&
    variant &&
    filament &&
    validExtension &&
    validNozzle
  );
}

async function upload() {
  let uploadedFileName = null;

  try {
    const file = dom.file.files[0];
    const name = dom.name.value.trim();
    const printer = findPrinterByLabel(dom.printerUpload.value);
    const variant = printer ? findVariantByNameAndPrinter(dom.variantUpload.value, printer.id) : null;
    const filament = findFilamentByName(dom.filamentUpload.value);
    const nozzleValue = dom.nozzleUpload.value.trim();
    const nozzle = !nozzleValue ? null : findNozzleByLabel(nozzleValue);

    const { data, error: userError } = await sb.auth.getUser();
    if (userError) {
      console.error("Erreur utilisateur:", userError);
    }

    const user = data?.user;

    if (!user) {
      alert(t("alerts.signInToUpload"));
      return;
    }

    if (!file || !name || !printer || !variant || !filament) {
      alert(t("alerts.incompleteForm"));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert(t("alerts.fileTooLarge"));
      return;
    }

    if (nozzleValue && !nozzle) {
      alert(t("alerts.invalidNozzle"));
      return;
    }

    if (!file.name.toLowerCase().endsWith(".3mf")) {
      alert(t("alerts.invalidFileType"));
      return;
    }

    const safeBaseName = slugifyFileBaseName(file.name);
    const fileName = `${Date.now()}-${safeBaseName}.3mf`;
    uploadedFileName = fileName;

    const { error: uploadError } = await sb.storage
      .from("profiles")
      .upload(fileName, file, {
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { error: insertError } = await sb.from("profiles").insert([
      {
        name,
        file: fileName,
        printer_id: printer.id,
        variant_id: variant.id,
        filament_id: filament.id,
        nozzle_id: nozzle?.id ?? null,
        user_id: user.id
      }
    ]);

    if (insertError) {
      throw insertError;
    }

    dom.name.value = "";
    dom.file.value = "";
    dom.printerUpload.value = "";
    dom.variantUpload.value = "";
    dom.filamentUpload.value = "";
    dom.nozzleUpload.value = "";
    checkUploadForm();
    closeModal();
    await loadProfiles();
  } catch (error) {
    console.error("Erreur upload profil:", error);

    if (uploadedFileName) {
      await sb.storage.from("profiles").remove([uploadedFileName]);
    }

    if (error?.message?.includes("Limite")) {
      alert(t("alerts.uploadLimitReached"));
    } else {
      alert(error?.message || t("alerts.uploadFailed"));
    }
  }
}

async function deleteProfile(id, file) {
  if (!window.confirm(t("profiles.deleteConfirm"))) {
    return;
  }

  const { error } = await sb.from("profiles").delete().eq("id", id);
  if (error) {
    console.error("Erreur suppression profil:", error);
    alert(t("alerts.deleteFailed"));
    return;
  }

  if (file) {
    const { error: storageError } = await sb.storage.from("profiles").remove([file]);
    if (storageError) {
      console.error("Erreur suppression storage:", storageError);
    }
  }

  await loadProfiles();
}

function openModal() {
  if (dom.openModalBtn.disabled) {
    alert(t("alerts.signInToAdd"));
    return;
  }

  dom.modal.style.display = "flex";
  dom.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  dom.modal.style.display = "none";
  dom.modal.setAttribute("aria-hidden", "true");
}

function bindEvents() {
  dom.langFrBtn.addEventListener("click", () => setLanguage("fr"));
  dom.langEnBtn.addEventListener("click", () => setLanguage("en"));
  dom.loginBtn.addEventListener("click", login);
  dom.logoutBtn.addEventListener("click", logout);
  dom.openModalBtn.addEventListener("click", openModal);
  dom.closeModalBtn.addEventListener("click", closeModal);
  dom.uploadBtn.addEventListener("click", upload);
  dom.resetFiltersBtn.addEventListener("click", resetFilters);

  dom.name.addEventListener("input", checkUploadForm);
  dom.file.addEventListener("change", checkUploadForm);
  dom.printerUpload.addEventListener("input", checkUploadForm);
  dom.variantUpload.addEventListener("input", checkUploadForm);
  dom.filamentUpload.addEventListener("input", checkUploadForm);
  dom.nozzleUpload.addEventListener("input", checkUploadForm);

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-wrapper")) {
      hideDropdowns();
    }

    if (event.target === dom.modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideDropdowns();
      closeModal();
    }
  });
}

async function init() {
  cacheDom();
  initImageZoom();
  state.language = getPreferredLanguage();
  applyStaticTranslations();
  bindEvents();

  sb.auth.onAuthStateChange((event) => {
    if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") {
      getUser();
      loadProfiles(true);
    }
  });

  try {
    await sb.auth.getSession();
    await loadFilters();

    setupDropdown("printer", () => state.printers.map((item) => item.label), "printerInput", "printerList", true);
    setupDropdown("filament", () => state.filaments.map((item) => item.name), "filamentInput", "filamentList", true);
    setupDropdown("nozzle", () => state.nozzles.map((item) => item.label), "nozzleInput", "nozzleList", true);

    setupDropdown("printer", () => state.printers.map((item) => item.label), "printerUpload", "printerUploadList", false);
    setupDropdown("variant", getVariantOptions, "variantUpload", "variantUploadList", false);
    setupDropdown("filament", () => state.filaments.map((item) => item.name), "filamentUpload", "filamentUploadList", false);
    setupDropdown("nozzle", () => state.nozzles.map((item) => item.label), "nozzleUpload", "nozzleUploadList", false);

    closeModal();
    await getUser();
    await loadProfiles(true);
  } catch (error) {
    console.error("Erreur initialisation:", error);
    renderProfilesMessage(t("profiles.initError"));
    setToolbarStatus(t("toolbar.loadingError"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function initImageZoom() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.getElementById("closeImageModal");

  document.querySelectorAll(".zoomable-image").forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}