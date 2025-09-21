import { useEffect, useState } from "react";
import { EntityProvider, useEntityList, useUser } from "@replyke/react-js";
import Tweet from "../components/tweet";
import TweetComposer from "../components/tweet-composer";
import UserProfile from "../components/user-profile";
import UsernameModal from "../components/auth-modal";
import LoadingPlaceholder from "../components/loading-placeholder";
import Filters from "../components/filters";
import { Sheet } from "../components/ui/sheet";
import CommentSectionSheet from "../components/comment-section-sheet";

export default function TweetFeed() {
  const {
    entities,
    fetchEntities,
    loading: loadingEntities,
    hasMore,
    loadMore,
  } = useEntityList({
    listId: "home-tweets", // Filers at the store level
  });
  const { user } = useUser();

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("new");
  const [timeFrame, setTimeFrame] = useState(null);

  useEffect(() => {
    const filters = { sortBy, timeFrame };

    if (content.length) {
      filters.contentFilters = { includes: [content] };
    }
    fetchEntities(
      filters,
      {
        sourceId: "tweets", // Filters at the DB level
        limit: 10, // Batch size
      },
      { resetUnspecified: true, clearImmediately: false }
    );
  }, [sortBy, timeFrame, content]);

  function handleShowAuthModal() {
    setShowAuthModal(true);
  }

  function handleSelectEntity(ent) {
    setSelectedEntity(ent);
    setCommentSheetOpen(true);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sheet>
        <CommentSectionSheet
          entity={selectedEntity}
          open={commentSheetOpen}
          onOpenChange={setCommentSheetOpen}
        />
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200">
          {user && (
            <div className="p-4 bg-white">
              <UserProfile />
            </div>
          )}
          <TweetComposer onAuthRequired={handleShowAuthModal} />

          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            content={content}
            setContent={setContent}
          />

          <div className="divide-y divide-gray-100">
            {entities.map((entity) => (
              <EntityProvider entity={entity} key={entity.id}>
                <Tweet
                  onAuthRequired={handleShowAuthModal}
                  handleSelectEntity={handleSelectEntity}
                />
              </EntityProvider>
            ))}
          </div>

          {loadingEntities && <LoadingPlaceholder />}

          {hasMore ? (
            <div className="p-6 flex justify-center items-center bg-white border-t border-gray-100">
              <button
                onClick={loadMore}
                disabled={loadingEntities}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {loadingEntities ? "Loading..." : "Load more"}
              </button>
            </div>
          ) : (
            <div className="p-6 flex justify-center items-center bg-white border-t border-gray-100">
              <span className="text-gray-500 text-sm">No more entities</span>
            </div>
          )}
        </div>
        <UsernameModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </Sheet>
    </div>
  );
}
