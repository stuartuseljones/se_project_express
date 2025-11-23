const router = require("express").Router();
const { getUser, getUsers, createUser } = require("../controllers/users");
const ERROR_CODES = require("../utils/errors");

router.get("/", getUsers);

router.get("/:userId", getUser);

router.post("/", createUser);

router.use((req, res) => {
  res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
