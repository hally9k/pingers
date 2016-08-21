/**
 * Created by hally9k on 26/02/16.
 */

var _ = require('lodash');
var Task = require('../models/task.model');
var scheduler = require('../scheduler');

exports.getAll = function(req, res) {
    Task.find({}, function(err, tasks) {
        if(err){
            handleError(res, err);
        } else {
            var taskModels = [];
            _.each(tasks, function(task){
                task._doc.status = scheduler.getTaskStatus(task._doc._id);
                taskModels.push(task._doc);
            });
            res.send(taskModels);
        }
    });
};

exports.getCurrent = function(req, res) {
    res.send(scheduler.getCronJobs());
};

exports.getOne = function(req, res) {
    var id = req.params.id;
    ServiceSnapshot.where({ _id: id }).findOne(function(err, task) {
        if(err){
            handleError(res, err);
        } else {
            res.send(task);
        }
    });
};

exports.addOrUpdateOne = function(req, res){
    if(req.body._id){

        Task.update({ _id: req.body._id },
                    {
                        name: req.body.name,
                        cron: req.body.cron,
                        rollbarToken: req.body.rollbarToken,
                        urls: req.body.urls
                    },
                    {},
                    function(err, task) {
                        if(err){
                            handleError(res, err);
                        } else {

                            scheduler.stopTask(req.body._id);
                            scheduler.removeTask(req.body._id);
                            scheduler.newTask(req.body, function(){
                                res.status(202).send(req.body.name);
                            });
                        }
        });
    } else {
        var task = new Task(req.body);
        task.save(function (err, task) {
            if (err) {
                handleError(res, err);
            } else {
                scheduler.newTask(task);
                res.status(201).send(task.name);
            }
        });
    }
};

exports.deleteOne = function(req, res) {
    var taskId = req.params.id;
    Task.where({ _id: taskId }).findOne(function(err, task) {
        if(err){
            handleError(res, err);
        } else {

            scheduler.stopTask(taskId);
            scheduler.removeTask(taskId);
            if(task) {
                task.remove();
            }
            res.sendStatus(204);
        }
    });
};

exports.stopTask = function(req, res){
    var taskId = req.params.id;
    scheduler.stopTask(taskId);
    var status = getTaskStatus(taskId);
    res.send(status);
};

exports.startTask = function(req, res){
    var taskId = req.params.id;
    scheduler.startTask(taskId);
    var status = getTaskStatus(taskId);
    res.send(status);
};

exports.getTaskStatus = function(req, res) {
    var taskId = req.params.id;
    var status = getTaskStatus(taskId);
    res.send(status);
};


function getTaskStatus(taskId){
    return scheduler.getTaskStatus(taskId);
}

function handleError(res, err) {
    return res.status(500).send(err);
}