browser.contextMenus.create({
    id: "koshian_del",
    title: "delフォームを開く",
    contexts: ["link"],
    documentUrlPatterns: ["*://*.2chan.net/*/*?mode=cat*"],
    targetUrlPatterns: ["*://*.2chan.net/*/res/*"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "koshian_del") {
        let tab_id = tab.id;
        browser.tabs.sendMessage(
            tab_id,
            {linkUrl:info.linkUrl}
        );
    }
});