import { store } from '../store/index';

type RouteHandler = () => HTMLElement;

interface Route {
  handler: RouteHandler;
  protected?: boolean; // только для авторизованных
  guestOnly?: boolean; // только для гостей
}

export class Router {
  private routes = new Map<string, Route>();

  public constructor(private readonly root: HTMLElement) {
    window.addEventListener('popstate', () => {
      this.render(window.location.pathname);
    });
  }

  public register(path: string, route: Route): void {
    this.routes.set(path, route);
  }

  public go(path: string): void {
    window.history.pushState({}, '', path);
    this.render(path);
  }

  public start(): void {
    this.render(window.location.pathname);
  }

  private render(path: string): void {
    const route = this.routes.get(path);

    if (!route) {
      this.root.textContent = '404';
      return;
    }

    const { isAuthorized } = store.getState();

    // 🔹 GUARDS
    if (route.protected && !isAuthorized) {
      this.go('/login');
      return;
    }

    if (route.guestOnly && isAuthorized) {
      this.go('/');
      return;
    }

    const page = route.handler();

    this.root.innerHTML = '';
    this.root.append(page);
  }
}