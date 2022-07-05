if(localStorage.getItem("message")){const retour = document.querySelector(".dec")

retour.addEventListener("click",()=>{
    window.location.href="utilisateur.html"
})
}else{
    localStorage.removeItem("profil")
    localStorage.removeItem("email")
    window.location.replace("indexapp.html")
}