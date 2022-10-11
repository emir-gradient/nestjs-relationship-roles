import { RelationshipResolver } from '../type/relationship-resolver';
import { SupportedRelationshipsOverlapException } from '../exception/supported-relationships-overlap.exception';

/**
 * Container that holds all registered relationship resolvers.
 */
export class RelationshipResolverContainer {
  private relationshipResolvers: RelationshipResolver<unknown, unknown, unknown>[] = [];
  private registeredRoles: Set<unknown> = new Set<unknown>();

  async findRelationshipResolvers<R>(requiredRelations: R[]): Promise<RelationshipResolver<unknown, unknown, R>[]> {
    const result = [];

    for (const relationshipResolver of this.relationshipResolvers as RelationshipResolver<unknown, unknown, R>[]) {
      const supportedRelations = await relationshipResolver.getSupportedRelationships();

      const matches = supportedRelations.find((sr) => {
        return !!requiredRelations.find((rr) => rr === sr);
      });

      if (matches) {
        result.push(relationshipResolver);
      }
    }

    return result;
  }

  async addRelationshipResolver<T, U, V>(relationshipResolver: RelationshipResolver<T, U, V>): Promise<void> {
    const supportedRoles = new Set(await relationshipResolver.getSupportedRelationships());

    for (const supportedRole of supportedRoles) {
      if (this.registeredRoles.has(supportedRole)) {
        throw new SupportedRelationshipsOverlapException(
          `Multiple Relationship Resolvers handle the role ${supportedRole}!`,
        );
      }

      this.registeredRoles.add(supportedRole);
    }

    this.relationshipResolvers.push(relationshipResolver);
  }
}
