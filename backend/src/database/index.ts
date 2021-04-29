import * as config from "../config";
import createLocalAdapter from "./localAdapter";
import createMongoAdapter from "./mongoAdapter";

const adapter = config.isProduction
  ? createMongoAdapter()
  : createLocalAdapter();

export default adapter;
