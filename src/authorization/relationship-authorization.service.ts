import { RelationshipResolverContainer } from '../relationship-resolver/relationship-resolver.container';

export class RelationshipAuthorizationService {
  constructor(private relationshipResolverContainer: RelationshipResolverContainer) {}

  async authorize<User, RelatedObject, RelationshipRole>(
    user: User,
    relatedObject: RelatedObject,
    requiredRoles: RelationshipRole[],
  ): Promise<boolean> {
    if (!requiredRoles.length) {
      return true;
    }

    const collectedRoles: RelationshipRole[] = [];

    const relationshipResolvers = await this.relationshipResolverContainer.findRelationshipResolvers(requiredRoles);
    for (const relationshipResolver of relationshipResolvers) {
      const relations = await relationshipResolver.getRelations(user, relatedObject);
      collectedRoles.push(...relations);
    }

    const matches = collectedRoles.filter((sr) => {
      return !!requiredRoles.find((rr) => rr === sr);
    });

    return !!matches.length;
  }
}
