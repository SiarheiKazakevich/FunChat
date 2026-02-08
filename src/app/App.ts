export class App {
  public start(): void {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);
  }
}