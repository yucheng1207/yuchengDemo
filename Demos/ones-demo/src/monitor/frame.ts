import { perfMonitorEvents, perfMonitorEventType } from './event';
import { getCurrentHub } from '@sentry/react';
import type { Transaction } from '@sentry/types';

interface FrameInfo {
  op: string;
  description: string;
  /** seconds */
  startTimestamp: number;
  /** seconds */
  endTimestamp: number;
}

function getActiveTransaction(): Transaction | undefined {
  const hub = getCurrentHub();
  const scope = hub.getScope();
  return scope?.getTransaction();
}

function initFrame() {
  perfMonitorEvents.addListener(perfMonitorEventType.FRAME, (info: FrameInfo) => {
    const transaction = getActiveTransaction();
    if (!transaction) {
      return;
    }

    transaction.startChild({
      description: info.description,
      op: info.op,
      startTimestamp: info.startTimestamp,
      endTimestamp: info.endTimestamp,
    });
  });
}

export { initFrame };
