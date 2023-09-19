const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/thoughtDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

// Requests Targetting all Articles

app.route("/articles").get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new ariticle.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all ariticles.");
      } else {
        res.send(err);
      }
    });
  });

// Requests Targetting a specific Articles

app.route("/articles/:articleTitle")

.get(function(req, res) {
  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle) {
    if (!err) {
      res.send(foundArticle);
    } else {
      res.send("No matching that title was found.");
    }
  });
})

.put(function(req, res) {
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title: req.body.title}, // automatically pick field that have been updated
    {overwrite: true},
    function(err) {
    if (!err) {
      res.send("Successfully updated article.");
    } else {
      res.send(err);
    }
  });
})

.patch(function(req,res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    {overwrite: true},
    function(err) {
    if (!err) {
      res.send("Successfully updated article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err) {
    if (!err) {
      res.send("Deleted the corresponding article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});