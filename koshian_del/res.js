const DEL_POPUP_CLASS_NAME = "KOSHIAN_del_popup";
const DEFAULT_POST_ALERT = false;
const DEFAULT_USE_KOSHIAN_NG = false;
const DEFAULT_ALERT_TIME = 1000;
const DEFAULT_DEL_INTERVAL = 5500;
const DEFAULT_USE_SRCDOC = false;
const DEFAULT_USE_DEL_BUTTON = true;
const DEL_INTERVAL_OFFSET = 20;
let post_alert = DEFAULT_POST_ALERT;
let use_koshian_ng = DEFAULT_USE_KOSHIAN_NG;
let alert_time = DEFAULT_ALERT_TIME;
let del_interval = DEFAULT_DEL_INTERVAL;
let use_srcdoc = DEFAULT_USE_SRCDOC;
let use_del_button = DEFAULT_USE_DEL_BUTTON;
let last_del = 0;

class Del {
    constructor() {
        this.resno = "";
        this.b = null;
        this.d = null;
        this.popup = null;
        this.iframe = null;
        this.form = null;
        this.timer = null;
        this.checked_id = "110";
        this.submit = null;
        this.interval_timer = null;
        this.srcdoc = null;
        this.has_trimmed_srcdoc = false;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/res\/([0-9]+)\.htm/);
        if(!url_matches){
            return;
        }

        this.b = url_matches[2];
        this.d = url_matches[3];

        this.popup = document.createElement("div");
        this.popup.className = DEL_POPUP_CLASS_NAME;
        this.popup.style.position = "absolute";
        this.popup.style.border = "solid 1px black";
        this.popup.style.backgroundColor="#FFFFEE";
        this.popup.style.zIndex = 403;

        this.iframe = document.createElement("iframe");
        this.iframe.src = "about:blank";
        this.iframe.width = "150px";
        this.iframe.height = "42px";
        this.iframe.b = this.b;

        this.popup.appendChild(this.iframe);

