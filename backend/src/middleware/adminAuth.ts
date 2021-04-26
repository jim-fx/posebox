import basicAuth from "express-basic-auth";
import * as config from "../config";

export default basicAuth({
  users: { admin: config.ADMIN_PASS },
  challenge: true,
});
