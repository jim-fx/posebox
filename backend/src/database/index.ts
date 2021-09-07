import * as config from "../config";
import createLocalAdapter from "./localAdapter";
import createMongoAdapter from "./mongoAdapter";

const adapter = config.MONGO_URL
  ? createMongoAdapter()
  : createLocalAdapter();

export default adapter;
