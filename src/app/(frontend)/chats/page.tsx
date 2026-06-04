"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { mockContacts, mockGroups, ChatContact, ChatGroup, Message } from "@/data/mockMessages";
import Link from "next/link";

export default function ChatsPage() {
  const [contacts, setContacts] = useState<ChatContact[]>(mockContacts);
  const [groups, setGroups] = useState<ChatGroup[]>(mockGroups);
  const [selectedChatId, setSelectedChatId] = useState<string>("chat-1");
  const [isGroup, setIsGroup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Active chat selection
  const activeContact = useMemo(() => {
    return contacts.find(c => c.id === selectedChatId) || null;
  }, [contacts, selectedChatId]);

  const activeGroup = useMemo(() => {
    return groups.find(g => g.id === selectedChatId) || null;
  }, [groups, selectedChatId]);

  // Scroll messages to bottom on switch or new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, contacts, groups]);

  // Search filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [contacts, searchTerm]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "Gaston Lapierre",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    if (isGroup) {
      setGroups(prevGroups =>
        prevGroups.map(g =>
          g.id === selectedChatId
            ? { ...g, messages: [...g.messages, newMsg] }
            : g
        )
      );
    } else {
      setContacts(prevContacts =>
        prevContacts.map(c =>
          c.id === selectedChatId
            ? {
                ...c,
                lastMessage: inputMessage,
                lastMessageTime: "Just now",
                messages: [...c.messages, newMsg]
              }
            : c
        )
      );
    }

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] space-y-4">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Messages</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Communicate with customers, agents, and staff members</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Chats</li>
        </ol>
      </div>

      {/* ── Main Chat Interface Window ────────────────────────────── */}
      <div className="flex flex-1 bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] min-h-0">
        
        {/* 1. Left Sidebar: Contacts & Groups */}
        <div className="w-[300px] border-r border-border flex flex-col shrink-0 bg-muted/10">
          {/* Search Box */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="Search contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>
          </div>

          {/* Chat List Scroll Container */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Group section */}
            <div>
              <p className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Groups</p>
              <div className="space-y-0.5">
                {groups.map((group) => {
                  const isActive = isGroup && selectedChatId === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => {
                        setSelectedChatId(group.id);
                        setIsGroup(true);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-[5px] text-left transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-[#ebe9fc] dark:bg-slate-700 flex items-center justify-center text-primary text-[13px] font-bold shrink-0">
                          #
                        </div>
                        <span className="text-[13.5px] truncate">{group.name}</span>
                      </div>
                      {group.unreadCount > 0 && (
                        <span className="bg-danger text-white text-[10px] font-bold h-4 px-1.5 rounded-full flex items-center justify-center">
                          {group.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct messages section */}
            <div>
              <p className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Direct Messages</p>
              <div className="space-y-0.5">
                {filteredContacts.map((contact) => {
                  const isActive = !isGroup && selectedChatId === contact.id;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedChatId(contact.id);
                        setIsGroup(false);
                        // Mark as read
                        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unreadCount: 0 } : c));
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-left transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {/* Avatar with Status indicator */}
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="h-9 w-9 rounded-full object-cover border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`;
                          }}
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card ${
                            contact.status === "Active"
                              ? "bg-success"
                              : contact.status === "Away"
                              ? "bg-warning"
                              : "bg-muted-foreground/50"
                          }`}
                        />
                      </div>

                      {/* Content Preview */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[13.5px] font-semibold text-foreground truncate">{contact.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                      </div>

                      {/* Unread badge */}
                      {contact.unreadCount > 0 && (
                        <span className="bg-danger text-white text-[10px] font-bold h-4 px-1.5 rounded-full flex items-center justify-center shrink-0">
                          {contact.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Center Panel: Active Chat Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/10">
          {/* Header info */}
          {((isGroup && activeGroup) || (!isGroup && activeContact)) ? (
            <>
              <div className="h-[65px] border-b border-border px-5 flex items-center justify-between shrink-0 bg-card">
                <div className="flex items-center gap-3">
                  {isGroup ? (
                    <div className="h-10 w-10 rounded-full bg-[#ebe9fc] dark:bg-slate-700 flex items-center justify-center text-primary text-[15px] font-bold shrink-0">
                      #
                    </div>
                  ) : (
                    <img
                      src={activeContact?.avatar}
                      alt={activeContact?.name}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeContact?.name}`;
                      }}
                    />
                  )}
                  <div>
                    <h4 className="text-[14px] font-bold text-foreground mb-0.5">
                      {isGroup ? activeGroup?.name : activeContact?.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-0">
                      {!isGroup && (
                        <>
                          <span className={`h-1.5 w-1.5 rounded-full ${activeContact?.status === "Active" ? "bg-success" : activeContact?.status === "Away" ? "bg-warning" : "bg-muted-foreground/60"}`} />
                          {activeContact?.status === "Active" ? "Online" : activeContact?.status === "Away" ? "Away" : `Last seen ${activeContact?.lastSeen || "recently"}`}
                        </>
                      )}
                      {isGroup && `${groups.find(g => g.id === selectedChatId)?.messages.length || 0} messages`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!isGroup && (
                    <>
                      <button onClick={() => alert("Starting voice call...")} className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors" title="Voice Call">
                        <i className="ri-phone-line text-[16px]" />
                      </button>
                      <button onClick={() => alert("Starting video call...")} className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors" title="Video Call">
                        <i className="ri-vidicon-line text-[16px]" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowProfilePanel(!showProfilePanel)}
                    className={`h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors ${showProfilePanel ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
                    title="Toggle Info Sidebar"
                  >
                    <i className="ri-information-line text-[17px]" />
                  </button>
                </div>
              </div>

              {/* Chat Stream (scrolled) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/5">
                {(isGroup ? activeGroup : activeContact)?.messages.map((msg) => {
                  const isMe = msg.senderId === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[80%] ${
                        isMe ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      {!isMe && (
                        <img
                          src={isGroup ? `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}` : activeContact?.avatar}
                          alt={msg.senderName}
                          className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5 border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}`;
                          }}
                        />
                      )}

                      {/* Bubble */}
                      <div className="space-y-1">
                        {isGroup && !isMe && (
                          <span className="text-[10px] font-bold text-primary block ml-1">{msg.senderName}</span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] text-[13px] leading-relaxed ${
                            isMe
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-card text-foreground border border-border rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span
                          className={`text-[9.5px] text-muted-foreground block px-1 ${
                            isMe ? "text-right" : ""
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              {/* Input section */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Files upload placeholder")}
                    className="h-9 w-9 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 transition-colors"
                  >
                    <i className="ri-attachment-line text-[18px]" />
                  </button>
                  <input
                    type="text"
                    className="flex-1 bg-background border border-border rounded-[5px] px-4 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded bg-primary hover:bg-[#4d36cd] text-white font-bold text-[12.5px] flex items-center gap-1 transition-all shrink-0"
                  >
                    Send <i className="ri-send-plane-2-line" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <i className="ri-chat-smile-2-line text-[48px] text-muted-foreground/50 mb-2" />
              <p className="text-[14px]">Select a chat or group conversation to start messaging.</p>
            </div>
          )}
        </div>

        {/* 3. Right Sidebar: Collapsible Profile Details */}
        {showProfilePanel && !isGroup && activeContact && (
          <div className="w-[260px] border-l border-border flex flex-col shrink-0 bg-card overflow-y-auto animate-in slide-in-from-right-5 duration-200">
            {/* Header profile info */}
            <div className="p-5 text-center border-b border-border flex flex-col items-center">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="h-20 w-20 rounded-full object-cover border border-border shadow-sm mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeContact.name}`;
                }}
              />
              <h4 className="font-bold text-[15px] text-foreground mb-0.5">{activeContact.name}</h4>
              <p className="text-[11.5px] text-muted-foreground uppercase tracking-wider font-semibold">{activeContact.status}</p>
            </div>

            {/* Detailed list */}
            <div className="p-4 space-y-4 text-[13px]">
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Email Address</span>
                <span className="text-foreground font-medium block truncate" title={activeContact.email}>{activeContact.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Phone Number</span>
                <span className="text-foreground font-medium block">{activeContact.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Location</span>
                <span className="text-foreground font-medium block">{activeContact.location}</span>
              </div>

              {/* Attachments shared mock list */}
              <div className="pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-2">Shared Files</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-semibold text-foreground truncate mb-0.5">property_flyer.pdf</p>
                      <p className="text-[9.5px] text-muted-foreground mb-0">1.8 MB</p>
                    </div>
                    <button className="text-primary hover:text-[#4d36cd] shrink-0 ml-2">
                      <i className="ri-download-2-line text-[15px]" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-semibold text-foreground truncate mb-0.5">house_images.zip</p>
                      <p className="text-[9.5px] text-muted-foreground mb-0">12.4 MB</p>
                    </div>
                    <button className="text-primary hover:text-[#4d36cd] shrink-0 ml-2">
                      <i className="ri-download-2-line text-[15px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
