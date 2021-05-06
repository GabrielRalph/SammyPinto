import {SvgPlus} from './SvgPlus.js'
import {Experience, Project, Education, ListH4, Contacts, Reference} from './ItemTemplates.js'
import {VList} from './VList.js'


class Resume extends SvgPlus{
  constructor(data){
    super('DIV');
    this.class = "resume"
    this.makeVideo();
    this.bg = 0;

    this.table = this.createChild("TABLE")
    this.table.onwheel = (e) => {
      this.fader(e)
    }
    let row = this.table.createChild("TBODY").createChild("TR");
    this.columnA = row.createChild("TD");
    this.columnB = row.createChild("TD");

    this.data = data;
    window.scrollTo(0,0)
  }

  makeVideo(){
    let video = this.createChild("video");
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.props = {
      style: {
        position: 'fixed',
        top: "-18%",
        left: "50%",
        right: "0",
        bottom: "0",
        'z-index': '-1',
        'height': `max(135vh, ${135*665/1183}vw)`,
        transform: 'translate(-50%, 0)'
      }
    }
    // video.oncanplay = () => {
    //   document.body.onmousemove = ()=>{
    //     console.log('x');
    //     video.play()
    //     document.body.onmousemove = null;
    //   }
    // }
    video.createChild("source").props = {
      src:"./Sober.mp4",
      type: "video/mp4"
    }
  }

  fader(e){
    let box = this.table.getBoundingClientRect();
    this.bg = (50-box.y)/window.innerHeight;
    this.styles = {
      background: `rgba(255,255,255, ${this.bg > 1 ? 1 : this.bg})`,
    }
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

  onscrl
}

export {Resume}
