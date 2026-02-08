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