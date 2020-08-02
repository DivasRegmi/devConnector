const express = require("express");
const router = express.Router();
const mongooose = require("mongoose");
const passport = require("passport");

//Load Profile model
const Profile = require("../../models/Profile");

//Load User Model
const User = require("../../models/User");

//@Route  GET  /api/post/test
//@desc     Test profile route
//@access    public
router.get("/test", (req, res) => res.json({ msg: "profile All ok" }));

//@Route GET /api/post
//@desc      Get the current user Profile
//@access    private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
