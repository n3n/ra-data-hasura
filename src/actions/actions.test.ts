import { print } from 'graphql';
import { buildActionMethods } from './index';
import type { IntrospectionResult } from '../types';

const namedType = (name: string) => ({ kind: 'NAMED', name }) as any;
const nonNull = (ofType: any) => ({ kind: 'NON_NULL', ofType }) as any;
const listOf = (ofType: any) => ({ kind: 'LIST', ofType }) as any;

const objectField = (name: string, type: any) => ({
  name,
  args: [],
  type,
  isDeprecated: false,
});

const buildIntrospection = (): IntrospectionResult => {
  // Output type for an action
  const outputType = {
    kind: 'OBJECT',
    name: 'CreateUserOutput',
    fields: [
      objectField('id', { kind: 'SCALAR', name: 'Int' }),
      objectField('email', { kind: 'SCALAR', name: 'String' }),
      objectField('profile', { kind: 'OBJECT', name: 'Profile' }),
    ],
    interfaces: [],
  } as any;

  const profileType = {
    kind: 'OBJECT',
    name: 'Profile',
    fields: [objectField('avatarUrl', { kind: 'SCALAR', name: 'String' })],
    interfaces: [],
  } as any;

  const mutationRoot = {
    kind: 'OBJECT',
    name: 'mutation_root',
    fields: [
      {
        name: 'createUser',
        args: [
          {
            name: 'email',
            type: nonNull(namedType('String')),
            defaultValue: null,
          },
          { name: 'name', type: namedType('String'), defaultValue: null },
        ],
        type: nonNull({ kind: 'OBJECT', name: 'CreateUserOutput' }),
        isDeprecated: false,
      },
      {
        name: 'sendEmail',
        args: [
          {
            name: 'to',
            type: nonNull(namedType('String')),
            defaultValue: null,
          },
        ],
        type: namedType('String'),
        isDeprecated: false,
      },
      {
        name: 'tagThings',
        args: [
          {
            name: 'tags',
            type: nonNull(listOf(nonNull(namedType('String')))),
            defaultValue: null,
          },
        ],
        type: namedType('Boolean'),
        isDeprecated: false,
      },
    ],
    interfaces: [],
  } as any;

  const queryRoot = {
    kind: 'OBJECT',
    name: 'query_root',
    fields: [
      {
        name: 'searchUsers',
        args: [
          {
            name: 'query',
            type: nonNull(namedType('String')),
            defaultValue: null,
          },
        ],
        type: listOf(nonNull({ kind: 'OBJECT', name: 'CreateUserOutput' })),
        isDeprecated: false,
      },
    ],
    interfaces: [],
  } as any;

  return {
    types: [outputType, profileType, mutationRoot, queryRoot],
    queries: [],
    resources: [],
    schema: {
      mutationType: { name: 'mutation_root' },
      queryType: { name: 'query_root' },
      subscriptionType: null,
      types: [],
      directives: [],
    } as any,
  };
};

const makeClient = () => {
  const calls: {
    method: string;
    doc: string;
    variables?: any;
    fetchPolicy?: any;
  }[] = [];
  const client = {
    mutate: jest.fn(async ({ mutation, variables, fetchPolicy }: any) => {
      calls.push({
        method: 'mutate',
        doc: print(mutation),
        variables,
        fetchPolicy,
      });
      return { data: { __mockResponse: true } };
    }),
    query: jest.fn(async ({ query, variables, fetchPolicy }: any) => {
      calls.push({
        method: 'query',
        doc: print(query),
        variables,
        fetchPolicy,
      });
      return { data: { __mockResponse: true } };
    }),
  };
  return { client, calls };
};

