import { parse } from 'graphql';
import type { DataProvider } from 'ra-core';
import { createDebugger } from './index';
import type { BuildQuery } from '../buildQuery';
import type { IntrospectionResult } from '../types';

const buildIntrospection = (resourceCount = 2): IntrospectionResult =>
  ({
    types: [],
    queries: [],
    schema: {} as IntrospectionResult['schema'],
    resources: Array.from({ length: resourceCount }, (_, i) => ({
      type: { name: `Resource${i}` },
    })) as IntrospectionResult['resources'],
  }) as IntrospectionResult;

const buildFakeFactory =
  (): BuildQuery => () => (fetchType, resourceName, params) => ({
    query: parse(`query { ${resourceName} { id } }`),
    variables: { fetchType, resourceName, params },
    parseResponse: ({ data }: { data: unknown }) => ({ data }) as any,
  });

const spyConsole = () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  const groupCollapsed = jest
    .spyOn(console, 'groupCollapsed')
    .mockImplementation(() => {});
  const group = jest.spyOn(console, 'group').mockImplementation(() => {});
  const groupEnd = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  return { log, error, groupCollapsed, group, groupEnd };
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createDebugger', () => {
  it('logs introspection start once, on the first provider call', async () => {
    const console$ = spyConsole();
    const dbg = createDebugger();
    const fakeProvider: DataProvider = {
      getList: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      getOne: jest.fn().mockResolvedValue({ data: { id: 1 } }),
      getMany: jest.fn().mockResolvedValue({ data: [] }),
      getManyReference: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      create: jest.fn().mockResolvedValue({ data: { id: 1 } }),
      update: jest.fn().mockResolvedValue({ data: { id: 1 } }),
      updateMany: jest.fn().mockResolvedValue({ data: [] }),
      delete: jest.fn().mockResolvedValue({ data: { id: 1 } }),
      deleteMany: jest.fn().mockResolvedValue({ data: [] }),
    };
    const wrapped = dbg.wrapDataProvider(fakeProvider);

    await wrapped.getList('users', {
      pagination: { page: 1, perPage: 10 },
    } as any);
    await wrapped.getList('users', {
      pagination: { page: 1, perPage: 10 },
    } as any);

    const startCalls = console$.log.mock.calls.filter((args) =>
      String(args[0]).includes('introspection started')
    );
    expect(startCalls).toHaveLength(1);
  });

  it('logs introspection complete with resource count when buildQuery factory first runs', () => {
    const console$ = spyConsole();
    const dbg = createDebugger();
    const wrappedFactory = dbg.wrapBuildQuery(buildFakeFactory());

    wrappedFactory(buildIntrospection(3));
    wrappedFactory(buildIntrospection(3));

    const completeCalls = console$.log.mock.calls.filter((args) =>
      String(args[0]).includes('introspection complete')
    );
    expect(completeCalls).toHaveLength(1);
    expect(completeCalls[0][1]).toMatchObject({ resources: 3 });
  });

  it('correlates request id between provider wrapper and buildQuery wrapper', async () => {
    const console$ = spyConsole();
    const dbg = createDebugger();

    const wrappedFactory = dbg.wrapBuildQuery(buildFakeFactory());

    const fakeProvider: DataProvider = {
      getList: jest.fn(async (resource, params) => {
        wrappedFactory(buildIntrospection())(
          'GET_LIST' as any,
          resource,
          params
        );
        return { data: [], total: 0 };
      }),
    } as any;

    const wrapped = dbg.wrapDataProvider(fakeProvider);

    await wrapped.getList('users', {} as any);
    await wrapped.getList('posts', {} as any);

    const groupTitles = console$.groupCollapsed.mock.calls.map(
      (args) => args[0] as string
    );

    const requestStarts = groupTitles.filter((t) =>
      /#\d+ getList \w+$/.test(t)
    );
    const completions = groupTitles.filter((t) =>
      /#\d+ getList \w+ done \(\d+ms\)/.test(t)
    );
    expect(requestStarts).toEqual([
      expect.stringContaining('#1 getList users'),
      expect.stringContaining('#2 getList posts'),
    ]);
    expect(completions).toEqual([
      expect.stringMatching(/#1 getList users done/),
      expect.stringMatching(/#2 getList posts done/),
    ]);
  });

  it('logs errors via console.error and rethrows', async () => {
    const console$ = spyConsole();
    const dbg = createDebugger();

    const boom = new Error('network failure');
    const fakeProvider: DataProvider = {
      getList: jest.fn().mockRejectedValue(boom),
    } as any;

    const wrapped = dbg.wrapDataProvider(fakeProvider);

    await expect(wrapped.getList('users', {} as any)).rejects.toBe(boom);

    expect(
      console$.error.mock.calls.some((args) =>
        String(args[0]).includes('introspection failed')
      )
    ).toBe(true);
    expect(console$.error.mock.calls.some((args) => args[0] === boom)).toBe(
      true
    );
  });

  it('does not flag introspection failure when introspection already completed', async () => {
    const console$ = spyConsole();
    const dbg = createDebugger();
    const wrappedFactory = dbg.wrapBuildQuery(buildFakeFactory());
    wrappedFactory(buildIntrospection());

    const boom = new Error('post-introspection failure');
    const fakeProvider: DataProvider = {
      getList: jest.fn().mockRejectedValue(boom),
    } as any;
    const wrapped = dbg.wrapDataProvider(fakeProvider);

    await expect(wrapped.getList('users', {} as any)).rejects.toBe(boom);

    expect(
      console$.error.mock.calls.some((args) =>
        String(args[0]).includes('introspection failed')
      )
    ).toBe(false);
  });

  it('logs printed GraphQL query and variables on request start', () => {
    const console$ = spyConsole();
    const dbg = createDebugger();

    const wrappedFactory = dbg.wrapBuildQuery(buildFakeFactory());

    const fakeProvider: DataProvider = {
      getList: jest.fn(async (resource, params) => {
        wrappedFactory(buildIntrospection())(
          'GET_LIST' as any,
          resource,
          params
        );
        return { data: [], total: 0 };
      }),
    } as any;

    const wrapped = dbg.wrapDataProvider(fakeProvider);
    return wrapped.getList('users', { foo: 'bar' } as any).then(() => {
      const queryLogs = console$.log.mock.calls.filter(
        (args) => args[0] === 'query'
      );
      expect(queryLogs).toHaveLength(1);
      expect(String(queryLogs[0][1])).toContain('users');

      const varLogs = console$.log.mock.calls.filter(
        (args) => args[0] === 'variables'
      );
      expect(varLogs).toHaveLength(1);
      expect(varLogs[0][1]).toMatchObject({ resourceName: 'users' });
    });
  });
});
