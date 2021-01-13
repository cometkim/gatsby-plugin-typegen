import { Machine, actions } from 'xstate';

import type {
  AutoFixContext,
  AutoFixEvent,
  AutoFixConfig,
} from './types';

const machine = Machine<AutoFixContext, AutoFixEvent>({
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        src: 'autoFixCode',
        onDone: 'settled',
      },
    },
    settled: {
      type: 'final',
      entry: 'reportRejectedResults',
    },
  },
});

interface MakeAutoFixCodeScheduler {
  (args: {
    config: AutoFixConfig,
  }): typeof machine;
}
export const makeAutoFixCodeScheduler: MakeAutoFixCodeScheduler = ({ config }) => {
  return machine.withConfig(config);
};
