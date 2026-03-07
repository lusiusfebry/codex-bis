import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";

const port = Number(process.env.PORT ?? 5000);

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch(async (error) => {
  console.error("Gagal menjalankan server:", error);
  await disconnectDatabase();
  process.exit(1);
});
