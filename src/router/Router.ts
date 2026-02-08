type RouteHandler = () => HTMLElement;

export class Router {
  private routes = new Map<string, RouteHandler>();

  public constructor(private readonly root: HTMLElement) {
    window.addEventListener('popstate', () => {
      this.render(window.location.pathname);
    });
  }

  public register(path: string, handler: RouteHandler): void {
    this.routes.set(path, handler);
  }

  public go(path: string): void {
    window.history.pushState({}, '', path);
    this.render(path);
  }

  public start(): void {
    this.render(window.location.pathname);
  }

  private render(path: string): void {
    const handler = this.routes.get(path);

    if (!handler) {
      this.root.textContent = '404';
      return;
    }

    const page = handler();

    this.root.innerHTML = '';
    this.root.append(page);
  }
}