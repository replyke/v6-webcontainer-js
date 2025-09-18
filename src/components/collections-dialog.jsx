import React, { useState } from "react";
import { useEntity, useLists } from "@replyke/react-js";
import {
  Plus,
  Check,
  ChevronRight,
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

function CollectionsDialog({ setIsEntitySaved }) {
  const {
    createList,
    deleteList,
    updateList,
    subLists,
    openList,
    goBack,
    currentList,
    isEntityInList,
    addToList,
    removeFromList,
  } = useLists();

  const { entity } = useEntity();

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    setIsCreatingList(true);
    try {
      await createList({ listName: newListName.trim() });
      setNewListName("");
    } catch (error) {
      console.error("Failed to create list:", error);
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleAddToList = async (entityId) => {
    try {
      setIsSaving(true);
      await addToList({ entityId });
      setIsEntitySaved(true);
    } catch (error) {
      console.error("Failed to add to list:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromList = async (entityId) => {
    try {
      await removeFromList({ entityId });
    } catch (error) {
      console.error("Failed to remove from list:", error);
    }
  };

  const handleEditList = (list) => {
    setEditingList(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = async (listId) => {
    if (!editName.trim()) return;

    try {
      await updateList({ listId, update: { name: editName.trim() } });
      setEditingList(null);
      setEditName("");
    } catch (error) {
      console.error("Failed to update list:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName("");
  };

  const handleDeleteList = async (list) => {
    try {
      await deleteList({ list });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header - only show when NOT at root */}
      {currentList && currentList.parentId && (
        <div className="flex items-center pb-3 border-b">
          <Button
            size="sm"
            variant="ghost"
            onClick={goBack}
            className="h-8 px-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            {currentList.name}
          </Button>
        </div>
      )}

      {/* Current Collection Save - show when in a collection */}
      {currentList && entity?.id && (
        <div className="pb-3 border-b">
          <Button
            onClick={() => {
              const isInCurrentList = isEntityInList(entity.id);
              if (isInCurrentList) {
                handleRemoveFromList(entity.id);
              } else {
                handleAddToList(entity.id);
              }
            }}
            variant={isEntityInList(entity.id) ? "secondary" : "outline"}
            disabled={isSaving}
            className="w-full"
          >
            {isEntityInList(entity.id) ? (
              <>
                <Check size={16} className="mr-2" />
                Saved to {currentList.name}
              </>
            ) : isSaving ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Saving..
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Save to {currentList.name}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Collections List */}
      <div className="space-y-3">
        {!currentList && (
          <h3 className="font-medium text-gray-900">My Collections</h3>
        )}

        {subLists && subLists.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {subLists.map((list) => {
              const isEditing = editingList === list.id;

              return (
                <div
                  key={list.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(list.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(list.id)}
                          disabled={!editName.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                        onClick={() => openList(list)}
                      >
                        <span className="font-medium text-gray-900">
                          {list.name}
                        </span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditList(list)}
                          >
                            <Edit size={14} className="mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(list)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">No collections yet</div>
            <div className="text-sm">Create your first collection below</div>
          </div>
        )}
      </div>

      {/* Create New Collection */}
      <div className="pt-4 border-t flex items-center gap-2">
        <Input
          placeholder="New collection name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
          className="flex-1"
        />
        <Button
          onClick={handleCreateList}
          disabled={!newListName.trim() || isCreatingList}
          size="sm"
        >
          {isCreatingList ? "Creating..." : <Plus size={16} />}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Collection
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This
              action cannot be undone.
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
                onClick={() => handleDeleteList(deleteConfirm)}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsDialog;
