const express = require("express");
const port = 4000;
const path = require("path");

// require the mongoose file
const db = require("./config/mongoose");
const User = require("./models/User");
const Login = require("./models/login");
const Dashboard = require("./models/dashboard");
const Register = require("./models/User");

const app = express();

// path: routes\index.js
app.get("/", require("./routes"));
app.get("/dashboard", require("./routes"));
app.get("/register", require("./routes"));
app.get("/login", require("./routes"));
app.get("/alltask", require("./routes"));
app.get("/completedtask", require("./routes"));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up the middleware
app.use(express.urlencoded());

// set up the static files
app.use(express.static("assets"));

// registering the user in the database
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

app.post("/register", async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user with hashed password
    const newUser = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log("Successfully Created user!", newUser);
    res.redirect("/dashboard"); // Redirect to dashboard upon success
  } catch (err) {
    console.log("Error Creating user!!", err);
    res.status(500).send("Error Creating user!!"); // Return error response
  }
});

// Ensure bcrypt is required for password comparison

app.post("/login", async (req, res) => {
  

  try {
    // Find user by email
    const { email, password } = req.body;
    const user = await User.findOne({  email: email } );
  console.log(user)
    if (!user) {
      // User not found
      console.log("User not found!");
      return res.status(404).send("User not found!");
    }

    // Check if password matches using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Incorrect password
      console.log("Incorrect password!");
      return res.status(401).send("Incorrect password!");
    }

    // Password matches, proceed with login
    console.log("Login successful!");
  // Assuming session management
    res.redirect("/dashboard");

  } catch (err) {
    // Handle errors
    console.log("Error logging in!", err);
    res.status(500).send("Error logging in!");
  }
});

// adding the task to the database
app.post("/addtask", function (req, res) {
  Dashboard.create({
    task: req.body.task,
    date: req.body.date,
    description: req.body.description,
    time: req.body.time,
    categoryChoosed: req.body.categoryChoosed,
  })
    .then((newTask) => {
      console.log("Successfully Created Task!", newTask);
      res.redirect("back");
    })
    .catch((err) => {
      console.log("Error Creating Task!!", err);
      // res.status(500).send("Error Creating Task!!");
      res.redirect("back");
    });
});

// complate the task to the database
app.get("/complete-task", function (req, res) {
  let id = req.query.id;
  Dashboard.findByIdAndUpdate(id, { completed: true })
    .then((newTask) => {
      console.log("Successfully Complated Task!", newTask);
      res.redirect("back");
    })
    .catch((err) => {
      console.log("Error Complating Task!!", err);
      res.redirect("back");
    });
});

// deleting the task to the database
app.get("/delete-task", function (req, res) {
  let id = req.query.id;
  Dashboard.findByIdAndDelete(id)
    .then((newTask) => {
      console.log("Successfully Deleted Task!", newTask);
      res.redirect("back");
    })
    .catch((err) => {
      console.log("Error Deleting Task!!", err);
      res.redirect("back");
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Yupp! Server is running on port ${port}`);
});
