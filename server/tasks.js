/**
 * Created by hally9k on 26/02/16.
 */

var Task = require('./models/task.model');

module.exports = function(callback) {
    Task.find({}, function(err, tasks) {
        if(err){
            handleError(res, err);
        } else {
            callback(tasks);
        }
    });
};
