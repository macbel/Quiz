/**
 * Created by Manolo on 17/07/2015.
 */

//GET login Formulario de Login
exports.new = function(req,res){
    var errors = req.session.errors || {};
    req.session.errors = {};
    res.render('sessions/new', {errors: errors});
};

//POST Login Autenticación de usuario
exports.create = function(req, res){
    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user){
        if (error){ //retornamos error de inicio de sesión
            req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
            res.redirect('/login');
            return;
        }

        //crear req.session.user y guardar campos id y username
        //la session se define por la existencia de: req.session.user
        req.session.user = {id: user.id, username: user.username};
        res.redirect(req.session.redir); //redirección a página anterior al login
    });
};
//DELETE /logout Destruir sesión
exports.destroy = function(req,res){
    delete req.session.user;
    res.redirect(req.session.redir); //redirección a página anterior al login
}
