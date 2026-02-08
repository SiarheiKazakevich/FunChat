import { Router } from '../router/Router';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { AboutPage } from '../pages/AboutPage';
import { store } from '../store/index';

export class App {
  public start(): void {
    const root = document.createElement('div');
    document.body.append(root);

    const router = new Router(root);

    router.register('/login', LoginPage);
    router.register('/', MainPage);
    router.register('/about', AboutPage);

    store.subscribe((state) => {
      console.log('STATE UPDATED:', state);
    });

    router.start();
  }
}