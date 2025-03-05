import logger from "@/utils/logger";

export default function handler(req, res) {
  logger.info("API test route accessed", { route: "/api/test", method: req.method });
  
  try {
    // Simulating a process
    throw new Error("Test error occurred!");
  } catch (error) {
    logger.error("An error occurred", { error: error.message, stack: error.stack });
  }

  res.status(200).json({ message: "Check logs" });
}
