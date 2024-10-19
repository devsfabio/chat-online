import { WebSocketServer } from 'ws';
import dontenv from 'dotenv';

dontenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    wss.clients.forEach((client) => client.send(data.toString()));
  });

  console.log('client connected');
});
