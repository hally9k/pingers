/**
 * Created by hally9k on 26/02/16.
 */

var _ = require('lodash');
var request = require('request');
var moment = require('moment');
var rollbar = require('rollbar');
var CronJob = require('cron').CronJob;

var cronJobs = {};

module.exports = {
        bootstrap: bootstrap,
        getCronJobs: getCronJobs,
        newTask: newTask,
        stopTask: stopTask,
        startTask: startTask,
        removeTask: removeTask,
        getTaskStatus: getTaskStatus
    };

function bootstrap(tasks){
    _.each(tasks, function(task){
        newTask(task);
    });
}

function getCronJobs() {
    return _.keys(cronJobs);
}

function newTask(task, callback){
    cronJobs[task._id] = {};
    _.each(task.urls, function(url) {
        cronJobs[task._id][url] = new CronJob(task.cron, function () {
            var pingTime = moment().format("YYYY-MM-DD HH:mm:ss");
            request(url, function (err, res) {
                if (!err && res.statusCode == 200) {
                    console.log(task.name + ' - ' + url + ' - ' + pingTime);
                } else {
                    console.log('FAILED -> ' + task.name + ' on ' +  url + ' at ' + pingTime);
                    if(task.rollbarToken) {
                        rollbar.init(task.rollbarToken);
                        rollbar.reportMessage("Http Pinger FAILED to pop " + url + " at " + pingTime + "   "  + err);
                    }
                }
            })
        }, null, true, 'Pacific/Auckland');
    });
    if(callback){
        callback();
    }
}

function removeTask(taskId) {
    if(_.has(cronJobs, taskId)) {
        _.unset(cronJobs, taskId);
        return true;
    } else {
        return false;
    }
}

function stopTask(taskId){
    if(_.has(cronJobs, taskId)) {
        var urls = _.keys(cronJobs[taskId]);
        _.each(urls, function(url){
            cronJobs[taskId][url].stop();
        });
        return true;
    } else {
        return false;
    }
}

function startTask(taskId){
    if(_.has(cronJobs, taskId)) {
        _.each(_.keys(cronJobs[taskId]), function(url){
            cronJobs[taskId][url].start();
        });
        return true;
    } else {
        return false;
    }
}

function getTaskStatus(taskId){

    var status = 'running';

    for (var url in cronJobs[taskId]) {
        if (cronJobs[taskId].hasOwnProperty(url)) {
            if(!cronJobs[taskId][url].running) {
                status = 'stopped';
                break;
            }
        }
    }

    return status;
}