describe('buildActionMethods', () => {
  it('builds a mutation that selects all scalar fields by default', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation('createUser', {
      email: 'a@b.com',
      name: 'Alice',
    });

    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe('mutate');
    expect(calls[0].variables).toEqual({ email: 'a@b.com', name: 'Alice' });
    // Scalar fields selected (id, email), object field (profile) excluded
    expect(calls[0].doc).toContain('createUser(email: $email, name: $name)');
    expect(calls[0].doc).toContain('id');
    expect(calls[0].doc).toContain('email');
    expect(calls[0].doc).not.toContain('profile');
    expect(calls[0].doc).toContain('$email: String!');
    expect(calls[0].doc).toContain('$name: String');
  });

  it('omits a selection set when the action returns a scalar', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation('sendEmail', { to: 'a@b.com' });

    expect(calls[0].doc).toContain('sendEmail(to: $to)');
    // No selection set follows the field call - last token before the closing
    // operation brace is the field's closing paren.
    expect(calls[0].doc).toMatch(/sendEmail\(to: \$to\)\s*}/);
  });

  it('honors a custom fields selection string', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation(
      'createUser',
      { email: 'a@b.com' },
      { fields: 'id profile { avatarUrl }' }
    );

    expect(calls[0].doc).toContain('avatarUrl');
    expect(calls[0].doc).toMatch(/profile\s*{\s*avatarUrl\s*}/);
    expect(calls[0].doc).not.toContain('email\n');
  });

  it('also accepts a fields string already wrapped in braces', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation(
      'createUser',
      { email: 'a@b.com' },
      { fields: '{ id }' }
    );

    expect(calls[0].doc).toMatch(/createUser\([^)]*\)\s*{\s*id\s*}/);
  });

  it('drops undefined variables and only sends the args the action declares', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation('createUser', {
      email: 'a@b.com',
      name: undefined,
      bogus: 'ignored',
    });

    expect(calls[0].variables).toEqual({ email: 'a@b.com', bogus: 'ignored' });
    // bogus is not a declared arg, so it does not appear in the operation
    expect(calls[0].doc).not.toContain('bogus');
    expect(calls[0].doc).not.toContain('$name');
  });

  it('throws when a required argument is missing', async () => {
    const { client } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await expect(methods.actionMutation('createUser', {})).rejects.toThrow(
      /missing required argument/i
    );
  });

  it('throws when the action is not in the schema', async () => {
    const { client } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await expect(
      methods.actionMutation('nonExistentAction', {})
    ).rejects.toThrow(/was not found/);
  });

  it('throws a clear error when introspection is disabled', async () => {
    const { client } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: () => undefined,
    });

    await expect(methods.actionMutation('createUser', {})).rejects.toThrow(
      /introspection is disabled/i
    );
  });

  it('looks up actionQuery on the Query root and defaults fetchPolicy to network-only', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionQuery('searchUsers', { query: 'alice' });

    expect(calls[0].method).toBe('query');
    expect(calls[0].fetchPolicy).toBe('network-only');
    expect(calls[0].doc).toMatch(/^query/);
    expect(calls[0].doc).toContain('searchUsers(query: $query)');
  });

  it('respects a caller-provided fetchPolicy on actionQuery', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionQuery(
      'searchUsers',
      { query: 'a' },
      { fetchPolicy: 'cache-first' }
    );

    expect(calls[0].fetchPolicy).toBe('cache-first');
  });

  it('prints list/non-null nested arg types correctly', async () => {
    const { client, calls } = makeClient();
    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    await methods.actionMutation('tagThings', { tags: ['a', 'b'] });

    expect(calls[0].doc).toContain('$tags: [String!]!');
  });

  it('returns the response data scoped to the action name', async () => {
    const { client } = makeClient();
    client.mutate = jest.fn(async () => ({
      data: { createUser: { id: 7, email: 'a@b.com' } },
    })) as any;

    const methods = buildActionMethods({
      client,
      getIntrospection: async () => buildIntrospection(),
    });

    const result = await methods.actionMutation('createUser', {
      email: 'a@b.com',
    });

    expect(result).toEqual({ id: 7, email: 'a@b.com' });
  });
});
