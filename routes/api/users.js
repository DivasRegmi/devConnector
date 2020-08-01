const express = require('express');
const router = express.Router()


//@Route    /api/users/test
//@desc     Test users route
//@access    public
router.get("/test", (req, res) => res.json({ msg: "user All ok" }));

module.exports = router