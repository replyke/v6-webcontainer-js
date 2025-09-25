import { useState } from "react";
import { Shuffle } from "lucide-react";
import { useAuth } from "../context/use-auth";
import { ResponsiveDrawer } from "./ui/ResponsiveDrawer";

export default function UsernameModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUsername: saveUsername, generateRandomUsername } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (username.length > 30) {
      setError("Username must be less than 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers, hyphens, and underscores"
      );
      return;
    }

    saveUsername(username.trim());
    onClose();
  };

  const handleGenerateRandom = () => {
    const randomUsername = generateRandomUsername();
    setUsername(randomUsername);
    setError("");
  };

  return (
    <ResponsiveDrawer
      open={isOpen}
      onOpenChange={onClose}
      title="Choose a Username"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="text-sm flex-1 py-1.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="py-1.5 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap text-sm"
              title="Generate a random username suggestion"
            >
              <Shuffle size={16} className="inline mr-1" />
              Shuffle
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={!username.trim() || username.length < 3}
          className="w-full bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue with this username
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">
          <strong>Good to know:</strong>
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>
            • This is a demo project, so we're keeping it simple! In a real
            application, you'd typically have proper user authentication.
          </li>
          <li>
            • You can reuse a username you've used before if you want to test
            interactivity between different users
          </li>
          <li>
            • In this demo anyone can access any "account" by using the same
            username (e.g., "test", "user", "demo"). If you use a common
            word/phrase, you might enter an account with history
          </li>
          <li>
            • This is a public demo - don't post anything sensitive or important
          </li>
        </ul>
      </div>
    </ResponsiveDrawer>
  );
}
