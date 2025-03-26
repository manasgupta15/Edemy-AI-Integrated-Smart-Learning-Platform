// import mongoose from "mongoose";

// // connect to the MongoDB database

// const connectDB = async () => {
//   mongoose.connection.on("connected", () => console.log("Database connected"));

//   await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
// };

// // Verify GridFS collections exist
// mongoose.connection.once("open", () => {
//   console.log("✅ MongoDB connected and GridFS ready");
// });

// export default connectDB;

import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

// Initialize GridFS bucket
let gfs;

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`);

    // Initialize GridFS after connection
    gfs = new GridFSBucket(mongoose.connection.db, {
      bucketName: "thumbnails",
    });

    console.log("✅ MongoDB connected and GridFS ready");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Export both connectDB and gfs as named exports
export { connectDB, gfs };
