import type { AppState } from '../types/index';

type Listener = (state: AppState) => void;

export class Store {
  private state: AppState = {
    user: null,
    isAuthorized: false,
    socket: null,
  };

  private listeners: Listener[] = [];

  public getState(): AppState {
    return this.state;
  }

  public setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
