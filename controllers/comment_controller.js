/**
 * Created by Manolo on 17/07/2015.
 */
var models = require('../models/models.js');


//GET quizes/:quizId/comments/new
exports.new = function(req,res){
    res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

//POST quizes/quizId/comments
exports.create = function(req, res){
    var comment = models.Comment.build(
        {  texto: req.body.comment.texto,
           QuizId: req.params.quizId
        }
    );

    comment.validate().then(function (err){
        if (err){
            res.render('coments/new', {comment: comment, errors: err.errors});
        }else{
            //guarda en DB los campos pregunta, respuesta y tema de quiz
            comment.save().then(function(){
                res.redirect('/quizes/' + req.params.quizId);
            });
        }
    })

};
