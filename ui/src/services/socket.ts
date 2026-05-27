import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token: string) {
    if (socket?.connected) {
        return socket;
    }

    if (socket) {
        socket.disconnect();
    }

    socket = io('http://localhost:3005', {
        auth: {
            token,
        },
        transports: ['websocket', 'polling'],
    });

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}