type MessageHandler = (data: unknown) => void;
type VoidHandler = () => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private messageHandlers: MessageHandler[] = [];
  private openHandlers: VoidHandler[] = [];
  private closeHandlers: VoidHandler[] = [];
  private reconnectHandlers: VoidHandler[] = [];

  constructor(private readonly url: string, private readonly reconnectDelay = 3000) { }

  public connect(): void {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => {
      console.log('WS connected');
      this.openHandlers.forEach((h) => h());
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((h) => h(data));
    });

    this.socket.addEventListener('close', () => {
      console.log('WS closed');
      this.socket = null;
      this.closeHandlers.forEach((h) => h());

      // 🔹 авто-reconnect
      this.reconnectTimer = setTimeout(() => {
        console.log('WS reconnecting...');
        this.reconnectHandlers.forEach((h) => h());
        this.connect();
      }, this.reconnectDelay);
    });

    this.socket.addEventListener('error', () => {
      console.warn('WS error occurred');
      this.socket?.close();
    });
  }

  public send(data: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.send(JSON.stringify(data));
  }

  public disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
  }

  // Подписки
  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public onOpen(handler: VoidHandler): void {
    this.openHandlers.push(handler);
  }

  public onClose(handler: VoidHandler): void {
    this.closeHandlers.push(handler);
  }

  public onReconnect(handler: VoidHandler): void {
    this.reconnectHandlers.push(handler);
  }
}