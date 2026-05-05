# ra-data-hasura

A GraphQL data provider for [react-admin](https://marmelab.com/react-admin) tailored to target [Hasura](https://hasura.io/) GraphQL endpoints.

| Library version | React Admin version |
| --------------- | ------------------- |
| `>= 0.7.0`      | v5                  |
| `0.5.x – 0.6.x` | v4                  |
| `<= 0.4.2`      | v3                  |

- [ra-data-hasura](#ra-data-hasura)
  - [Benefits and Motivation](#benefits-and-motivation)
  - [Installation](#installation)
  - [Usage](#usage)
  - [How It Works](#how-it-works)
  - [Options](#options)
    - [Customize the Apollo client](#customize-the-apollo-client)
    - [Adding Authentication Headers](#adding-authentication-headers)
    - [Customize the introspection](#customize-the-introspection)
    - [Customize the Data Return](#customize-the-data-return)
    - [Debug Mode](#debug-mode)
  - [Customizing queries](#customizing-queries)
    - [Example: extending a query to include related entities](#example-extending-a-query-to-include-related-entities)
    - [Example: write a completely custom query](#example-write-a-completely-custom-query)
  - [Special Filter Features](#special-filter-features)
    - [Multi-field OR filtering](#multi-field-or-filtering)
    - [Nested filtering](#nested-filtering)
    - [Jsonb filtering](#jsonb-filtering)
    - [Raw Hasura query filter](#raw-hasura-query-filter)
    - [Programmatic filters (customFilters)](#programmatic-filters-customfilters)
  - [Sorting](#sorting)
    - [Sorting by multiple columns](#sorting-by-multiple-columns)
    - [Null handling in sort](#null-handling-in-sort)
  - [Disabling pagination](#disabling-pagination)
  - [Contributing](#contributing)
  - [Credits](#credits)

Example applications demonstrating usage:

- [react-admin-low-code](https://github.com/cpursley/react-admin-low-code) (basic usage)
- [react-admin-hasura-queries](https://github.com/cpv123/react-admin-hasura-queries) (usage with custom queries)

## Benefits and Motivation

This utility is built on top of [ra-data-graphql](https://github.com/vladimiregorov/react-admin/blob/master/packages/ra-data-graphql/README.md) and is a custom data provider for the current Hasura GraphQL API format.

The existing ra-data-graphql-simple provider requires that your GraphQL endpoint implement a specific grammar for the objects and methods exposed, which is different with Hasura because the exposed objects and methods are generated differently.

This utility auto generates valid GraphQL queries based on the properties exposed by the Hasura API such as `object_bool_exp` and `object_set_input`.

## Installation

```sh
npm install --save graphql @aginix/ra-data-hasura
```

## Usage

The `@aginix/ra-data-hasura` package exposes a single default function with the following signature:

```js
buildHasuraProvider(
  options?: Object,
  buildGqlQueryOverrides?: Object,
  customBuildVariables?: Function,
  customGetResponseParser?: Function,
) => Promise<DataProvider>
```

See the [Options](#options) and [Customizing queries](#customizing-queries) sections below for more details on these arguments.

This function acts as a constructor for a `dataProvider` based on a Hasura GraphQL endpoint. When executed, this function calls the endpoint, running an [introspection](http://graphql.org/learn/introspection/) query to learn about the specific data models exposed by your Hasura endpoint. It uses the result of this query (the GraphQL schema) to automatically configure the `dataProvider` accordingly.

```jsx
import React, { useState, useEffect } from 'react';
import buildHasuraProvider from '@aginix/ra-data-hasura';
import { Admin, Resource } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const App = () => {
  const [dataProvider, setDataProvider] = useState(null);

  useEffect(() => {
    const buildDataProvider = async () => {
      const dataProvider = await buildHasuraProvider({
        clientOptions: { uri: 'http://localhost:8080/v1/graphql' },
      });
      setDataProvider(() => dataProvider);
    };
    buildDataProvider();
  }, []);

  if (!dataProvider) return <p>Loading...</p>;

  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="Post"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
      />
    </Admin>
  );
};

export default App;
```

## How It Works

The data provider converts React Admin queries into the form expected by Hasura's GraphQL API. For example, a React Admin `GET_LIST` request for a person resource with the parameters:

```json
{
  "pagination": { "page": 1, "perPage": 5 },
  "sort": { "field": "name", "order": "DESC" },
  "filter": {
    "ids": [101, 102]
  }
}
```

will generate the following GraphQL request for Hasura:

```graphql
query person(
  $limit: Int
  $offset: Int
  $order_by: [person_order_by!]!
  $where: person_bool_exp
) {
  items: person(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    name
    address_id
  }
  total: person_aggregate(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    aggregate {
      count
    }
  }
}
```

With the following variables:

```json
{
  "limit": 5,
  "offset": 0,
  "order_by": { "name": "desc" },
  "where": {
    "_and": [
      {
        "id": { "_in": [101, 102] }
      }
    ]
  }
}
```

React Admin sort and filter objects will be converted appropriately. For example, sorting with dot notation:

```jsx
export const PostList = (props) => (
  <List {...props} sort={{ field: 'user.email', order: 'DESC' }}>
    ...
  </List>
);
```

will generate:

```json
{ "order_by": { "user": { "email": "desc" } } }
```

and `distinct_on`:

```jsx
export const AddressList = () => (
  <List
    sort={{ field: 'city', order: 'DESC' }}
    filter={{ distinct_on: 'city' }}
  >
    ...
  </List>
);
```

will generate:

```json
{
  "order_by": { "city": "desc" },
  "distinct_on": "city"
}
```

Keep in mind that `distinct_on` must be used in conjunction with `order_by`, otherwise a `"distinct_on" columns must match initial "order_by" columns"` error will result. See more [here](https://hasura.io/docs/latest/queries/postgres/distinct-queries/#the-distinct_on-argument).

## Options

### Customize the Apollo client

You can either supply just the client options:

```js
buildHasuraProvider({
  clientOptions: {
    uri: 'http://localhost:8080/v1/graphql',
    ...otherApolloOptions,
  },
});
```

or supply the client instance directly:

```js
buildHasuraProvider({ client: myClient });
```

### Adding Authentication Headers

To send authentication headers, supply the client instance directly with headers defined:

```js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const myClientWithAuth = new ApolloClient({
  uri: 'http://localhost:8080/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': 'hasuraAdminSecret',
    // 'Authorization': `Bearer xxxx`,
  },
});

buildHasuraProvider({ client: myClientWithAuth });
```

<details style="margin-bottom: 20px">

<summary style="margin-bottom: 10px">Adding headers using just client options</summary>

You can also add headers using only client options rather than the client itself:

```js
import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-hasura-admin-secret': 'hasuraAdminSecret',
    // 'Authorization': `Bearer xxxx`,
  },
}));

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/v1/graphql',
});

const clientOptionsWithAuth = {
  link: authLink.concat(httpLink),
};

buildHasuraProvider({ client: clientOptionsWithAuth });
```

</details>

### Customize the introspection

These are the default options for introspection:

```js
const introspectionOptions = {
  include: [], // Either an array of types to include or a function which will be called for every type discovered through introspection
  exclude: [], // Either an array of types to exclude or a function which will be called for every type discovered through introspection
};

// Including types
const introspectionOptions = {
  include: ['Post', 'Comment'],
};

// Excluding types
const introspectionOptions = {
  exclude: ['CommandItem'],
};

// Including types with a function
const introspectionOptions = {
  include: (type) => ['Post', 'Comment'].includes(type.name),
};

// Excluding types with a function
const introspectionOptions = {
  exclude: (type) => !['Post', 'Comment'].includes(type.name),
};
```

**Note**: `exclude` and `include` are mutually exclusive and `include` will take precedence.

**Note**: When using functions, the `type` argument will be a type returned by the introspection query. Refer to the [introspection](http://graphql.org/learn/introspection/) documentation for more information.

Pass the introspection options to the `buildHasuraProvider` function:

```js
buildHasuraProvider({ introspection: introspectionOptions });
```

### Customize the Data Return

Once the data is returned back from the provider, you can customize it by implementing the `DataProvider` interface. [An example is changing the ID key](https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources).

```typescript
const [dataProvider, setDataProvider] = React.useState<DataProvider | null>(
  null
);

React.useEffect(() => {
  const buildDataProvider = async () => {
    const dataProviderHasura = await buildHasuraProvider({
      clientOptions: {
        uri: 'http://localhost:8080/v1/graphql',
      },
    });
    const modifiedProvider: DataProvider = {
      getList: async (resource, params) => {
        let { data, ...metadata } = await dataProviderHasura.getList(
          resource,
          params
        );

        if (resource === 'example_resource_name') {
          data = data.map(
            (val): Record => ({
              ...val,
              id: val.region_id,
            })
          );
        }

        return { data: data as any[], ...metadata };
      },
      getOne: (resource, params) => dataProviderHasura.getOne(resource, params),
      getMany: (resource, params) =>
        dataProviderHasura.getMany(resource, params),
      getManyReference: (resource, params) =>
        dataProviderHasura.getManyReference(resource, params),
      update: (resource, params) => dataProviderHasura.update(resource, params),
      updateMany: (resource, params) =>
        dataProviderHasura.updateMany(resource, params),
      create: (resource, params) => dataProviderHasura.create(resource, params),
      delete: (resource, params) => dataProviderHasura.delete(resource, params),
      deleteMany: (resource, params) =>
        dataProviderHasura.deleteMany(resource, params),
    };
    setDataProvider(() => modifiedProvider);
  };
  buildDataProvider();
}, []);
```

### Debug Mode

Pass `debug: true` to log every request to the browser console. Each call is rendered as a collapsible group with its `fetchType`, params, the printed GraphQL query, variables, response (or error), and duration. Requests are tagged with a sequential id (`#1`, `#2`, …) so request and response groups stay correlated even when calls interleave. Schema introspection is also logged the first time it runs.

```ts
const dataProvider = await buildHasuraProvider({
  client: apolloClient,
  debug: true,
});
```

> [!WARNING]
> Debug mode prints **everything sent to and received from Hasura**, including mutation variables (e.g. password hashes, tokens, or any other sensitive column values). Only enable it in development. Gate it behind an environment check before shipping:
>
> ```ts
> debug: process.env.NODE_ENV === 'development',
> ```

## Customizing queries

Queries built by this data provider are made up of 3 parts:

1. The set of fields requested
2. The variables defining the query constraints like `where, order_by, limit, offset`
3. The response format e.g. `{ data: {...}, total: 100 }`

Each of these can be customized — functions overriding numbers 2 and 3 can be passed directly to `buildHasuraProvider` as shown in [Usage](#usage), whilst number 1 can be customized in parts using the `buildGqlQueryOverrides` object argument:

```js
{
  buildFields?: Function,
  buildMetaArgs?: Function,
  buildArgs?: Function,
  buildApolloArgs?: Function,
}
```

A likely scenario is that you want to override only the `buildFields` part so that you can customize your GraphQL queries — requesting fewer fields, more fields, nested fields etc.

This can be easily done, and importantly can be done using `gql` template literal tags, as shown in the examples below. Take a look at this [demo application](https://github.com/cpv123/react-admin-hasura-queries) to see it in action.

### Example: extending a query to include related entities

By default, the data provider will generate queries that include all fields on a resource, but without any relationships to nested entities. If you would like to keep these base fields but extend the query to also include related entities, then you can write a custom `buildFields` like this:

```ts
import buildDataProvider, { buildFields } from '@aginix/ra-data-hasura';
import type { BuildFields } from '@aginix/ra-data-hasura';
import gql from 'graphql-tag';

const extractFieldsFromQuery = (queryAst) => {
  return queryAst.definitions[0].selectionSet.selections;
};

const EXTENDED_GET_ONE_USER = gql`
  {
    todos_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const customBuildFields: BuildFields = (type, fetchType) => {
  const resourceName = type.name;

  const defaultFields = buildFields(type, fetchType);

  if (resourceName === 'users' && fetchType === 'GET_ONE') {
    const relatedEntities = extractFieldsFromQuery(EXTENDED_GET_ONE_USER);
    defaultFields.push(...relatedEntities);
  }

  return defaultFields;
};

buildDataProvider(options, { buildFields: customBuildFields });
```

### Example: write a completely custom query

If you want full control over the GraphQL query, then you can define the entire set of fields like this:

```ts
import gql from 'graphql-tag';
import buildDataProvider, { buildFields } from '@aginix/ra-data-hasura';
import type { BuildFields } from '@aginix/ra-data-hasura';

const extractFieldsFromQuery = (queryAst) => {
  return queryAst.definitions[0].selectionSet.selections;
};

const GET_ONE_USER = gql`
  {
    id
    name
    todos(
      where: { is_completed: { _eq: false } }
      order_by: { created_at: asc }
    ) {
      title
    }
    todos_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const customBuildFields: BuildFields = (type, fetchType) => {
  const resourceName = type.name;

  if (resourceName === 'users' && fetchType === 'GET_ONE') {
    return extractFieldsFromQuery(GET_ONE_USER);
  }

  return buildFields(type, fetchType);
};

buildDataProvider(options, { buildFields: customBuildFields });
```

Note that when using this approach in particular, it is possible that you will come across [this issue](https://github.com/cpv123/react-admin-hasura-queries#troubleshooting).

## Special Filter Features

This adapter provides a rich filter syntax using special key patterns. Keys are parsed using:

- `@` as operator separator (e.g. `field@_ilike`)
- `#` as nested field separator (e.g. `relation#field`)
- `,` to create OR conditions across multiple fields

The default comparator is `_ilike` for strings (automatically wraps value in `%value%`) and `_eq` for other types.

### Multi-field OR filtering

Comma-separate multiple field paths in a single `source` to produce an `_or` condition:

```tsx
<Filter {...props}>
  <TextInput
    label="Search"
    source="email,first_name@_eq,last_name@_like"
    alwaysOn
  />
</Filter>
```

Generates:

```json
{
  "where": {
    "_or": [
      { "email": { "_ilike": "%edu%" } },
      { "first_name": { "_eq": "edu" } },
      { "last_name": { "_like": "%edu%" } }
    ]
  }
}
```

### Nested filtering

Use `#` as a field separator to filter on related object fields:

```tsx
<TextInput
  label="Search by indication, drug, sponsor, nctid"
  source="indication#name@_ilike,drug#preferred_name@_ilike,sponsor#name@_ilike,trial#nctid@_ilike"
  alwaysOn
/>
```

Generates:

```json
{
  "where": {
    "_or": [
      { "indication": { "name": { "_ilike": "%TEXT%" } } },
      { "drug": { "name": { "_ilike": "%TEXT%" } } },
      { "sponsor": { "name": { "_ilike": "%TEXT%" } } }
    ]
  }
}
```

### Jsonb filtering

Use `@_contains` with a `#`-separated path to filter on JSONB fields:

```jsx
<TextField label="Theme Color" source="users#preferences@_contains@ux#theme" />
```

Generates:

```json
{
  "where": {
    "_and": [
      {
        "users": {
          "preferences": {
            "_contains": { "ux": { "theme": "%TEXT" } }
          }
        }
      }
    ]
  }
}
```

Dynamic JSONB filtering using a related record field:

```jsx
<FunctionField
  render={(rec) => (
    <ReferenceManyField
      reference="account_plans"
      target={`payments#details@_contains@processor#${rec.processor}_id`}
      source="payment_processor"
    >
      <Datagrid>...</Datagrid>
    </ReferenceManyField>
  )}
/>
```

### Raw Hasura query filter

When the standard filter syntax cannot express your condition, you can pass a raw Hasura `where` object directly using the `hasura-raw-query` format. This bypasses all filter processing and injects the value as-is into the `where` clause.

```tsx
// In a custom List component or hook:
const filters = {
  status: {
    format: 'hasura-raw-query',
    value: { _in: ['active', 'pending'] },
  },
};

<List filter={filters}>...</List>;
```

This is especially useful when you need to express conditions that the `@` / `#` syntax does not cover, such as `_nin`, `_similar`, or nested `_and`/`_or` logic:

```ts
const filters = {
  metadata: {
    format: 'hasura-raw-query',
    value: {
      _or: [{ tags: { _contains: 'featured' } }, { priority: { _gte: 5 } }],
    },
  },
};
```

The key (`status`, `metadata`, etc.) is still used as the field path. To inject a condition at the top level of `_and`, use a key that matches the desired root field.

### Programmatic filters (customFilters)

You can pass additional pre-built filter objects via `customFilters` on the params object. These are merged directly into the `_and` array alongside the standard `filter` object:

```tsx
import { useListController } from 'react-admin';

const MyList = () => {
  const controllerProps = useListController({
    resource: 'posts',
    // customFilters are appended to the _and clause
    filter: { status: 'published' },
    // @ts-ignore — customFilters is not part of the official RA type
    customFilters: [{ author_id: { _eq: currentUserId } }],
  });
  // ...
};
```

`customFilters` is an array of raw Hasura filter objects. Each object is added as an additional `_and` condition alongside any filters derived from the `filter` param.

## Sorting

### Sorting by multiple columns

Hasura supports [sorting by multiple fields](https://hasura.io/docs/latest/graphql/core/databases/postgres/queries/sorting.html#sorting-by-multiple-fields). Since React Admin's `List` `sort` prop does not accept arrays, separate multiple fields and orders with commas:

```jsx
const TodoList = (props) => (
  <List sort={{ field: 'title,is_completed', order: 'asc,desc' }} {...props}>
    <Datagrid rowClick="edit">...</Datagrid>
  </List>
);
```

generates:

```json
{ "order_by": [{ "title": "asc" }, { "is_completed": "desc" }] }
```

Fields may contain dots to sort by nested object properties (e.g. `user.email`).

### Null handling in sort

Append `@nulls_last` or `@nulls_first` to a sort field to control how `NULL` values are ordered:

```jsx
<List sort={{ field: 'published_at@nulls_last', order: 'DESC' }}>...</List>
```

generates:

```json
{ "order_by": { "published_at": "desc_nulls_last" } }
```

Supported modifiers: `nulls_last`, `nulls_first`.

## Disabling pagination

Set `perPage` to `-1` to fetch all records without a `limit` or `offset` being sent to Hasura:

```jsx
<List pagination={false} perPage={-1}>
  ...
</List>
```

Use with caution on large tables.

## Calling Hasura Actions

Hasura [Actions](https://hasura.io/docs/latest/actions/overview/) are exposed as
GraphQL fields on the `Mutation` or `Query` root types. Because `ra-data-hasura`
already manages an Apollo client and the introspected schema, you can invoke
them directly through the data provider — no separate client setup required.

```js
const dataProvider = await buildHasuraProvider({
  clientOptions: { uri: 'https://my-hasura/v1/graphql' },
});

// Mutation action
const user = await dataProvider.actionMutation('createUser', {
  email: 'alice@example.com',
  name: 'Alice',
});

// Query action
const matches = await dataProvider.actionQuery('searchUsers', {
  query: 'alice',
});
```

### Field selection

By default, all scalar fields on the action's output type are selected. To pick
a custom selection set (for example, to traverse nested objects), pass a
selection set fragment as the third argument:

```js
const user = await dataProvider.actionMutation(
  'createUser',
  { email: 'alice@example.com' },
  { fields: 'id email profile { avatarUrl }' }
);
```

The string can be passed with or without surrounding braces. When the action
returns a scalar (e.g. `String`, `Int`, `Boolean`), no selection set is needed
and `fields` is ignored.

### TypeScript

Both methods accept generic type parameters for the response and variables:

```ts
type CreateUserInput = { email: string; name?: string };
type CreateUserOutput = { id: number; email: string };

const user = await dataProvider.actionMutation<
  CreateUserOutput,
  CreateUserInput
>('createUser', { email: 'alice@example.com' });
```

### Caching

`actionQuery` defaults to Apollo's `network-only` fetchPolicy so action results
aren't served stale from the cache. Override it via `options.fetchPolicy` if you
do want caching:

```js
await dataProvider.actionQuery(
  'getDashboardStats',
  {},
  { fetchPolicy: 'cache-first' }
);
```

`actionMutation` doesn't set a fetchPolicy by default; pass one through the same
option if needed.

### Inside react-admin components

Use these methods through `useDataProvider` so react-admin's mutation lifecycle
and notifications integrate naturally:

```jsx
import { useDataProvider, useNotify } from 'react-admin';

const ResendInviteButton = ({ userId }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  return (
    <Button
      onClick={async () => {
        await dataProvider.actionMutation('resendInvite', { userId });
        notify('Invite sent', { type: 'success' });
      }}
    >
      Resend invite
    </Button>
  );
};
```

Required arguments missing from `variables`, or actions not present in the
introspected schema, throw with a descriptive error before any network request
is made.

## Contributing

To modify, extend and test this package locally:

```sh
cd ra-data-hasura
npm link
```

Now use this local package in your React app for testing:

```sh
cd my-react-app
npm link ra-data-hasura
```

Build the library by running `npm run build` — output is generated in the `dist` folder.

## Credits

We would like to thank [Steams](https://github.com/Steams) and all the contributors to this library for porting this adapter to support GraphQL spec, since all the releases till v0.0.8 were based off the REST API spec.
