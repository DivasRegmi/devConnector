const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../confg/key");

//Load input Validation
const validateRegistorInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load user Model
const User = require("../../models/User");

//@Route  GET   /api/users/test
//@desc     Test users route
//@access    public
router.get("/test", (req, res) => res.json({ msg: "user All ok" }));

//@Route  POST   /api/users/register
//@desc     Test users route
//@access    public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegistorInput(req.body);

  //Check for erors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "404", //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//@Route  POST   /api/users/login
//@desc     Test users route
//@access    public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      //check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      //check for password match
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //User Matched
          const payLoad = { id: user.id, name: user.name, avatar: user.avatar }; // Json payLOad

          //Jst sign
          jwt.sign(
            payLoad,
            key.secreteOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => console.log(err));
});

//@Route  GET   /api/users/current
//@desc     get current user
//@access    private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      name,
      email,
    });
  }
);

module.exports = router;
