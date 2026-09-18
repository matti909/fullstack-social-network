import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env["MONGODB_URI"];
export async function initDatabase(): Promise<void> {
  if (!uri) {
    throw new Error("MONGODB_URI no está definida");
  }

  mongoose.connection.on("open", () => {
    console.info("successfully connected to database:", uri);
  });

  console.log("MongoDB conectado");
}
