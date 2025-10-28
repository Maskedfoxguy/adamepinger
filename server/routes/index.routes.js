const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});


module.exports = router;
