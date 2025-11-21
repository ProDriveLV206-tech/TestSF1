/* client_helpers.js */
const db = firebase.database();
const auth = firebase.auth();

// apply admin saved site customization to localStorage for legacy pages
db.ref('siteCustom').on('value', snap=>{ const v = snap.val(); if(v) localStorage.setItem('siteCustom', JSON.stringify(v)); });

// presence: set online and lastSeen
auth.onAuthStateChanged(user=>{
  if(!user) return;
  const key = user.email.replace(/\./g,'_');
  const ref = db.ref('users/'+user.uid+'/presence');
  ref.set({online:true, lastSeen: Date.now()});
  ref.onDisconnect().set({online:false, lastSeen: Date.now()});
  // listen for force logout signal
  db.ref('force_logout/'+key).on('value', s=>{ if(s.val()){ alert('You were force-logged out by an admin'); auth.signOut(); } });
});
// check bans and mutes before sending messages
async function canSend(email){
  const k = email.replace(/\./g,'_');
  const banned = (await db.ref('banned/'+k).once('value')).val();
  if(banned) return false;
  const muted = (await db.ref('muted/'+k).once('value')).val();
  if(muted) return false;
  const muteAll = (await db.ref('mute_all').once('value')).val();
  if(muteAll) return false;
  return true;
}
