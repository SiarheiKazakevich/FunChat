export interface User {
  id: string;
  name: string;
}

export interface AppState {
  user: User | null;
  isAuthorized: boolean;
  socket: WebSocket | null;
}