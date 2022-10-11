import { RelationshipResolverContainer } from '../../relationship-resolver/relationship-resolver.container';
import { BlogRelationshipRole } from '../mock/roles';
import {
  PostAuthorRelationshipResolver,
  PostGuestEditorRelationshipResolver,
  PostRelationshipResolver,
} from '../mock/relationship-resolvers';
import { SupportedRelationshipsOverlapException } from '../../exception/supported-relationships-overlap.exception';

describe('RelationshipResolverContainer', function () {
  let relationshipResolverContainer: RelationshipResolverContainer;

  beforeEach(() => {
    relationshipResolverContainer = new RelationshipResolverContainer();
  });

  it('should properly register and find resolver per provided roles', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(
      await relationshipResolverContainer.findRelationshipResolver([
        BlogRelationshipRole.POST_AUTHOR,
        BlogRelationshipRole.POST_GUEST_EDITOR,
      ]),
    ).toBe(postRelationshipResolver);
  });

  it('should properly register and find resolver by at least one of roles - case: 1st role', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(await relationshipResolverContainer.findRelationshipResolver([BlogRelationshipRole.POST_AUTHOR])).toBe(
      postRelationshipResolver,
    );
  });

  it('should properly register and find resolver by at least one of roles - case: 2nd role', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    expect(await relationshipResolverContainer.findRelationshipResolver([BlogRelationshipRole.POST_GUEST_EDITOR])).toBe(
      postRelationshipResolver,
    );
  });

  it('should fail when resolvers have overlap in supported roles', async () => {
    const postRelationshipResolver: PostRelationshipResolver = new PostRelationshipResolver();
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postRelationshipResolver);

    await expect(relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver)).rejects.toThrow(
      SupportedRelationshipsOverlapException,
    );
  });

  it('should find resolver among multiple registered resolvers per proper role', async () => {
    const postAuthorRelationshipResolver: PostAuthorRelationshipResolver = new PostAuthorRelationshipResolver();
    const postGuestEditorRelationshipResolver: PostGuestEditorRelationshipResolver =
      new PostGuestEditorRelationshipResolver();

    await relationshipResolverContainer.addRelationshipResolver(postAuthorRelationshipResolver);
    await relationshipResolverContainer.addRelationshipResolver(postGuestEditorRelationshipResolver);

    expect(await relationshipResolverContainer.findRelationshipResolver([BlogRelationshipRole.POST_GUEST_EDITOR])).toBe(
      postGuestEditorRelationshipResolver,
    );
    expect(await relationshipResolverContainer.findRelationshipResolver([BlogRelationshipRole.POST_AUTHOR])).toBe(
      postAuthorRelationshipResolver,
    );
  });
});
