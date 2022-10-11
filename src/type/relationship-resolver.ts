/**
 * User - Type of user
 * RelatedObject - Type of related object (object user is related to)
 * RelationshipRole - Type of relationship role
 */
export interface RelationshipResolver<User, RelatedObject, RelationshipRole> {
  /**
   * Return RelationRoles that this resolver is responsible to handle.
   */
  getSupportedRelations(): Promise<RelationshipRole[]>;

  /**
   * Retrieve related object from the request data.
   */
  getRelatedObject(request: any): Promise<RelatedObject>;

  /**
   * Calculate and provide relation between user and related object.
   */
  getRelations(user: User, relatedObject: RelatedObject): Promise<RelationshipRole[]>;
}
