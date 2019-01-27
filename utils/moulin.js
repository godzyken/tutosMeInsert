//on importe le modèle
var Model = require('./Model');
//recherche de tous les utilisateurs
Model.User.findAll().then(users => {
    //on récupère ici un tableau "users" contenant une liste d'utilisateurs
    console.log(users);
}).catch(function (e) {
    //gestion erreur
    console.log(e);
});

Model.User.findAll({
    include: [
        //j'inclus les roles de mon utilisateur
        {model: Model.t},
        //mais aussi la liste de ses "Operators" qui ont comme valeur role_id ="1" je récupére également leur propre role.
        {model: Model.User, as: "Operators", where: {role_id: '149999900000000002'}, include: [{model: Model.Role}]}
    ]
}).then(users => {
    users.forEach((user) => {
        console.log('----');
        console.log(user.name + " : " + user.role.name);
        console.log('----');
        user.Operators.forEach((operator) => {
            console.log(operator.name + " : " + operator.role.name);
        });
    });
});

//requête d'un utilisateur par son identifiant avec inclusion de la relation "Role"
let id =  19; //id
Model.User.findById(id, {
    include: [{model: Model.trainer}]
}).then(user => {
    //on peux directement afficher le nom du rôle de l'utilisateur
    console.log(user.role.name);
});

//exemple de création d'un utilisateur, puis de sa suppression dans la foulée. Ce qui permet de voir comment effectuer des requêtes successives.
Model.User.create({
    name: 'Test',
    email : 'test@testmail.com'
}).then(user => {
    return user.destroy();
}).then(destroy => {
    //traitement terminé...
}).catch(function (e) {
    //gestion erreur
});

//exemple de requête d'update d'un utilisateur
let id = 19;//id
Model.User.update(
    {name: 'Numa'},
    {where: {id: id}}
).then(user => {
    //traitement terminé...
});

//recuperations des utilisateurs correspondants au différents rôles
Model.Trainer.findAll({include: [{model: Model.User}]}).then(trainer => {
    //pour chaque role on peux parcourir la liste des ses utilisateurs
    trainer.forEach((trainer) => {
        console.log(trainer.name);
        trainer.users.forEach((user) => {
            console.log(user.name);
        });
    });
    //...
});

Model.User.findAll({
    include: [
        //j'inclus les roles de mon utilisateur
        {model: Model.Role},
        //mais aussi la liste de ses "Operators" qui ont comme valeur role_id ="1" je récupére également leur propre role.
        {model: Model.User, as: "Operators", where: {role_id: '149999900000000002'}, include: [{model: Model.Role}]}
    ]
}).then(users => {
    users.forEach((user) => {
        console.log('----');
        console.log(user.name + " : " + user.role.name);
        console.log('----');
        user.Operators.forEach((operator) => {
            console.log(operator.name + " : " + operator.role.name);
        });
    });
});

let param_name = '%a%';
let param_role = 1;
//sql brut
let sql = 'SELECT (ROUND(id / 5)+123) as nimportequoi FROM user WHERE name LIKE $1 AND role_id > $2';
Model.sequelize.query(sql, {bind: [param_name, param_role], type: Model.sequelize.QueryTypes.SELECT}).then(results => {
    console.log(results);
});

User.hasMany(User, {foreignKey: 'manager_id', as: 'Operators'});//l'utilisateur peux avoir des "Operators"
User.belongsTo(User, {foreignKey: 'manager_id', as: 'Manager'});//l'utilisateur peux avoir un "Manager"