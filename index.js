const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("Public"));
app.use(express.urlencoded({extended:true}))



mongoose
  .connect("mongodb+srv://faisaldeepto:BF5HX7YaucvCBmii@part1.x3hquza.mongodb.net/DBDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists. Please login.");
    }

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();

    res.redirect(`login`);
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Error during signup. Please try again later.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("User not found. Please sign up.");
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.send("Incorrect password. Please try again.");
    }

    res.send(`Welcome back, ${email}! You are now logged in.`);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login. Please try again later.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
