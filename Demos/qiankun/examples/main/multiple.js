import { loadMicroApp } from '../../es';

let app;

function mount() {
  app = loadMicroApp(
    { name: 'vue', entry: '//localhost:7101', container: '#vue' },
    // { name: 'react15', entry: '//localhost:7102', container: '#react15' },
    { sandbox: { experimentalStyleIsolation: true } },
  );
}

function unmount() {
  app.unmount();
}

document.querySelector('#mount').addEventListener('click', mount);
document.querySelector('#unmount').addEventListener('click', unmount);

loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' });
// loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' }, { sandbox: { strictStyleIsolation: true } });
// loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#vue' });
