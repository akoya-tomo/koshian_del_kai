const DEL_CLASS_NAME = "KOSHIAN_del";
const DEL_POPUP_CLASS_NAME = "KOSHIAN_del_popup";
const DEFAULT_POST_ALERT = false;
const DEFAULT_ALERT_TIME = 1000;
const DEFAULT_USE_CATALOG_NG = false;
const DEFAULT_DEL_INTERVAL = 5500;
const DEFAULT_USE_SRCDOC = false;
const DEL_INTERVAL_OFFSET = 20;
let post_alert = DEFAULT_POST_ALERT;
let alert_time = DEFAULT_ALERT_TIME;
let use_catalog_ng = DEFAULT_USE_CATALOG_NG;
let del_interval = DEFAULT_DEL_INTERVAL;
let use_srcdoc = DEFAULT_USE_SRCDOC;
let last_del = 0;

function createCloseButton(text) {
    let elem = document.createElement("input");

    elem.value = text;
    elem.type = "button";
    elem.onclick = onClickClose;
    elem.style.cssFloat = "right";

    return elem;
}

class Del {
    constructor() {
        this.resno = "";
        this.popup = null;
        this.close = createCloseButton("閉じる");
        this.iframe = null;
        this.url = null;
        this.form = null;
        this.target = null;
        this.timer = null;
        this.checked_id = null;
        this.client_x = null;
        this.client_y = null;
        this.submit = null;
        this.interval_timer = null;
        this.srcdoc = null;
        this.has_trimmed_srcdoc = false;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/futaba.php/);
        if(!url_matches){
            return;
        }

        this.popup = document.createElement("div");
        this.popup.className = DEL_POPUP_CLASS_NAME;
        this.popup.style.position = "absolute";
        this.popup.style.border = "solid 1px black";
        this.popup.style.backgroundColor="#FFFFEE";
        this.popup.style.zIndex = 202;

        this.iframe = document.createElement("iframe");
        this.iframe.src = "about:blank";
        this.iframe.width = "300px";
        this.iframe.height = "426px";
        this.iframe.style.clear = "both";
        this.iframe.b = url_matches[2];

        this.url = document.createElement("div");
        this.url.style.width = "230px";
        this.url.style.fontSize = "10px";
        this.url.style.cssFloat = "left";
        this.url.style.wordBreak = "break-all";

        this.popup.appendChild(this.url);
        this.popup.appendChild(this.close);
        this.popup.appendChild(document.createElement("BR"));
        this.popup.appendChild(this.iframe);

