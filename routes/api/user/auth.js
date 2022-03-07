const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../../middleware/auth");

// auth to Complaint Page
router.post("/", (req, res) => {
  console.log(req.body);
  const authUser = async () => {
    // Connect Mongo
    const db = config.get("mongoUsers");
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        // Complaint Model
        const User = require("../../../models/User");
        const { buasri_id } = req.body;
        if (!buasri_id) {
          return res
            .status(400)
            .json({
              msg: "ไม่มีข้อมูล Buasri ID ในระบบ Complaint โปรดเข้าใช้งานใหม่",
            });
        }
        mongoose.set("useFindAndModify", false);
        User.findOne({ buasri_id }).then((user) => {
          if (!user) {
            return res
              .status(400)
              .json({ msg: "BuasriID ไม่มีอยู่ในระบบ Complaint" });
          }
          if (user.active === "INACTIVE") {
            return res.status(400).json({
              msg:
                "BuasriID นี้ไม่สามารถใช้งานได้ในระบบ Complaint กรุณาติดต่อผู้ดูแล",
            });
          }
          jwt.sign(
            {
              id: user.id,
              buasri_id: user.buasri_id,
              email: user.email,
              position: user.position,
            },
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
        }).catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  authUser();
});

// auth with Token (/user)
router.get("/user", auth, (req, res) => {
  const authwithToken = async () => {
    // Connect Mongo
    const db = config.get("mongoUsers");
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        const User = require("../../../models/User");
        User.findById(req.user.id).then((user) => res.json(user));
      })
      .catch((err) => console.log(err));
  };
  authwithToken();
});

module.exports = router;
