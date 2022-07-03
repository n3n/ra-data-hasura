import {
  IntrospectionField,
  ArgumentNode,
  VariableDefinitionNode,
} from 'graphql';
import { FetchType } from '../types';
export declare type BuildArgs = (
  query: IntrospectionField,
  variables: any
) => ArgumentNode[];
export declare type BuildMetaArgs = (
  query: IntrospectionField,
  variables: any,
  aorFetchType: FetchType
) => ArgumentNode[];
export declare type BuildApolloArgs = (
  query: IntrospectionField,
  variables: any
) => VariableDefinitionNode[];
export declare const buildArgs: BuildArgs;
export declare const buildMetaArgs: BuildMetaArgs;
export declare const buildApolloArgs: BuildApolloArgs;
//# sourceMappingURL=buildArgs.d.ts.map
