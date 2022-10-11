import { RelationshipAuthorizationService } from '../../../authorization/relationship-authorization.service';
import { RelationshipResolverContainer } from '../../../relationship-resolver/relationship-resolver.container';
import { blogUsers, posts } from '../../mock/data';
import { BlogRelationshipRole } from '../../mock/roles';
import {
  PostAuthorRelationshipResolver,
  PostGuestEditorRelationshipResolver,
  PostRelationshipResolver,
} from '../../mock/relationship-resolvers';

describe('RelationshipAuthorizationService', () => {
  let relationshipAuthorizationService: RelationshipAuthorizationService;
  let relationshipResolverContainer: RelationshipResolverContainer;

  beforeEach(() => {
    relationshipResolverContainer = new RelationshipResolverContainer();
    relationshipAuthorizationService = new RelationshipAuthorizationService(relationshipResolverContainer);
  });

  it('should properly allow access when there are no required roles', async () => {
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[3], posts[1], []);

    expect(allowed).toBe(true);
  });

  it('should allow access when user is in expected relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[0], [
      BlogRelationshipRole.POST_AUTHOR,
    ]);

    expect(allowed).toBe(true);
  });

  it('should allow access when user is in at least one of the expected relations with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[1], [
      BlogRelationshipRole.POST_AUTHOR,
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  });

  it('should allow access when user is in at least one relation with post - multiple resolvers', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostAuthorRelationshipResolver());
    await relationshipResolverContainer.addRelationshipResolver(new PostGuestEditorRelationshipResolver());

    const allowed = await relationshipAuthorizationService.authorize(blogUsers[0], posts[1], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  });

  it('should deny access when user is not in any relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[3], posts[1], [
      BlogRelationshipRole.POST_AUTHOR,
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(false);
  });

  it('should deny access when user is in wrong relation with post', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[1], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(false);
  });

  it('should allow access when user has more relations than requested - but including requested one', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[2], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
    ]);

    expect(allowed).toBe(true);
  });

  it('should allow access when user has more relations and all are requested', async () => {
    await relationshipResolverContainer.addRelationshipResolver(new PostRelationshipResolver());
    const allowed = await relationshipAuthorizationService.authorize(blogUsers[1], posts[2], [
      BlogRelationshipRole.POST_GUEST_EDITOR,
      BlogRelationshipRole.POST_AUTHOR,
    ]);

    expect(allowed).toBe(true);
  });
});
