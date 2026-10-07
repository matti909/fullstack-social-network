import mongoose from "mongoose";
import "dotenv/config";

export async function initDatabase(): Promise<void> {
  const DATABASE_URL = process.env["MONGODB_URI"];

  if (!DATABASE_URL) {
    throw new Error("MONGODB_URI no está definida");
  }

  mongoose.connection.on("open", () => {
    console.info("successfully connected to database:", DATABASE_URL);
  });

  mongoose.connect(DATABASE_URL);
  console.log("MongoDB conectado");
}
