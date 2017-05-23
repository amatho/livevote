import * as firebase from 'firebase/app';

import 'firebase/database';

const config = {
  apiKey: "AIzaSyBvDzg5tUq8nQC8TmPzFGmRQYzl3IvbI9Y",
  authDomain: "livevote2.firebaseapp.com",
  databaseURL: "https://livevote2.firebaseio.com",
  projectId: "livevote2",
  storageBucket: "livevote2.appspot.com",
  messagingSenderId: "71563963470"
};

firebase.initializeApp(config);

const db = firebase.database();

function readAtPath(path, event, cb) {
  db.ref(path).on(event, cb);
}

function readAtPathOnce(path, event, cb) {
  db.ref(path).once(event, cb);
}

function transactionAtPath(path, cb) {
  db.ref(path).transaction(cb);
}

function setAtPath(path, val) {
  db.ref(path).set(val);
}

function searchAtPathOnce(path, event, child, query, cb) {
  db.ref(path)
    .orderByChild(child)
    .startAt(query)
    .endAt(`${query}\uf8ff`)
    .once(event, cb)
}

function pushAtPath(path, obj) {
  db.ref(path).push(obj);
}

export {
  readAtPath,
  readAtPathOnce,
  transactionAtPath,
  setAtPath,
  searchAtPathOnce,
  pushAtPath
};
