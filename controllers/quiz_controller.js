/**
 * Created by Manolo on 17/07/2015.
 */
var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
    models.Quiz.find({
            where: {id: Number(quizId)},
            include: [{model: models.Comment}]
        }).then(
        function (quiz){
            if (quiz){
                req.quiz = quiz;
                next();
            }else{next(new Error('No existe quizId=' + quizId));}
        }
    ).catch(function(error){next(error);});
};

exports.index = function (req,res){
    if ((req.query.tema === '') || (req.query.tema === undefined)) {
        if ((req.query.search === '') || (req.query.search === undefined)) {
            models.Quiz.findAll().then(function (quizes) {
                    res.render('quizes/index', {quizes: quizes, errors: []});
                }
            ).catch(function (error) {
                    next(error);
                })
        } else {
            var filtro = '%' + req.query.search.replace(' ', '%') + '%';// replace(req.query.search,' ','%') + '%';
            models.Quiz.findAll({where: ["pregunta like ?", filtro]}).then(function (quizes) {
                    res.render('quizes/index', {quizes: quizes, errors: []});
                }
            ).catch(function (error) {
                    next(error);
                })
        }
    }else{
        models.Quiz.findAll({where: ["tema like ?", req.query.tema]}).then(function (quizes) {
                res.render('quizes/index', {quizes: quizes, errors: [], tema_mostrar: 'TEMA: ' + req.query.tema});
            }
        ).catch(function (error) {
                next(error);
            })
    }
};

exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.temas = function(req,res){
    res.render('quizes/temas', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res){
    var resultado = "Incorrecto";
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = "Correcto";
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req,res){
    var quiz = models.Quiz.build(
        {pregunta: "", respuesta: "", tema: ""});
    res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST quizes/create
exports.create = function(req, res){
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate().then(function (err){
        if (err){
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
        }else{
            //guarda en DB los campos pregunta, respuesta y tema de quiz
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
                res.redirect('/quizes');
            });
        }
    })

};

//GET /quizes/:id/edit
exports.edit = function(req,res){
    var quiz = req.quiz;
    res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz.validate().then(function(err){
        if (err){
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
        }else{
            req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
                res.redirect('/quizes');});
        }
    });
};

//DELETE /quizes/:id
exports.destroy = function(req,res){
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error);});
};