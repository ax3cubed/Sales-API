import "reflect-metadata";
import { HOST, NODE_ENV, PORT } from "@/common/config/env/index";
import { app } from "@/server";
import { logger } from "./common/config/logger/logger.config";

const server = app.listen(PORT, () => {
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
