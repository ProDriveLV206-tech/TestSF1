/* admin.js - admin commands using Firebase Realtime Database */
const db = firebase.database();
const auth = firebase.auth();

// Checks admin status before running sensitive actions
async function requireAdminOrRedirect(){
  const user = auth.currentUser;
  if(!user) { alert('Not logged in'); location.href='index.html'; return false; }
  const isAdmin = await db.ref('admins/'+user.email.replace(/\./g,'_')).once('value');
  if(!isAdmin.val()){ alert('Access denied. Not admin.'); location.href='index.html'; return false; }
  return true;
}

// Core actions
async function clearChat(room='global'){
  if(!await requireAdminOrRedirect()) return;
  await db.ref('chatrooms/'+room+'/messages').remove();
  logAdmin('clearChat '+room);
  alert('Cleared chat room '+room);
}

async function deleteMessage(room, msgKey){
  if(!await requireAdminOrRedirect()) return;
  await db.ref('chatrooms/'+room+'/messages/'+msgKey).remove();
  logAdmin('deleteMessage '+room+' '+msgKey);
  alert('Deleted message');
}

async function banUser(email){
  if(!await requireAdminOrRedirect()) return;
  const k = email.replace(/\./g,'_');
  await db.ref('banned/'+k).set(true);
  logAdmin('ban '+email);
  alert('Banned '+email);
}

async function unbanUser(email){
  if(!await requireAdminOrRedirect()) return;
  const k = email.replace(/\./g,'_');
  await db.ref('banned/'+k).remove();
  logAdmin('unban '+email);
  alert('Unbanned '+email);
}

async function muteUser(email){
  if(!await requireAdminOrRedirect()) return;
  const k = email.replace(/\./g,'_');
  await db.ref('muted/'+k).set(true);
  logAdmin('mute '+email);
  alert('Muted '+email);
}

async function unmuteUser(email){
  if(!await requireAdminOrRedirect()) return;
  const k = email.replace(/\./g,'_');
  await db.ref('muted/'+k).remove();
  logAdmin('unmute '+email);
  alert('Unmuted '+email);
}

async function kickUser(email){
  if(!await requireAdminOrRedirect()) return;
  // set force logout flag which clients should listen to and sign out
  const k = email.replace(/\./g,'_');
  await db.ref('force_logout/'+k).set(true);
  logAdmin('kick '+email);
  alert('Kicked '+email);
}

async function globalAnnouncement(text){
  if(!await requireAdminOrRedirect()) return;
  await db.ref('global_announcements').push({text:text, ts:Date.now()});
  logAdmin('announce '+text);
  alert('Announcement sent');
}

// Role management
async function setRole(email, role){
  if(!await requireAdminOrRedirect()) return;
  const k = email.replace(/\./g,'_');
  await db.ref('roles/'+k).set(role);
  logAdmin('setRole '+email+' '+role);
  alert('Role set');
}

// UI customization - saves to /siteCustom so the global loader can pick up
async function setSiteCustomization(obj){
  if(!await requireAdminOrRedirect()) return;
  await db.ref('siteCustom').set(obj);
  logAdmin('setSiteCustomization '+JSON.stringify(obj));
  alert('Site customization saved');
}

// admin logs
function logAdmin(msg){
  const user = auth.currentUser;
  db.ref('admin_logs').push({by: user ? user.email : 'system', msg: msg, ts: Date.now()});
}

// view reports
async function viewReports(){
  if(!await requireAdminOrRedirect()) return;
  const snap = await db.ref('reports').once('value');
  return snap.val();
}
