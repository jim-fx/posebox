const {
  PORT = 8080,
  NODE_ENV = "development",
  MONGO_URL = "mongodb://127.0.0.1:27017",
} = process.env;

const isProduction = NODE_ENV !== "development";

export { isProduction, PORT, MONGO_URL };
