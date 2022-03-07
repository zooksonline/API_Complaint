const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../../middleware/auth");

// เพิ่มรายละเอียดร้องเรียน
router.put("/add", auth, (req, res) => {
  const listAdd = async () => {
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
        // Complaint Model
        const List = require("../../../models/User");
        const {
          buasri_id,
          type,
          member,
          email,
          phone,
          topic,
          detail,
          status,
          file_name,
          file_path,
        } = req.body;

        mongoose.set("useFindAndModify", false);
        List.findOneAndUpdate(
          { buasri_id },
          {
            $push: {
              list: {
                type,
                member,
                email,
                phone,
                topic,
                detail,
                upload_file: {
                  file_name,
                  file_path,
                },
                status: {
                  status,
                },
              },
            },
          },
          { new: true }
        )
          .then((listdetail) => res.json(listdetail))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  listAdd();
});

// Last List
router.get("/last", auth, (req, res) => {
  const lastList = async () => {
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
        const { buasri_id } = req.body;
        List.aggregate([
          { $match: { buasri_id } },
          { $unwind: "$list" },
          { $sort: { "list._id": -1 } },

          { $unwind: "$list.status" },
          { $sort: { "list.status._id": -1 } },

          { $unwind: "$list.upload_file" },
          { $sort: { "list.upload_file": -1 } },

          { $limit: 1 },
          {
            $group: {
              _id: "$_id",
              list: { $push: "$list" },
            },
          },
        ]).then((lastlistdetail) => res.json(lastlistdetail));
      })
      .catch((err) => console.log(err));
  };
  lastList();
});

// Remove All List in User
router.put("/removeall", auth, (req, res) => {
  const PutList = async () => {
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
        const { buasri_id } = req.body;
        mongoose.set("useFindAndModify", false);
        List.findOneAndUpdate(
          { buasri_id },
          {
            $set: {
              list: [],
            },
          },
          { new: true }
        ).then((listdetail) => res.json(listdetail));
      })
      .catch((err) => console.log(err));
  };
  PutList();
});

// Get All List in User
router.post("/", auth, (req, res) => {
  const ListUser = async () => {
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
        const { buasri_id } = req.body;
        List.aggregate([
          { $match: { buasri_id } },
          { $unwind: "$list" },
          { $unwind: "$list.status" },
          { $unwind: "$list.upload_file" },
          {
            $group: {
              _id: "$list._id",
              list_all: {
                $push: {
                  list_buasri: "$buasri_id",
                  list_type: "$list.type",
                  list_member: "$list.member",
                  list_phone: "$list.phone",
                  list_email: "$list.email",
                  list_topic: "$list.topic",
                  list_detail: "$list.detail",
                  list_status_id: "$list.status._id",
                  list_status: "$list.status.status",
                  list_status_note: "$list.status.note",
                  list_upload_name: "$list.upload_file.file_name",
                  list_upload_path: "$list.upload_file.file_path",
                },
              },
            },
          },
          { $unwind: "$list_all" },
          {
            $group: {
              _id: "$_id",
              buasri_id: { $last: "$list_all.list_buasri" },
              type: { $last: "$list_all.list_type" },
              member: { $last: "$list_all.list_member" },
              topic: { $last: "$list_all.list_topic" },
              phone: { $last: "$list_all.list_phone" },
              email: { $last: "$list_all.list_email" },
              detail: { $last: "$list_all.list_detail" },
              status: { $last: "$list_all.list_status" },
              note: { $last: "$list_all.list_status_note" },
              file_name: { $last: "$list_all.list_upload_name" },
              file_path: { $last: "$list_all.list_upload_path" },
            },
          },
          { $sort: { _id: -1 } },
        ]).then((listdetail) => res.json(listdetail));
      })
      .catch((err) => console.log(err));
  };
  ListUser();
});

// Get All List
router.get("/all", auth, (req, res) => {
  const allList = async () => {
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
        List.aggregate([
          { $unwind: "$list" },
          { $unwind: "$list.status" },
          { $unwind: "$list.upload_file" },
          {
            $group: {
              _id: "$list._id",
              list_all: {
                $push: {
                  list_buasri: "$buasri_id",
                  list_type: "$list.type",
                  list_member: "$list.member",
                  list_phone: "$list.phone",
                  list_email: "$list.email",
                  list_topic: "$list.topic",
                  list_detail: "$list.detail",
                  list_status_id: "$list.status._id",
                  list_status: "$list.status.status",
                  list_status_note: "$list.status.note",
                  list_upload_name: "$list.upload_file.file_name",
                  list_upload_path: "$list.upload_file.file_path",
                },
              },
            },
          },
          { $unwind: "$list_all" },
          {
            $group: {
              _id: "$_id",
              buasri_id: { $last: "$list_all.list_buasri" },
              type: { $last: "$list_all.list_type" },
              member: { $last: "$list_all.list_member" },
              topic: { $last: "$list_all.list_topic" },
              phone: { $last: "$list_all.list_phone" },
              email: { $last: "$list_all.list_email" },
              detail: { $last: "$list_all.list_detail" },
              status: { $last: "$list_all.list_status" },
              note: { $last: "$list_all.list_status_note" },
              file_name: { $last: "$list_all.list_upload_name" },
              file_path: { $last: "$list_all.list_upload_path" },
            },
          },
          { $sort: { _id: -1 } },
        ]).then((alllistdetail) => res.json(alllistdetail));
      })
      .catch((err) => console.log(err));
  };
  allList();
});

// Select List
router.post("/select", auth, (req, res) => {
  const selectList = async () => {
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
        var ObjectId = require("mongoose").Types.ObjectId;
        const { buasri_id, id } = req.body;
        List.aggregate([
          { $match: { buasri_id } },
          { $unwind: "$list" },
          { $unwind: "$list.status" },
          { $unwind: "$list.upload_file" },
          {
            $group: {
              _id: "$list._id",
              list_all: {
                $push: {
                  list_buasri: "$buasri_id",
                  list_type: "$list.type",
                  list_member: "$list.member",
                  list_phone: "$list.phone",
                  list_email: "$list.email",
                  list_topic: "$list.topic",
                  list_detail: "$list.detail",
                  list_status_id: "$list.status._id",
                  list_status: "$list.status.status",
                  list_status_note: "$list.status.note",
                  list_upload_name: "$list.upload_file.file_name",
                  list_upload_path: "$list.upload_file.file_path",
                },
              },
            },
          },
          { $unwind: "$list_all" },
          {
            $group: {
              _id: "$_id",
              buasri_id: { $last: "$list_all.list_buasri" },
              type: { $last: "$list_all.list_type" },
              member: { $last: "$list_all.list_member" },
              topic: { $last: "$list_all.list_topic" },
              phone: { $last: "$list_all.list_phone" },
              email: { $last: "$list_all.list_email" },
              detail: { $last: "$list_all.list_detail" },
              status: { $last: "$list_all.list_status" },
              note: { $last: "$list_all.list_status_note" },
              file_name: { $last: "$list_all.list_upload_name" },
              file_path: { $last: "$list_all.list_upload_path" },
            },
          },
          { $match: { _id: ObjectId(id) } },
          { $sort: { _id: -1 } },
        ])
          .then((listdetail) => {
            res.json(listdetail);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  selectList();
});

module.exports = router;
