const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ENUM
const position_enum = ["ADMIN", "USER"];
const active_enum = ["ACTIVE", "INACTIVE"];
const type_enum = [
  "BUILDING",
  "LEARNING",
  "SERVICES",
  "ACTIVITY",
  "ETHICAL",
  "OTHER",
];
const member_enum = ["MEMBER", "GUEST"];
const status_enum = ["WAITING", "RECEIVED", "CONSIDERING", "EDIT", "RESULT"];

// Create Shema
// Upload File
const UploadSchema = new Schema(
  {
    updated: {
      type: Date,
      default: Date.now,
    },
    file_name: {
      type: String,
    },
    file_path: {
      type: String,
    },
  },
  { timestamps: true }
);

// Status
const StatusSchema = new Schema(
  {
    updated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: status_enum,
      default: "WAITING",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);
// List
const ListSchema = new Schema(
  {
    type: {
      type: String,
      enum: type_enum,
      default: "OTHER",
      required: true,
    },
    member: {
      type: String,
      enum: member_enum,
      default: "MEMBER",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    topic: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    upload_file: [UploadSchema],
    status: [StatusSchema],
  },
  { timestamps: true }
);

// User
const UserSchema = new Schema(
  {
    buasri_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true },
    position: {
      type: String,
      enum: position_enum,
      default: "USER",
      required: true,
    },
    active: {
      type: String,
      enum: active_enum,
      default: "ACTIVE",
      required: true,
    },
    list: [ListSchema],
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("usercomplaint", UserSchema);
