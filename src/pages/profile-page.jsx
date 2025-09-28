import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  EntityProvider,
  useEntityList,
  useFetchUser,
  useFollowManager,
  useUser,
} from "@replyke/react-js";
import { ArrowLeft, Edit2, Check, X, Calendar, UserIcon } from "lucide-react";
import Tweet from "../components/tweet";
import UsernameModal from "../components/auth-modal";
import LoadingPlaceholder from "../components/loading-placeholder";
import Filters from "../components/filters";
import { Sheet } from "../components/ui/sheet";
import CommentSectionSheet from "../components/comment-section-sheet";
import getUserAvatar from "../utils/getUserAvatar";
import { generateProfileBanner } from "../utils/getProfileBanner";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useUser();
  const fetchUser = useFetchUser();
  const { isFollowing, isLoading, toggleFollow } = useFollowManager({
    userId,
  });

  const {
    entities,
    fetchEntities,
    loading: loadingEntities,
    hasMore,
    loadMore,
  } = useEntityList({
    listId: "profile-tweets-" + userId,
  });

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("new");
  const [timeFrame, setTimeFrame] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editBirthdate, setEditBirthdate] = useState("");

  const avatar = profileUser ? getUserAvatar(profileUser.id) : null;
  const bannerStyle = userId ? generateProfileBanner(userId) : null;

  useEffect(() => {
    if (!userId) return;

    const filters = {
      sortBy,
      timeFrame,
      userId: [userId],
    };

    if (content.length) {
      filters.contentFilters = { includes: [content] };
    }

    fetchEntities(
      filters,
      {
        sourceId: "tweets",
        limit: 10,
      },
      { resetUnspecified: true, clearImmediately: false }
    );
  }, [userId, sortBy, timeFrame, content]);

  useEffect(() => {
    if (userId === currentUser?.id) {
      console.log({ currentUser });
      setProfileUser(currentUser);
    } else if (userId) {
      fetchUser({ userId }).then((u) => setProfileUser(u));
    }
  }, [userId, currentUser]);

  // Initialize edit values when profileUser changes
  useEffect(() => {
    if (profileUser) {
      setEditBio(profileUser.bio || "");
      // Convert Date object to YYYY-MM-DD string format for date input
      setEditBirthdate(
        profileUser.birthdate
          ? new Date(profileUser.birthdate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [profileUser]);

  const isCurrentUser = currentUser?.id === userId;

  const handleBioEdit = () => {
    setIsEditingBio(true);
  };

  const handleBioSave = async () => {
    try {
      await updateUser({ bio: editBio });
      if (profileUser) {
        setProfileUser({ ...profileUser, bio: editBio });
      }
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  const handleBioCancel = () => {
    setEditBio(profileUser?.bio || "");
    setIsEditingBio(false);
  };

  const handleBirthdateEdit = () => {
    setIsEditingBirthdate(true);
  };

  const handleBirthdateSave = async () => {
    try {
      // Convert string back to Date object
      const birthdateObj = editBirthdate ? new Date(editBirthdate) : null;
      await updateUser({ birthdate: birthdateObj });
      if (profileUser) {
        setProfileUser({ ...profileUser, birthdate: birthdateObj });
      }
      setIsEditingBirthdate(false);
    } catch (error) {
      console.error("Failed to update birthdate:", error);
    }
  };

  const handleBirthdateCancel = () => {
    // Convert Date object back to string format for input
    setEditBirthdate(
      profileUser?.birthdate
        ? new Date(profileUser.birthdate).toISOString().split("T")[0]
        : ""
    );
    setIsEditingBirthdate(false);
  };

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
          onAuthRequired={handleShowAuthModal}
        />
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200">
          {/* Header with back button */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center space-x-4 z-10">
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Profile</h1>
              {entities.length > 0 && (
                <p className="text-sm text-gray-500">
                  {entities.length} tweets
                </p>
              )}
            </div>
          </div>

          {/* Profile user info - always show if we have profile data */}
          {profileUser && avatar && (
            <div className="bg-white border-b border-gray-200 relative">
              {/* Profile banner/header area */}
              <div className="relative h-40">
                <div
                  className="h-40 overflow-hidden"
                  style={{
                    backgroundImage:
                      bannerStyle?.backgroundImage ||
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                {/* Profile avatar positioned over the banner */}
                <div className="absolute -bottom-10 left-6">
                  <img
                    src={avatar}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white"
                  />
                </div>
              </div>

              {/* Profile details */}
              <div className="pt-12 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      @{profileUser.username}
                    </h1>

                    {/* Bio Section */}
                    <div className="mb-3">
                      {isEditingBio ? (
                        <div className="flex items-center space-x-2">
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Add a bio..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            maxLength={160}
                          />
                          <button
                            onClick={handleBioSave}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleBioCancel}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            {profileUser.bio ? (
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {profileUser.bio}
                              </p>
                            ) : (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <UserIcon size={14} />
                                <span className="text-sm italic">
                                  {isCurrentUser
                                    ? "Add a bio to tell people about yourself"
                                    : "No bio yet"}
                                </span>
                              </div>
                            )}
                          </div>
                          {isCurrentUser && (
                            <button
                              onClick={handleBioEdit}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all ml-2 cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Birthdate Section */}
                    <div className="mb-3">
                      {isEditingBirthdate ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={editBirthdate}
                            onChange={(e) => setEditBirthdate(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={handleBirthdateSave}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleBirthdateCancel}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-gray-500" />
                            {profileUser.birthdate ? (
                              <span className="text-gray-600 text-sm">
                                Born{" "}
                                {new Date(
                                  profileUser.birthdate
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm italic">
                                {isCurrentUser
                                  ? "Add your birthdate"
                                  : "Birthdate not set"}
                              </span>
                            )}
                          </div>
                          {isCurrentUser && (
                            <button
                              onClick={handleBirthdateEdit}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        <span className="font-semibold text-gray-900">
                          {entities.length}
                        </span>{" "}
                        tweets
                      </span>
                      <span>
                        Joined{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Follow Button - only show if not current user and user is logged in */}
                  {!isCurrentUser && currentUser && (
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={toggleFollow}
                        disabled={isLoading}
                        className={
                          "px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer " +
                          (isLoading || isFollowing
                            ? "text-gray-800 hover:bg-gray-300 border border-gray-300"
                            : "text-white hover:bg-blue-700") +
                          " " +
                          (isLoading || isFollowing
                            ? "bg-gray-200"
                            : "bg-blue-600")
                        }
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {entities.length === 0 && !loadingEntities && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No tweets found</p>
              <p className="text-gray-400 text-sm mt-2">
                This user hasn't posted any tweets yet.
              </p>
            </div>
          )}

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
            entities.length > 0 && (
              <div className="p-6 flex justify-center items-center bg-white border-t border-gray-100">
                <span className="text-gray-500 text-sm">No more tweets</span>
              </div>
            )
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
