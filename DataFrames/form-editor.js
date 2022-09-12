import {SvgPlus} from "../SvgPlus/4.js"
const IconTemplate =
`
  <svg save class = "icon" viewBox="0 0 99 99"><path d="M44,93.5c-1.83,0-3.55-.91-4.58-2.45L17.42,58.05c-1.68-2.53-1-5.94,1.53-7.63,2.53-1.68,5.94-1,7.63,1.53l16.37,24.55L71.94,8.83c1.2-2.79,4.43-4.08,7.22-2.89,2.79,1.2,4.08,4.43,2.89,7.22L49.05,90.17c-.8,1.85-2.54,3.12-4.55,3.31-.17,.02-.34,.02-.5,.02Z"/></svg>
  <svg close class = "icon" viewBox="0 0 99 99"><path d="M86.25,78.4l-29.19-28.76,29.08-29.08c2.15-2.15,2.15-5.63,0-7.78-2.15-2.15-5.63-2.15-7.78,0l-29.14,29.14L20.09,13.21c-2.16-2.13-5.65-2.11-7.78,.06-2.13,2.16-2.11,5.65,.06,7.78l29.08,28.65-28.42,28.42c-2.15,2.15-2.15,5.63,0,7.78,1.07,1.07,2.48,1.61,3.89,1.61s2.82-.54,3.89-1.61l28.47-28.47,29.25,28.82c1.07,1.06,2.47,1.58,3.86,1.58s2.84-.55,3.92-1.64c2.13-2.16,2.11-5.65-.06-7.78Z"/></svg>
  <svg delete class = "icon" viewBox="0 0 99 99"><polygon points="77 88 66 99 33 99 22 88 11 33 33 41.25 66 41.25 88 33 77 88"/><polygon points="85.86 14.51 66.46 27.76 34.4 35.61 11.07 32.83 19.14 19.53 33.86 10.26 37.89 3.61 48.58 .99 55.3 5.07 72.56 6.44 85.86 14.51"/></svg>
`;


function parseDate(date) {
  let dates = [date];
  if (typeof date === "string") {
    dates = date.split(/\s*[,-]\s*/g);
  }
  for (let d of dates) {
    // console.log(new Date(d));
    let time = (new Date(d)).getTime();
    if (Number.isNaN(time) && d.toLowerCase() !== "present") {
      return null;
    }
  }

  return dates.length > 0;
}

function validateInputValue(value, type) {
  if (typeof value !== "string") value = "";
  // standadise white space
  value = value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");

  switch (type) {
    case "date":
      if (parseDate(value) === null) value = null;
      break;
    case "required":
      if (value.length < 1) {
        value = null;
      }
      break;
  }
  return value;
}

class IBox extends SvgPlus {
  constructor(el, formEditor){
    super("i-box");
    try {
      el.parentNode.replaceChild(this, el);
      this._type = el.getAttribute("type");
      el.removeAttribute("type");
      el.setAttribute("v-type", this.type);
      this.appendChild(el);
      this.formEditor = el;
      this.input = el;
    } catch(e) {
    }
  }

  get name(){
    return this.input.getAttribute("name");
  }
  get value() {
    let value = validateInputValue(this.input.value, this.type);
    this.invalid = value === null;
    return value;
  }
  get changed() {
    let oldv = validateInputValue(this.oldValue, this.type);
    let value = this.value;
    return oldv !== value;
  }
  set value(v) {
    this.oldValue = v;
    this.input.value = v;
  }
  set invalid(v) {
    this._invalid = v;
    this.toggleAttribute("invalid", v);
  }
  get type() {return this._type;}

  get path() {
    let path = [this.name];

    let node = this;
    while (!this.formEditor.form.isSameNode(node)) {
      let key = node.getAttribute("key");
      if (key != null && key != "") {
        path.unshift(key);
      }
      node = node.parentNode;
    }

    return path;
  }
}

