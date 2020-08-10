// login user in
$("#login-button").on("click", function () {
  var username = $("#username").val().trim();
  var password = $("#password").val().trim();

  $.ajax({
    type: "POST",
    url: "/api/login",
    data: {
      username: username,
      password: password
    }
  }).then(function (response) {
    console.log(response);
    if (response === "noPassOrUser") {
      $("#modal-msg").empty();
      var newPara = $("<p>").text("Must enter Username and Password");
      $("#modal-msg").append(newPara);
    } else if (response === "wrongPassOrUser") {
      $("#modal-msg").empty();
      var newPara = $("<p>").text("Incorrect Username and/or Password");
      $("#modal-msg").append(newPara);
    } else if (response === "userLoggedIn") {
      window.location.href = "/loggedin";
    }
  });
});

// create user
$("#create-button").on("click", function () {
  var username = $("#postUsername").val().trim();
  var password = $("#postPassword").val().trim();

  $.ajax({
    type: "POST",
    url: "/api",
    data: {
      username: username,
      password: password
    }
  }).then(function (response) {
    console.log(response);
    if (response === "formNotComplete") {
      $("#modal2-msg").empty();
      var newPara = $("<p>").text("Please complete the registration form");
      $("#modal2-msg").append(newPara);
    } else if (response === "userAlreadyExists") {
      $("#modal2-msg").empty();
      var newPara = $("<p>").text("Account already exists with that username");
      $("#modal2-msg").append(newPara);
    } else if (response === "userCreateSuccess") {
      $("#modal2-msg").empty();
      var newPara = $("<p>").text("Account successfully created. You may now login.");
      $("#modal2-msg").append(newPara);
    }
  });
});

// sign out onclick
$("#sign-out").on("click", function () {
  event.preventDefault();
  window.location.href = "/logout";

})

// book submit onclick
$("#book-submit").on("click", function () {
  $("#book-info").empty();
  event.preventDefault();
  var searchTerm = $("#booksearch").val();

  var searchURL = "/api/search?q=" + searchTerm;
  $.ajax({
    type: "GET",
    url: searchURL
  }).then(function (result) {

    if (result.userID) {

      var currentUser = result.userID;

      var bookArr = result.bookArr;

      var userSearch = $("<h3>").text("Your Search: " + searchTerm);
      $("#user-Search").empty();
      $("#user-Search").append(userSearch);

      for (var i = 0; i < bookArr.length; i++) {
        var newDiv = $("<div>").addClass("col-md-6 col-lg-4 col-xl-3 py-2");
        var newDiv2 = $("<div>").addClass("card-border text-center");
        var newImg = $("<img>").attr("src", bookArr[i].image).addClass("img py-2");
        newDiv2.append(newImg);

        var newTitleHead = $("<h6>").text(bookArr[i].title).addClass("px-1");
        newDiv2.append(newTitleHead);

        var NewAuthor = $("<p>").text(bookArr[i].author).addClass("px-1");
        newDiv2.append(NewAuthor);

        var newButton = $("<button>").addClass("btn btn-primary add-book mb-2").attr("type", "button").attr("data-user_id", currentUser).attr("data-book_id", bookArr[i].id).attr("data-book_title", bookArr[i].title).text("Add Book");

        newDiv2.append(newButton);
        newDiv.append(newDiv2);

        $("#book-info").append(newDiv);
      }



    } else {
      var newHeader = $("<h3>").text("ERROR: Please try logging back in.")
      $("#book-info").append(newHeader);
    }
  });
});

// book vote
$(document).on("click", ".vote-button", function () {
  var googleId = $(this).data("googleid");

  $.ajax({
    type: "PUT",
    url: "/api/vote",
    data: {
      googleId: googleId
    }
  }).then(function (response) {
    console.log(response);
    window.location.href = "/loggedin";

  });
});


$(document).on("click", ".add-book", function () {
  var userId = $(this).data("user_id");
  var bookId = $(this).data("book_id");
  var BookName = $(this).data("book_title");

  console.log("sending obj vars: " + userId + " : " + bookId + " : " + BookName);

  $.ajax({
    type: "POST",
    url: "/api/addbook",
    data: {
      userId: userId,
      bookId: bookId,
      BookName: BookName
    }
  }).then(function (response) {
    console.log(response);
    window.location.href = "/loggedin";

  });
});

// add book
$(document).on("click", "#add-book-info", function () {
  var userID = $(this).data("user_id");
  var bookID = $(this).data("book_id");

  $.ajax({
    type: "POST",
    url: "/api/addbook",
    data: {
      userID: userID,
      bookID: bookID,
    }
  }).then(function (response) {
    console.log(response);

  });
});

