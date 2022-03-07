const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

const config = require("config");
const port = config.get("portENV");

// CORS
app.use(cors());
// Body-Parser Middleware
app.use(express.json());
// file Upload
app.use(fileUpload());

// Register
register = require("./routes/api/user/register");
app.use("/api/register", register);

// Auth
auth_user = require("./routes/api/user/auth");
app.use("/api/auth/", auth_user);

// update User
update_user = require("./routes/api/user/update_user");
app.use("/api/update/user", update_user);

// List User
user_list = require("./routes/api/user_list/list");
app.use("/api/list/user", user_list);

// Upload File
upload_file = require("./routes/api/user_list/upload_file");
app.use("/api/list/upload", upload_file);

// update status & file
update_status = require("./routes/api/user_list/status");
app.use("/api/update/status", update_status);

// Load Image
app.use("/uploads", express.static("./uploads"));

// List Admin

// app.listen(port);
app.listen(port, () => console.log(`Server ทำงานอยู่ที่ Port ${port}`));
