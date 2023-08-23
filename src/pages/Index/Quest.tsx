import { useEffect } from 'react';

import { PROJECT_QUEST, PROJECT_NAME } from '@/const';
import { usePost } from '@/custom/api';
import { useAccountStore } from '@/store/store';

export function ICOQuest() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);
  const ICOQuest = usePost(
    `register_quest/${PROJECT_NAME}/${PROJECT_QUEST}/${connectedAccount?.address()}`,
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
