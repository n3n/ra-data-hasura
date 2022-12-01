import buildDataProvider, { Options } from 'ra-data-graphql';
import { BuildVariables } from '../buildVariables';
import { GetResponseParser } from '../getResponseParser';
import {
  BuildMetaArgs,
  BuildArgs,
  BuildApolloArgs,
} from '../buildGqlQuery/buildArgs';
import { BuildFields } from '../buildGqlQuery/buildFields';
export type BuildCustomDataProvider = (
  options: Partial<Options>,
  buildGqlQueryOverrides?: {
    buildFields?: BuildFields;
    buildMetaArgs?: BuildMetaArgs;
    buildArgs?: BuildArgs;
    buildApolloArgs?: BuildApolloArgs;
    aggregateFieldName?: (resourceName: string) => string;
  },
  customBuildVariables?: BuildVariables,
  customGetResponseParser?: GetResponseParser
) => ReturnType<typeof buildDataProvider>;
export declare const buildCustomDataProvider: BuildCustomDataProvider;
//# sourceMappingURL=index.d.ts.map
