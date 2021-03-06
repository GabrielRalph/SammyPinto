import {SvgPlus} from './SvgPlus.js'
import {Experience, Project, Education, ListH4, Contacts, Reference} from './ItemTemplates.js'
import {VList} from './VList.js'


class Resume extends SvgPlus{
  constructor(data){
    super('DIV');
    this.class = "resume"
    // this.debug = this.createChild("div");
    // this.debug.styles = {
    //   position: "fixed",
    //   top: "0",
    //   left: "0",
    //   'z-index': 10,
    //   padding: '20px',
    //   'font-size': '50px',
    //   color: 'grey'
    // }
    this.box = this.createChild("DIV");
    this.box.class = "resume-box"
    this.table = this.box.createChild("TABLE");
    let link = this.createChild("A")
    link.innerHTML = `<svg viewBox="0 0 100 100" style = "height: 1.5em">
    	<path d="M63.6,16.5L63.6,16.5c0.8-3.8,3.1-7.9,14.1-7.9V2.1H35.6v6.4c10.4,0,15.6,0.6,14.9,8C30,19.1,11.7,33.1,8.1,50C4.6,66.8,16.8,80.8,36,83.5l0.1,0.1c-0.8,3.1-2.9,7.8-13.7,7.8l0,6.6l38.2,0l0-6.6c-5.5,0-13.3-0.2-11.7-7.3l0.1-0.5l0,0c20.7-2.4,39.4-16.5,43-33.6C95.7,33.1,83.3,19,63.6,16.5z M37.4,77.8L37.4,77.8c-11.9-3.1-18.9-14.3-16-27.8c2.9-13.5,14.7-24.8,28-27.8l0,0l-0.6,2.7l-6.3,29.9L37.4,77.8z M78.8,50.1c-2.9,13.7-15,25.2-28.5,28l0,0l0.5-2.3L57,46.6l3.4-15.5l1-4.7c0,0,0.5-1.7,1-4.2C74.5,25.1,81.6,36.5,78.8,50.1z"/>
    </svg>`
    link.styles = {
      display: 'block',
      'text-align': 'center'
    }
    link.href = "https://www.galetora.com"

    let row = this.table.createChild("TBODY").createChild("TR");
    this.columnA = row.createChild("TD");
    this.columnB = row.createChild("TD");


    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    }else{
    }
    this.makeVideo();
    this.data = data;
    window.scrollTo(0,0)
  }

  makeVideo(){
    this.bg = 0;
    this.table.styles = {
      'padding-top': '100vh'
    }
    this.table.onwheel = (e) => {
      this.fader(e)
      console.log("sc");
    }
    let next = () => {
      this.fader();
      window.requestAnimationFrame(next);
    }
    next();
    // let video = this.createChild("video");
    // video.autoplay = true;
    // video.muted = true;
    // video.loop = true;
    // video.playsinline = true;
    // video.props = {
    //   style: {
    //     position: 'fixed',
    //     top: "-18%",
    //     left: "50%",
    //     right: "0",
    //     bottom: "0",
    //     'z-index': '-1',
    //     'height': `max(135vh, ${135*665/1183}vw)`,
    //     transform: 'translate(-50%, 0)'
    //   }
    // }
    // video.oncanplay = () => {
    //   document.body.onmousemove = ()=>{
    //     console.log('x');
    //     video.play()
    //     document.body.onmousemove = null;
    //   }
    // }
    // video.createChild("source").props = {
    //   src:"./Sober.mp4",
    //   type: "video/mp4"
    // }
  }

  fader(e){
    let box = this.table.getBoundingClientRect();
    this.bg = (50-box.y)/window.innerHeight;
    if (this.bg < 0) this.bg = 0;
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
