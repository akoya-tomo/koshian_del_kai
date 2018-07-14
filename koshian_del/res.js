const DEL_CLASS_NAME = "KOSHIAN_del";
const DEFAULT_POST_ALERT = false;
const DEFAULT_ALERT_TIME = 1000;
let post_alert = DEFAULT_POST_ALERT;
let alert_time = DEFAULT_ALERT_TIME;

class Del {
    constructor() {
        this.resno = "";
        this.popup = null;
        this.iframe = null;
        this.form = null;
        this.timer = null;
        this.checked_id = null;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/res\/[0-9]+\.htm/);
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
        this.iframe.b = url_matches[2];

        this.popup.appendChild(this.iframe);

        document.body.appendChild(this.popup);    
    }

    show(resno, target) {
        this.resno = resno;
        let scrollX = document.documentElement.scrollLeft;
        let scrollY = document.documentElement.scrollTop;
        let rect = target.getBoundingClientRect();

        this.iframe.onload = () => {
            this.iframe.onload = null;
            this.iframe.doc = this.iframe.contentWindow.document;
            this.form = this.iframe.doc.getElementsByTagName("form")[0];
            if (this.form) {
                this.form.onsubmit = () => {
                    this.form.onsubmit = null;
                    if(post_alert){
                        this.iframe.onload = () => {
                            this.iframe.onload = null;
                            let anchors = this.iframe.contentWindow.document.getElementsByTagName("a");
                            for (let anchor of anchors) {
                                // レスポンス内のリンクを削除
                                anchor.parentNode.removeChild(anchor);
                            }
                            if (alert_time > 0) this.timer = setTimeout(this.hide.bind(this), alert_time);
                        }
                        target.textContent = "del 送信済み";
                        target.onclick = (e) => {return false};
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

                    return true;
                }

                // iframe内のform以外のnodeを削除
                for (let node = this.form.previousSibling; node; node = this.form.previousSibling) {
                    node.parentNode.removeChild(node);
                }
                for (let node = this.form.nextSibling; node; node = this.form.nextSibling) {
                    node.parentNode.removeChild(node);
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

                // 前回checkしたinputにcheckを入れる
                if (this.checked_id) {
                    let checked_input = this.iframe.doc.getElementById(this.checked_id);
                    if (checked_input) {
                        checked_input.checked = true;
                    }
                }

                this.iframe.height = Math.max(this.iframe.doc.documentElement.clientHeight, this.iframe.doc.documentElement.scrollHeight);
            }
        }
        this.iframe.src = `${location.protocol}//${location.host}/del.php?b=${this.iframe.b}&d=${this.resno}`;

        this.popup.style.left = `${scrollX + rect.left + rect.width}px`;
        this.popup.style.top = `${scrollY + rect.top}px`;
        this.popup.style.display = "block";
    }

    hide() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.popup.style.display = "none";
        this.iframe.src = "about:blank";
    }

    isHide() {
        return this.popup.style.display == "none";
    }

    static getResno(target) {
        for (let elem = target.parentElement.firstElementChild; elem; elem = elem.nextElementSibling) {
            if (elem.tagName == "INPUT" && elem.value == "delete") {
                let matches = elem.getAttribute("name").match(/([0-9]+)/);
                if (matches != null) {
                    return matches[1];
                }
            }
        }

        return "";
    }
    
    static init(){

    }
}

let del;

function onClickDel(e) {
    let resno = Del.getResno(e.target);
    if (resno == "") {
        return;
    }
    
    if(del.isHide() || del.resno != resno){
        del.show(resno, e.target);
    }else{
        del.hide();
    }
}

let last_process_index = 0;

function process(beg){
    let dels = document.querySelectorAll(".rtd > .del");
    if(!dels){
        return;
    }

    let end = dels.length;

    for(let i = beg; i < end; ++i){
        dels[i].onclick = onClickDel;
    }

    last_process_index = end;
}

function main() {
    let thre = document.getElementsByClassName("thre")[0];
    if (thre == null) {
        return;
    }

    del = new Del();

    // thre
    document.getElementsByClassName("del")[0].onclick = onClickDel;

    // rtd直下のdelだけを選択
    process(0);

    document.addEventListener("KOSHIAN_reload", (e) => {
        process(last_process_index);
    });
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {
}

function onSettingGot(result) {
    post_alert = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
    alert_time = safeGetValue(result.alert_time, DEFAULT_ALERT_TIME);
    
    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    post_alert = safeGetValue(changes.post_alert.newValue, post_alert);
    alert_time = safeGetValue(changes.alert_time.newValue, alert_time);
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);