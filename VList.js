import {SvgPlus} from './SvgPlus.js'

class VList extends SvgPlus{
  constructor(name, list, ItemClass){
    super('DIV');

    this.props = {class: 'v-list'}
    this.ItemClass = ItemClass;

    this._headerElement = this.createChild('DIV');
    this._headerElement.props = {class: 'header'}

    this._listElement = this.createChild('DIV')
    this._listElement.props = {
      class: 'list',
      style: {
        overflow: "hidden"
      }
    }

    this._headerTitle = this.createChildOfHead('H1');
    // this._headerTitle.styles = { 'font-size': '1em'}

    this._headerTitle.ondblclick = (e) => {
      this.ontitledblclick(e)
    }

    this._headerTitle.onclick = (e) => {
      this.ontitleclick(e)
    }

    //Instantiate private variables
    this._name = null;
    this._open = true;
    this._moving = false;

    this.name = name;
    this.list = list;
    this.transistionName = 'linearMove'
  }

  //Runs a method using the event bus
  runEvent(eventName, params){
    if ( this.master == null ) return;
    if ( typeof this.master === 'object' ) {
      if ( eventName in this.master ) {
        if ( this.master[eventName] instanceof Function ){
          this.master[eventName](params);
        }
      }
    }
  }

  clear(){
    this._listElement.innerHTML = "";
  }

  async addElement(element){
    if (element instanceof Element){
      let height = this.height;
      this._listElement.styles = {
        height: `${height}px`
      }
      this._listElement.appendChild(element);
      let dh = this.height - height;
      await this.waveTransistion((t) => {
        this._listElement.styles = {
          height: `${height + dh*t}`
        }
      }, 500, true)
      this._listElement.styles = {
        height: 'auto'
      }
    }
  }

  removeElement(element){
    if (element instanceof Element && this._listElement.contains(element)){
      this._listElement.removeChild(element);
    }
  }

  ontitleclick(){
    this.open = !this.open
  }

  ontitledblclick(){
  }

  //Creates a child in the header
  createChildOfHead(name){
    return this._headerElement.createChild(name);
  }

  //Appends a child to the header
  appendChildToHead(element){
    return this._headerElement.appendChild(element);
  }

  //Removes a child from the header
  removeChildFromHead(element){
    if (this._headerElement.contains(element)){
      this._headerElement.remove(element);
    }
  }

  //Clears head
  clearHead(){
    this._headerElement.innerHTML = "";
    this.appendChildToHead(this._headerTitle);
  }

  async show(){
    let height = this.height;
    this._moving = true;
    await this.waveTransistion((t) => {
      this._listElement.styles = {
        height: `${t*height}px`
      }
    }, 500, true)
    this._listElement.styles = {
      height: 'auto'
    }
    this._moving = false;
  }

  async hide(){
    this._moving = true;
    let height = this.height;
    await this.waveTransistion((t) => {
      this._listElement.styles = {
        height: `${t*height}px`
      }
    }, 500, false)
    this._moving = false;
  }

  showAll(){

  }

  get moving() {return this._moving}

  set ItemClass(ItemClass) {
    if (ItemClass instanceof Function && ItemClass.prototype instanceof SvgPlus) {
      let string = (`${ItemClass}`);
      const match = string.match(/^\s*class\s*(\w*)/)
      if (match[1]) {
        let name = match[1];
        name = name.replace(/(\w)([A-Z])/g, "$1-$2").toLowerCase();
        this.class = "v-list " + name;
      }
      this._ItemClass = ItemClass
    }else{
      this._ItemClass = null
    }
  }

  get ItemClass(){ return this._ItemClass}

  set list(list){
    if (!Array.isArray(list)) return;
    if (this.ItemClass != null) {
      for (let item of list){
        this.addElement(new this.ItemClass(item))
      }
    }
  }

  set open(val){
    if (this.moving) return;
    if (val){
      this.show();
      this._open = true;
    }else{
      this.hide();
      this._open = false;
    }
  }
  get open(){
    return this._open;
  }

  get height(){
    let bbox = this._listElement.scrollHeight;
    return bbox;
  }

  //Set and get the list name
  set name(name){
    this._name = null;
    this._headerTitle.innerHTML = "";

    if (typeof name !== 'string') return;

    this._headerTitle.innerHTML = name;
    this._name = name;
  }
  get name(){
    return this._name;
  }
}

export {VList}
