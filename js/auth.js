/* auth.js - Handles auth, profile, friends, admin detection */
// Require: include firebase-app.js firebase-auth.js firebase-database.js firebase-storage.js in pages
const ADMIN_EMAIL = "proadmin@proton.me";
const db = firebase.database();
const auth = firebase.auth();

function signup(email, password, displayName){
  return auth.createUserWithEmailAndPassword(email, password).then(cred=>{
    const u = cred.user;
    db.ref('users/'+u.uid).set({ email:u.email, name: displayName||u.email.split('@')[0], created: Date.now() });
    return u;
  });
}

function login(email, password){
  return auth.signInWithEmailAndPassword(email, password);
}

function logout(){
  return auth.signOut();
}

function requireAuth(redirectTo='index.html'){
  return new Promise(resolve=>{
    auth.onAuthStateChanged(user=>{
      if(!user){ window.location.href = redirectTo; resolve(null); }
      else resolve(user);
    });
  });
}

function isAdmin(user){
  if(!user) return Promise.resolve(false);
  const key = user.email.replace(/\./g,'_');
  return db.ref('admins/'+key).once('value').then(snap=>!!snap.val());
}

// ensure proadmin is registered in admins (create if missing)
function ensureProAdminExists(){
  const key = ADMIN_EMAIL.replace(/\./g,'_');
  db.ref('admins/'+key).set(true);
}

// helper to sanitize email to key
function emailKey(email){ return email.trim().toLowerCase().replace(/\./g,'_'); }
