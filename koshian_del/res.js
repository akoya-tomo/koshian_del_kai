const DEL_POPUP_CLASS_NAME = "KOSHIAN_del_popup";
const DEFAULT_POST_ALERT = false;
const DEFAULT_USE_KOSHIAN_NG = false;
const DEFAULT_ALERT_TIME = 1000;
const DEFAULT_DEL_INTERVAL = 5500;
let post_alert = DEFAULT_POST_ALERT;
let use_koshian_ng = DEFAULT_USE_KOSHIAN_NG;
let alert_time = DEFAULT_ALERT_TIME;
let del_interval = DEFAULT_DEL_INTERVAL;
let last_del = 0;

class Del {
    constructor() {
        this.resno = "";
        this.popup = null;
        this.iframe = null;
        this.form = null;
        this.timer = null;
        this.checked_id = null;
        this.submit = null;
        this.interval_timer = null;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/res\/[0-9]+\.htm/);
        if(!url_matches){
            return;
        }

        this.popup = document.createElement("div");
        this.popup.className = DEL_POPUP_CLASS_NAME;
        this.popup.style.position = "absolute";
        this.popup.style.border = "solid 1px black";
        this.popup.style.backgroundColor="#FFFFEE";
        this.popup.style.zIndex = 403;

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
                    this.submit = null;
                    last_del = curTime();
                    browser.storage.local.set({
                        last_del:last_del
                    });

                    if (post_alert) {
                        this.iframe.onload = () => {
                            this.iframe.onload = null;
                            last_del = curTime();
                            browser.storage.local.set({
                                last_del:last_del
                            });
                            this.iframe.doc = this.iframe.contentWindow.document;
                            let anchors = this.iframe.doc.getElementsByTagName("a");
                            for (let anchor of anchors) {
                                // レスポンス内のリンクを削除
                                anchor.parentNode.removeChild(anchor);
                            }
                            let body = this.iframe.doc.getElementsByTagName("body")[0];
                            if (body && !body.textContent.match(/操作が早すぎます/)) {
                                target.textContent = "del 送信済み";
                                target.onclick = () => {return false;};
                                if (use_koshian_ng) hideRes(target.parentElement);
                            }
                            if (alert_time > 0) this.timer = setTimeout(this.hide.bind(this), alert_time);
                        };
                    } else {
                        target.textContent = "del 送信済み";
                        target.onclick = () => {return false;};
                        this.hide();
                        if (use_koshian_ng) hideRes(target.parentElement);
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
                };

                // iframe内のform以外のnodeを削除
                let iframe_body = this.iframe.doc.getElementsByTagName("body")[0];
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

                // 前回checkしたinputにcheckを入れる
                if (this.checked_id) {
                    let checked_input = this.iframe.doc.getElementById(this.checked_id);
                    if (checked_input) {
                        checked_input.checked = true;
                    }
                }

                this.iframe.height = Math.max(this.iframe.doc.documentElement.clientHeight, this.iframe.doc.documentElement.scrollHeight);

                this.submit = this.form.querySelector("input[type='submit']");
                if (this.submit) switchSubmitButton();
            }
        };
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
        this.submit = null;
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

function curTime(){
    let date = new Date();
    return date.getTime();
}

function getRemain(){
    return last_del + del_interval - curTime();
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
    if (!del.interval_timer) del.interval_timer = setInterval(countTime, 500);
    countTime();
}

function hideRes(rtd) {
    if (rtd) {
        let hideButton = rtd.querySelector(":scope > .KOSHIAN_HideButton") || rtd.querySelector(":scope > .KOSHIAN_NGSwitch");
        if (hideButton && hideButton.textContent == "[隠す]") hideButton.click();
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

    document.addEventListener("KOSHIAN_reload", () => {
        process(last_process_index);
    });

    let status = "";
    let target = document.getElementById("akahuku_reload_status");
    if (target) {
        checkAkahukuReload();
    } else {
        document.addEventListener("AkahukuContentApplied", () => {
            target = document.getElementById("akahuku_reload_status");
            if (target) checkAkahukuReload();
        });
    }
    function checkAkahukuReload() {
        let config = { childList: true };
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (target.textContent == status) return;
                status = target.textContent;
                if (status.indexOf("新着:") === 0) {
                    process(last_process_index);
                }
            });
        });
        observer.observe(target, config);
    }
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {   // eslint-disable-line no-unused-vars
}

function onSettingGot(result) {
    post_alert = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
    alert_time = safeGetValue(result.alert_time, DEFAULT_ALERT_TIME);
    use_koshian_ng = safeGetValue(result.use_koshian_ng, DEFAULT_USE_KOSHIAN_NG);
    del_interval = safeGetValue(result.del_interval, DEFAULT_DEL_INTERVAL);
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
        use_koshian_ng = safeGetValue(changes.use_koshian_ng.newValue, use_koshian_ng);
        del_interval = safeGetValue(changes.del_interval.newValue, del_interval);
    }
    if (changes.last_del) {
        last_del = safeGetValue(changes.last_del.newValue, last_del);
    }
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);