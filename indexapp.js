const btn = document.getElementById("btn")
btn.addEventListener("click",(e)=>{
    e.preventDefault()
    const username = document.querySelector(".username").value
    const pwd = document.querySelector(".pwd").value
    fetch(`http://localhost:8000/user/${username}` , {
        headers: {
            "Content-type" :"application/json charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
        },
        method: "GET"
})
        .then((rep) => rep.json())
        .then((rep) => {

            if (pwd==rep[0]["pwd"]) {
                document.getElementById("msg").innerText=""
                localStorage.setItem("profil", `${rep[0]["profil"]}`)
                localStorage.setItem("email", `${rep[0]["email"]}`)
                
                if (rep[0]["profil"]=="admin") {
                    window.location.href="pageadmin.html";
                }else{
                    window.location.href="utilisateur.html";
                }
                
            }else{
                localStorage.removeItem("profil")
                localStorage.removeItem("email")
                document.getElementById("msg").innerText="mot de passe incorrect ou utilisateur incorrect"
            }
           })
          

})