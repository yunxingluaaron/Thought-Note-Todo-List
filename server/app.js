//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const path = require('path');
const indexPath = path.join(__dirname, 'views/build');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static("public"));
// app.use(express.static(indexPath));
app.use(bodyParser.urlencoded({
  extended: true
}));
// initialize session
app.use(session({
  secret: "Ourlittlesecret.",
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } //when secure is set, and you access your site over HTTP, the cookie will not be set
}))
//initialize cookie; use passport to menage the sessions
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
    notes: [{
    title: String,
    content: String,
    toDoList: [
        {
            listContent: String,
            checkedBox: Boolean,
        }]
}]
});

//to hash and salt our password and to save users to DB
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// Google auth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://thought-note.herokuapp.com/auth/google/notes"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      username: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));
// home page
app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(indexPath, 'index.html'));
  } else {
    res.render("home");
  }
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ["profile"]
  })
);
app.get("/auth/google/notes",
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {

    // Successful authentication, redirect notes page.
    res.redirect('/notes');
  });
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

// app.get("/notes", function(req, res) {
//   User.find({"notes": {$ne: null}}, function(err, foundUsers){
//     if(err){
//       console.log(err);
//     } else {
//       if (foundUsers) {
//         res.sendFile(path.join(indexPath, 'index.html'));
//         // res.render("secrets", {usersWithSecrets: foundUsers});
//       }
//     }
//   });
// });

app.get("/notes", function(req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(indexPath, 'index.html'));
  } else {
    res.redirect("login");
  }
})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/login-failure", function(req,res) {
  res.render("login-failure");
})

// app.get("/submit", function(req, res) {
//   if (req.isAuthenticated()) {
//     res.render("submit");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/submit", function(req, res){
//   const submittedSecret = req.body.secret;
//   User.findById(req.user.id, function(err, foundUser){
//     if(err){
//       console.log(err);
//     } else {
//       if (foundUser) {
//         foundUser.secret = submittedSecret;
//         foundUser.save(function(){
//           res.redirect("/secrets");
//         });
//       }
//     }
//   });
// });

app.post("/register", function(req, res) {
  User.register({
    username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/notes");
      });
    }
  });
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local",{failureRedirect:"/login-failure"})(req, res, function() {
        console.log("success");
        res.redirect("/notes");
      });
    }
  });
  
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port " + process.env.PORT);
});
