import * as config from "../config";
import createLocalAdapter from "./localAdapter";
import createMongoAdapter from "./mongoAdapter";

const adapter = config.isProduction || true
  ? createMongoAdapter()
  : createLocalAdapter();

export default adapter;
