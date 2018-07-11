const DEL_CLASS_NAME = "KOSHIAN_del";
const DEFAULT_POST_ALERT = false;
const DEFAULT_USE_CATALOG_NG = false;
let post_alert = DEFAULT_POST_ALERT;
let use_catalog_ng = DEFAULT_USE_CATALOG_NG;

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
        this.target = null;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/futaba.php/);
        if(!url_matches){
            return;
        }

        this.popup = document.createElement("div");
        this.popup.className = DEL_CLASS_NAME;
        this.popup.style.position = "absolute";
        this.popup.style.border = "solid 1px black";
        this.popup.style.backgroundColor="#FFFFEE";

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

    show(resno, target) {
        this.resno = resno;
        let scrollX = document.documentElement.scrollLeft;
        let scrollY = document.documentElement.scrollTop;
        let rect = target.getBoundingClientRect();
        let clientW = document.documentElement.clientWidth;
        let cx = rect.x + rect.width/2; // center x

        this.iframe.onload = () => {
            this.iframe.onload = null;
            let iframe_doc = this.iframe.contentWindow.document;
            let form = iframe_doc.getElementsByTagName("form")[0];
            if (form) {
                form.onsubmit = () => {
                    form.onsubmit = null;
                    this.hide();

                    if(post_alert){
                        alert(`delを送信しました`);
                    }

                    if (use_catalog_ng){
                        target.classList.add(DEL_CLASS_NAME);
                        document.dispatchEvent(new CustomEvent("KOSHIAN_del"));
                    }

                    return true;
                }

                //iframe内のform以外のnodeを削除
                for (let node = form.previousSibling; node; node = form.previousSibling) {
                    node.parentNode.removeChild(node);
                }
                for (let node = form.nextSibling; node; node = form.nextSibling) {
                    node.parentNode.removeChild(node);
                }

                this.iframe.height = Math.max(iframe_doc.documentElement.clientHeight, iframe_doc.documentElement.scrollHeight);
            }
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
        this.popup.style.display = "none";
        this.iframe.src = "about:blank";
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
    if (resno == "" || !del.target) {
        return;
    }
    
    if(del.isHide() || del.resno != resno){
        del.show(resno, del.target);
    }
}

function onClickClose() {
    del.hide();
}

function main() {
    let url_matches = location.search.match(/mode=cat/);
    if(!url_matches){
        return;
    }

    let table = document.querySelector("table[border]");
    if (!table) {
        return;
    }

    let anchors = table.getElementsByTagName("a");
    if (!anchors.length) {
        return;
    }

    del = new Del();

    for (let anchor of anchors) {
        anchor.addEventListener("contextmenu", getTargetElement, false);
    }

    browser.runtime.onMessage.addListener(request => {
        onClickDel(request.linkUrl);
    });
}

function getTargetElement(e) {
    for (let elm = e.target; elm; elm = elm.parentElement) {
        if (elm.tagName == "TD") {
            del.target = elm;
            return;
        }
    }
    del.target = null;
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {
}

function onSettingGot(result) {
    post_alert = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
    use_catalog_ng = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
    
    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    post_alert = safeGetValue(changes.post_alert.newValue, post_alert);
    use_catalog_ng = safeGetValue(changes.use_catalog_ng.newValue, use_catalog_ng);
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);
