const deconnexion = document.querySelector(".dec")
const div_list_users = document.querySelector(".users")
const ajouter_utilisateur = document.querySelector(".ajou")
const div_ajouter = document.querySelector(".divajout")
const div_edit = document.getElementById("div1")
const fermer_user = document.querySelector('.fa')
const btn_ajout_user = document.querySelector(".btn3")
const formulaire_add_user= document.querySelector(".formajou")
// const formulaire_edit_user = document.getElementById("form1")
const edit_user = document.getElementById("btn")



if (!localStorage.getItem("profil")|| localStorage.getItem("profil")=="utilisateur") {
    window.location.replace("indexapp.html")
}else if(localStorage.getItem("profil")=="admin"){
    deconnexion.addEventListener("click",()=>{
        localStorage.removeItem("profil")
        localStorage.removeItem("email")
        window.location.replace("indexapp.html")
    })
    fetch(`http://localhost:8000/info/utilisateur` ,{
        headers: {
            "Content-type" :"application/json charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
        }
})
    .then((rep) => rep.json())
    .then((rep) => {
        rep.forEach(element => {
            div_list_users.innerHTML +=`
    <div class="user1">
        <h3 class="h3">${element["nom"]}</h3>
        <h3 class="h3e">${element["email"]}</h3>
        <button type="button" class="btnmodif">Modifier</button>
        <button type="button" class="btnsup">Suprrimer</button>
        <button type="button" class="btnarbre">Arbre</button>

     </div>`
    btnModif()
})
        })
        ajouter_utilisateur.addEventListener("click",()=>{
            visible(div_ajouter,div_list_users)
            btn_ajout_user.style.visibility="visible"
        })
        fermer_user.addEventListener("click",()=>{
            formulaire_add_user["nom"].value=""
            formulaire_add_user["email"].value=""
            invisible(div_ajouter,div_list_users)
            edit_user.style.visibility="hidden"
            btn_ajout_user.style.visibility="hidden"


        })
        btn_ajout_user.addEventListener("click",(e)=>{

            fetch(`http://localhost:8000/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({email:formulaire_add_user["email"].value, nom:formulaire_add_user["nom"].value ,pwd:formulaire_add_user["pwd"]}),
            });
            e.preventDefault()
                div_list_users.innerHTML +=`
                <div class="user1">
                    <h3 class="h3">${formulaire_add_user["nom"].value}</h3>
                    <h3 class="h3e">${formulaire_add_user["email"].value}</h3>
                    <button type="button" class="btnmodif">Modifier</button>
                    <button type="button" class="btnsup">Suprrimer</button>
                    <button type="button" class="btnarbre">Arbre</button>

                </div>
            `
            invisible(div_ajouter,div_list_users)
            edit_user.style.visibility="hidden"
            btn_ajout_user.style.visibility="hidden"

            
            btnModif()
            window.location.reload();

            
                    })
}



function visible(p1,p2) {
    p1.style.visibility= "visible"
    p2.style.opacity="0.2"
}
function invisible(p1,p2) {
    p1.style.visibility= "hidden"
    p2.style.opacity="1"
}
function btnModif() {

    inputs = formulaire_add_user.querySelectorAll('input[type="text"]')

            inputs.forEach(item =>{
                item.value = ''
            })
            const list_btn_edit_user = document.querySelectorAll(".btnmodif")
            list_btn_edit_user.forEach(btn_edit_user => {
                btn_edit_user.addEventListener('click',(e)=>{
                    const email2= e.target.parentNode.querySelector(".h3e").innerText
                    

                    btn_ajout_user.style.visibility="hidden"
                    edit_user.style.visibility="visible"

                        e.preventDefault()
                        const div= e.target.parentNode
                        div_edit.style.visibility="visible"
                        div_list_users.style.opacity="0.3" 
                        document.querySelector(".email").value=div.querySelector(".h3e").innerText
                        document.querySelector(".name").value=div.querySelector(".h3").innerText
                        div.classList.add('active') 
                        edit_user.addEventListener('click',(even)=>{
                            
                        even.preventDefault()
                        let divActive = document.querySelector('.active')
                        const formulaire_edit_user = even.target.parentNode
                        divActive.querySelector(".h3e").innerText=formulaire_edit_user["email"].value
                        divActive.querySelector(".h3").innerText=formulaire_edit_user["nom"].value
                        fetch(`http://localhost:8000/user/${email2}`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({email:formulaire_edit_user["email"].value, nom:formulaire_edit_user["nom"].value}),
                      });
                        div_edit.style.visibility="hidden"
                        div_list_users.style.opacity="1" 
                        edit_user.style.visibility="hidden"

                        divActive.classList.remove('active')
                        formulaire_edit_user["email"].value=""
                        formulaire_edit_user["nom"].value=""
                })
            });
})
const list_btn_delete_user = document.querySelectorAll(".btnsup")
list_btn_delete_user.forEach(liste_delete => {
    liste_delete.addEventListener("click",(e)=>{
        if (window.confirm(`veut tu vraiment supprimer l'utilisateur ${e.target.parentNode.querySelector(".h3").innerText}`)) {
            const email1= e.target.parentNode.querySelector(".h3e").innerText
        fetch(`http://localhost:8000/user/${email1}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            window.location.reload();
          }
        
            
    })
    
});
const list_arbre = document.querySelectorAll(".btnarbre") 

list_arbre.forEach(arbre_user => {
    arbre_user.addEventListener("click",(e)=>{
const email1= e.target.parentNode.querySelector(".h3e").innerText

        console.log("je click");
    localStorage.setItem("email", `${email1}`)
    window.location.href="famille.html"
    

    })
    
});

}
