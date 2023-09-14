// express import
const express = require("express");

const { createServer } = require("http")
const { Server } = require("socket.io")

const { initializeSocketIO } = require("./socket")

// initialize app
const app = express();

// mongodb connection
require("./connection");

// used to work with environment variables (.env file)
require("dotenv").config();

// all routes are inside routes folder
const Routes = require('./routes')

// cors to work with cross origin requests
const cors = require("cors")

// passport import for user authentication
const passport = require('passport')

// express-session for user authentication
const session = require('express-session')

// connect-mongo to store user sessions
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')(session)

// file upload package
const fileUpload = require("express-fileupload")

// passport initialization
require('./config/passport')(passport)

// app port and host
const hostname = "127.0.0.1";
const port = process.env.PORT || 3001;

// trust netlify reverse proxy
app.set("trust proxy", 1);

// cors to access apis from frontend

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3005",
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

app.use(
  cors({
    origin:"http://localhost:3005",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
)

// express-session
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // trust reverse proxy of netlify
    cookie: {maxAge: 60 * 60 * 1000, secure: true, sameSite:'none' }, // 1 hour, secure for https & sameSite for deployment of backend & frontend on different places
    // cookie: {maxAge: 60 * 60 * 1000, secure: true }, // 1 hour, secure for https & sameSite for deployment of backend & frontend on different places
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // storing sessions in mongodb
  })
  )
// express-sessions (admin session)


// app.use(
//   session({
//     secret: 'cOmPleXsecREtkEy',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {maxAge: 60 * 60 * 1000 }, // 1 hour 
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   })
// )


// this will not break session if user performs some activity within 1 hour
app.use(function(req, res, next) {
  req.session._garbage = Date();
  req.session.touch();
  next();
});

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// to work with jsons
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("App is Working");
});

// file upload middleware (alternative of multer)
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// all routes are inside this
app.use('/api', Routes)

initializeSocketIO(io);

// api's listening port and host
httpServer.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
