const DEL_CLASS_NAME = "KOSHIAN_del";
const DEFAULT_POST_ALERT = false;
let post_alert = DEFAULT_POST_ALERT;

class Del {
    constructor() {
        this.resno = "";
        this.popup = null;
        this.iframe = null;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/res\/[0-9]+\.htm/);
        if(!url_matches){
            return;
        }

        this.popup = document.createElement("div")
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
            let iframe_doc = this.iframe.contentWindow.document;
            let form = iframe_doc.getElementsByTagName("form")[0];
            if (form) {
                form.onsubmit = () => {
                    form.onsubmit = null;
                    target.textContent = "del 送信済み";
                    target.onclick = (e) => {return false};
                    this.hide();

                    if(post_alert){
                        alert(`delを送信しました`);
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

        this.popup.style.left = `${scrollX + rect.left + rect.width}px`;
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
    
    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    post_alert = safeGetValue(changes.post_alert.newValue, post_alert);
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);