/**
 * Created by hally9k on 26/02/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: { type : String, unique : true, required: true },
    lastRun: Date,
    rollbarToken: String,
    cron: { type : String, required: true },
    urls: { type : [String] }
});

module.exports = mongoose.model('Task', TaskSchema);
