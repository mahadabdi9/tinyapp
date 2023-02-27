const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Generating random string for shortURL
function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


const authenticateUser = function(database, email, password) {
  if (password === undefined) {
    for (let user in database) {
      if (database[user].email === email) {
        return user;
      }
    }
  } else {
    for (let user in database) {
      if (database[user].email === email && database[user].password === password) {
        return user;
      }
    }
  } return false;
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
};

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: users[req.cookies["user_id"]]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: users[req.cookies["user_id"]]
};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    username: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});

// Deleting URL from URLS page and staying on current page after
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
  });


  // After clciking edit button redirecting to corresponding page to change URL
  app.post("/urls/:id/edit", (req, res) => {
    res.redirect(`/urls/${req.params.id}`);
    });

// Adding a new URL
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const urlId = generateRandomString();
  urlDatabase[urlId] = req.body.longURL
  res.redirect("/urls");
});

// Redirect shortURL to longURL website
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


// Recieving information about updated LongURL 
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
})

/*
// Login and store username in cookie and redirect to URLs page
app.post('/login', (req, res) => {
  res.cookie("username",req.body.username);
  console.log(req.body.username);
  res.redirect('/urls');
})

*/

app.post('/login', (req, res) => {
  if (authenticateUser(users, req.body.email) === false) {
    res.status(403);
    res.send("Email not found, please register");
    return;
  } else if (authenticateUser(users, req.body.email, req.body.password) === false) {
    res.status(403);
    res.send("Incorrect password, please try again");
    return;
  } else {
    res.cookie('user_id', authenticateUser(users, req.body.email, req.body.password));
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  const templateVars = { username: users[req.cookies["user_id"]] };
  res.render("login", templateVars);
})

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// get for request page
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = { username: users[req.cookies["user_id"]] };
  console.log("This is a cookie", req.cookies);
  setTimeout(function() { console.log("this is username ", users[userID]) }, 1000);
  res.render("register", templateVars);
});

// registration handler
app.post('/register', (req, res) => {
  // error handling
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send("Please enter a valid email & password");
    return;
  }
  if (authenticateUser(users, req.body.email) !== false) {
    res.status(400);
    res.send("Email already exists, please log in");
    return;
  }
  // initialize user objs
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }

  console.log(users);
  //cookie time
  res.cookie('user_id', userID);
  res.redirect('/urls');
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





