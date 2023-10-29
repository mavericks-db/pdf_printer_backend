const express = require("express");
const app = express();
require("dotenv").config();

// env variables
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the server" });
});

// listening to port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
