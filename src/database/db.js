import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(`connect to ${connect.connection.host}`);
  } catch (error) {
    console.log("ERREUR de connection", error.message);
    process.exit(1);
  }
}
