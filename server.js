const express = require("express");
const mongoose = require("mongoose");
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//Db configuration
const db = require("./confg/key").mongoURI;

//connect to db
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoose conected successfully"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("<h1>Hello diasdfadfvas</h1>");
});

//use Routes
app.use('/api/users', users)
app.use('/api/posts', posts)
app.use('/api/profile', profile)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port" + PORT));
