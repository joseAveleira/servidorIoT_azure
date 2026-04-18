const WebSocket = require('ws');
const url = require('url');

const PORT = 9000;

function startWebSocketService() {
    const wss = new WebSocket.Server({ port: PORT });

    wss.on('connection', (ws, req) => {
        // Leer ?room=xxx de la URL; si no viene, sala 'default'
        const { query } = url.parse(req.url, true);
        ws.room = query.room || 'default';

        console.log(`Cliente WebRTC conectado a sala: ${ws.room}`);

        ws.on('message', (data) => {
            // Reenviar solo a los clientes de la MISMA sala
            wss.clients.forEach((client) => {
                if (
                    client !== ws &&
                    client.readyState === WebSocket.OPEN &&
                    client.room === ws.room
                ) {
                    client.send(data.toString());
                }
            });
        });

        ws.on('close', () => {
            console.log(`Cliente WebRTC desconectado de sala: ${ws.room}`);
        });

        ws.on('error', (err) => {
            console.error('Error en WebSocket:', err.message);
        });
    });

    console.log(`Servicio WebSocket (señalización WebRTC) escuchando en el puerto ${PORT}`);
    return wss;
}

module.exports = { startWebSocketService };
