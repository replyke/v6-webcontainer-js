import { useState } from "react";
import { X, Shuffle } from "lucide-react";
import { useAuth } from "../../context/use-auth";

export default function UsernameModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUsername: saveUsername, generateRandomUsername } = useAuth();

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">
            Choose a Username
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This is a demo project, so we're
              keeping it simple! In a real application, you'd typically have
              proper user authentication. Enter a username below or shuffle
              through random suggestions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap text-sm"
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                • You can reuse a username you've used before if you want to
                test interactivity between different users
              </li>
              <li>
                • In this demo anyone can access any "account" by using the same
                username (e.g., "test", "user", "demo"). If you use a common
                word/phrase, you might enter an account with history
              </li>
              <li>
                • This is a public demo - don't post anything sensitive or
                important
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
