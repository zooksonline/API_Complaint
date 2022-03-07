const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../../middleware/auth");

// Add Upload File when Update status
router.put("/", auth, (req, res) => {
  // console.log(req.body);
  const fileUpdate = async () => {
    // DB Config
    const mongoose = require("mongoose");
    const db = config.get("mongoUsers");

    //   Connect Mongo
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        const List = require("../../../models/User");
        const { buasri_id, id, status, note, file_name, file_path } = req.body;
        mongoose.set("useFindAndModify", false);
        List.findOneAndUpdate(
          { buasri_id, "list._id": id },
          {
            $push: {
              "list.$.status": { status, note },
              "list.$.upload_file": { file_name, file_path },
            },
          },
          { new: true }
        ).then((listdetail) => res.json(listdetail));
      })
      .catch((err) => console.log(err));
  };
  fileUpdate();
});

module.exports = router;
