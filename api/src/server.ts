import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`✓ API server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();