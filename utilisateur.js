const deconnexion = document.querySelector(".dec")
const nom = document.getElementById("name")
const divname = document.getElementById("divname")
const divemail = document.getElementById("email")
const addmembre = document.querySelector(".addmembre")
const corps = document.querySelector(".main-body")
const fermer = document.getElementById("fermerfamille")
const fermerEdit = document.getElementById("fermer")
const modifier = document.querySelector(".edituser")
const arbre = document.querySelector(".arbre")
const divajoufamille = document.querySelector(".divajoutfamille")
const name_add_family = document.querySelector("#namefamily")
const address_add_family = document.querySelector("#addressfamily")
const lien_add_family = document.querySelector("select")












if (!localStorage.getItem("profil") || localStorage.getItem("profil") == "admin") {
    window.location.replace("indexapp.html")
} else if (localStorage.getItem("profil") == "utilisateur") {
    localStorage.setItem("message", "disponible")
    deconnexion.addEventListener("click", () => {
        localStorage.removeItem("profil")
        localStorage.removeItem("email")
        window.location.replace("indexapp.html")
    })
    fetch(`http://localhost:8000/infos/${localStorage.getItem("email")}`)
        .then((rep) => rep.json())
        .then((rep) => {
            nom.innerText = rep["nom"]
            divname.innerText = rep["nom"]
            divemail.innerText = rep["email"]
            sexe.innerText = rep["sexe"]
                profession.innerText = rep["profession"]
                phone.innerText = rep["phone"]
                address.innerText = rep["address"]
        })
    const msg = document.getElementById("message")
    msg.addEventListener("click", () => {
        window.location.href = "message.html"
    })
    addmembre.addEventListener("click", () => {
        visible(divajoufamille, corps)
        fermer.addEventListener("click", () => {
            invisible(divajoufamille, corps)
        })
        const ajouter = document.getElementById("btnAjout")
        ajouter.addEventListener("click", (e) => {
            e.preventDefault()
            data={
                "name":name_add_family.value,
                "address": address_add_family.value ,
                "lien":lien_add_family.options[lien_add_family.selectedIndex].value
            }
            
            fetch(`http://localhost:8000/addmember/${localStorage.getItem("email")}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "nom":name_add_family.value,
                    "address": address_add_family.value ,
                    "lien":lien_add_family.options[lien_add_family.selectedIndex].value
                }),
              });
              console.log("j'ajoute")
        })
    })
    modifier.addEventListener("click", () => {
        formuEdit = document.querySelector(".formajou")
        const divajout = document.querySelector(".divajout")
        visible(divajout, corps)
        fermerEdit.addEventListener("click", () => {
            invisible(divajout, corps)
        })
        fetch(`http://localhost:8000/infos/${localStorage.getItem("email")}`)
            .then((rep) => rep.json())
            .then((rep) => {
                console.log(rep)
                formuEdit["email"].value = rep["email"]
                formuEdit["nom"].value = rep["nom"]
                formuEdit["sexe"].value = rep["sexe"]
                formuEdit["profession"].value = rep["profession"]
                formuEdit["phone"].value = rep["phone"]
                formuEdit["address"].value = rep["address"]

            })
        const edit = document.getElementById("btnEdit")
        edit.addEventListener("click", (even) => {
            fetch(`http://localhost:8000/edit/${localStorage.getItem("email")}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formuEdit["email"].value, nom: formuEdit["nom"].value, phone: formuEdit["phone"].value, sexe: formuEdit["sexe"].value, address: formuEdit["address"].value, profession: formuEdit["profession"].value },),
            })
            

            fetch(`http://localhost:8000/infos/${localStorage.getItem("email")}`)
            .then((rep) => rep.json())
            .then((rep) => {
                console.log(rep)
                nom.innerText = rep["nom"]
                divname.innerText =rep["nom"]
                divemail.innerText= rep["email"]
                sexe.innerText = rep["sexe"]
                profession.innerText = rep["profession"]
                phone.innerText = rep["phone"]
                address.innerText = rep["address"]

            })
            console.log(divname)
            even.preventDefault()
            invisible(divajout, corps)
            window.location.reload();
        })
    })

    arbre.addEventListener("click", () => {
        window.location.href = "famille.html"
    })

}
function visible(p1, p2) {
    p1.style.visibility = "visible"
    p2.style.opacity = "0.2"
}
function invisible(p1, p2) {
    p1.style.visibility = "hidden"
    p2.style.opacity = "1"
}




