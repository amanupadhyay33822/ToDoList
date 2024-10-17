const db = require("../config/mongoose");
const Dashboard = require("../models/dashboard");
const User = require("../models/User");

module.exports.alltask = async function (req, res) {
  try {
    // Fetch all dashboard data
    const data = await Dashboard.find({});

    // Fetch all user data
    const user = await User.find({});
    console.log(user);
    // Render the result
    return res.render("alltask", {
      title: "Dashboard",
      name: user.length > 0 ? user[0].name : "No Name", // Handle if user array is empty
      dashboard: data,
    });
  } catch (err) {
    // Handle error
    console.log("Error:", err);
    return res.status(500).send("Server error");
  }
};
