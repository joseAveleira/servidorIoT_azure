const WebSocket = require('ws');

const PORT = 9000;

function startWebSocketService() {
    const wss = new WebSocket.Server({ port: PORT });

    wss.on('connection', (ws) => {
        console.log('Cliente WebRTC conectado');

        ws.on('message', (data) => {
            // Reenviar el mensaje a todos los demás clientes (señalización WebRTC)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data.toString());
                }
            });
        });

        ws.on('close', () => {
            console.log('Cliente WebRTC desconectado');
        });

        ws.on('error', (err) => {
            console.error('Error en WebSocket:', err.message);
        });
    });

    console.log(`Servicio WebSocket (señalización WebRTC) escuchando en el puerto ${PORT}`);
    return wss;
}

module.exports = { startWebSocketService };