        document.body.appendChild(this.popup);
    }

    show(resno, target, linkUrl) {
        this.resno = resno;
        let scrollX = document.documentElement.scrollLeft;
        let scrollY = document.documentElement.scrollTop;
        let rect = target.getBoundingClientRect();
        let clientW = document.documentElement.clientWidth;
        let cx = rect.x + rect.width/2; // center x

        this.iframe.onload = () => {
            this.iframe.onload = null;
            this.iframe.doc = this.iframe.contentWindow.document;
            this.form = this.iframe.doc.getElementsByTagName("form")[0];
            if (this.form) {
                this.form.onsubmit = () => {
                    this.form.onsubmit = null;
                    this.submit.disabled = true;
                    this.submit.value = "送信中...";
                    this.submit = null;
                    // 最終del時刻を更新
                    last_del = curTime();
                    browser.storage.local.set({
                        last_del:last_del
                    });

                    if(post_alert){
                        this.iframe.onload = () => {
                            this.iframe.onload = null;
                            // 最終del時刻を更新してタイマーを再設定
                            last_del = curTime();
                            browser.storage.local.set({
                                last_del:last_del
                            });
                            if (del.interval_timer) {
                                clearInterval(del.interval_timer);
                                del.interval_timer = null;
                            }
                            switchSubmitButton();

                            let anchors = this.iframe.contentWindow.document.getElementsByTagName("a");
                            for (let anchor of anchors) {
                                // レスポンス内のリンクを削除
                                anchor.parentNode.removeChild(anchor);
                            }
                            if (alert_time > 0) {
                                this.timer = setTimeout(this.hide.bind(this), alert_time);
                            }
                        };

                    } else {
                        this.hide();
                    }

                    // checkしたinputのidを記憶
                    let inputs = this.iframe.doc.getElementsByTagName("input");
                    for (let input of inputs) {
                        if (input.checked) {
                            this.checked_id = input.id;
                            break;
                        }
                    }

                    if (use_catalog_ng){
                        target.classList.add(DEL_CLASS_NAME);
                        document.dispatchEvent(new CustomEvent("KOSHIAN_del"));
                    }

                    // del id登録
                    let url = linkUrl.match(/^https?:\/\/([^.]+\.2chan\.net\/[^/]+\/res\/\d+\.htm)$/);
                    if (url) {
                        browser.runtime.sendMessage({
                            id: "koshian_del_add_del_response",
                            url: url[1],
                            del_id: resno
                        });
                    }
 
                    return true;
                };

                if (!this.srcdoc || !this.has_trimmed_srcdoc) {
                    // iframe内のform以外のnodeを削除
                    let iframe_body = this.iframe.doc.body;
                    if (iframe_body) {
                        iframe_body.innerHTML = "";
                        iframe_body.append(this.form);
                    }

                    // form内のtextをlabelに置換
                    let inputs = this.form.getElementsByTagName("input");
                    for (let input of inputs) {
                        let text = input.nextSibling;
                        if (text && text.nodeType == Node.TEXT_NODE) {
                            input.id = input.value;
                            let label = this.iframe.doc.createElement("label");
                            label.textContent = text.textContent;
                            label.htmlFor = input.id;
                            text.parentNode.insertBefore(label, text.nextSibling);
                            text.remove();
                        }
                    }
                }
                if (!this.srcdoc) {
                    let iframe_html = this.iframe.doc.documentElement;
                    if (iframe_html) {
                        this.srcdoc = iframe_html.outerHTML;
                        this.has_trimmed_srcdoc = true;
                    }
                }

                // 前回checkしたinputにcheckを入れる
                if (this.checked_id) {
                    let checked_input = this.iframe.doc.getElementById(this.checked_id);
                    if (checked_input) {
                        checked_input.checked = true;
                    }
                }

                this.iframe.height = Math.max(this.iframe.doc.documentElement.clientHeight, this.iframe.doc.documentElement.scrollHeight);

                this.submit = this.form.querySelector("input[type='submit']");
                if (this.submit) {
                    switchSubmitButton();
                }
            }
        };
        if (use_srcdoc && this.srcdoc) {
            let srcdoc = this.srcdoc.replace(/<form action="del.php/, `<form action="${location.protocol}//${location.host}/del.php`).replace(/name="d" value="\d+"/, `name="d" value="${this.resno}"`);
            this.iframe.srcdoc = srcdoc;
        }
        this.iframe.src = `${location.protocol}//${location.host}/del.php?b=${this.iframe.b}&d=${this.resno}`;
        this.url.textContent = this.iframe.src;

        if(cx < clientW/2){
            this.popup.style.left = `${scrollX + rect.left + rect.width}px`;
            this.popup.style.right = null;
        }else{
            this.popup.style.left = null;
            this.popup.style.right = `${clientW - scrollX - rect.left}px`;
        }
        this.popup.style.top = `${scrollY + rect.top}px`;
        this.popup.style.display = "block";
    }

    hide() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.popup.style.display = "none";
        if (this.iframe.srcdoc) {
            this.iframe.srcdoc = "";
        }
        this.iframe.removeAttribute("srcdoc");
        this.iframe.src = "about:blank";
        this.submit = null;
    }

    isHide() {
        return this.popup.style.display == "none";
    }

    static getResno(linkUrl) {
        let matches = linkUrl.match(/\/([0-9]+).htm/);
        if (matches != null) {
            return matches[1];
        }

        return "";
    }

    static init(){

    }
}

let del;

