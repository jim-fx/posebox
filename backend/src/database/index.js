import * as config from "../config/index.js";
import * as localAdapter from "./localAdapter/index.js";
import * as mongoAdapter from "./mongoAdapter/index.js";

console.log("isProduction", config.isProduction);

const adapter = true || config.isProduction ? mongoAdapter : localAdapter;

console.log("MONGO_ADAPTER", Object.keys(adapter));

export default adapter;
