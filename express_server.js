const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
  });

  app.post("/urls/:id/edit", (req, res) => {
    res.redirect(`/urls/${req.params.id}`);
    });

app.post("/urls/", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const urlId = generateRandomString();
  urlDatabase[urlId] = req.body.longURL
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
})






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





