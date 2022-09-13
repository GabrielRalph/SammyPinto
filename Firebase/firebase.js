import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js'
import {getDatabase, child, push, ref, update, get, onValue, onChildAdded, onChildChanged, onChildRemoved, set, off} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js'
import {getAuth, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'


const CONFIG = {
  apiKey: "AIzaSyDG7HtXuGYku45FGch3fQoy-Nn1t7cUGLc",
  authDomain: "sammy-pinto-ad658.firebaseapp.com",
  databaseURL: "https://sammy-pinto-ad658-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sammy-pinto-ad658",
  storageBucket: "sammy-pinto-ad658.appspot.com",
  messagingSenderId: "48268231630",
  appId: "1:48268231630:web:073cf9fb1c2b1ebcb1619f",
  measurementId: "G-93V142XW57"
};
let App = null;
let Database = null;
let Auth = null;
let Resume = {};
let UserUID, User;

export function initializeDatabase(){
  if (App === null) {
    App = initializeApp(CONFIG);
    Database = getDatabase(App);
    onValue(ref(Database, "resume"), (e) => {
      Resume = e.val();
      resumeUpdate(Resume);
    })
  }
}

export function initializeAuth(){
  if (Auth === null) {
    console.log("%cinit-auth", "color: orange");
    Auth = getAuth();
    onAuthStateChanged(Auth, async (userData) => {
    let uid = null;
    User = userData;
    console.log("%cauth-state-change " + (User !== null), "color: orange");
    if (User != null) {
      uid = User.uid;
      if (uid !== UserUID) {
        console.log("admin/" + uid);
        let aref = ref(Database, "admin/" + uid)
        let isAdmin = (await get(aref)).val();
        if (isAdmin === null) {
          await set(aref, false);
        }
        User.isAdmin = isAdmin;
      }
    }
    if (UserUID !== uid) {
      UserUID = uid;
      userUpdate(User);
    }
  });
  }
}


// on user listener
let listenerCount = 0;
let onuserscallbacks = {};
export function addUserListener(callback) {
  let detatch = null;
  if (callback instanceof Function) {
    let lc = listenerCount;
    onuserscallbacks[lc] = callback;
    detatch = function () {
      delete onuserscallbacks[lc];
    }
    listenerCount++;
  }
  return detatch;
}
function userUpdate(user){
  for (let id in onuserscallbacks) {
    onuserscallbacks[id](user);
  }
}

let listenerCount2 = 0;
let onresumecallbacks = {};
export function addResumeListener(callback) {
  let detatch = null;
  if (callback instanceof Function) {
    let lc = listenerCount2;
    onresumecallbacks[lc] = callback;
    detatch = function () {
      delete onresumecallbacks[lc];
    }
    listenerCount2++;
    callback(Resume);
  }
  return detatch;
}
function resumeUpdate(resume){
  for (let id in onresumecallbacks) {
    onresumecallbacks[id](resume);
  }
}

export function signin(){
  if (Auth != null) {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(Auth, provider);
  }
}

export function signout(){
  if (Auth != null) {
    signOut(Auth);
  }
}

export function save(data) {
  if (User != null && User.isAdmin){
    set(ref(Database, "resume"), data);
  }
}
