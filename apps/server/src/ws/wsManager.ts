import { WebSocketServer, WebSocket } from 'ws';

export type WSMessage = {
  type: 'status_update';
  assignmentId: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  error?: string;
};

const clients = new Map<string, Set<WebSocket>>();

export function initWSServer(wss: WebSocketServer) {
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://localhost`);
    const assignmentId = url.searchParams.get('id');
    if (!assignmentId) return ws.close();

    if (!clients.has(assignmentId)) clients.set(assignmentId, new Set());
    clients.get(assignmentId)!.add(ws);

    console.log(`WS client connected for assignment: ${assignmentId}`);

    ws.on('close', () => {
      clients.get(assignmentId)?.delete(ws);
      console.log(`WS client disconnected for assignment: ${assignmentId}`);
    });
  });
}

export function broadcast(assignmentId: string, message: WSMessage) {
  const sockets = clients.get(assignmentId);
  if (!sockets) return;
  const payload = JSON.stringify(message);
  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
}