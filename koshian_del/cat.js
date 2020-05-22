const DEL_CLASS_NAME = "KOSHIAN_del";
const DEFAULT_USE_CATALOG_NG = false;
const DEFAULT_DEL_INTERVAL = 5500;
const DEL_INTERVAL_OFFSET = 20;
let use_catalog_ng = DEFAULT_USE_CATALOG_NG;
let del_interval = DEFAULT_DEL_INTERVAL;
let last_del = 0;

class Del {
    constructor() {
        this.pdm = null;
        this.resno = "";
        this.target = null;
        this.timer = null;
        this.pdmsc_del = null;
        this.pdmsc_ng = null;
        this.message = null;
    }

    create(pdm){
        this.target = null;
        this.pdm = pdm;

        let old_pdmsc = this.pdm.getElementsByClassName("KOSHIAN_del_pdmsc")[0];
        if (old_pdmsc) {
            old_pdmsc.remove();
        }
        let old_message = this.pdm.getElementsByClassName("KOSHIAN_del_message")[0];
        if (old_message) {
            old_message.remove();
        }

        this.resno = this.getDatano(this.pdm);
        if (!this.resno) {
            console.debug("KOSHIAN_del/cat.js/Del.create - no Del.resno");
            return;
        }
        this.target = this.getTarget(this.resno);
        if (!this.target) {
            console.debug("KOSHIAN_del/cat.js/Del.create - no Del.target");
            return;
        }

        this.pdmsc_ng = document.createElement("div");
        this.pdmsc_ng.className = "pdmsc pdmcd KOSHIAN_del_pdmsc";
        this.pdmsc_ng.textContent = "削除依頼(del&NG)";
        this.pdmsc_ng.addEventListener("click", this.send.bind(this), false);

        this.message = document.createElement("div");
        this.message.className = "pdmsc pdmcd KOSHIAN_del_message";
        this.message.style.display = "none";

        let pdmscs = this.pdm.getElementsByClassName("pdmsc");
        for (let pdmsc of pdmscs) {
            if (pdmsc.textContent == "削除依頼(del)") {
                this.pdmsc_del = pdmsc;
                if (use_catalog_ng) {
                    this.pdmsc_del.parentNode.insertBefore(this.pdmsc_ng, this.pdmsc_del.nextSibling);
                }
                this.pdmsc_del.parentNode.insertBefore(this.message, this.pdmsc_del.nextSibling);
                countTime();
                return;
            }
        }
        console.debug("KOSHIAN_del/cat.js/Del.create - pdmsc(del) not found");
    }

    send(e) {
        e.stopPropagation();
        if (this.pdmsc_del) {
            this.pdmsc_del.click();
            return;
        }
        console.debug("KOSHIAN_del/cat.js/Del.send - pdmsc(del) not found");
    }


    getDatano(pdm) {
        return pdm.getAttribute("data-no");
    }

    getTarget(no) {
        let cattable = document.getElementById("cattable");
        if (!cattable) {
            console.debug("KOSHIAN_del/cat.js/Del.getTarget - #cattable not found");
            return;
        }
        let anchors = cattable.getElementsByTagName("a");
        for (let anchor of anchors) {
            let resno = del.getResno(anchor.href);
            if (resno && resno == no) {
                return anchor.closest("td");
            }
        }
        console.debug("KOSHIAN_del/cat.js/Del.getTarget - target not found");
    }

    getResno(linkUrl) {
        let matches = linkUrl.match(/\/([0-9]+).htm/);
        if (matches != null) {
            return matches[1];
        }

        return "";
    }
}

let del;

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
        if (del.pdmsc_del) {
            del.pdmsc_del.style.display = "none";
        }
        if (del.pdmsc_ng) {
            del.pdmsc_ng.style.display = "none";
        }
        if (del.message) {
            del.message.style.display = "";
            del.message.textContent = `あと ${Math.ceil(remain/1000)}秒`;
        }
    } else {
        if (del.pdmsc_del) {
            del.pdmsc_del.style.display = "";
        }
        if (del.pdmsc_ng) {
            del.pdmsc_ng.style.display = "";
        }
        if (del.message) {
            del.message.style.display = "none";
            del.message.textContent = "";
        }
        if (del.timer) {
            clearInterval(del.timer);
            del.timer = null;
        }
    }
}

function hideDelButton(){
    if (!del.timer) {
        del.timer = setInterval(countTime, 100);
    }
    countTime();
}

function main() {
    let url_matches = location.search.match(/mode=cat/);
    if(!url_matches){
        return;
    }

    del = new Del();

    let pdm = document.getElementById("pdm");
    if (pdm) {
        del.create(pdm);
    }

    // プルダウンメニュー監視
    let target = document.body;
    let config = { childList: true };
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let nodes = mutation.addedNodes;
            for (let node of nodes) {
                if (node.id == "pdm") {
                    del.create(node);

                    // 「登録しました」(.pddtipc)監視
                    let target = node;
                    let config = { childList: true};
                    let observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            let nodes = mutation.addedNodes;
                            for (let node of nodes) {
                                if (node.classList.contains("pddtipc")) {
                                    // 最終del時刻を更新
                                    last_del = curTime();
                                    browser.storage.local.set({
                                        last_del:last_del
                                    });
                                    hideDelButton();
                                    if (use_catalog_ng) {
                                        if (del.target) {
                                            del.target.classList.add(DEL_CLASS_NAME);
                                            document.dispatchEvent(new CustomEvent("KOSHIAN_del"));
                                            del.target = null;
                                        } else {
                                            console.debug("KOSHIAN_del/cat.js/main - no Del.target");
                                        }
                                    }
                                }
                            }
                        });
                    });
                    observer.observe(target, config);
                }
            }
            nodes = mutation.removedNodes;
            for (let node of nodes) {
                if (node.id == "pdm") {
                    del.message = null;
                }
            }
        });
    });
    observer.observe(target, config);

}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {   // eslint-disable-line no-unused-vars
}

function onSettingGot(result) {
    use_catalog_ng = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
    del_interval = safeGetValue(result.del_interval, DEFAULT_DEL_INTERVAL);
    last_del = safeGetValue(result.last_del, 0);

    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    if (changes.use_catalog_ng) {
        use_catalog_ng = safeGetValue(changes.use_catalog_ng.newValue, use_catalog_ng);
        del_interval = safeGetValue(changes.del_interval.newValue, del_interval);
    }
    if (changes.last_del) {
        last_del = safeGetValue(changes.last_del.newValue, last_del);
    }
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);
