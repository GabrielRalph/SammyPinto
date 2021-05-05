import {SvgPlus} from './SvgPlus.js'
import {Experience, Project, Education, ListH4, Contacts, Reference} from './ItemTemplates.js'
import {VList} from './VList.js'


class Resume extends SvgPlus{
  constructor(data){
    super('DIV');
    let row = this.createChild("TABLE").createChild("TBODY").createChild("TR");
    this.columnA = row.createChild("TD");
    this.columnB = row.createChild("TD");

    this.data = data;
  }

  clear(){
    this.columnA.innerHTML = ""
    this.columnB.innerHTML = ""
  }

  set data(data){
    this.clear();
    this.columnA.createChild("H1").innerHTML = data.name
    this.columnA.appendChild(new VList("Education", data.educations, Education))
    this.columnA.appendChild(new VList("Experiences", data.experiences, Experience))
    this.columnA.appendChild(new VList("Projects", data.projects.sort((a, b) => {
      let dateA = new Date (a.dateOrder);
      let dateB = new Date (b.dateOrder);
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    }), Project))
    this.columnA.appendChild(new VList("References", data.references, Reference))

    this.columnB.appendChild(new Contacts(data.contacts))
    this.columnB.appendChild(new VList("Film Roles", data.filmRoles, ListH4))
    this.columnB.appendChild(new VList("Awards", data.awards, ListH4))
    this.columnB.appendChild(new VList("Qualifications", data.qualifications, ListH4))
  }
}

export {Resume}