function onClickDel(linkUrl) {
    let resno = Del.getResno(linkUrl);
    if (resno == "") {
        return;
    }
    if (!del.target && del.client_x !== null && del.client_y !== null) {
        let target = document.elementFromPoint(del.client_x, del.client_y);
        if (!target) {
            return;
        }
        let parent = target.parentElement;
        if (parent && (parent.tagName == "A" || parent.hasAttribute("koshian_index"))) {
            for (let elm = parent.parentElement; elm; elm = elm.parentElement) {
                if (elm.tagName == "TD" || elm.className == "GM_fth_pickuped" || elm.className == "GM_fth_opened") {
                    del.target = elm;
                    break;
                }
            }
        }
    }
    if (!del.target) {
        return;
    }
    
    if(del.isHide() || del.resno != resno){
        del.show(resno, del.target, linkUrl);
    }
}

function onClickClose() {
    del.hide();
}

function curTime(){
    let date = new Date();
    return date.getTime();
}

function getRemain(){
    return last_del + del_interval - curTime() - DEL_INTERVAL_OFFSET;
}

function countTime(){
    let remain = getRemain();

    if (remain > 0) {
        if (del.submit) {
            del.submit.disabled = true;
            del.submit.value = `残り ${Math.ceil(remain/1000)}秒`;
        }
    } else {
        if (del.submit) {
            del.submit.disabled = false;
            del.submit.value = `削除依頼をする`;
        }
        if (del.interval_timer) {
            clearInterval(del.interval_timer);
            del.interval_timer = null;
        }
    }
}

function switchSubmitButton(){
    if (!del.interval_timer) {
        del.interval_timer = setInterval(countTime, 500);
    }
    countTime();
}

function getCatalogResno() {
    let cattable = document.getElementById("cattable");
    if (cattable) {
        let anchor = cattable.querySelector("td > a");
        if (anchor && anchor.href) {
            let match = anchor.href.match(/res\/(\d+)\.htm/);
            if (match) {
                return match[1];
            }
        }
    }
    return null;
}

function main() {
    let url_matches = location.search.match(/mode=cat/);
    if(!url_matches){
        return;
    }

    del = new Del();

    let d = getCatalogResno();
    if (d) {
    // delフォームを取得
        let xml = new XMLHttpRequest();
        xml.open("GET", `${location.protocol}//${location.host}/del.php?b=${del.iframe.b}&d=${d}`);
        xml.responseType = "document";
        xml.onload = () => {
            if (xml.status != 200) {
                return;
            }

            let html = xml.responseXML.getElementsByTagName("html")[0];
            if (html) {
                del.srcdoc = html.outerHTML;
            }
        };
        xml.send();
    }

    document.addEventListener("contextmenu", getTargetElement, false);

    browser.runtime.onMessage.addListener(request => {
        onClickDel(request.linkUrl);
    });
}

function getTargetElement(e) {
    del.client_x = null;
    del.client_Y = null;
    let parent = e.target.parentElement;
    if (parent && (parent.tagName == "A" || parent.hasAttribute("koshian_index"))) {
        for (let elm = parent.parentElement; elm; elm = elm.parentElement) {
            if (elm.tagName == "TD" || elm.className == "GM_fth_pickuped" || elm.className == "GM_fth_opened") {
                del.target = elm;
                return;
            }
        }
    }
    del.target = null;
    del.client_x = e.clientX;
    del.client_y = e.clientY;
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {   // eslint-disable-line no-unused-vars
}

function onSettingGot(result) {
    post_alert = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
    alert_time = safeGetValue(result.alert_time, DEFAULT_ALERT_TIME);
    use_catalog_ng = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
    del_interval = safeGetValue(result.del_interval, DEFAULT_DEL_INTERVAL);
    use_srcdoc = safeGetValue(result.use_srcdoc, DEFAULT_USE_SRCDOC);
    last_del = safeGetValue(result.last_del, 0);

    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    if (changes.post_alert) {
        post_alert = safeGetValue(changes.post_alert.newValue, post_alert);
        alert_time = safeGetValue(changes.alert_time.newValue, alert_time);
        use_catalog_ng = safeGetValue(changes.use_catalog_ng.newValue, use_catalog_ng);
        del_interval = safeGetValue(changes.del_interval.newValue, del_interval);
        use_srcdoc = safeGetValue(changes.use_srcdoc.newValue, use_srcdoc);
    }
    if (changes.last_del) {
        last_del = safeGetValue(changes.last_del.newValue, last_del);
    }
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);
