const db = require("../config/mongoose");
const Dashboard = require("../models/dashboard");
const User = require("../models/User");

module.exports.dashboard = async function (req, res) {
  try {
    // Fetch dashboard data
    const data = await Dashboard.find({});

    // Fetch a specific user based on email
    const user = await User.findOne({ email: "ankitvis609@gmail.com" });

    // Render the dashboard view
    return res.render("dashboard", {
      title: "Dashboard",
      // name: user.name, // Uncomment this if you want to use the user's name
      dashboard: data,
    });
  } catch (err) {
    // Handle any errors
    console.log("Error:", err);
    return res.status(500).send("Server error");
  }
};
