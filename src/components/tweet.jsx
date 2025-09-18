import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useEntity,
  useEntityList,
  useUser,
  useIsEntitySaved,
} from "@replyke/react-js";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import { ResponsiveDrawer } from "./ui/ResponsiveDrawer";
import UserHoverCard from "./user-hover-card";
import getUserAvatar from "../utils/getUserAvatar";
import CollectionsDialog from "./collections-dialog";
import ReportDialog from "./report-dialog";
import { Dialog } from "./ui/dialog";

const formatTimestamp = (timestamp) => {
  const now = new Date();

  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 2) {
    return "Just now";
  } else if (minutes < 60) {
    return minutes + "m";
  } else if (hours < 24) {
    return hours + "h";
  } else {
    return days + "d";
  }
};

export default function Tweet({ onAuthRequired, handleSelectEntity }) {
  const { user } = useUser();
  const {
    entity,
    userUpvotedEntity,
    upvoteEntity,
    removeEntityUpvote,
    userDownvotedEntity,
    downvoteEntity,
    removeEntityDownvote,
  } = useEntity();

  const isAuthor = user?.id === entity?.user?.id;

  const { deleteEntity } = useEntityList({
    listId: "home-tweets",
  });

  const { checkIfEntityIsSaved } = useIsEntitySaved();

  const [isEntitySaved, setIsEntitySaved] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user && entity?.id) {
      checkIfEntityIsSaved(entity.id).then((isSaved) =>
        setIsEntitySaved(isSaved)
      );
    }
  }, [user, entity, checkIfEntityIsSaved]);

  const handleDeleteConfirm = () => {
    if (entity?.id) {
      deleteEntity({ entityId: entity.id });
      setShowDeleteConfirm(false);
    }
  };

  const handleBookmarkClick = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setIsBookmarkDrawerOpen(true);
  };

  return (
    <div className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50/50 transition-all duration-200">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserHoverCard userId={entity?.user?.id || ""}>
              <Link
                to={"/u/" + (entity?.user?.id || "")}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={getUserAvatar(entity?.user?.id || "")}
                  className="w-7 h-7 rounded-full bg-white shadow"
                />
              </Link>
            </UserHoverCard>
            <div className="flex items-center space-x-2 pb-0.5">
              <UserHoverCard userId={entity?.user?.id || ""}>
                <Link to={"/u/" + (entity?.user?.id || "")} className="hover:underline">
                  <span className="font-semibold text-gray-900 text-sm">
                    @{entity?.user?.username}
                  </span>
                </Link>
              </UserHoverCard>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-xs">
                {entity && formatTimestamp(new Date(entity.createdAt))}
              </span>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors opacity-60 hover:opacity-100"
            >
              <MoreHorizontal size={14} className="text-gray-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-36">
                {isAuthor ? (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete entity
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowReportDialog(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Report entity
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-900 leading-relaxed text-sm ml-10">
          {entity?.content}
        </p>

        <div className="flex justify-between">
          <div className="flex items-center space-x-8 ml-10 pt-1">
            <button
              onClick={() => {
                if (!user) {
                  onAuthRequired();
                  return;
                }
                if (userUpvotedEntity) {
                  removeEntityUpvote?.();
                } else {
                  upvoteEntity?.();
                }
              }}
              className={"flex items-center space-x-1.5 transition-all group cursor-pointer " + (
                userUpvotedEntity
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-blue-600"
              )}
            >
              <div
                className={"p-1.5 rounded-full transition-all " + (
                  userUpvotedEntity ? "bg-blue-100" : "group-hover:bg-blue-50"
                )}
              >
                <ThumbsUp size={14} />
              </div>
              <span className="text-xs font-medium">
                {entity?.upvotes.length}
              </span>
            </button>

            <button
              onClick={() => {
                if (!user) {
                  onAuthRequired();
                  return;
                }
                if (userDownvotedEntity) {
                  removeEntityDownvote?.();
                } else {
                  downvoteEntity?.();
                }
              }}
              className={"flex items-center space-x-1.5 transition-all group cursor-pointer " + (
                userDownvotedEntity
                  ? "text-red-600"
                  : "text-gray-400 hover:text-red-600"
              )}
            >
              <div
                className={"p-1.5 rounded-full transition-all " + (
                  userDownvotedEntity ? "bg-red-100" : "group-hover:bg-red-50"
                )}
              >
                <ThumbsDown size={14} />
              </div>
              <span className="text-xs font-medium">
                {entity?.downvotes.length}
              </span>
            </button>

            <button
              onClick={() =>
                !user ? onAuthRequired() : handleSelectEntity(entity)
              }
              className="flex items-center space-x-1.5 text-gray-400 hover:text-green-600 transition-all group cursor-pointer"
            >
              <div className="p-1.5 rounded-full group-hover:bg-green-50 transition-all">
                <MessageCircle size={14} />
              </div>
              <span className="text-xs font-medium">
                {entity?.repliesCount}
              </span>
            </button>
          </div>
          <ResponsiveDrawer
            open={isBookmarkDrawerOpen}
            onOpenChange={setIsBookmarkDrawerOpen}
            title="Add to Collection"
            trigger={
              <button
                onClick={handleBookmarkClick}
                className={"flex items-center space-x-1.5 transition-all group cursor-pointer " + (
                  isEntitySaved
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-blue-600"
                )}
              >
                <div
                  className={"p-1.5 rounded-full transition-all " + (
                    isEntitySaved ? "bg-blue-100" : "group-hover:bg-blue-50"
                  )}
                >
                  <Bookmark
                    size={14}
                    fill={isEntitySaved ? "currentColor" : "none"}
                  />
                </div>
              </button>
            }
          >
            <CollectionsDialog setIsEntitySaved={setIsEntitySaved} />
          </ResponsiveDrawer>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Entity
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this entity? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <ReportDialog
          setShowReportPostDialog={setShowReportDialog}
          entity={entity}
        />
      </Dialog>
    </div>
  );
}
