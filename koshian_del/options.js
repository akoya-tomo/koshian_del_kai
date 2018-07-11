const DEFAULT_POST_ALERT = false;
const DEFAULT_ALERT_TIME = 1000;
const DEFAULT_USE_CATALOG_NG = false;

function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions(e) {
  browser.storage.local.set({
    post_alert:document.getElementById("post_alert").checked,
    alert_time:document.getElementById("alert_time").value,
    use_catalog_ng:document.getElementById("use_catalog_ng").checked
  });
}

function setCurrentChoice(result) {
  document.getElementById("post_alert").checked = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
  document.getElementById("alert_time").value = safeGetValue(result.alert_time, DEFAULT_ALERT_TIME);
  document.getElementById("use_catalog_ng").checked = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
  document.getElementById("submit_button").addEventListener("click", saveOptions);
}

function onError(error) {
  //  console.log(`Error: ${error}`);
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get().then(setCurrentChoice, onError);
});