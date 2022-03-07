const express = require("express");
const router = express.Router();
const config = require("config");
const mongoose = require("mongoose");
const auth = require("../../../middleware/auth");

router.put("/", auth, (req, res) => {
  const updateUser = async () => {
    const db = await config.get("mongoUsers");
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        const User = require("../../../models/User");
        const { buasri_id, position, active } = req.body;
        mongoose.set("useFindAndModify", false);
        User.findOneAndUpdate(
          { buasri_id },
          { position, active },
          { new: true }
        ).then((res_user) =>
          res.json({
            buasri_id: res_user.buasri_id,
            position: res_user.position,
            active: res_user.active,
          })
        );
      })
      .catch((err) => console.log(err));
  };
  updateUser();
});

module.exports = router;
