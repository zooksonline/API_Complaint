const express = require("express");
const router = express.Router();
const config = require("config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Register Complaint User
router.post("/", (req, res) => {
  const registerUser = async () => {
    // DB Config
    const db = await config.get("mongoUsers");
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        const Complaint = require("../../../models/User");
        const { buasri_id, email, position, active } = req.body;
        const newComplaint = new Complaint({
          buasri_id,
          email,
          position,
          active,
        });
        newComplaint
          .save()
          .then((user) => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token: token,
                  user,
                });
              }
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  registerUser();
});

module.exports = router;
