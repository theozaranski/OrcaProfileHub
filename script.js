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
  currentUserId: null,
  isLoading: false
};

const dom = {};

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
  const url = new URL(window.location.href);
  url.hash = "";
  return url.toString();
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
  dom.loginBtn = document.getElementById("loginBtn");
  dom.logoutBtn = document.getElementById("logoutBtn");
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
    dom.resultsSummary.textContent = "Aucun profil disponible";
    return;
  }

  if (filtered === total) {
    dom.resultsSummary.textContent = `${total} profil${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`;
    return;
  }

  dom.resultsSummary.textContent = `${filtered} / ${total} profil${total > 1 ? "s" : ""} affiche${filtered > 1 ? "s" : ""}`;
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
      renderProfilesMessage("Aucun profil trouve pour ces filtres.");
    } else {
      renderProfilesMessage("Aucun profil disponible pour le moment.");
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
  await sb.auth.signOut();
  closeModal();
  hideDropdowns();
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
    isConnected ? "" : "Mode visiteur. Connecte-toi pour ajouter un profil."
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
  printerHeadline.textContent = profile.printerLabel || "Imprimante inconnue";
  header.appendChild(printerHeadline);

  const title = document.createElement("h3");
  title.textContent = profile.name || "Profil sans nom";
  header.appendChild(title);

  const fileType = document.createElement("div");
  fileType.className = "card-format";
  fileType.textContent = profile.file ? "Fichier 3MF pret" : "Profil sans fichier";
  header.appendChild(fileType);

  const body = document.createElement("div");
  body.className = "card-body";
  body.appendChild(createTag(`Variante: ${profile.variantLabel || "?"}`));
  body.appendChild(createTag(`Filament: ${profile.filamentLabel || "?"}`));
  body.appendChild(createTag(`Buse: ${profile.nozzleLabel || "?"}`));

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
    downloadLink.textContent = "Telecharger .3mf";
    footer.appendChild(downloadLink);
  } else {
    const unavailable = document.createElement("span");
    unavailable.className = "btn unavailable";
    unavailable.textContent = "3mf indisponible";
    footer.appendChild(unavailable);
  }

  if (currentUserId && currentUserId === profile.user_id) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn delete";
    deleteButton.textContent = "Supprimer";
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
      renderProfilesMessage("Chargement des profils...");
      await fetchProfiles();
    }

    const filteredProfiles = state.profiles
      .map(normalizeProfile)
      .filter(matchesSelectedFilters);

    renderProfilesList(filteredProfiles, state.currentUserId);
  } catch (error) {
    console.error("Erreur chargement profils:", error);
    setResultsSummary(0, 0);
    renderProfilesMessage(`Impossible de charger les profils. ${error.message ?? ""}`.trim());
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
    alert("Connecte-toi pour envoyer un profil.");
    return;
  }

  if (!file || !name || !printer || !variant || !filament) {
    alert("Formulaire incomplet.");
    return;
  }

  if (nozzleValue && !nozzle) {
    alert("Choisis une buse existante dans la liste.");
    return;
  }

  if (!file.name.toLowerCase().endsWith(".3mf")) {
    alert("Le fichier doit etre au format .3mf.");
    return;
  }

  const safeBaseName = slugifyFileBaseName(file.name);
  const fileName = `${Date.now()}-${safeBaseName}.3mf`;
  const { error: uploadError } = await sb.storage
    .from("profiles")
    .upload(fileName, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    console.error("Erreur upload storage:", uploadError);
    const details = [uploadError.message, uploadError.error, uploadError.statusCode]
      .filter(Boolean)
      .join(" | ");
    alert(
      details
        ? `Impossible d'envoyer le fichier. ${details}`
        : "Impossible d'envoyer le fichier."
    );
    return;
  }

  const { error: insertError } = await sb.from("profiles").insert([
    {
      name,
      file: fileName,
      printer_id: printer.id,
      variant_id: variant.id,
      filament_id: filament.id,
      nozzle_id: nozzle?.id ?? null
    }
  ]);

  if (insertError) {
    console.error("Erreur insertion profil:", insertError);
    await sb.storage.from("profiles").remove([fileName]);
    alert("Impossible d'enregistrer le profil.");
    return;
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
}

async function deleteProfile(id, file) {
  if (!window.confirm("Supprimer ?")) {
    return;
  }

  const { error } = await sb.from("profiles").delete().eq("id", id);
  if (error) {
    console.error("Erreur suppression profil:", error);
    alert("Impossible de supprimer le profil.");
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
    alert("Connecte-toi pour ajouter un profil.");
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
    renderProfilesMessage("Impossible d'initialiser l'application.");
    setToolbarStatus("Erreur de chargement des donnees.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
