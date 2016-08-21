/**
 * Created by hally9k on 26/02/16.
 */

module.exports = function(app) {
    var taskController = require('../controllers/task.controller');
    app.route('/task').get(taskController.getAll);
    app.route('/task/current').get(taskController.getCurrent);
    app.route('/task/:id').get(taskController.getOne);
    app.route('/task').post(taskController.addOrUpdateOne);
    app.route('/task/:id').delete(taskController.deleteOne);
    app.route('/task/:id/start').get(taskController.startTask);
    app.route('/task/:id/stop').get(taskController.stopTask);
    app.route('/task/:id/status').get(taskController.getTaskStatus);
};