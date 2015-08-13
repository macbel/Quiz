/**
 * Created by Manolo on 12/08/2015.
 */
var users = {admin: {id:1, username:"admin", password:"1234"},
             manolo: {id:2, username:"Manuel Blazquez", password:"1"}
    };

//validación del usuario
exports.autenticar = function(login, password, callback){
    if (users[login]){
        if (password === users[login].password){
            callback(null, users[login]);
        }else{
            callback(new Error('Password incorrecto'));
        }
    }else{
        callback(new Error('No existe el usuario'));
    }
};

