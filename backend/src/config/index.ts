const {
  PORT = 8080,
  NODE_ENV = "development",
  ADMIN_PASS = "kevin",
  MONGO_URL,
} = process.env;

const isProduction = NODE_ENV !== "development";

export { isProduction, PORT, MONGO_URL, ADMIN_PASS };
