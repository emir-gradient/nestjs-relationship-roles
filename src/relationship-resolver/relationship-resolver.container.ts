import { RelationshipResolver } from '../type/relationship-resolver';

/**
 * Container that holds all registered relationship resolvers.
 */
export class RelationshipResolverContainer {
  private relationshipResolvers: RelationshipResolver<unknown, unknown, unknown>[] = [];

  async findRelationshipResolver<R>(requiredRelations: R[]): Promise<RelationshipResolver<unknown, unknown, R> | null> {
    let result = null;

    for (const relationshipResolver of this.relationshipResolvers as RelationshipResolver<unknown, unknown, R>[]) {
      const supportedRelations = await relationshipResolver.getSupportedRelations();

      const matches = supportedRelations.find((sr) => {
        return !!requiredRelations.find((rr) => rr === sr);
      });

      if (matches) {
        result = relationshipResolver;
        break;
      }
    }

    return result;
  }
}
