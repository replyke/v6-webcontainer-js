import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetchUser } from "@replyke/react-js";
import { Calendar, User as UserIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import getUserAvatar from "../utils/getUserAvatar";

export default function UserHoverCard({ userId, children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUser = useFetchUser();

  const fetchUserData = async () => {
    if (user) return; // Already fetched

    setIsLoading(true);
    try {
      const userData = await fetchUser({ userId });
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const avatar = getUserAvatar(user?.id || "");

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span onMouseEnter={fetchUserData}>{children}</span>
      </HoverCardTrigger>
      <HoverCardContent
        className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 z-50"
        align="start"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : user && avatar ? (
          <div className="space-y-3">
            {/* User header */}
            <div className="flex items-center space-x-3">
              <Link
                to={"/u/" + user.id}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={avatar}
                  className="w-10 h-10 rounded-full bg-white shadow-lg"
                />
              </Link>
              <Link
                to={"/u/" + user.id}
                className="hover:underline font-bold text-gray-900 text-base truncate pb-1"
              >
                @{user.username}
              </Link>
            </div>

            {/* Bio */}
            {user.bio ? (
              <div>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {user.bio}
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <UserIcon size={14} />
                <span className="text-sm italic">No bio yet</span>
              </div>
            )}

            {/* Birthdate */}
            {user.birthdate && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={14} />
                <span className="text-sm">
                  Born{" "}
                  {new Date(user.birthdate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            {/* Join date */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-500 text-xs">
                Joined{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <p className="text-gray-500 text-sm">Unable to load user profile</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
