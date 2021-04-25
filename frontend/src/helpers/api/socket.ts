import { io } from "socket.io-client";

const socket = io();

const on = (eventType, cb) => socket.on(eventType, cb);
const off = (eventType, cb) => socket.off(eventType, cb);
const emit = socket.emit;

export { on, off, emit };
