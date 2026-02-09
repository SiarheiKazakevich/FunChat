import { store } from '../store/index';

export function LoginPage(): HTMLElement {
  const btn = document.createElement('button');
  btn.textContent = 'Fake login';

  btn.onclick = () => {
    store.setState({
      user: { id: '1', name: 'John' },
      isAuthorized: true,
    });
  };

  return btn;
}