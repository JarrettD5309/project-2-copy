var db = require("../models");

var axios = require("axios");
const { sequelize } = require("../models");

module.exports = function(app) {
  app.get("/", function(req,res) {
    db.Books.findAll({
      order: sequelize.literal("vote DESC")
    }).then(function (results) {
      var bookVoteArr = [];

      var counter = 0;

      function cycleGoogleBook() {
        if (counter < (results.length) - 1) {
          var bookVoteId = results[counter].bookId;
          var voteTotal = results[counter].vote;
          var searchURL = "https://www.googleapis.com/books/v1/volumes/" + bookVoteId + "?key=" + process.env.apiKey;

          axios.get(searchURL).then(function (result) {
        
            var bookID = result.data.id;
            var bookTitle = result.data.volumeInfo.title;
            var authorArr = result.data.volumeInfo.authors;
            var authors = authorArr.join(", ");
            var bookImage = result.data.volumeInfo.imageLinks.thumbnail;

            var bookObj = {
              id: bookID,
              title: bookTitle,
              author: authors,
              image: bookImage,
              vote: voteTotal
            };

            bookVoteArr.push(bookObj);
            counter += 1;
            cycleGoogleBook();
          });

        } else {

          var bookVoteId = results[counter].bookId;
          var voteTotal = results[counter].vote;
          var searchURL = "https://www.googleapis.com/books/v1/volumes/" + bookVoteId + "?key=" + process.env.apiKey;

          axios.get(searchURL).then(function (result) {
           
            var bookID = result.data.id;
            var bookTitle = result.data.volumeInfo.title;
            var authorArr = result.data.volumeInfo.authors;
            var authors = authorArr.join(", ");
            var bookImage = result.data.volumeInfo.imageLinks.thumbnail;

            var bookObj = {
              id: bookID,
              title: bookTitle,
              author: authors,
              image: bookImage,
              vote: voteTotal
            };

            bookVoteArr.push(bookObj);

            var hbsObject = {
              books: bookVoteArr,
              username: req.session.username
            }
            res.render("index", hbsObject);
            

          });

        }
      }

      cycleGoogleBook();

    });
  });

  app.get("/loggedin", function(req,res) {
    
    if (req.session.loggedin) {
      // Render home page
      db.Books.findAll({
        order: sequelize.literal("vote DESC")
      }).then(function (results) {
        var bookVoteArr = [];

        var counter = 0;

        function cycleGoogleBook() {
          if (counter < (results.length) - 1) {
            var bookVoteId = results[counter].bookId;
            var voteTotal = results[counter].vote;
            var searchURL = "https://www.googleapis.com/books/v1/volumes/" + bookVoteId + "?key=" + process.env.apiKey;

            axios.get(searchURL).then(function (result) {
         
              var bookID = result.data.id;
              var bookTitle = result.data.volumeInfo.title;
              var authorArr = result.data.volumeInfo.authors;
              var authors = authorArr.join(", ");
              var bookImage = result.data.volumeInfo.imageLinks.thumbnail;

              var bookObj = {
                id: bookID,
                title: bookTitle,
                author: authors,
                image: bookImage,
                vote: voteTotal
              };

              bookVoteArr.push(bookObj);
              counter += 1;
              cycleGoogleBook();
            });

          } else {

            var bookVoteId = results[counter].bookId;
            var voteTotal = results[counter].vote;
            var searchURL = "https://www.googleapis.com/books/v1/volumes/" + bookVoteId + "?key=" + process.env.apiKey;

            axios.get(searchURL).then(function (result) {
              // res.json(result.data);



              var bookID = result.data.id;
              var bookTitle = result.data.volumeInfo.title;
              var authorArr = result.data.volumeInfo.authors;
              var authors = authorArr.join(", ");
              var bookImage = result.data.volumeInfo.imageLinks.thumbnail;

              var bookObj = {
                id: bookID,
                title: bookTitle,
                author: authors,
                image: bookImage,
                vote: voteTotal
              };

              bookVoteArr.push(bookObj);

              var hbsObject = {
                books: bookVoteArr,
                username: req.session.username
              }
              res.render("loggedin", hbsObject);
              
            });

          }
        }

        cycleGoogleBook();

      });
    } else {
      // Redirect to login page
      res.redirect("/");
    }

  });
  app.get("/search", function(req,res) {
    res.render("search");
  });

  app.get("/logout", function(req,res) {
    req.session.destroy();
    res.redirect("/");
  });

};