function setPath(path, root, value) {
  if (path.length == 1 && path[0] == null) {
    return value;
  }

  let data = root;
  let key = path.pop();
  for (let dir of path) {
    if (!(dir in data)) data[dir] = {};
    data = data[dir];
  }
  data[key] = value;

  return root;
}
function getPath(path, data) {
  if (path.length == 1 && path[0] == null) {
    return data;
  }

  for (let key of path) {
    if (key in data) {
      data = data[key];
    } else {
      return null
    }
  }
  return data;
}


let SelectedFormEditor = null;
class FormEditor extends SvgPlus {
  onconnect(){
    this._value = null;
    this.build();
    this.shown = false;
    SelectedFormEditor = this;
  }
  build(){
    this.innerHTML = "";
    this.form = this.createChild("form");
    this.icons = this.createChild("div", {class: "icons", content: IconTemplate});

    this.form.oninput = (e) => {
      this.toggleAttribute("saveable", this.isSaveable());
    }
  }


  async getFormData(template, oldata = null, allowDelete = true) {
    await this.hide();
    if (this.buildForm(template, oldata, allowDelete)) {
      this.shown = true;
      return new Promise((resolve, reject) => {
        this.setIconClick("close", () => {
          this.shown = false;
          resolve(null);
        });

        let unSubSave = () => {};
        let unSubDelete = () => {};
        unSubSave = this.setIconClick("save", () => {
          unSubDelete();
          unSubSave();
          let value = this.value;
          this.shown = false;
          resolve(this.value);
        })

        unSubDelete = this.setIconClick("delete", () => {
          unSubDelete();
          unSubSave();
          this.shown = false;
          resolve("delete");
        })
      });
    }
  }


  buildForm(temp, oldValue = null, allowDelete = true) {
    this.toggleAttribute("saveable", false);
    this.toggleAttribute("edit", false);
    this.form.innerHTML = temp;
    this.getValue = null;
    this.isSaveable = null;
    let built = false;
    if (typeof temp === "string" && temp.length > 0) {
      this._value = oldValue;
      let edit = oldValue !== null && (typeof oldValue === "object" || (typeof oldValue === "string" && oldValue !== ""));
      this.toggleAttribute("edit", edit && allowDelete);

      let tinputs = this.form.querySelectorAll("input[name]");
      if (tinputs.length === 0) {
        tinputs = [this.form.querySelector("input")]
      }
      let inputs = [];
      for (let input of tinputs) {
        let ibox = new IBox(input, this);
        let name = ibox.name;
        inputs.push(ibox);

        if (edit) {
          let value = getPath(ibox.path, oldValue);
          ibox.value = value;
        }
      }


      let changed = false;
      let getValue = () => {
        changed = false;

        let data = {};
        for (let ibox of inputs) {
          let subv = ibox.value;
          if (subv === null) {
            data = subv;
          } else if (data !== null){
            if (subv !== "") {
              data = setPath(ibox.path, data, subv);
            }
            changed ||= ibox.changed;
          }
        }
        return data;
      }

      this.isSaveable = () => {
        let value = getValue();
        if (value != null) {
          if (!edit || changed) {
            this._value = value;
            return true;
          }
        }
        return false;
      }

      built = true;
    }

    return built;
  }


  get value(){
    return this._value;
  }
  async hide(v) {
    this.shown = v;
  }
  set shown(v) {
    this.style.setProperty("--hidden", v?0:1);
  }

  setIconClick(name, callback) {
    let icon = this.icons.querySelector(`[${name}]`);
    icon.onclick = callback;
    return () => {icon.onclick = null;}
  }
}

async function getFormData(formTemplate, oldData, allowDelete = true) {
  if (SelectedFormEditor != null) {
    return await SelectedFormEditor.getFormData(formTemplate, oldData, allowDelete);
  }
  return null;
}
SvgPlus.defineHTMLElement(FormEditor);

export {getFormData, setPath, getPath}
