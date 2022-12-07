import {SvgPlus} from "../SvgPlus/4.js"
import {getFormData, getPath, setPath} from "./form-editor.js"

function checkObjDiff(obj1, obj2) {
  let different = true;
  if (typeof obj1 === typeof obj2) {
    different = false;
    if (typeof obj1 === "object") {
      let keys1 = Object.keys(obj1);
      let keys2 = Object.keys(obj2);
      let keySet1 = new Set(keys1)
      let keySet2 = new Set(keys2);
      let int1 =  keys1.filter((key => !keySet2.has(key)));
      let int2 =  keys2.filter((key => !keySet1.has(key)));
      let exclusion = int1.concat(int2);

      if (exclusion.length == 0) {
        for (let key of keys1) {
          different ||= checkObjDiff(obj1[key], obj2[key]);
        }
      } else {
        different = true;
      }
    } else {
      different = obj1 !== obj2;
      if (different) {
      }
    }
  }

  return different;
}


class KeyElement extends SvgPlus {
  pathTo(element) {
    let path = [];

    let node = this;
    while (!element.isSameNode(node)) {
      let key = node.key;
      if (typeof key === "string" && key != "") {
        path.unshift(key);
      }
      node = node.parentNode;
    }

    return path;
  }

  setFromScope(element, data) {
    let value = getPath(this.pathTo(element), data);
    this.value = value;
  }
  getFromScope(element, data) {
    setPath(this.pathTo(element), data, this.value);
  }

  getValue(){
    return this._value;
  }
  setValue(value) {
    this._value = value;
  }

  get value(){
    return this.getValue();
  }
  set value(value){
    this.toggleAttribute("edited", false);
    this.setValue(value);
    this._value = this.value;
  }

  get key(){
    return this.getAttribute("key");
  }
  set key(value) {
    this.setAttribute("key", value);
  }

  get editable(){
    let node = this;
    while (node != document.body) {
      if (node.getAttribute("editable") != null) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
  get edited() {
    let diff = checkObjDiff(this.value, this._value);
    return diff;
  }

  update(node = this){
    node.toggleAttribute("edited", node.edited);
    const event = new Event("update");
    while (node) {
      node.dispatchEvent(event);
      node = node.parentNode;
    }
  }
}

class Item extends KeyElement{
  constructor(template, form, el = "item") {
    super(el);
    this.form = form;
    this.template = template;
  }

  async edit(){
    let data = await getFormData(this.form, this.value);
    let parent = this.parentNode;
    if (data === "delete") {
      this.remove();
      this.update(parent);
    } else if (data !== null) {
      this.setValue(data);
      this.update(parent);
    }
    return data;
  }

  render(data) {
    this.innerHTML = this.template.replace(/{(\w*){([^}]*)}}/g, (a, key, repstr) => {
      let value = key;
      if (typeof data === "string") {
        value = data;
      } else {
        if (key in data) {
          value = data[key];
        } else if (!key) {
          value = data;
        }
      }
      if (repstr) {
        if (value == null || value == "") {
          value = ""
        } else {
          value = repstr.replace(/%1/g, value);
        }
      }
      return value;
    });
  }

  getValue() {
    return this.data;
  }

  setValue(value){
    this.data = value;
    this.render(value);
  }

  onclick() {
    if (this.editable) {
      this.edit();
    }
  }
}

class ItemList extends KeyElement {
  onconnect(){
    let html = this.innerHTML;
    let templateEl = this.querySelector("template");
    let formEl = this.querySelector("form");
    this.template = templateEl.innerHTML;
    this.form = formEl.innerHTML;
    formEl.remove();
    templateEl.remove();
    this.head = this.innerHTML;
    this.clear();


  }



  sortChildren(){
    if (this.sortMethod instanceof Function) {
      if (this.sorting) return;
      this.sorting = true;
      window.requestAnimationFrame(() => {
        let items = [...this.items];
        console.log(items);
        items.sort(this.sortMethod);
        for (let item of items) {
          this.appendChild(item);
        }
        this.sorting = false;
      })
    }
  }

  addItem(data) {
    let item = new Item(this.template, this.form);
    item.value = data;
    item.key = this.itemCount;
    this.itemCount++;
    this.appendChild(item);
    this.sortChildren()
    return item;
  }

  clear(){
    this.itemCount = 0;
    this.innerHTML = "";
    this.createChild("div", {class: "head", content: this.head}).
    onclick = () => this.add();
  }

  get items(){
    let children = [...this.children];
    return {
      *[Symbol.iterator]() {
        for (let child of children) {
          if (SvgPlus.is(child, Item)) {
            yield child;
          }
        }
      }
    }
  }
  async add() {
    let data = await getFormData(this.form);
    if (data) {
      this.addItem(data);
      this.update();
    }
  }

  getValue() {
    let value = {};
    let idx = 0;
    for (let item of this.items) {
      value[idx] = item.value;
      idx++;
    }
    return value;
  }
  setValue(data) {
    this.clear();
    for (let key in data) {
      this.addItem(data[key]);
    }
  }
}

class ItemView extends Item {
  constructor(el) {
    super(null, null, el)
  }
  onconnect(){
    let template = this.querySelector("template");
    let form = this.querySelector("form");
    this.template = template.innerHTML;
    this.form = form.innerHTML;
    this.innerHTML = "";
  }

  async edit(){
    let data = await getFormData(this.form, this.value, false);
    if (data !== null) {
      this.setValue(data);
      this.update();
    }
  }
}


class DataFrame extends KeyElement {
  constructor(el){
    super(el);
  }

  get keyElements(){
    let lists = this.querySelectorAll("item-list");
    let items = this.querySelectorAll("item-view");
    let frames = this.querySelectorAll("data-frame");
    return {
      *[Symbol.iterator]() {
        for (let child of lists) yield child;
        for (let child of items) yield child;
        for (let child of frames) yield child;
      }
    }
  }


  setValue(value){
    for (let item of this.keyElements) {
      item.setFromScope(this, value);
    }
  }
  getValue(){
    let data = {};
    for (let item of this.keyElements) {
      item.getFromScope(this, data);
    }
    return data;
  }
}

SvgPlus.defineHTMLElement(ItemList)
SvgPlus.defineHTMLElement(ItemView)
SvgPlus.defineHTMLElement(DataFrame)
