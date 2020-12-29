class Experience extends SvgPlus{
  constructor(data){
    super('div');
    this.mode = "large";
    this.data = data;
  }

  set data(val){
    if (typeof val !== "object") return;
    if ("title" in val && typeof val.title === "string") this.title = val.title;
    if ("location" in val && typeof val.location === "string") this.location = val.location;
    if ("role" in val && typeof val.role === "string") this.role = val.role;
    if ("date" in val && typeof val.date === "string") this.date = val.date;
    this.render();
  }

  render(){
    this[this.mode]();
  }

  large(){
    this.innerHTML = "";
    this.innerHTML += `<h3>
                          <b>${this.title}</b>, ${this.location} - <i>${this.role}</i>
                       </h3>
                       <p>${this.date}</p>`;

  }
}
class Education extends SvgPlus{
  constructor(data){
    super('div');
    this.mode = "large";
    this.data = data;
  }

  set data(val){
    if (typeof val !== "object") return;
    if ("title" in val && typeof val.title === "string") this.title = val.title;
    if ("location" in val && typeof val.location === "string") this.location = val.location;
    if ("qualifications" in val && typeof val.qualifications === "string") this.qualifications = val.qualifications;
    if ("date" in val && typeof val.date === "string") this.date = val.date;
    this.render();
  }

  render(){
    this[this.mode]();
  }

  large(){
    this.innerHTML = "";
    this.innerHTML += `<h3>
                          <b>${this.title}</b>, ${this.location} - <i>${this.qualifications}</i>
                       </h3>
                       <p>${this.date}</p>`;

  }
}
class Project extends SvgPlus{
  constructor(data){
    super('div');
    this.mode = "large";
    this.data = data;
  }

  set data(val){
    if (typeof val !== "object") return;
    if ("title" in val && typeof val.title === "string") this.title = val.title;
    if ("date" in val && typeof val.date === "string") this.date = val.date;
    if ("role" in val && typeof val.role === "string") this.role = val.role;
    if ("description" in val && typeof val.description === "string") this.description = val.description;
    if ("video" in val && typeof val.video === "string") this.video = val.video;
    this.render();
  }

  render(){
    this[this.mode]();
  }

  large(){
    this.innerHTML = "";
    this.innerHTML += `<h3>
                          <b>${this.title}(${this.date})</b> - <i>${this.role}</i>
                       </h3>
                       <p>${this.description}</p>
                `;

  }
}

class List extends SvgPlus{
  constructor(header, list){
    super('div');
    this.props = {
      class: "list"
    }
    this.header = `${header}`;
    this.list = list;
    this.expand = false;
  }

  render(){
    this.innerHTML = "";
    let head = this.createChild('H2');
    head.innerHTML = this.header;
    head.onclick = () => {
      this.expand = !this.expand;
      this.render();
    }
    let list = this.list;
    if (this.expand) return;
    if (list instanceof Array && this.elementParser instanceof Function){
      for (var i in list){
        let element = this.elementParser(list[i]);
        if (element instanceof Element){
          this.appendChild(element);
        }
      }
    }
  }
}

class Reference extends SvgPlus{
  constructor(reference){
    super('div');
    this.data = reference;
    this.props = {
      class: "references"
    }
  }
  set data(val){
    if (typeof val !== "object") return;
    if ("location" in val && typeof val.location === "string") this.location = val.location;
    if ("number" in val && typeof val.number === "string") this.number = val.number;
    if ("email" in val && typeof val.email === "string") this.email = val.email;
    if ("role" in val && typeof val.role === "string") this.role = val.role;
    if ("name" in val && typeof val.name === "string") this.name = val.name;
    this.render();
  }

  render(){
    this.innerHTML = "" + `<h3><b>${this.name}</b>, ${this.location} - <i>${this.role}</h3>
                           <p>${this.email}<br />
                           ${this.number}
                           </p>`;
  }
}

class Contacts extends SvgPlus{
  constructor(contacts){
    super('div');
    this.data = contacts;
  }

  set data(val){
    if (typeof val !== "object") return;
    if ("address" in val && typeof val.address === "string") this.address = val.address;
    if ("number" in val && typeof val.number === "string") this.number = val.number;
    if ("email" in val && typeof val.email === "string") this.email = val.email;
    if ("instagram" in val && typeof val.instagram === "string") this.instagram = val.instagram;
    this.render();
  }

  render(){
    this.innerHTML = "";
    this.createChild('H5').innerHTML = this.address;
    this.createChild('H5').innerHTML = this.number;
    this.createChild('H5').innerHTML = this.email;
    this.createChild('H5').innerHTML = this.instagram;
  }
}

class Resume extends SvgPlus{
  constructor(sammy){
    super('div');
    this.sammy = sammy;
  }

  set sammy(sammy){
    if(sammy instanceof Sammy){
      this._sammy = sammy;
      this.render(this.mode)
    }
  }
  get sammy(){
    return this._sammy;
  }

  renderExperiences(){
    let list =  new List('Experiences', this.sammy.experiences);
    list.elementParser = (experience) => {
      return new Experience(experience);
    }
    list.render();
    return list;
  }

  renderProjects(){
    let list =  new List('Projects', this.sammy.projects);
    list.elementParser = (project) => {
      return new Project(project);
    }
    list.render();
    return list;
  }

  renderEducation(){
    let list =  new List('Education', this.sammy.education);
    list.elementParser = (education) => {
      return new Education(education);
    }
    list.render();
    return list;
  }

  renderReferences(){
    let table = this.createChild('TABLE');
    table.props = {
      class: "references"
    }
    let tbody = table.createChild('TBODY');
    tbody.createChild('TR').createChild('TD').createChild('H2').innerHTML = "Reference"

    if (sammy.references.length == 0) return;

    for (var i = 0; i < Math.floor(sammy.references.length/2); i++){
      let row = tbody.createChild('TR');
      let c1 = row.createChild('TD').appendChild(new Reference(sammy.references[i]));
      if (i + 1 < sammy.references.length){
        let c2 = row.createChild('TD').appendChild(new Reference(sammy.references[i]));
      }
    }
  }

  renderList(listName, header, el){
    let array = this.sammy[listName];
    if (!(array instanceof Array)) return;
    let header_el = el.createChild('H2');
    header_el.innerHTML = header;
    for (var i in array){
      el.createChild('H4').innerHTML = array[i];
    }
  }

  render(mode){
    this.innerHTML = "";
    let table = this.createChild('TABLE').createChild('TBODY');
    let tr = table.createChild('TR');
    let c1 = tr.createChild('TD');
    c1.createChild('H1').innerHTML = "Sammy Pinto";
    let c2 = tr.createChild('TD');
    c2.appendChild(new Contacts(this.sammy.contacts))
    tr = table.createChild('TR');
    c1 = tr.createChild('TD');
    c2 = tr.createChild('TD');

    c1.appendChild(this.renderEducation());
    c1.appendChild(this.renderExperiences());
    c1.appendChild(this.renderProjects());
    this.renderList('filmRoles', 'Film Roles', c2);
    this.renderList('awards', 'Awards', c2);
    this.renderList('qualifications', 'Qualifications', c2);
    this.renderReferences();
    this.createChild('H6').innerHTML = "Designed & coded by Gabriel Ralph"
  }
}
