const deconnexion = document.querySelector(".dec")
const user = document.getElementById("user")
const email = localStorage.getItem("email")
const profil = localStorage.getItem("profil")


console.log(email)


window.onload = async ()=>{
    if(!profil){
        window.location.replace('indexapp.html')
    }
    deconnexion.addEventListener("click",()=>{
        window.location.replace("utilisateur.html")
    })

    let response = await fetch(`http://localhost:8000/infos/${email}`, {
        method: "GET",
        headers:{
            "Content-type" :"application/json charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
        }

    })

    let data = await response.json()

    user.innerHTML += `<h3>${data.nom}</h3>`


    let familles = await fetch(`http://localhost:8000/addmember/add/${email}`, {
                    method: "GET",
                    headers: {
                        "Content-type" :"application/json charset=UTF-8",
                        "Access-Control-Allow-Origin":"*"
                    }
                })
    let membres = await familles.json()

    membres.forEach(item => {
        let item_key = Object.keys(item)[0]
        console.log(item[item_key], item_key)
        document.querySelector(`div.${item_key}`).innerHTML += `<h6>${item[item_key].prenom}</h6>`
    })
}



// window.onload = ()=>{
//     if (!localStorage.getItem("profil")){
//         window.location.replace("indexapp.html")
//     }else{
//         deconnexion.addEventListener("click",()=>{
//             window.location.replace("utilisateur.html")
//         })
    
//     fetch(`http://localhost:8000/infos/${email}`, {
//         headers: {
//             "Content-type" :"application/json charset=UTF-8",
//             "Access-Control-Allow-Origin":"*"
//         }
//     })
//             .then((rep) => rep.json())
//             .then((rep) => {
    
//                 user.innerHTML += `<h3>${rep["nom"]}</h3>`
                
//             })
    
//     fetch(`http://localhost:8000/addmember/add/${email}`, {
//             headers: {
//                 "Content-type" :"application/json charset=UTF-8",
//                 "Access-Control-Allow-Origin":"*"
//             }
//     })
//             .then((rep) => rep.json())
//             .then((rep) => {
//                 console.log(rep)
//             })
//      }
// }