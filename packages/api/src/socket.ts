import { io, Socket } from "socket.io-client";

const socket: Socket = io();

type socketOnCB = (eventType: string, cb: (...args: any[]) => void) => Socket;
type socketOffCB = (eventType: string, cb: (...args: any[]) => void) => any;

const on: socketOnCB = (eventType, cb) => socket.on(eventType, cb);
const off: socketOffCB = (eventType, cb) => socket.off(eventType, cb);
const emit: typeof socket.emit = socket.emit;

export { on, off, emit };
