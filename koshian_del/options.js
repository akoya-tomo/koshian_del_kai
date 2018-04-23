const DEFAULT_PAGE_TRANS = false;
const DEFAULT_POST_ALERT = false;
const DEFAULT_USE_CATALOG_NG = false;

function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions(e) {
  browser.storage.local.set({
    page_trans:document.getElementById("page_trans").checked,
    post_alert:document.getElementById("post_alert").checked,
    use_catalog_ng:document.getElementById("use_catalog_ng").checked
  });
}

function setCurrentChoice(result) {
  document.getElementById("page_trans").checked = safeGetValue(result.page_trans, DEFAULT_PAGE_TRANS);
  document.getElementById("post_alert").checked = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
  document.getElementById("use_catalog_ng").checked = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
  document.getElementById("submit_button").addEventListener("click", saveOptions);
}

function onError(error) {
  //  console.log(`Error: ${error}`);
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get().then(setCurrentChoice, onError);
});