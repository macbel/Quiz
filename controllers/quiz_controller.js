/**
 * Created by Manolo on 17/07/2015.
 */
var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
    models.Quiz.findByPrimary(quizId).then(
        function (quiz){
            if (quiz){
                req.quiz = quiz;
                next();
            }else{next(new Error('No existe quizId=' + quizId));}
        }
    ).catch(function(error){next(error);});
};

exports.index = function (req,res){
    if ((req.query.search === '') || (req.query.search === undefined)){
        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index',{quizes: quizes});
         }
        ).catch(function (error){next(error);})
    }else{
        var filtro = '%' + req.query.search.replace(' ','%')  + '%';// replace(req.query.search,' ','%') + '%';
        models.Quiz.findAll({where: ["pregunta like ?", filtro]}).then(function(quizes){
                res.render('quizes/index',{quizes: quizes});
            }
        ).catch(function(error){next(error);})
    }
};

exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res){
    var resultado = "Incorrecto";
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = "Correcto";
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

exports.new = function(req,res){
    var quiz = models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "Respuesta"});
    res.render('quizes/new', {quiz: quiz});
};

//POST quizes/create
exports.create = function(req, res){
    var quiz = models.Quiz.build(req.body.quiz);

    //guarda en DB los campos pregunta y respuesta de quiz
    quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
        res.redirect('/quizes');
    });
};