import { Server, Response } from 'miragejs';

export function routesForQuest(server: Server) {
  server.post('/register_quest/:project/:quest/:address', (_, request) => {
    const { project, quest, address } = request.params;

    if ([project, quest, address].includes('undefined'))
      return new Response(404, {}, { code: '404', error: 'Not Found' });

    return new Response(201);
  });
}
