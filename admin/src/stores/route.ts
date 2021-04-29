import { writable } from "svelte/store";

let activeRoute: string =
  window.location.hash.length > 2
    ? window.location.hash.replace("#", "")
    : "index";

const route = writable(activeRoute);

route.subscribe((v) => {
  window.location.hash = v;
});

export default route;
