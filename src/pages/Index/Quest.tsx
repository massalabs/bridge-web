import { useEffect } from 'react';

import { QUEST_CONNECT_WALLET, QUEST_NAME, QUEST_SERVER } from '@/const';
import { usePost } from '@/custom/api';
import { useAccountStore } from '@/store/store';

export function ICOQuest() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);
  const ICOQuest = usePost(
    `register_quest/${QUEST_NAME}/${QUEST_CONNECT_WALLET}/${connectedAccount?.address()}`,
    QUEST_SERVER,
  );

  useEffect(() => {
    if (connectedAccount && connectedAccount?.address()) {
      notifyICOQuest();
    }
  }, [connectedAccount]);

  async function notifyICOQuest() {
    try {
      await ICOQuest.mutateAsync({});
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}
