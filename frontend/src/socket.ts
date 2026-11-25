import { io } from 'socket.io-client'

const PORT = 3000;
export const socket = io(`http://${window.location.hostname}:${PORT}`);