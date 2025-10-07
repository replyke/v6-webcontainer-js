import { LogOut, FolderOpen } from "lucide-react";
import { useAuth as useAuthReplyke, useUser } from "@replyke/react-js";
import { Link } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import getUserAvatar from "../utils/getUserAvatar";
import { ResponsiveDrawer } from "./ui/ResponsiveDrawer";
import CollectionsExplorer from "./collections-explorer";
import NotificationControl from "./notification-control";

export default function UserProfile() {
  const { clearUsername } = useAuth();
  const { user } = useUser();
  const { signOut: signOutReplyke } = useAuthReplyke();

  if (!user) return null;

  const notificationTemplates = {
    entityComment: {
      title: "New comment on your post",
      content: "$initiatorName commented on your post",
    },
    commentReply: {
      title: "New reply to your comment",
      content: "$initiatorName replied to your comment",
    },
    entityMention: {
      title: "You were mentioned in a post",
      content: "$initiatorName mentioned you",
    },
    commentMention: {
      title: "You were mentioned in a comment",
      content: "$initiatorName mentioned you in a comment",
    },
    entityUpvote: {
      title: "Your post was liked",
      content: "$initiatorName liked your post",
    },
    commentUpvote: {
      title: "Your comment was liked",
      content: "$initiatorName liked your comment",
    },
    newFollow: {
      title: "New follower",
      content: "$initiatorName started following you",
    },
  };

  const handleSignOut = async () => {
    clearUsername();
    await signOutReplyke();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-100 rounded-xl p-4 flex flex-col-reverse gap-4 md:flex-row md:items-center justify-between">
      <Link
        to={"/u/" + user.id}
        className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-max whitespace-nowrap"
      >
        <img
          src={getUserAvatar(user.id)}
          className="size-8 md:size-10 rounded-full bg-white shadow-lg"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{user.username}</p>
          <p className="text-xs text-gray-600">Demo user</p>
        </div>
      </Link>

      <div className="flex items-center space-x-2">
        <ResponsiveDrawer
          title="My Collections"
          trigger={
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all px-3 py-2 rounded-lg hover:bg-blue-50 border border-blue-200 cursor-pointer">
              <FolderOpen size={14} />
              <span className="text-xs font-medium">My collections</span>
            </button>
          }
        >
          <CollectionsExplorer />
        </ResponsiveDrawer>

        <NotificationControl
          notificationTemplates={notificationTemplates}
          theme="light"
        />

        <div className="flex-1" />

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer"
        >
          <LogOut size={14} />
          <span className="text-xs font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}
