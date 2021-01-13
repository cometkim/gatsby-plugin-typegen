import type {
  ActionObject,
  ActionFunction,
  ServiceConfig,
  AnyEventObject,
} from 'xstate';
import type { Unwrap } from '@cometjs/core';
import type { RequiredPluginOptions } from '../../../plugin-utils';
import type { autoFixFiles } from './service';

export type AutoFixContext = {
  files: string[],
  pluginOptions: RequiredPluginOptions,
};

export type AutoFixEvent = (
  | { type: 'done.invoke.autoFixFiles', data: Unwrap<ReturnType<typeof autoFixFiles>> }
);

export type AutoFixActionName = (
  | 'reportAutoFixResults'
);

export type AutoFixActionMap = Record<
  AutoFixActionName,
  (
    | ActionObject<AutoFixContext, AutoFixEvent>
    | ActionFunction<AutoFixContext, AutoFixEvent>
  )
>;

export type AutoFixServiceName = (
  | 'autoFixFiles'
);

export type AutoFixServiceMap = Record<
  AutoFixServiceName,
  ServiceConfig<AutoFixContext, AutoFixEvent>
>;

export type AutoFixConfig = {
  actions: AutoFixActionMap,
  services: AutoFixServiceMap,
};
