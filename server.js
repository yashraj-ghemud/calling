const { WebSocketServer } = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

// Map to store connected clients: userId -> WebSocket
const clients = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            switch (data.type) {
                case 'register':
                    if (data.userId) {
                        clients.set(data.userId, ws);
                        ws.userId = data.userId;
                        console.log(`User registered: ${data.userId}`);
                    }
                    break;
                case 'call':
                case 'offer':
                case 'answer':
                case 'ice_candidate':
                case 'reject':
                case 'end_call':
                    // Route message to the destination user
                    if (data.to && clients.has(data.to)) {
                        const targetWs = clients.get(data.to);
                        if (targetWs.readyState === targetWs.OPEN) {
                            targetWs.send(JSON.stringify(data));
                        }
                    } else {
                        console.log(`Target user ${data.to} is offline or not found`);
                    }
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${ws.userId}`);
        if (ws.userId) {
            clients.delete(ws.userId);
        }
    });
});

console.log(`Signaling server running on port ${port}`);
