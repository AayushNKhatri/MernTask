import mongoose from "mongoose";

export const db = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Optional: Exit app if DB connection fails
  }
};
