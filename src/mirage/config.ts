import { createServer } from 'miragejs';

import { factories } from './factories';
import { handlers } from './handlers';
import { models } from './models';
import { ENV } from '../const/env/env';

export function mockServer(environment = ENV.DEV) {
  const server = createServer({
    environment,
    models,
    factories,
    seeds(server) {
      server.createList('account', 5);
      server.create('network');
    },
    // Axios has some issue with mock in mirage, see below:
    // https://github.com/miragejs/miragejs/issues/1006#issuecomment-1439946798
    routes() {
      const NativeXMLHttpRequest = window.XMLHttpRequest;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.XMLHttpRequest = function XMLHttpRequest() {
        const request = new NativeXMLHttpRequest();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete request.onloadend;
        return request;
      };
    },
  });

  for (const namespace of Object.keys(handlers)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handlers[namespace](server);
  }

  server.passthrough('https://rpc.sepolia.org');
  server.passthrough('https://eth-sepolia.g.alchemy.com/**');
  server.passthrough('https://station.massa/**');
  server.passthrough('https://buildnet.massa.net/**');

  return server;
}