        document.body.appendChild(this.popup);    
    }

    show(resno, target) {
        this.iframe = this.popup.getElementsByTagName("iframe")[0];
        this.iframe.width = "150px";
        this.iframe.height = "42px";
        if (!this.iframe.b) {
            this.iframe.b = this.b;
        }
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
                    this.submit.disabled = true;
                    this.submit.value = "送信中...";
                    this.submit = null;
                    // 最終del時刻を更新
                    last_del = curTime();
                    browser.storage.local.set({
                        last_del:last_del
                    });

                    if (post_alert) {
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

                            this.iframe.doc = this.iframe.contentWindow.document;
                            let anchors = this.iframe.doc.getElementsByTagName("a");
                            for (let anchor of anchors) {
                                // レスポンス内のリンクを削除
                                anchor.parentNode.removeChild(anchor);
                            }
                            this.iframe.width = "300px";
                            this.iframe.height = Math.max(this.iframe.doc.documentElement.clientHeight, this.iframe.doc.documentElement.scrollHeight);
                            let body = this.iframe.doc.getElementsByTagName("body")[0];
                            if (body && !body.textContent.match(/操作が早すぎます|理由がありません/)) {
                                target.textContent = "del 送信済み";
                                if (alert_time > 0) {
                                    target.onclick = () => {return false;};
                                }
                                if (use_koshian_ng) {
                                    hideRes(target.parentElement);
                                }
                                // del id登録
                                let del_id = target.outerHTML.match(/del\((\d+)\)/);
                                if (del_id) {
                                    browser.runtime.sendMessage({
                                        id: "koshian_del_add_del_response",
                                        url: location.host + location.pathname,
                                        del_id: del_id[1]
                                    });
                                }
                            }
                            if (alert_time > 0) {
                                this.timer = setTimeout(this.hide.bind(this), alert_time);
                            }
                        };
                    } else {
                        target.textContent = "del 送信済み";
                        target.onclick = () => {return false;};
                        this.hide();
                        if (use_koshian_ng) {
                            hideRes(target.parentElement);
                        }
                        // del id登録
                        let del_id = target.outerHTML.match(/del\((\d+)\)/);
                        if (del_id) {
                            browser.runtime.sendMessage({
                                id: "koshian_del_add_del_response",
                                url: location.host + location.pathname,
                                del_id: del_id[1]
                            });
                        }
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

                    // form内のinputにidを付与
                    let inputs = this.form.getElementsByTagName("input");
                    for (let input of inputs) {
                        if (input.type == "radio" && input.name == "reason" && input.value) {
                            input.id = input.value;
                        }
                    }

                    // 削除理由を隠す
                    let form_table = this.form.getElementsByTagName("table")[0];
                    if (form_table) {
                        form_table.style.display = "none";
                    }
                }
                if (!this.srcdoc) {
                    let iframe_html = this.iframe.doc.documentElement;
                    if (iframe_html) {
                        this.srcdoc = iframe_html.outerHTML;
                        this.has_trimmed_srcdoc = true;
                    }
                }

                // input#110（荒らし・嫌がらせ・混乱の元）にcheckを入れる
                if (this.checked_id) {
                    let checked_input = this.iframe.doc.getElementById(this.checked_id);
                    if (checked_input) {
                        checked_input.checked = true;
                    } else {
                        // input#110が無いときは最初の項目にcheckを入れる
                        let form_inputs = this.form.getElementsByTagName("input");
                        for (let form_input of form_inputs) {
                            if (form_input.id && form_input.type == "radio" && form_input.name == "reason" && form_input.value) {
                                form_input.checked = true;
                                break;
                            }
                        }
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
            this.iframe.srcdoc = this.srcdoc.replace(/<form action="del.php/, `<form action="${location.protocol}//${location.host}/del.php`).replace(/name="d" value="\d+"/, `name="d" value="${this.resno}"`);
        } else {
            this.iframe.src = `${location.protocol}//${location.host}/del.php?b=${this.iframe.b}&d=${this.resno}`;
        }

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

    static getResno(target) {
        let parent = target.parentNode;
        let cno = parent.getElementsByClassName("cno")[0];
        if (cno) {
            // 新レスNo.取得（2019/11～）
            return cno.textContent.replace("No.", "");
        }

        for (let node = parent.firstChild; node; node = node.nextSibling) {
            if (node.nodeName == "BLOCKQUOTE") {
                break;
            } else if (node.nodeType == Node.TEXT_NODE) {
                // 旧レスNo.取得
                let matches = node.nodeValue.match(/No\.(\d+)/);
                if (matches) {
                    return matches[1];
                }
            } else if (node.nodeName == "INPUT" && node.value == "delete") {
                // 旧削除チェックボックスからレスNo.取得
                let name = node.getAttribute("name");
                if (name) {
                    let matches = name.match(/\d+/);
                    if (matches) {
                        return matches[0];
                    }
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
        if(e.target.textContent == "del 送信済み") {
            e.target.onclick = () => {return false;};
        }
        del.hide();
    }
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

function putDel(elem) {
    if (!use_del_button) {
        return false;
    }
    let cno = elem.querySelector(":scope > .cno");
    if (!cno) {
        return false;
    }
    let no = cno.textContent.replace("No.", "");
    let del_elem = document.createElement("a");
    del_elem.textContent = "del";
    del_elem.className = "del";
    del_elem.href = "javascript:void(0)";
    del_elem.name = `del(${no})`;
    let quote_button = elem.getElementsByClassName("KOSHIAN_NumberButton")[0];
    if (quote_button) {
        elem.insertBefore(del_elem, quote_button.nextSibling);
    } else {
        elem.insertBefore(del_elem, cno.nextSibling);
    }
    return del_elem;
}

function hideRes(rtd) {
    if (rtd) {
        let hideButton = rtd.querySelector(":scope > .KOSHIAN_HideButton") || rtd.querySelector(":scope > .KOSHIAN_NGSwitch");
        if (hideButton && hideButton.textContent == "[隠す]") {
            hideButton.click();
        }
    }
}

let last_process_index = 0;

function process(beg, start = false){
    let end = 0;
    let rtds = document.getElementsByClassName("rtd");
    if (!rtds.length) {
        if (start) {
            restoreDelStatus();
        }
        return;
    }

    end = rtds.length;

    for(let i = beg; i < end; ++i){
        let del_elem = rtds[i].querySelector(":scope > .del");
        if (!del_elem) {
            del_elem = putDel(rtds[i]);
        }
        if (del_elem) {
            del_elem.onclick = onClickDel;
        }
    }

    if (start) {
        restoreDelStatus();
    }

    last_process_index = end;

    function restoreDelStatus() {
        browser.runtime.sendMessage({
            id: "koshian_del_request_del_list",
            url: location.host + location.pathname
        }).then(response => {
            let del_list = response.del_list;
            if (!del_list.length) {
                return;
            }
            // スレ
            let del_thre = document.querySelector(".thre > .del");
            if (del_thre) {
                let del_id = del_thre.outerHTML.match(/del\((\d+)\)/);
                if (del_id && del_list.some(id => id == del_id[1])) {
                    del_thre.textContent = "del 送信済み";
                    del_thre.onclick = () => {return false;};
                }
            }

            if (end == 0) {
                return;
            }
            // レス
            let dels = document.querySelectorAll(".rtd > .del");
            for (let i = beg; i < end; ++i) {
                let del_id = dels[i].outerHTML.match(/del\((\d+)\)/);
                if (del_id && del_list.some(id => id == del_id[1])) {
                    dels[i].textContent = "del 送信済み";
                    dels[i].onclick = () => {return false;};
                    if (use_koshian_ng) {
                        hideRes(dels[i].parentElement);
                    }
                }
            }
        });
    }
}

function main() {
    let thre = document.getElementsByClassName("thre")[0];
    if (thre == null) {
        return;
    }

    del = new Del();

    // delフォームを取得
    let xml = new XMLHttpRequest();
    xml.open("GET", `${location.protocol}//${location.host}/del.php?b=${del.b}&d=${del.d}`);
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

    // thre
    let del_thre = document.querySelector(".thre > .del");
    if (!del_thre) {
        del_thre = putDel(thre);
    }
    if (del_thre) {
        del_thre.onclick = onClickDel;
    }

    // rtd直下のdelだけを選択
    process(0, true);

    // KOSHIANリロード監視
    document.addEventListener("KOSHIAN_reload", () => {
        process(last_process_index);
    });

    // 赤福リロード監視
    let target = document.getElementById("akahuku_reload_status");
    if (target) {
        checkAkahukuReload(target);
    } else {
        document.addEventListener("AkahukuContentApplied", () => {
            target = document.getElementById("akahuku_reload_status");
            if (target) {
                checkAkahukuReload(target);
            }
        });
    }
    function checkAkahukuReload(target) {
        let status = "";
        let config = { childList: true };
        let observer = new MutationObserver(() => {
            if (target.textContent == status) {
                return;
            }
            status = target.textContent;
            if (status.indexOf("新着:") === 0) {
                process(last_process_index);
            }
        });
        observer.observe(target, config);
    }

    // ふたばリロード監視
    let contdisp = document.getElementById("contdisp");
    if (contdisp) {
        check2chanReload(contdisp);
    }
    function check2chanReload(target) {
        let status = "";
        let reloading = false;
        let config = { childList: true };
        let observer = new MutationObserver(() => {
            if (target.textContent == status) {
                return;
            }
            status = target.textContent;
            if (status == "・・・") {
                //del.hide();
                reloading = true;
            } else if (reloading && status.endsWith("頃消えます")) {
                process(last_process_index);
                reloading = false;
            } else {
                reloading = false;
            }
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
    use_srcdoc = safeGetValue(result.use_srcdoc, DEFAULT_USE_SRCDOC);
    use_del_button = safeGetValue(result.use_del_button, DEFAULT_USE_DEL_BUTTON);
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
        use_srcdoc = safeGetValue(changes.use_srcdoc.newValue, use_srcdoc);
    }
    if (changes.last_del) {
        last_del = safeGetValue(changes.last_del.newValue, last_del);
    }
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);
