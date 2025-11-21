/* global_apply.js - loads siteCustom from DB or localStorage and applies */
(async function(){
  try{
    if(typeof firebase === 'undefined') return;
    const db = firebase.database();
    // try DB first (admin saved)
    const snap = await db.ref('siteCustom').once('value');
    let data = snap.val() || JSON.parse(localStorage.getItem('siteCustom')||'{}');
    if(data.bgUrl) document.body.style.backgroundImage = 'url('+data.bgUrl+')';
    if(data.accentColor) document.documentElement.style.setProperty('--accent', data.accentColor);
    if(data.logoUrl){
      var img = document.querySelector('.site-logo');
      if(img) img.src = data.logoUrl;
    }
    if(data.siteTitle){
      var el = document.querySelector('.site-title');
      if(el) el.textContent = data.siteTitle;
      document.title = data.siteTitle || document.title;
    }
  }catch(e){ console.error(e); }
})();