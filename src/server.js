
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;
console.log("MONGODB_URI loaded:", Boolean(process.env.MONGODB_URI));
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express only after successful connection
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `DevTrack server running on port ${PORT}`
      );

      console.log(
        `Environment: ${process.env.NODE_ENV}`
      );
    });

    server.on("error", (error) => {
      console.error("Server error:", error.message);
      process.exit(1);
    });

  } catch (error) {
    console.error("Application startup failed.");
    process.exit(1);
  }
};

startServer();