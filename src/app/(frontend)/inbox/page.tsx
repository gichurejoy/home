"use client";

import { useState, useMemo } from "react";
import { mockEmails, Email, EmailAttachment } from "@/data/mockEmails";
import Link from "next/link";

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [activeFolder, setActiveFolder] = useState<string>("inbox");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [activeEmailId, setActiveEmailId] = useState<string | null>("email-1");
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Form states for Compose Mail
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");

  // Form states for Quick Reply
  const [replyText, setReplyText] = useState("");

  // Selected Email Detail
  const activeEmail = useMemo(() => {
    return emails.find((e) => e.id === activeEmailId) || null;
  }, [emails, activeEmailId]);

  // Folder Counts
  const inboxCount = useMemo(() => {
    return emails.filter((e) => e.folder === "inbox" && !e.isRead).length;
  }, [emails]);

  const draftsCount = useMemo(() => {
    return emails.filter((e) => e.folder === "drafts").length;
  }, [emails]);

  // Filtered Emails List
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Folder or Label match
      let matchesFolder = false;
      if (activeLabel) {
        matchesFolder = email.labels.includes(activeLabel as any);
      } else if (activeFolder === "starred") {
        matchesFolder = email.isStarred;
      } else if (activeFolder === "important") {
        matchesFolder = email.isImportant;
      } else {
        matchesFolder = email.folder === activeFolder;
      }

      // Search match
      const matchesSearch =
        email.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFolder && matchesSearch;
    });
  }, [emails, activeFolder, activeLabel, searchTerm]);

  // Handlers
  const handleSelectEmailRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails((prev) => [...prev, id]);
    } else {
      setSelectedEmails((prev) => prev.filter((emailId) => emailId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(filteredEmails.map((e) => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const handleDeleteSelected = () => {
    if (selectedEmails.length === 0) return;
    setEmails((prev) =>
      prev.map((email) =>
        selectedEmails.includes(email.id) ? { ...email, folder: "trash" } : email
      )
    );
    setSelectedEmails([]);
    setActiveEmailId(null);
  };

  const handleMarkAsReadSelected = (isRead: boolean) => {
    if (selectedEmails.length === 0) return;
    setEmails((prev) =>
      prev.map((email) =>
        selectedEmails.includes(email.id) ? { ...email, isRead } : email
      )
    );
    setSelectedEmails([]);
  };

  const handleComposeSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !bodyText.trim()) return;

    const newEmail: Email = {
      id: `email-${Date.now()}`,
      senderName: "Gaston Lapierre",
      senderEmail: "gaston@lahomes.com",
      senderAvatar: "/assets/images/users/avatar-1.jpg",
      subject: subject,
      preview: bodyText.substring(0, 80) + "...",
      body: bodyText,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isRead: true,
      isStarred: false,
      isImportant: false,
      folder: "sent",
      labels: ["Work"]
    };

    setEmails([newEmail, ...emails]);
    setToEmail("");
    setSubject("");
    setBodyText("");
    setShowComposeModal(false);
    setActiveFolder("sent");
    setActiveLabel(null);
    setActiveEmailId(newEmail.id);
  };

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeEmail) return;

    alert(`Reply sent to ${activeEmail.senderEmail}:\n\n"${replyText}"`);
    setReplyText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] space-y-4">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Inbox</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Access mail notifications, contact inquiries, and newsletters</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Inbox</li>
        </ol>
      </div>

      {/* ── Main Layout Split Screen ────────────────────────────────── */}
      <div className="flex flex-1 bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] min-h-0">
        
        {/* 1. Left Sidebar: Folder & Labels */}
        <div className="w-[220px] border-r border-border shrink-0 bg-muted/10 p-4 flex flex-col space-y-6 overflow-y-auto">
          {/* Compose Button */}
          <button
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-[#ff5b5b] hover:bg-[#eb4a4a] text-white text-[13px] font-bold py-2 px-4 rounded-[6px] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <i className="ri-pencil-line text-[15px]" /> Compose
          </button>

          {/* Folder Categories */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Folders</p>
            <ul className="space-y-0.5 text-[13px]">
              {[
                { key: "inbox", label: "Inbox", icon: "ri-inbox-line", badge: inboxCount },
                { key: "starred", label: "Starred", icon: "ri-star-line" },
                { key: "important", label: "Important", icon: "ri-bookmark-3-line" },
                { key: "sent", label: "Sent Mail", icon: "ri-send-plane-line" },
                { key: "drafts", label: "Drafts", icon: "ri-file-text-line", badge: draftsCount },
                { key: "trash", label: "Trash", icon: "ri-delete-bin-line" }
              ].map((folder) => {
                const isActive = !activeLabel && activeFolder === folder.key;
                return (
                  <li key={folder.key}>
                    <button
                      onClick={() => {
                        setActiveFolder(folder.key);
                        setActiveLabel(null);
                        setSelectedEmails([]);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[4px] text-left transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <i className={`${folder.icon} text-[15px]`} /> {folder.label}
                      </span>
                      {folder.badge !== undefined && folder.badge > 0 && (
                        <span className="bg-primary/20 text-primary text-[10px] font-bold h-4 px-1.5 rounded-full flex items-center justify-center">
                          {folder.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Label Categories */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Labels</p>
            <ul className="space-y-0.5 text-[13px]">
              {[
                { name: "Personal", color: "bg-success" },
                { name: "Work", color: "bg-primary" },
                { name: "Update", color: "bg-info" },
                { name: "Social", color: "bg-warning" }
              ].map((lbl) => {
                const isActive = activeLabel === lbl.name;
                return (
                  <li key={lbl.name}>
                    <button
                      onClick={() => {
                        setActiveLabel(lbl.name);
                        setSelectedEmails([]);
                      }}
                      className={`w-full flex items-center px-3 py-1.5 rounded-[4px] text-left transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${lbl.color} mr-2.5`} />
                      {lbl.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 2. Middle Panel: Emails List */}
        <div className="w-[380px] border-r border-border shrink-0 flex flex-col min-w-0">
          {/* List Search & Controls */}
          <div className="p-4 border-b border-border space-y-3 shrink-0 bg-muted/5">
            <div className="relative">
              <input
                type="search"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="Search mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border text-[#604ae3] h-4 w-4"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    filteredEmails.length > 0 &&
                    filteredEmails.every((e) => selectedEmails.includes(e.id))
                  }
                />
                {selectedEmails.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDeleteSelected}
                      className="h-7 w-7 rounded hover:bg-muted text-danger flex items-center justify-center transition-colors"
                      title="Move to Trash"
                    >
                      <i className="ri-delete-bin-line text-[15px]" />
                    </button>
                    <button
                      onClick={() => handleMarkAsReadSelected(true)}
                      className="h-7 w-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                      title="Mark as Read"
                    >
                      <i className="ri-mail-open-line text-[15px]" />
                    </button>
                    <button
                      onClick={() => handleMarkAsReadSelected(false)}
                      className="h-7 w-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                      title="Mark as Unread"
                    >
                      <i className="ri-mail-line text-[15px]" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[11.5px] text-muted-foreground">
                {filteredEmails.length} messages
              </span>
            </div>
          </div>

          {/* Email Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-[13px]">
                No emails found.
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmails.includes(email.id);
                const isActive = activeEmailId === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setActiveEmailId(email.id);
                      // Mark as read
                      setEmails((prev) =>
                        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
                      );
                    }}
                    className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary/5 border-l-2 border-primary"
                        : "hover:bg-muted/30"
                    } ${!email.isRead ? "font-semibold bg-muted/10" : ""}`}
                  >
                    {/* Checkbox and Star */}
                    <div className="flex flex-col items-center gap-2 mt-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-border text-[#604ae3] h-3.5 w-3.5"
                        checked={isSelected}
                        onChange={(e) => handleSelectEmailRow(email.id, e.target.checked)}
                      />
                      <button onClick={(e) => toggleStar(email.id, e)} className="text-muted-foreground hover:text-warning transition-colors">
                        <i className={email.isStarred ? "ri-star-fill text-[15px] text-warning" : "ri-star-line text-[15px]"} />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[13px] text-foreground truncate">{email.senderName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{email.time}</span>
                      </div>
                      <h5 className="text-[12.5px] text-foreground truncate">{email.subject}</h5>
                      <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-relaxed">{email.preview}</p>
                      
                      {/* Label badges / tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {email.labels.map((lbl) => (
                          <span
                            key={lbl}
                            className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold ${
                              lbl === "Work"
                                ? "bg-primary/10 text-primary"
                                : lbl === "Personal"
                                ? "bg-success/10 text-success"
                                : lbl === "Update"
                                ? "bg-info/10 text-info"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {lbl}
                          </span>
                        ))}
                        {email.attachments && email.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-muted text-muted-foreground text-[9.5px] font-bold">
                            <i className="ri-attachment-line" /> {email.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Right Panel: Active Email Details */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/5">
          {activeEmail ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              
              {/* Header: Sender details */}
              <div className="p-5 border-b border-border flex items-start gap-4 shrink-0 bg-card">
                <img
                  src={activeEmail.senderAvatar}
                  alt={activeEmail.senderName}
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeEmail.senderName}`;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[15px] text-foreground mb-0.5">{activeEmail.senderName}</h4>
                  <p className="text-[12px] text-muted-foreground truncate">
                    From: &lt;{activeEmail.senderEmail}&gt;
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    To: gaston@lahomes.com
                  </p>
                </div>
                <div className="text-right shrink-0 text-[11.5px] text-muted-foreground">
                  <span>{activeEmail.date}</span>
                  <span className="block mt-1 font-semibold">{activeEmail.time}</span>
                </div>
              </div>

              {/* Subject & Email Body */}
              <div className="p-6 space-y-6 flex-1 bg-card">
                <h3 className="text-[16px] font-bold text-foreground leading-snug">
                  {activeEmail.subject}
                </h3>
                <div className="text-[13.5px] text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeEmail.body}
                </div>

                {/* Attachments Section */}
                {activeEmail.attachments && activeEmail.attachments.length > 0 && (
                  <div className="pt-4 border-t border-border mt-6">
                    <h5 className="text-[12.5px] font-bold text-foreground mb-3 flex items-center gap-1">
                      <i className="ri-attachment-line text-[14px]" /> Attachments ({activeEmail.attachments.length})
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeEmail.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="p-3 rounded border border-border bg-muted/30 flex items-center justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-semibold text-foreground truncate mb-0.5">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mb-0">{file.size}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${file.name}...`)}
                            className="h-8 w-8 rounded-full hover:bg-muted text-primary flex items-center justify-center transition-colors"
                            title="Download File"
                          >
                            <i className="ri-download-2-line text-[16px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Section Footer */}
              <div className="p-5 border-t border-border bg-card shrink-0">
                <form onSubmit={handleSendQuickReply} className="space-y-3">
                  <span className="text-[12px] font-bold text-muted-foreground block">
                    Quick Reply to {activeEmail.senderName}:
                  </span>
                  <textarea
                    rows={3}
                    className="w-full bg-background border border-border rounded-[5px] p-3 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Type your reply message here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyText("")}
                      className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-[#4d36cd] text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors flex items-center gap-1"
                    >
                      Send Reply <i className="ri-send-plane-fill" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <i className="ri-mail-line text-[48px] text-muted-foreground/50 mb-2" />
              <p className="text-[14px]">Select an email to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Compose Message Modal ──────────────────────────────────── */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-[8px] shadow-lg max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#ff5b5b]/10">
              <h3 className="text-[15.5px] font-bold text-foreground">New Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="h-8 w-8 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <i className="ri-close-line text-[20px]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleComposeSend}>
              <div className="p-5 space-y-4">
                <div>
                  <label htmlFor="toEmail" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    TO (RECIPIENT)
                  </label>
                  <input
                    type="email"
                    id="toEmail"
                    required
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Enter email address..."
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Enter message subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="bodyText" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    MESSAGE CONTENT
                  </label>
                  <textarea
                    id="bodyText"
                    required
                    rows={6}
                    className="w-full bg-background border border-border rounded-[5px] p-3.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Type details of your email here..."
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/10">
                <button
                  type="button"
                  onClick={() => {
                    setToEmail("");
                    setSubject("");
                    setBodyText("");
                    setShowComposeModal(false);
                  }}
                  className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-[#4d36cd] text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors flex items-center gap-1.5"
                >
                  Send Message <i className="ri-send-plane-fill" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
