const max_threads = 1024;
let del_list = {};

function onAddDelResponse(url, del_id) {
    if (!(url in del_list)) {
        del_list[url] = [];
    }
    if (!del_list[url].some(id => id == del_id)) {
        del_list[url].push(del_id);
    }
    let del_list_num = Object.keys(del_list) ? Object.keys(del_list).length : 0;
    for (let i = 0; i < del_list_num - max_threads; ++i) {
        delete del_list[Object.keys(del_list)[0]];
    }
}

function onRequestDelList(url, response) {
    let response_del_list = [];
    if (url in del_list) {
        response_del_list = del_list[url];
    }
    response({
        del_list: response_del_list
    });
}

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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.id) {
        case "koshian_del_request_del_list":
            onRequestDelList(message.url, sendResponse);
            break;
        case "koshian_del_add_del_response":
            onAddDelResponse(message.url, message.del_id);
            sendResponse();
            break;
    }
});
