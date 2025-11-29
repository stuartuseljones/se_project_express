const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ERROR_CODES = require("./utils/errors");
const indexRouter = require("./routes/index");

const auth = require("./middlewares/auth");

const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/", indexRouter);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingitems"));

app.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
