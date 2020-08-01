const express = require("express");
const router = express.Router();


//@Route    /api/users/test
//@desc     Test profile route
//@access    public
router.get("/test", (req, res) => res.json({ msg: "profile All ok" }));

module.exports = router;
