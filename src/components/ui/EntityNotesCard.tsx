"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Pin, Trash2, Calendar, Send } from "lucide-react";

interface EntityNotesCardProps {
  entityId: string;
}

export function EntityNotesCard({ entityId }: EntityNotesCardProps) {
  const { entityNotes, addEntityNote, deleteEntityNote, togglePinNote } = useAppStore();
  const [noteText, setNoteText] = useState("");

  const notes = entityNotes.filter(n => n.entityId === entityId);
  // Sort pinned first, then by date descending (we use id/timestamp comparison as a backup)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    addEntityNote({
      entityId,
      authorName: "Dominic Keller", // Default logged-in admin user
      authorAvatar: "/assets/images/users/avatar-1.jpg",
      content: noteText,
      isPinned: false
    });

    setNoteText("");
    toast.success("Note added successfully.");
  };

  const handleTogglePin = (id: string) => {
    togglePinNote(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      toast.success(note.isPinned ? "Note unpinned." : "Note pinned to top.");
    }
  };

  const handleDelete = (id: string) => {
    deleteEntityNote(id);
    toast.success("Note deleted.");
  };

  return (
    <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
      <div className="border-b border-border pb-3 mb-4">
        <h4 className="text-[15.5px] font-bold text-foreground">Interaction Notes & Logs</h4>
        <p className="text-[12px] text-muted-foreground mt-0.5">Attach meeting logs, notes, or client interactions to this record</p>
      </div>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="relative">
          <textarea
            rows={3}
            placeholder="Type interaction note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-3 pr-10 py-2 outline-none focus:border-primary placeholder:text-muted-foreground/60 resize-none font-medium"
          />
          <button
            type="submit"
            disabled={!noteText.trim()}
            className="absolute right-2.5 bottom-2.5 h-7 w-7 rounded bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground/30 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Notes list */}
      {sortedNotes.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-8 text-center text-[12.5px] text-muted-foreground bg-muted/5 font-medium">
          No notes logged yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {sortedNotes.map(note => (
            <div
              key={note.id}
              className={`border rounded-lg p-3 space-y-2 relative transition-all group ${
                note.isPinned 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-card border-border/70 hover:border-border"
              }`}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={note.authorAvatar || "/assets/images/users/avatar-1.jpg"}
                    className="h-6 w-6 rounded-full object-cover border border-border"
                    alt=""
                  />
                  <div>
                    <span className="text-[12px] font-bold text-foreground block leading-none">{note.authorName}</span>
                    <span className="text-[9.5px] text-muted-foreground flex items-center gap-0.5 mt-0.5 font-bold">
                      <Calendar className="h-3 w-3" /> {note.createdAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`h-6 w-6 rounded flex items-center justify-center transition-all ${
                      note.isPinned 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={note.isPinned ? "Unpin Note" : "Pin Note"}
                  >
                    <Pin className={`h-3.5 w-3.5 ${note.isPinned ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="h-6 w-6 rounded flex items-center justify-center text-danger hover:bg-danger/10 transition-all"
                    title="Delete Note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <p className="text-[12.5px] text-foreground/80 leading-relaxed font-medium">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
