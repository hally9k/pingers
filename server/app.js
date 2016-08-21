/**
 * Created by hally9k on 26/02/16.
 */

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var chalk = require('chalk');

var db = "mongodb://localhost:27017/httppinger";

// connect to MongoDB
mongoose.connect(db, function(err) {
    if (err) {
        console.error(chalk.red('MongoDB connection failed'));
        console.log(chalk.red(err));
    }else{
        console.log(chalk.green('MongoDB connection successful'));
    }
});

// fetch all tasks from the db
require('./tasks')(function(tasks){
    // bootstrap scheduler
    require('./scheduler').bootstrap(tasks);
});

// api setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// register routes for task
require('./routes/task.route.js')(app);

var port = process.env.PORT || 8080;

app.listen(port);
console.log('Http Pinger running on ' + port);
