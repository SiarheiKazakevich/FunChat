import { Router } from '../router/Router';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { AboutPage } from '../pages/AboutPage';
import { store } from '../store/index';
import { WebSocketService } from '../services/WebSocketService';

export class App {
  public start(): void {

    const socket = new WebSocketService('ws://localhost:4000'); // ← порт сервера из задания
    //const socket = new WebSocketService('ws://localhost:8080');

    socket.onOpen(() => console.log('WS connected'));
    socket.onClose(() => console.log('WS disconnected'));
    socket.onReconnect(() => console.log('WS reconnecting...'));

    socket.onMessage((msg) => console.log('WS message:', msg));


    socket.connect();

    socket.onOpen(() => {
      console.log('WS connected');
      store.setState({ socket: socket as unknown as WebSocket });
    });

    socket.onMessage((msg) => {
      console.log('WS message:', msg);
    });

    socket.onClose(() => {
      console.log('WS closed');
    });

    const root = document.createElement('div');
    document.body.append(root);

    const router = new Router(root);

    // ✅ маршруты с guard-флагами
    router.register('/login', {
      handler: LoginPage,
      guestOnly: true,
    });

    router.register('/', {
      handler: MainPage,
      protected: true,
    });

    router.register('/about', {
      handler: AboutPage,
    });

    store.subscribe((state) => {
      console.log('STATE UPDATED:', state);

      if (state.isAuthorized) {
        router.go('/');
      } else {
        router.go('/login');
      }
    });

    router.start();
  }
}