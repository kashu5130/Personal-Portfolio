import React from "react";
import { X, Trash2, Clock, BookOpen, ChevronRight, FileText } from "lucide-react";
import { SavedAssignment } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedAssignment[];
  onSelect: (item: SavedAssignment) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2D2A26]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E0D8CF] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E0D8CF] flex items-center justify-between bg-[#F1EDE6]/80">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#5E6B5D]" />
              <h3 className="font-semibold text-sm text-[#2D2A26]">
                Synthesized Assignment Archive
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0D8CF] text-[#3D3B39]">
                {history.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs text-[#7A736B] hover:text-rose-700 font-medium transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[#7A736B] hover:text-[#2D2A26] hover:bg-[#EAE2D8] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FileText className="w-10 h-10 text-[#D0C7BC] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#7A736B]">No saved assignments yet</p>
                <p className="text-xs text-[#948B81] mt-1">
                  Synthesize an assignment prompt to automatically record it in your archive.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group p-3.5 rounded-2xl border border-[#E0D8CF] hover:border-[#7D8C7C] hover:bg-[#F7F3EE] transition-all cursor-pointer relative text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F1EDE6] text-[#5E6B5D] border border-[#D0C7BC]">
                      {item.discipline}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => onDelete(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#948B81] hover:text-rose-700 transition-opacity"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-[#2D2A26] mt-1.5 line-clamp-2 leading-snug font-serif">
                    {item.query}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[#7A736B] mt-2 font-mono">
                    <span>{item.wordCount} words</span>
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
