type MessageHandler = (data: unknown) => void;
type VoidHandler = () => void;

export class WebSocketService {
  private socket: WebSocket | null = null;

  private messageHandlers: MessageHandler[] = [];
  private openHandlers: VoidHandler[] = [];
  private closeHandlers: VoidHandler[] = [];

  public constructor(private readonly url: string) { }

  // 🔹 подключение
  public connect(): void {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => {
      this.openHandlers.forEach((h) => h());
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((h) => h(data));
    });

    this.socket.addEventListener('close', () => {
      this.socket = null;
      this.closeHandlers.forEach((h) => h());
    });
  }

  // 🔹 отправка
  public send(data: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.send(JSON.stringify(data));
  }

  // 🔹 подписки
  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public onOpen(handler: VoidHandler): void {
    this.openHandlers.push(handler);
  }

  public onClose(handler: VoidHandler): void {
    this.closeHandlers.push(handler);
  }

  // 🔹 закрытие
  public disconnect(): void {
    this.socket?.close();
  }
}