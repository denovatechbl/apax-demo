import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("Mongoose Connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;