import { Server, Response } from 'miragejs';

import { QUEST_SERVER } from '@/const';

export function routesForQuest(server: Server) {
  server.post(
    `${QUEST_SERVER}/register_quest/:project/:quest/:address`,
    (_, request) => {
      const { project, quest, address } = request.params;

      if ([project, quest, address].includes('undefined'))
        return new Response(404, {}, { code: '404', error: 'Not Found' });

      return new Response(201);
    },
  );
}
