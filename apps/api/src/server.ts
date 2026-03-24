import app from "./app";
import { apiEnv } from "@notifyflow/env";

const PORT = apiEnv.PORT || 3004;

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Environment: ${apiEnv.NODE_ENV}`);
});

// graceful shutdown - important for Docker and AWS deployments
// when the process receives SIGTERM (e.g. container stopping),
// finish existing requests before closing
process.on("SIGTERM", () => {
  console.log("SIGTERM received = shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received - shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
