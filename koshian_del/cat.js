const DEL_CLASS_NAME = "KOSHIAN_del";
const DUMMY_NAME = "KOSHIAN_dummy_del_target";
const DEFAULT_PAGE_TRANS = false;
const DEFAULT_POST_ALERT = false;
const DEFAULT_USE_CATALOG_NG = false;
let page_trans = DEFAULT_PAGE_TRANS;
let post_alert = DEFAULT_POST_ALERT;
let use_catalog_ng = DEFAULT_USE_CATALOG_NG;

function addFormItem(dest, value, text, checked = false) {
    let id = `del_${value}`;

    let input = document.createElement("input");
    input.name = "reason";
    input.value = value;
    input.type = "radio";
    input.id = id;
    input.checked = checked;

    let label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = text;

    dest.appendChild(input);
    dest.appendChild(label);
    dest.appendChild(document.createElement("br"));
}

function createField(text){
    let field = document.createElement("fieldset");
    let legend = document.createElement("legend");
    
    legend.textContent = text;
    field.appendChild(legend);

    return field;
}

function createHiddenParam(name, value) {
    let elem = document.createElement("input");

    elem.name = name;
    elem.value = value;
    elem.type = "hidden";

    return elem;
}

function createSubmitButton(text) {
    let elem = document.createElement("input");

    elem.value = text;
    elem.type = "submit";

    return elem;
}

function createCloseButton(text) {
    let elem = document.createElement("input");

    elem.value = text;
    elem.type = "button";
    elem.onclick = onClickClose;

    return elem;
}

class Del {
    constructor() {
        this.resno = "";
        this.popup = null;
        this.form = null;
        this.param_mode = null;
        this.param_d = null;
        this.param_b = null;
        this.param_dlv = null;
        this.submit = createSubmitButton("削除依頼をする");
        this.close = createCloseButton("閉じる");
        this.dummy = document.createElement("iframe");
        this.target = null;

        this.create();
        this.hide();
    }

    create(){
        let url_matches = location.href.match(/https?:\/\/(.+?)\/(.+?)\/futaba.php/);
        let url_matches2 = location.search.match(/mode=cat/);
        if(!url_matches || !url_matches2){
            return;
        }

        this.popup = document.createElement("div");
        this.popup.className = DEL_CLASS_NAME;
        this.popup.style.position = "absolute";
        this.popup.style.border = "solid 1px black";
        this.popup.style.backgroundColor="#FFFFEE";

        this.form = document.createElement("form");
        this.form.action = `${location.protocol}//${location.host}/del.php?guid=on`;
        this.form.method = "POST";

        let field1 = createField("文字･画像");
        addFormItem(field1, "101", "中傷・侮辱・名誉毀損");
        addFormItem(field1, "102", "脅迫・自殺");
        addFormItem(field1, "103", "個人情報・プライバシー");
        addFormItem(field1, "104", "つきまとい・ストーカー");
        addFormItem(field1, "105", "連投・負荷増大・無意味な羅列");
        addFormItem(field1, "106", "広告・spam");
        addFormItem(field1, "107", "売春・援交");
        addFormItem(field1, "108", "侵害・妨害");
        //addFormItem(field1, "109", "");
        addFormItem(field1, "110", "荒らし・嫌がらせ・混乱の元");
        addFormItem(field1, "111", "政治・宗教・民族");
        this.form.appendChild(field1);

        let field2 = createField("２次画像");
        addFormItem(field2, "201", "グロ画像(２次)");
        addFormItem(field2, "202", "猥褻画像・無修正画像(２次)");
        this.form.appendChild(field2);

        let field3 = createField("３次画像");
        addFormItem(field3, "301", "グロ画像(３次)");
        addFormItem(field3, "302", "エロ画像(３次)");
        addFormItem(field3, "303", "児童ポルノ画像(３次)");
        addFormItem(field3, "304", "猥褻画像・無修正画像(３次)");
        this.form.appendChild(field3);

        this.param_mode =createHiddenParam("mode", "post");
        this.param_d = createHiddenParam("d", "");
        this.param_b = createHiddenParam("b", url_matches[2]);
        this.param_dlv = createHiddenParam("dlv", "0");     
        this.form.appendChild(this.param_mode);
        this.form.appendChild(this.param_d);
        this.form.appendChild(this.param_b);
        this.form.appendChild(this.param_dlv);
        this.form.appendChild(this.submit);
        this.form.appendChild(document.createTextNode("　"));
        this.form.appendChild(this.close);

        this.dummy = document.createElement("iframe");
        this.dummy.name = "KOSHIAN_dummy_del_target";
        this.dummy.hidden = true;

        if(!page_trans){
            this.form.target = this.dummy.name;
        }

        this.popup.appendChild(this.form);

        document.body.appendChild(this.popup);    
        document.body.appendChild(this.dummy);
    }

    show(resno, target) {
        this.resno = resno;
        let scrollX = document.documentElement.scrollLeft;
        let scrollY = document.documentElement.scrollTop;
        let rect = target.getBoundingClientRect();
        let clientW = document.documentElement.clientWidth;
        let cx = rect.x + rect.width/2; // center x

        if(cx < clientW/2){
            this.popup.style.left = `${scrollX + rect.left + rect.width}px`;
            this.popup.style.right = null;
        }else{
            this.popup.style.left = null;
            this.popup.style.right = `${clientW - rect.left}px`;
        }

        this.popup.style.top = `${scrollY + rect.top}px`;
        this.popup.style.display = "block";

        this.param_d.value = resno;
        
        this.form.onsubmit = () => {
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
    }

    hide() {
        this.popup.style.display = "none";
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
    let anchors = document.getElementsByTagName("a");
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
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {
}

function onSettingGot(result) {
    page_trans = safeGetValue(result.page_trans, DEFAULT_PAGE_TRANS);
    post_alert = safeGetValue(result.post_alert, DEFAULT_POST_ALERT);
    use_catalog_ng = safeGetValue(result.use_catalog_ng, DEFAULT_USE_CATALOG_NG);
    
    main();
}

function onSettingChanged(changes, areaName) {
    if (areaName != "local") {
        return;
    }

    page_trans = safeGetValue(changes.page_trans.newValue, page_trans);
    post_alert = safeGetValue(changes.post_alert.newValue, post_alert);
    use_catalog_ng = safeGetValue(changes.use_catalog_ng.newValue, use_catalog_ng);
}

browser.storage.local.get().then(onSettingGot, onError);
browser.storage.onChanged.addListener(onSettingChanged);
