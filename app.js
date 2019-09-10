let mongoose = require("mongoose");
let express = require("express");
let app = express();
let bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));

let Task = require('./models/tasks');
let Developers = require('./models/developers');

let url = "mongodb://localhost:27017/lab7DB"

mongoose.connect(url, function(err){
    if (err) { //handles errors so program won't crash
        throw err;
    }
    console.log("Successfully connected");
})

app.use(express.static('css')) //css (background colour)
app.use(express.static('views')) //reads folder

let viewsPath = __dirname+"/views/"; //__dirname is current path + views the folder

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.get('/',function(req,res){
    res.sendFile(viewsPath+"index.html");
});

app.use(bodyParser.urlencoded({extended:false}));

//Create developers
app.get('/adddev',function(req,res){
    res.sendFile(viewsPath+"adddev.html");
});

app.post('/adddev', function(req,res){
    console.log(req.body);

    let developers = new Developers ({
        'name.firstName': req.body.devFname,
        'name.lastName': req.body.devLname,
        level: req.body.devLevel,
        'address.state': req.body.state,
        'address.suburb': req.body.suburb,
        'address.street': req.body.street,
        'address.unit': req.body.unit,
        
    })
    developers.save(function (err) {
        if (err)
            console.log(err);
        else {
            console.log('Developer saved');
        }
    });
    res.redirect('/alldev');
});

//Get developers
app.get('/alldev', function (req, res) {
    Developers.find().exec(function (err, result){ 
        console.log(result);
        res.render(__dirname + '/views/alldev.html', { developersDb: result });
    })
});


//Create tasks
app.get('/addtask',function(req,res){
    res.sendFile(viewsPath+"addtask.html");
});

app.post('/addthistask', function(req,res){
    console.log(req.body);

    let task = new Task ({
        name: req.body.taskName,
        assignee: req.body.taskAssign,
        due: req.body.taskDue,
        status: req.body.taskStat,
        desc: req.body.taskDes
    })
    task.save(function (err) {
        if (err)
            console.log(err);
        else {
            console.log('Task saved');
        }
    });
    res.redirect('/alltasks');
});


//Get tasks
app.get('/alltasks', function (req, res) {
    Task.find().exec(function (err, result){ 
        console.log(result); 
        res.render(__dirname + '/views/alltasks.html', { tasksDb: result });
    })
});

//Delete Task by ID
app.get('/deleteID', function(req,res){
    res.sendFile(viewsPath+"deleteID.html");
});

app.post('/deleteID', function (req, res) {
    let deleteID = req.body;
    console.log(deleteID);
    let filter = { _id: mongoose.Schema.Types.ObjectId(deleteID.taskID) };
    Task.deleteOne(filter, function (err, doc) {
        console.log(doc);
    });

    res.redirect('/alltasks');
});

//Delete completed tasks
app.get('/deleteComplete', function(req,res){
    res.sendFile(viewsPath+"deleteComplete.html");
});

app.post('/deletecomplete', function (req, res) {
    Task.deleteMany({ 'status': 'completed' }, function (err, doc) {
        console.log(doc);
    });
    res.redirect('/alltasks');
});

//Update task by task ID
app.get('/updateID', function(req,res){
    res.sendFile(viewsPath+"updateID.html");
});

app.post('/updateID', function (req, res) {
    let taskDetails = req.body;
    console.log(taskDetails);
    let filter = { _id: mongoose.Schema.Types.ObjectId(taskDetails.taskID)};
    let theUpdate = { $set: { taskStat: taskDetails.taskstatus} };
    Task.updateOne(filter, theUpdate);
    res.redirect('/alltasks');
})

//sort complete tasks by descending name, limit of 3
app.get('/sorttask', function (req, res) {
    let taskDetails = req.body;
    Task.where({ 'status': 'completed' }).where('name').limit(3).sort('name: -1').exec(function (err, doc) {
        console.log(doc);
    });
    res.send(doc);
});


app.listen(8080);
