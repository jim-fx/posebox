import * as fetch from "./fetch";
import * as socket from "./socket";
import * as wrappers from "./wrappers";

export default { ...fetch, ...socket, ...wrappers };
