import * as config from "../config/index.js";
import * as localAdapter from "./localAdapter/index.js";
import * as mongoAdapter from "./mongoAdapter/index.js";

const adapter = true || config.isProduction ? mongoAdapter : localAdapter;

export default adapter;
