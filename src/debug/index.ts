import { print } from 'graphql';
import type { DataProvider } from 'ra-core';
import type { BuildQuery } from '../buildQuery';
import type { IntrospectionResult } from '../types';

type RequestCtx = {
  id: number;
  fetchType: string;
  resource: string;
  start: number;
};

const PROVIDER_METHODS = [
  'getList',
  'getOne',
  'getMany',
  'getManyReference',
  'create',
  'update',
  'updateMany',
  'delete',
  'deleteMany',
] as const;

const TAG = '[ra-data-hasura]';

export type Debugger = {
  wrapBuildQuery: (factory: BuildQuery) => BuildQuery;
  wrapDataProvider: (provider: DataProvider) => DataProvider;
};

export const createDebugger = (): Debugger => {
  let counter = 0;
  let introspectionStartedAt = 0;
  let introspectionLogged = false;
  let introspectionRequested = false;
  const pending: RequestCtx[] = [];

  const safe = (fn: () => void) => {
    try {
      fn();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`${TAG} debug logging failed`, err);
    }
  };

  const wrapBuildQuery: Debugger['wrapBuildQuery'] = (originalFactory) => {
    return (introspectionResults: IntrospectionResult) => {
      if (!introspectionLogged) {
        introspectionLogged = true;
        const durationMs = introspectionStartedAt
          ? Date.now() - introspectionStartedAt
          : 0;
        safe(() => {
          // eslint-disable-next-line no-console
          console.log(`${TAG} introspection complete`, {
            durationMs,
            resources: introspectionResults.resources.length,
          });
        });
      }
      const realBuildQuery = originalFactory(introspectionResults);
      return (fetchType, resource, params) => {
        const result = realBuildQuery(fetchType, resource, params);
        const ctx = pending.shift();
        const id = ctx ? ctx.id : 0;
        const method = ctx ? ctx.fetchType : String(fetchType);
        safe(() => {
          // eslint-disable-next-line no-console
          console.groupCollapsed(`${TAG} #${id} ${method} ${resource}`);
          // eslint-disable-next-line no-console
          console.log('fetchType', fetchType);
          // eslint-disable-next-line no-console
          console.log('params', params);
          let queryString: string;
          try {
            queryString = print(result.query);
          } catch {
            queryString = String(result.query);
          }
          // eslint-disable-next-line no-console
          console.log('query', queryString);
          // eslint-disable-next-line no-console
          console.log('variables', result.variables);
          // eslint-disable-next-line no-console
          console.groupEnd();
        });
        return result;
      };
    };
  };

  const wrapDataProvider: Debugger['wrapDataProvider'] = (provider) => {
    const wrapped: Record<string, unknown> = { ...provider };
    for (const method of PROVIDER_METHODS) {
      const original = (provider as unknown as Record<string, unknown>)[method];
      if (typeof original !== 'function') continue;
      wrapped[method] = async (resource: string, params: unknown) => {
        if (!introspectionRequested) {
          introspectionRequested = true;
          introspectionStartedAt = Date.now();
          safe(() => {
            // eslint-disable-next-line no-console
            console.log(`${TAG} introspection started`);
          });
        }
        const ctx: RequestCtx = {
          id: ++counter,
          fetchType: method,
          resource,
          start: Date.now(),
        };
        pending.push(ctx);
        try {
          const result = await (
            original as (...a: unknown[]) => Promise<unknown>
          ).call(provider, resource, params);
          const durationMs = Date.now() - ctx.start;
          safe(() => {
            // eslint-disable-next-line no-console
            console.groupCollapsed(
              `${TAG} #${ctx.id} ${ctx.fetchType} ${ctx.resource} done (${durationMs}ms)`
            );
            // eslint-disable-next-line no-console
            console.log('response', result);
            // eslint-disable-next-line no-console
            console.groupEnd();
          });
          return result;
        } catch (error) {
          const durationMs = Date.now() - ctx.start;
          safe(() => {
            if (!introspectionLogged) {
              // eslint-disable-next-line no-console
              console.error(`${TAG} introspection failed`, error);
            }
            // eslint-disable-next-line no-console
            console.group(
              `${TAG} #${ctx.id} ${ctx.fetchType} ${ctx.resource} failed (${durationMs}ms)`
            );
            // eslint-disable-next-line no-console
            console.error(error);
            // eslint-disable-next-line no-console
            console.groupEnd();
          });
          throw error;
        }
      };
    }
    return wrapped as unknown as DataProvider;
  };

  return { wrapBuildQuery, wrapDataProvider };
};
