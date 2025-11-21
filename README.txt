Site upgrade completed.
To enable full functionality, do the following:
1) Replace the placeholders in js/firebase_init.js with your Firebase project config.
2) Deploy Realtime Database with rules allowing authenticated access, or configure rules.
3) Open the site, sign up a user with email proadmin@proton.me OR run in console:
   firebase.database().ref('admins').child('proadmin_proton_me').set(true);
   (or use the admin panel seed function if available)
4) Configure Storage if you want PFP uploads.
5) This build stores:
   - chatrooms/{room}/messages
   - dms/{room}/
   - users/{uid}/
   - friends/{uid}/
   - friend_requests/{key}/
   - banned/{email_key}, muted/{email_key}
   - admin_logs, siteCustom, global_announcements
