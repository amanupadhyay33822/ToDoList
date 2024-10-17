const db = require("../config/mongoose");
const Dashboard = require("../models/dashboard");
const User = require("../models/User");

module.exports.completedtask = async function (req, res) {
  try {
    // Fetch dashboard data
    const data = await Dashboard.find({});

    // Fetch a specific user based on email
    const user = await User.findOne({ email: "ankitvis609@gmail.com" });

    // Log the user's name
    console.log(`**********user`, user ? user.name : "User not found");

    // Render the completed task view
    return res.render("completedtask", {
      title: "Dashboard",
      name: user ? user.name : "No Name", // Handle if user is not found
      dashboard: data,
    });
  } catch (err) {
    // Handle any errors
    console.log("Error:", err);
    return res.status(500).send("Server error");
  }
};
