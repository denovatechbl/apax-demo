import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

const connectDatabase = async (): Promise<void> => {
  try {
    // `useNewUrlParser` / `useUnifiedTopology` were removed from the
    // underlying MongoDB driver years ago — passing them now throws
    // MongoParseError on connect. Modern mongoose/mongodb no longer need
    // them at all.
    await mongoose.connect(MONGO_URI);

    console.log("Mongoose Connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;