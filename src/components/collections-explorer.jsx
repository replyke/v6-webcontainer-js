import { useState } from "react";
import { Link } from "react-router-dom";
import { useLists } from "@replyke/react-js";
import {
  ArrowLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { Button } from "../components/ui/button";

function CollectionsExplorer() {
  const { subLists, openList, goBack, currentList, removeFromList } =
    useLists();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleRemoveFromCollection = async (entityId) => {
    if (!deleteConfirm) return;

    try {
      await removeFromList({ entityId });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to remove from collection:", error);
    }
  };

  const entities = currentList?.entities || [];
  const collections = subLists || [];

  return (
    <div className="space-y-3">
      {/* Current Collection Header */}
      {currentList && (
        <div className="pb-2 border-b">
          <div className="flex items-center space-x-2">
            {currentList.parentId && (
              <Button
                size="sm"
                variant="ghost"
                onClick={goBack}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={14} />
              </Button>
            )}
            <h2 className="text-base font-medium text-gray-900">
              {currentList.name === "root" ? "Root" : currentList.name}
            </h2>
            <span className="text-xs text-gray-500">
              {entities.length} {entities.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      )}

      {/* Collections Navigation - Always Show */}
      <div className="space-y-2">
        {collections.length > 0 ? (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {collections.map((list) => (
              <div
                key={list.id}
                className="flex items-center justify-between px-3 py-2 rounded-md border hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openList(list)}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {list.name}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <FolderOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <div className="text-xs">No collections yet</div>
          </div>
        )}
      </div>

      {/* Current Collection Entities - Show only when in a collection */}
      {currentList && (
        <div className="space-y-2 pt-3 border-t">
          {entities.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-start space-x-2 p-2 rounded-md border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {entity.content && entity.content.length > 80
                            ? entity.content.substring(0, 80) + "..."
                            : entity.content}{" "}
                        </h4>

                        <div className="flex items-center space-x-3 mt-2">
                          <Link
                            to={"/e/" + entity.shortId}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <ExternalLink size={10} />
                            <span>View</span>
                          </Link>
                          {entity.createdAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(entity.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setDeleteConfirm({
                            entity,
                            listName: currentList.name,
                          })
                        }
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="text-xs">No items in this collection</div>
            </div>
          )}
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Remove from Collection
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to remove "
              {deleteConfirm.entity.title || "this item"}" from "
              {deleteConfirm.listName}"?
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleRemoveFromCollection(deleteConfirm.entity.id)
                }
                variant="destructive"
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsExplorer;
