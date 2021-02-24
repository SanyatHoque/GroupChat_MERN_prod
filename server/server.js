const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Messages = require('./message');
const socket = require('socket.io');
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 8080;

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
// Assign the value of your mongoDB connection string to this constant
// const dbConnectString = "mongodb+srv://Sanyat:Sanyat1234@cluster0.r6sod.mongodb.net/Realchatdb?retryWrites=true&w=majority";
const db_mongo_atlas_compass = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.r6sod.mongodb.net/samplename?retryWrites=true&w=majority`;
// Updating mongoose's promise version
mongoose.Promise = global.Promise;

// Connecting to MongoDB through Mongoose
mongoose.connect(db_mongo_atlas_compass).then(() => {
    console.log('connected to the db');
}).catch((err) => {
    console.log(err);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

// Middleware to parse the request body as json
app.use(bodyParser.json());

// GET all the previous messages
app.get('/api/message', (req, res) => {
    Messages.find().exec((err, messages) => {
        if(err) {
            res.send(err).status(500);
        } else {
            res.send(messages).status(200);
        }
    });
});
// // GET all the previous messages
// app.get('/api/message/:postId', (req, res) => {
//     Messages.findById(req.params.postId).exec((err, messages) => {
//         if(err) {
//             res.send(err).status(500);
//         } else {
//             res.send(messages).status(200);
//         }
//     });
// });
// GET all the previous messages
// app.get('/api/message/:postId', (req, res) => {
//     Messages.find({street_no: req.params.postId}).exec((err, messages) => {      //"street_no":"12"      "Street": "Belcourt"  findById
//         if(err) {
//             res.send(err).status(500);
//         } else {   
//             res.send(messages).status(200);
//             console.log(messages);
//         }
//     });
// });
// POST a new message
app.post('/api/message', (req, res) => {
    Messages.create(req.body).then((message) => {
        res.send(message).status(200);
    }).catch((err) => {
        console.log(err);
        res.send(err).status(500);
    });
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static("./client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
    });
}

// Start the server at the specified PORT
let server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Starting a socket on the specified server
let io = socket(server);

io.on("connection", (socket) => {

    socket.on("new-message", (data) => {
        io.sockets.emit("new-message", data);
    });

});