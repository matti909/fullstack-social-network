import { readFileSync } from "node:fs";
import { defaultFieldResolver, GraphQLError, type GraphQLSchema } from "graphql";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers.js";
import type { AppContext } from "./context.js";

export const typeDefs = readFileSync(new URL("./schema.graphql", import.meta.url), "utf-8");

function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](fieldConfig) {
      const hasAuth = getDirective(schema, fieldConfig, "auth")?.[0];
      if (!hasAuth) return fieldConfig;

      const { resolve = defaultFieldResolver } = fieldConfig;
      fieldConfig.resolve = (source, args, context: AppContext, info) => {
        if (!context.authUser) {
          throw new GraphQLError("User is not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }
        return resolve(source, args, context, info);
      };
      return fieldConfig;
    },
  });
}

let schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirectiveTransformer(schema);

export default schema;
