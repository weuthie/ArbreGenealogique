
from flask import Flask ,render_template,jsonify,request
from flask_cors import CORS
from neo4j import GraphDatabase
from flask_socketio import SocketIO, send
import re


driver = GraphDatabase.driver(uri='neo4j://localhost:7687',auth=("neo4j","weuthie"))
session=driver.session()

api = Flask(__name__)
socketio = SocketIO(api, cors_allowed_origins="*")

CORS(api)

regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

def isValid(email):
    if re.fullmatch(regex, email):
      return True
    else:
      return False


@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)

@api.route('/')
def index():
    return render_template("index.html")


@api.route("/user/<person>")
def users(person):
    requet="match (weuz:Utilsateur) where weuz.archive = FALSE return weuz"
    requetes=session.run(requet)
    userss=requetes.data()
    print(userss)
    
    users = []
    for user in range(len(userss)):
        if person == userss[user]["weuz"]["email"]:
            user_db = {
             "email": userss[user]["weuz"]["email"],
             "pwd": userss[user]["weuz"]["pwd"],
             "profil":userss[user]["weuz"]["profil"]
                }
            users.append(user_db)
    return jsonify(users)

@api.route("/infos/<email>")
def info(email):
    requet="match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.email=$email return weuz"
    requetess=session.run(requet,email=email)
    requetes = requetess.data()

    user_db = {
            "email": requetes[0]["weuz"]["email"],
            "nom": requetes[0]["weuz"]["name"] ,
            "address":requetes[0]["weuz"]["address"] if 'address' in requetes[0]["weuz"] else None,
            "sexe":requetes[0]["weuz"]["sexe"] if 'sexe' in requetes[0]["weuz"] else None,
            "phone":requetes[0]["weuz"]["phone"] if 'phone' in requetes[0]["weuz"] else None,
            "profession":requetes[0]["weuz"]["profession"] if 'profession' in requetes[0]["weuz"] else None      
                }
    return jsonify(user_db), 200


@api.route('/info/utilisateur')  
def utilisateur():
    requetuser='match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.profil="utilisateur" return weuz'
    listuser = session.run(requetuser)
    datalistuser = listuser.data()
    data_users = []
    for user in range(len(datalistuser)):
        
        user_db = {
             "email": datalistuser[user]["weuz"]["email"],
             "nom": datalistuser[user]["weuz"]["name"],
                }
        data_users.append(user_db)
    return jsonify(data_users)

@api.route("/user" , methods=["POST"])
def add_user():
    requete_email='match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.profil="utilisateur" return weuz.email'
    list_email = session.run(requete_email)
    list_email = list_email.data()
    data_email = []
    for user in range(len(list_email)):
         data_email.append(list_email[user]["weuz.email"])

    email = request.json["email"]
    nom = request.json["nom"]
    pwd = request.json["pwd"]

    if email not in data_email and  isValid(email):
        requete_email_insert='CREATE (weuz:Utilsateur{name:$nom, email:$email ,pwd:"test123" ,profil:"utilisateur",archive:FALSE})'
        listuser = session.run(requete_email_insert,nom=nom,email=email)
        return "ok"
    else :
        return "ok" , 404

@api.route("/user/<email1>" , methods=["PATCH"] )
def update_user(email1):
    requete_email='match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.profil="utilisateur" return weuz.email'
    list_email = session.run(requete_email)
    list_email = list_email.data()
    data_email = []
    for user in range(len(list_email)):
        data_email.append(list_email[user]["weuz.email"])

    email2 = request.json["email"]
    nom = request.json["nom"]

    if isValid(email2):
        requete_email_insert='MATCH(weuz:Utilsateur) where weuz.email=$email1 set weuz.name=$nom set weuz.email=$email'
        listuser = session.run(requete_email_insert,email1=email1,nom=nom, email=email2)
    return "ok"


@api.route("/edit/<email1>" , methods=["PATCH"] )
def edit_user(email1):
    requete_email='match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.profil="utilisateur" return weuz.email'
    list_email = session.run(requete_email)
    list_email = list_email.data()
    data_email = []
    for user in range(len(list_email)):
        data_email.append(list_email[user]["weuz.email"])

    email2 = request.json["email"]
    nom = request.json["nom"]
    address = request.json["address"]
    sexe = request.json["sexe"]
    profession = request.json["profession"]
    phone = request.json["phone"]
    if isValid(email2):
        requete_email_insert='MATCH(weuz:Utilsateur) where weuz.email=$email1 set weuz.name=$nom set weuz.email=$email set weuz.sexe=$sexe set weuz.profession=$profession  set weuz.address=$address  set weuz.phone=$phone'
        listuser = session.run(requete_email_insert,email1=email1,nom=nom, email=email2,sexe=sexe,profession=profession,address=address ,phone=phone)
    return "ok"   

