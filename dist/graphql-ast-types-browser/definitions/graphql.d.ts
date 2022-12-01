export const __esModule: boolean;
declare function _default(): (
  | (
      | string
      | {
          builder: string[];
          fields: {
            value: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            definitions: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            operation: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            selectionSet: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            variableDefinitions: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            variable: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            type: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            defaultValue: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            selections: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            alias: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            arguments: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            selectionSet: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            value: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            selectionSet: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            typeCondition: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            typeCondition: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            selectionSet: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: never[];
          fields: {};
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            values: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            fields: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            arguments: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            type: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            operationTypes: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            operation: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            type: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            fields: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            interfaces: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            arguments: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            type: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            type: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            defaultValue: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            fields: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            types: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            values: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            directives: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            definition: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
          };
          aliases: string[];
        }
    )[]
  | (
      | string
      | {
          builder: string[];
          fields: {
            name: {
              optional: boolean;
              validate: (node: any, key: any, val: any) => void;
            };
            locations: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
            arguments: {
              optional: boolean;
              validate: (...args: any[]) => void;
            };
          };
          aliases: string[];
        }
    )[]
)[];
export default _default;
//# sourceMappingURL=graphql.d.ts.map
