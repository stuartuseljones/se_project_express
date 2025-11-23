const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "692374419bc633969bed6795",
  };
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingitems"));

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
