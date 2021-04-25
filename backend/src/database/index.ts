import * as config from "../config/index.js";
import createLocalAdapter from "./localAdapter/index.js";
import createMongoAdapter from "./mongoAdapter/index.js";

const adapter = config.isProduction
  ? createMongoAdapter()
  : createLocalAdapter();

export default adapter;
