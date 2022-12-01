'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _index = require('./index');
exports.default = function () {
  return [
    [
      'Name',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'Document',
      {
        builder: ['definitions'],
        fields: {
          definitions: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Definition')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'OperationDefinition',
      {
        builder: [
          'operation',
          'selectionSet',
          'name',
          'variableDefinitions',
          'directives',
        ],
        fields: {
          operation: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
          selectionSet: {
            optional: false,
            validate: (0, _index.assertNodeType)('SelectionSet'),
          },
          name: {
            optional: true,
            validate: (0, _index.assertNodeType)('Name'),
          },
          variableDefinitions: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('VariableDefinition')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'Definition'],
      },
    ],
    [
      'VariableDefinition',
      {
        builder: ['variable', 'type', 'defaultValue'],
        fields: {
          variable: {
            optional: false,
            validate: (0, _index.assertNodeType)('Variable'),
          },
          type: {
            optional: false,
            validate: (0, _index.assertNodeType)('Type'),
          },
          defaultValue: {
            optional: true,
            validate: (0, _index.assertNodeType)('Value'),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'Variable',
      {
        builder: ['name'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'SelectionSet',
      {
        builder: ['selections'],
        fields: {
          selections: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Selection')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'Field',
      {
        builder: ['name', 'alias', 'arguments', 'directives', 'selectionSet'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          alias: {
            optional: true,
            validate: (0, _index.assertNodeType)('Name'),
          },
          arguments: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Argument')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
          selectionSet: {
            optional: true,
            validate: (0, _index.assertNodeType)('SelectionSet'),
          },
        },
        aliases: ['AST', 'Selection'],
      },
    ],
    [
      'Argument',
      {
        builder: ['name', 'value'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          value: {
            optional: false,
            validate: (0, _index.assertNodeType)('Value'),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'FragmentSpread',
      {
        builder: ['name', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'Selection'],
      },
    ],
    [
      'InlineFragment',
      {
        builder: ['selectionSet', 'typeCondition', 'directives'],
        fields: {
          selectionSet: {
            optional: false,
            validate: (0, _index.assertNodeType)('SelectionSet'),
          },
          typeCondition: {
            optional: true,
            validate: (0, _index.assertNodeType)('NamedType'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'Selection'],
      },
    ],
    [
      'FragmentDefinition',
      {
        builder: ['name', 'typeCondition', 'selectionSet', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          typeCondition: {
            optional: false,
            validate: (0, _index.assertNodeType)('NamedType'),
          },
          selectionSet: {
            optional: false,
            validate: (0, _index.assertNodeType)('SelectionSet'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'Definition'],
      },
    ],
    [
      'IntValue',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'FloatValue',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'StringValue',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'BooleanValue',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('boolean'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'NullValue',
      {
        builder: [],
        fields: {},
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'EnumValue',
      {
        builder: ['value'],
        fields: {
          value: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'ListValue',
      {
        builder: ['values'],
        fields: {
          values: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Value')
            ),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'ObjectValue',
      {
        builder: ['fields'],
        fields: {
          fields: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('ObjectField')
            ),
          },
        },
        aliases: ['AST', 'Value'],
      },
    ],
    [
      'ObjectField',
      {
        builder: ['name', 'value'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          value: {
            optional: false,
            validate: (0, _index.assertNodeType)('Value'),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'Directive',
      {
        builder: ['name', 'arguments'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          arguments: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Argument')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'NamedType',
      {
        builder: ['name'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
        },
        aliases: ['AST', 'Type'],
      },
    ],
    [
      'ListType',
      {
        builder: ['type'],
        fields: {
          type: {
            optional: false,
            validate: (0, _index.assertNodeType)('Type'),
          },
        },
        aliases: ['AST', 'Type'],
      },
    ],
    [
      'NonNullType',
      {
        builder: ['type'],
        fields: {
          type: {
            optional: false,
            validate: (0, _index.assertOneOf)('NamedType', 'ListType'),
          },
        },
        aliases: ['AST', 'Type'],
      },
    ],
    [
      'SchemaDefinition',
      {
        builder: ['directives', 'operationTypes'],
        fields: {
          directives: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
          operationTypes: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('OperationTypeDefinition')
            ),
          },
        },
        aliases: ['AST', 'TypeSystemDefinition'],
      },
    ],
    [
      'OperationTypeDefinition',
      {
        builder: ['operation', 'type'],
        fields: {
          operation: {
            optional: false,
            validate: (0, _index.assertValueType)('string'),
          },
          type: {
            optional: false,
            validate: (0, _index.assertNodeType)('NamedType'),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'ScalarTypeDefinition',
      {
        builder: ['name', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'ObjectTypeDefinition',
      {
        builder: ['name', 'fields', 'interfaces', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          fields: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('FieldDefinition')
            ),
          },
          interfaces: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('NamedType')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'FieldDefinition',
      {
        builder: ['name', 'arguments', 'type', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          arguments: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('InputValueDefinition')
            ),
          },
          type: {
            optional: false,
            validate: (0, _index.assertNodeType)('Type'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'InputValueDefinition',
      {
        builder: ['name', 'type', 'defaultValue', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          type: {
            optional: false,
            validate: (0, _index.assertNodeType)('Type'),
          },
          defaultValue: {
            optional: true,
            validate: (0, _index.assertNodeType)('Value'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'InterfaceTypeDefinition',
      {
        builder: ['name', 'fields', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          fields: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('FieldDefinition')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'UnionTypeDefinition',
      {
        builder: ['name', 'types', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          types: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('NamedType')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'EnumTypeDefinition',
      {
        builder: ['name', 'values', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          values: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('EnumValueDefinition')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'EnumValueDefinition',
      {
        builder: ['name', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST'],
      },
    ],
    [
      'InputObjectTypeDefinition',
      {
        builder: ['name', 'fields', 'directives'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          fields: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('InputValueDefinition')
            ),
          },
          directives: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Directive')
            ),
          },
        },
        aliases: ['AST', 'TypeDefinition'],
      },
    ],
    [
      'TypeExtensionDefinition',
      {
        builder: ['definition'],
        fields: {
          definition: {
            optional: false,
            validate: (0, _index.assertNodeType)('ObjectTypeDefinition'),
          },
        },
        aliases: ['AST', 'TypeSystemDefinition'],
      },
    ],
    [
      'DirectiveDefinition',
      {
        builder: ['name', 'locations', 'arguments'],
        fields: {
          name: {
            optional: false,
            validate: (0, _index.assertNodeType)('Name'),
          },
          locations: {
            optional: false,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('Name')
            ),
          },
          arguments: {
            optional: true,
            validate: (0, _index.assertArrayOf)(
              (0, _index.assertNodeType)('InputValueDefinition')
            ),
          },
        },
        aliases: ['AST', 'TypeSystemDefinition'],
      },
    ],
  ];
}; /* These are auto-generated definitions: Please do not edit this file directly */
