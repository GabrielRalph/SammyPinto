import {SvgPlus} from './SvgPlus.js'

class Experience extends SvgPlus{
  constructor(exp){
    super("DIV")
    this.experience = exp;
  }

  get location(){return this._location}
  get role(){return this._role}
  get data(){return this._data}

  set experience(exp){
    this.title = exp.title;
    this._location = exp.location;
    this._role = exp.role;
    this._data = exp.data;

    let text = `<h3><b>${exp.title}</b>`
    if (exp.location) text += `, ${exp.location}`
    if (exp.role)text += ` - <i>${exp.role}</i>`
    text += `</h3>`
    if (exp.date) text += `<p>${exp.date}</p>`
    this.innerHTML = text;
  }
}

class Project extends SvgPlus{
  constructor(project){
    super("DIV")
    this.project = project;
  }

  get description(){return this._description}
  get role(){return this._role}
  get data(){return this._data}

  set project(exp){
    this.title = exp.title;
    this._description = exp.description;
    this._role = exp.role;
    this._data = exp.data;
    let text = `<h3><b>${exp.title}</b>`
    if (exp.data) text += `, ${exp.date}`
    if (exp.role) text += ` - <i>${exp.role}</i>`
    text += '</h3>'
    if (exp.description)
    text += `<p>${exp.description}</p>`
    this.innerHTML = text;
  }
}

class Education extends SvgPlus{
  constructor(project){
    super("DIV")
    this.project = project;
  }

  get qualification(){return this._qualification}
  get location(){return this._location}
  get data(){return this._data}

  set project(exp){
    this.title = exp.title;
    this._qualification = exp.qualification;
    this._location = exp.location;
    this._data = exp.data;
    let text = `<h3><b>${exp.title}</b>`
    if (exp.location)text += `, ${exp.location}`
    if (exp.qualification) text += ` - <i>${exp.qualification}</i>`
    text += '</h3>'
    text += `<p>${exp.date}</p>`

    this.innerHTML = text;
  }
}

class ListH4 extends SvgPlus{
  constructor(data){
    super("H4");
    this.innerHTML = data;
  }
}

class Contacts extends SvgPlus{
  constructor(contacts){
    super("DIV")
    this.class = "contacts"
    this.contacts = contacts;
  }

  set contacts(contacts){
    this.innerHTML = "";
    this.createChild("H5").innerHTML = `${contacts.address}<br />${contacts.city}`

    if (contacts.number) {
      let number = this.createChild("A")
      number.props = {href: `tel:${contacts.number.replace(/\s/g, "")}`};
      number.innerHTML = contacts.number
    }

    if (contacts.email) {
      let email = this.createChild("A")
      email.props = {href: `mailto:${contacts.email}`};
      email.innerHTML = contacts.email
    }

    for (let insta of contacts.instagram) {
      let instaLink = this.createChild("A")
      instaLink.props = {href: insta.link};
      instaLink.innerHTML = insta.name
    }
  }
}

class Reference extends SvgPlus{
  constructor(reference){
    super("DIV")
    this.reference = reference;
  }

  get name(){return this._name}
  get role(){return this._role}
  get location(){return this._location}
  get number(){return this._number}
  get email(){return this._email}

  set reference(ref){
    this._name = ref.name;
    this._role = ref.role;
    this._location = ref.location;
    this._number = ref.number;
    this._email = ref.email;
    let text = `
      <h3>
        <b>${ref.name}</b>`
    if (ref.location) text += `, ${ref.location}`;
    if (ref.role) text += ` - <i>${ref.role}</i>`;
    text += `</h3>`
    if (ref.email) text += `<a href = "mailto:${ref.email}">${ref.email}</a>`
    if (ref.number) text+=`<a href = "tel:${ref.number.replace(/\s/g, '')}">${ref.number}</a>`
    this.innerHTML = text;
  }
}


export {Experience, Project, Education, ListH4, Contacts, Reference}
