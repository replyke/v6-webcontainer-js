import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EntityProvider, useFetchEntityByShortId } from "@replyke/react-js";
import Tweet from "../components/tweet";
import LoadingPlaceholder from "../components/loading-placeholder";
import CommentSectionSheet from "../components/comment-section-sheet";
import { Button } from "../components/ui/button";

export default function EntityPage() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const fetchEntityByShortId = useFetchEntityByShortId();

  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!shortId) {
      setError("No entity ID provided");
      setLoading(false);
      return;
    }

    const loadEntity = async () => {
      try {
        setLoading(true);
        const fetchedEntity = await fetchEntityByShortId({ shortId });
        if (fetchedEntity) {
          setEntity(fetchedEntity);
        } else {
          setError("Entity not found");
        }
      } catch (err) {
        console.error("Failed to fetch entity:", err);
        setError("Failed to load entity");
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [shortId, fetchEntityByShortId]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSelectEntity = (ent) => {
    setSelectedEntity(ent);
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </div>
          <LoadingPlaceholder />
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </div>
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              {error || "Entity not found"}
            </div>
            <Button onClick={handleBackToHome} variant="outline">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CommentSectionSheet
        entity={selectedEntity}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
      <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
        </div>

        <EntityProvider entity={entity}>
          <Tweet
            onAuthRequired={() => {
              /* Auth modal could be added here if needed */
            }}
            handleSelectEntity={handleSelectEntity}
          />
        </EntityProvider>
      </div>
    </div>
  );
}
