let mongodb=require('mongodb');
let MongoDBClient=mongodb.MongoClient;
let express = require('express');
let app = express();
let bodyParser=require('body-parser'); //npm install body-parser

let db=null;
let col=null;
app.use(bodyParser.urlencoded({extended:false}));
let url="mongodb://localhost:27017";
MongoDBClient.connect(url,{ 
    useNewUrlParser: true, 
    useUnifiedToplogy: true
}, function(err,client){
    db=client.db('lab6');
    col=db.collection('tasks');
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

//addtask
app.get('/addtask',function(req,res){
    res.sendFile(viewsPath+"addtask.html");
});

app.post('/addthistask',function(req,res){
    db.collection('tasks').insertOne(req.body);
    res.redirect('/alltasks');
});

//list all tasks
app.get('/alltasks',function(req,res){
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('alltasks', { tasksDb: data });
        console.log(data);
    });
});

//delete task by ID
app.get('/deleteID', function(req,res){
    res.sendFile(viewsPath+"deleteID.html");
});

app.post('/deleteid', function(req,res){
        let deleteID = req.body;
        console.log(deleteID);
        let filter = { _id: mongodb.ObjectId(deleteID.taskID) };
        db.collection('tasks').deleteOne(filter);
        res.redirect('/alltasks');
});

//delete all completed tasks
app.get('/deleteComplete', function(req,res){
    res.sendFile(viewsPath+"deleteComplete.html");
});

app.post('/deletecomplete', function (req, res) {
    let taskDetails = req.body;
    let filter = { taskStat: taskDetails.taskStat };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/alltasks');
});

//update tasks by ID
app.get('/updateID', function(req,res){
    res.sendFile(viewsPath+"updateID.html");
});

app.post('/updateiddata', function (req, res) {
    let taskDetails = req.body;
    console.log(taskDetails);
    let filter = { _id: mongodb.ObjectId(taskDetails.taskID)};
    let theUpdate = { $set: { taskStat: taskDetails.taskstatus} };
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/alltasks');
})

//delete old complete
app.get('/deleteoldcomplete', function (req, res) {
    let taskDetails = req.body;
    db.collection('tasks').deleteMany({taskStat: 'completed'},{taskDue:{$lte: "2019-09-03"}},function (err,result){

    });
    res.redirect('/alltasks');
});

app.listen(8080);

//npm install -g nodemon
//type nodemon in terminal

//git init
//make file .gitignore to include files git should ignore