@api.route("/user/<email>" ,methods=["DELETE"])
def delete_user(email):
    requet_delete = "match (n:Utilsateur)  where n.email=$email set n.archive=True"
    user_delete = session.run(requet_delete, email=email)
    user_delete = user_delete.data()
    return "ok"


@api.route("/email/")
def Email():
    requete_email='match (weuz:Utilsateur) where weuz.archive=FALSE and weuz.profil="utilisateur" return weuz.email'
    list_email = session.run(requete_email)
    list_email = list_email.data()
    data_email = []
    for user in range(len(list_email)):
        data_email.append(list_email[user]["weuz.email"])
    return jsonify(data_email)

def relation_and_reciproque(lien):
    dataset = {
            'enfant':['EST_ENFANT_DE', 'EST_PARENT_DE', 'ENFANT'],
            'parent':['EST_PARENT_DE', 'EST_ENFANT_DE', 'PARENT'],
            'grandparent':['EST_GRDPERE_DE', 'EST_PTFILS_DE', 'GRANDPARENT'],
            'Freres':['EST_FRERE_DE', 'EST_FRERES_DE', 'FRERES']
    }
    return dataset.get(lien)


@api.route("/addmember/<user>" , methods=['POST'])
def add_member(user):
    nom = request.json["nom"]
    relation = relation_and_reciproque(request.json["lien"])[0]
    reciprok = relation_and_reciproque(request.json["lien"])[1]
    lien_parente = relation_and_reciproque(request.json["lien"])[0]
    address = request.json["address"]
    lien = request.json["lien"]
    query = """
        match (p:Utilsateur {email:"%s"})
        create (p) -[:%s]-> (x:MEMBER :%s {prenom: '%s', address: '%s', lien:'%s'})-[:%s]->(p) return p , x 
    """ % (user, reciprok, lien_parente, nom, address, lien, relation)
    add_member = session.run(query)

    return "ok"

@api.route("/addmember/add/<user>")
def affiche_member(user):
    query_enfant="""match(p:Utilsateur{email:'%s'}) --(x:EST_ENFANT_DE)
     return distinct x """ %(user)
    query_parent="""match(p:Utilsateur{email:'%s'}) --(x:EST_PARENT_DE) 
    return  distinct x""" %(user)
    query_frere="""match(p:Utilsateur{email:'%s'}) --(x:EST_FRERE_DE) 
    return distinct x""" %(user)
    query_grandparent="""match(p:Utilsateur{email:'%s'}) --(x:EST_GRDPERE_DE)
     return distinct  x""" %(user)
    data_enfant = session.run(query_enfant)
    data_parent = session.run(query_parent)
    data_frere = session.run(query_frere)
    data_gp = session.run(query_grandparent)
    data_users = []
    data_enfant = data_enfant.data()
    data_frere = data_frere.data()
    data_parent = data_parent.data()
    data_gp = data_gp.data()
    for user in range(len(data_enfant)):
        
        enfant_db ={"enfant":{
             "prenom": data_enfant[user]["x"]["prenom"],
             "address": data_enfant[user]["x"]["address"],
                }}
        data_users.append(enfant_db)
    for user in range(len(data_gp)):
        
        gp_db ={"grandparent":{
             "prenom": data_gp[user]["x"]["prenom"],
             "address": data_gp[user]["x"]["address"],
                }}
        data_users.append(gp_db)
    for user in range(len(data_frere)):
        
        frere_db ={"frere":{
             "prenom": data_frere[user]["x"]["prenom"],
             "address": data_frere[user]["x"]["address"],
                }}
        data_users.append(frere_db)
    for user in range(len(data_parent)):
        
        parent_db ={"parent":{
             "prenom": data_parent[user]["x"]["prenom"],
             "address": data_parent[user]["x"]["address"],
                }}
        data_users.append(parent_db)

    return jsonify(data_users)
        
if __name__=='__main__':
    # api.run(debug=True, port=8000)
    socketio.run(api, port=8000)

