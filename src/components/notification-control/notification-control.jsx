import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppNotifications } from "@replyke/react-js";
import { CheckCheck } from "lucide-react";
import NotificationList from "./notification-list";
import NotificationTrigger from "./notification-trigger";

function NotificationControl({ notificationTemplates, theme = "auto" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    position: "absolute",
    top: "100%",
    right: 0,
    left: "auto",
    marginTop: "8px",
  });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const {
    appNotifications,
    unreadAppNotificationsCount,
    loading,
    hasMore,
    loadMore,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAppNotifications({
    limit: 10,
    notificationTemplates,
  });

  // Close dropdown when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        const position = calculateDropdownPosition();
        setDropdownPosition(position);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Calculate optimal dropdown position based on trigger position and viewport
  const calculateDropdownPosition = () => {
    if (!triggerRef.current) {
      return {
        position: "absolute",
        top: "100%",
        right: 0,
        left: "auto",
        marginTop: "8px",
      };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = Math.min(
      400,
      viewportWidth <= 768 ? viewportWidth - 32 : 400
    );
    const padding = 16;

    // Mobile devices: use fixed positioning for better control
    if (viewportWidth <= 768) {
      const triggerBottom = triggerRect.bottom;
      const triggerRight = triggerRect.right;

      // Calculate left position to ensure dropdown stays in viewport
      let leftPosition = triggerRight - dropdownWidth;

      // Ensure dropdown doesn't go off left edge
      if (leftPosition < padding) {
        leftPosition = padding;
      }

      // Ensure dropdown doesn't go off right edge
      if (leftPosition + dropdownWidth > viewportWidth - padding) {
        leftPosition = viewportWidth - dropdownWidth - padding;
      }

      return {
        position: "fixed",
        top: (triggerBottom + 8) + "px",
        left: leftPosition + "px",
        right: "auto",
        marginTop: "0px",
      };
    }

    // Desktop: use absolute positioning with proper boundary checking
    const triggerRight = triggerRect.right;
    const triggerLeft = triggerRect.left;

    // Calculate if dropdown would overflow when aligned to right edge of trigger
    const wouldOverflowRight = triggerRight + padding > viewportWidth;

    // If dropdown would overflow on the right, or if trigger is too close to right edge
    if (wouldOverflowRight || triggerRight - dropdownWidth < padding) {
      // Try aligning to left edge of trigger
      if (triggerLeft + dropdownWidth + padding <= viewportWidth) {
        return {
          position: "absolute",
          top: "100%",
          right: "auto",
          left: 0,
          marginTop: "8px",
        };
      } else {
        // If both alignments would overflow, use fixed positioning like mobile
        const maxLeft = viewportWidth - dropdownWidth - padding;
        const idealLeft = Math.max(
          padding,
          Math.min(maxLeft, triggerRight - dropdownWidth)
        );

        return {
          position: "fixed",
          top: (triggerRect.bottom + 8) + "px",
          left: idealLeft + "px",
          right: "auto",
          marginTop: "0px",
        };
      }
    }

    // Default: align to right edge (dropdown's right edge aligns with trigger's right edge)
    return {
      position: "absolute",
      top: "100%",
      right: 0,
      left: "auto",
      marginTop: "8px",
    };
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    switch (notification.type) {
      case "entity-upvote":
        navigate("/e/" + notification.metadata.entityShortId);
        break;
      case "entity-mention":
        navigate("/e/" + notification.metadata.entityShortId);
        break;
      case "entity-comment":
        navigate(
          "/e/" + notification.metadata.entityShortId + "/?commentId=" + notification.metadata.commentId
        );
        break;
      case "comment-upvote":
        navigate(
          "/e/" + notification.metadata.entityShortId + "/?commentId=" + notification.metadata.commentId
        );
        break;
      case "comment-mention":
        navigate(
          "/e/" + notification.metadata.entityShortId + "/?commentId=" + notification.metadata.commentId
        );
        break;
      case "comment-reply":
        navigate(
          "/e/" + notification.metadata.entityShortId + "/?commentId=" + notification.metadata.commentId
        );
        break;
      case "new-follow":
        navigate("/u/" + notification.metadata.initiatorId);
        break;
    }
  };

  // Simple dark theme detection
  const isDarkTheme =
    theme === "auto"
      ? typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
      : theme === "dark";

  // Theme-aware colors
  const colors = {
    background: isDarkTheme ? "oklch(0.205 0 0)" : "#ffffff",
    border: isDarkTheme ? "oklch(1 0 0 / 10%)" : "#e5e7eb",
    text: isDarkTheme ? "oklch(0.985 0 0)" : "#0f172a",
    textMuted: isDarkTheme ? "oklch(0.708 0 0)" : "#64748b",
    separator: isDarkTheme ? "oklch(1 0 0 / 10%)" : "#f1f5f9", // Much lighter separator for light theme
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) {
            const position = calculateDropdownPosition();
            setDropdownPosition(position);
          }
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer"
      >
        <NotificationTrigger unreadCount={unreadAppNotificationsCount} />
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="rounded-[10px] shadow-xl z-[60] p-0 border"
          style={{
            position: dropdownPosition.position,
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            left: dropdownPosition.left,
            marginTop: dropdownPosition.marginTop,
            width:
              typeof window !== "undefined" && window.innerWidth <= 768
                ? Math.min(400, window.innerWidth - 32) + "px"
                : "400px",
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2
              className="text-sm font-semibold m-0"
              style={{
                color: colors.text,
              }}
            >
              Notifications
              {unreadAppNotificationsCount > 0 && (
                <span
                  className="ml-2 text-xs"
                  style={{
                    color: colors.textMuted,
                  }}
                >
                  ({unreadAppNotificationsCount} new)
                </span>
              )}
            </h2>

            {unreadAppNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="bg-transparent border-none p-1 text-xs cursor-pointer rounded flex items-center transition-colors duration-200 hover:opacity-80 cursor-pointer"
                style={{
                  color: colors.textMuted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* Separator */}
          <div
            className="h-px mx-4"
            style={{
              backgroundColor: colors.separator,
            }}
          />

          {/* Notification List */}
          <div className="max-h-[500px]">
            <NotificationList
              notifications={appNotifications}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onNotificationClick={handleNotificationClick}
              isDarkTheme={isDarkTheme}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationControl;
