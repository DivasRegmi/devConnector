const express = require("express");
const router = express.Router();

//@Route    /api/users/test
//@desc     Test posts route
//@access    public
router.get("/test", (req, res) => res.json({msg: "post All ok"}));

module.exports = router;
