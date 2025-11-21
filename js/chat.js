firebase.auth().onAuthStateChanged(user=>{
    if(!user){ window.location.href="index.html"; return; }
    const db=firebase.database().ref("messages");
    db.on("child_added",snap=>{
        const box=document.getElementById("chatBox");
        const d=document.createElement("div");
        d.textContent=snap.val().user+": "+snap.val().msg;
        box.appendChild(d);
    });
});

function sendMsg(){
    const msg=document.getElementById("msg").value;
    const user=firebase.auth().currentUser.email;
    firebase.database().ref("messages").push({user:user,msg:msg});
}
function reportMessage(id,from,text){firebase.database().ref('reports').push({id,from,text,ts:Date.now()});alert('Reported');}
