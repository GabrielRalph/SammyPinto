import {SvgPlus} from "../SvgPlus/4.js"
import {} from "../DataFrames/item-list.js";
import {save, initializeDatabase, initializeAuth, addResumeListener, addUserListener, signin, signout} from "../Firebase/firebase.js";
import {addKeyCommand} from "./key-cmd.js"


function getTime(datestr) {
  let date = new Date();

  if (datestr.toLowerCase() != "present") {
    datestr = datestr.replace(/(?:\d)th|st|nd/, "");
    if (datestr.match(/^\d\d\d\d$/)) {
      datestr = "1 Jan " + datestr;
    }
    date = new Date(datestr);
  }
  let dstr = (date + "").split(/\d\d:/)[0]
  console.log(datestr + " -> " + dstr);
  return date.getTime();
}

function getTimes(datestr) {
  let strs = datestr.toLowerCase().split(/\s*-\s*/);
  let start = getTime(strs[0]);
  let end = start;
  if (start.length > 1) {
    end = getTime(strs[1]);
  }

  return [start, end];
}

function sortTimes(a, b) {
  try {
    let ad = a.value.date;
    let bd = b.value.date;
    if ((!ad && bd) || (!ad && !bd)) return 1;
    if (!bd && ad) return -1;

    let [as, ae] = getTimes(ad);
    let [bs, be] = getTimes(bd);
    if (Math.abs(ae - be) < 1000) {
      return as > bs ? -1 : 1;
    }

    return ae > be ? -1 : (as > bs ? -1 : 1);
  } catch (e) {
    return -1;
  }
}


function addKeySet(set, key, list, split = true) {
  for (let lkey in list) {
    let obj = list[lkey];
    if (key in obj) {
      let value = obj[key];
      if (typeof value === "string") {
        if (split) {
          value = value.replace(/^\s*/, "").replace(/\s+$/, "")
          value = value.split(/(?:\s*[,/]\s*)|(?:\s+and\s+)/);
          // value = value;
          for (let lvalue of value) {
            set[lvalue.toLowerCase()] = lvalue;
          }
        } else {
          set[value.toLowerCase()] = value;
        }
      } else if (typeof value === "object") {
        let vkey = JSON.stringify(value);
        set[vkey] = value;
      }
    }
  }
}

class ResumeApp extends SvgPlus {
  onconnect() {
    this.save = this.querySelector(".save");
    this.authbutton = this.querySelector(".sign-in-out");
    this.keysets = new SvgPlus(this.querySelector(".key-sets"));
    this.data = this.querySelector("data-frame");

    let expil = document.querySelector("item-list[key = 'experiences']");
    expil.sortMethod = sortTimes;
    let proil = document.querySelector("item-list[key = 'projects']");
    proil.sortMethod = sortTimes;

    this.addEventListener("update", () => {
      console.log("update");
      this.updateKeySets();
      this.toggleAttribute("edited", this.data.edited);
    })

    this.save.onclick = () => {save(this.value)}
    addUserListener((user) => {
      this.toggleAttribute("user", user !== null);
      this.toggleAttribute("admin", user !== null && user.isAdmin === true);
      this.user = user;
    })
    addResumeListener((data) => {
      this.toggleAttribute("edited", false);
      if (data !== null && Object.keys(data).length > 3) {
        this.value = data;
      }
    });
    initializeDatabase();
    addKeyCommand("Meta+e", () => {
      this.editable = !this.editable;
    })
    this.updateEditable();
    window.onpopstate = () => this.updateEditable();

    let editable = false;
    window.addEventListener("beforeprint", () => {
      editable = this.editable;
      this.editable = false;
    })
    window.addEventListener("afterprint", () => {
      this.editable = editable;
    })
  }

  updateEditable(){
    this.editable = false;
    let location = window.location;
    if ((location + "").match(/\?edit/)) {
      this.editable = true;
    }
  }

  set user(user){
    this.toggleAttribute("user", !!user);
    this._user = user;
    console.log(user);
    if (user) {
      this.authbutton.onclick = () => {signout()};
    } else {
      this.authbutton.onclick = () => {signin()};
    }
  }

  set editable(v) {
    if (v) {
      initializeAuth();
    }
    this.toggleAttribute("editable", v);
    this._editable = v;
  }
  get editable() {
    return this._editable;
  }

  set value(value){
    this.toggleAttribute("hidden", true);
    if (value != null) {
      this.toggleAttribute("hidden", false)
    }
    this.data.value = value;
    this.updateKeySets();
  }

  get value(){
    return this.data.value;
  }

  clearKeySets(){
    this.keysets.innerHTML = "";
  }

  updateKeySets(){
    this.clearKeySets();
    this.makeRolesList();
    this.makeQualifications();
  }

  makeRolesList() {
    console.log("making roles list");
    let list = this.keysets.createChild("div", {class: "key-set"});
    let head = list.createChild("h3", {content: "Roles"});
    let data = this.value;
    // console.log(data.experiences);x

    let keyIcons = [];
    // get set of of all key values (csv)
    let keySet = {};
    // addKeySet(keySet, "role", data.experiences);
    addKeySet(keySet, "role", data.projects);

    let roles = Object.values(keySet);
    roles.sort((a, b) => a > b ? 1 : -1)
    for (let role of roles) {
      let icon = list.createChild("div", {class: "filter-key", content: role});
      icon.onclick = () => {
        icon.toggleAttribute("selected");
      }
      keyIcons.push(icon);
    }

    head.onclick = () => {
      for (let icon of keyIcons) {
        icon.toggleAttribute("selected", false);
      }
    }
  }

  makeQualifications(){
    let list = this.keysets.createChild("div", {class: "key-set"});
    let head = list.createChild("h3", {content: "Qualifications"});
    let data = this.value;

    let keyIcons = [];
    // get set of of all key values (csv)
    let keySet = {};
    addKeySet(keySet, "qualifications", data.experiences);
    addKeySet(keySet, "qualifications", data.educations);

    let quals = Object.values(keySet);
    quals.sort((a, b) => a > b ? 1 : -1)
    for (let qual of quals) {
      let icon = list.createChild("div", {class: "filter-key", content: qual});
    }
  }
}

SvgPlus.defineHTMLElement(ResumeApp);
