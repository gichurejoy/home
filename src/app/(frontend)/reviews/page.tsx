"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { 
  Star, 
  Check, 
  X, 
  MessageSquare, 
  Filter, 
  AlertCircle,
  Undo
} from "lucide-react";
import { Review } from "@/data/mockTier2";

export default function ReviewsPage() {
  const { reviews, updateReviewStatus, respondToReview } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Compute stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === "Approved");
    const pending = reviews.filter(r => r.status === "Pending");
    const rejected = reviews.filter(r => r.status === "Rejected");
    
    const avgRating = approved.length > 0
      ? (approved.reduce((sum, r) => sum + r.rating, 0) / approved.length).toFixed(1)
      : "0.0";

    return { total, approved: approved.length, pending: pending.length, rejected: rejected.length, avgRating };
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (selectedStatus === "All") return reviews;
    return reviews.filter(r => r.status === selectedStatus);
  }, [reviews, selectedStatus]);

  const handleStatusChange = (id: string, status: Review['status']) => {
    updateReviewStatus(id, status);
    toast.success(`Review ${status.toLowerCase()} successfully.`);
  };

  const handleSendResponse = (id: string) => {
    const reply = replyTexts[id];
    if (!reply || !reply.trim()) {
      toast.error("Reply text cannot be empty.");
      return;
    }

    respondToReview(id, reply);
    toast.success("Response added successfully.");
    setActiveReplyId(null);
    setReplyTexts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div>
        <Breadcrumb />
        <h1 className="text-[20px] font-bold text-foreground">Reviews Center</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Manage property reviews, moderate customer feedback, and respond to clients</p>
      </div>

      {/* ── Stats Summary Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        
        {/* Stat 1: Avg Rating */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <h4 className="text-[12px] font-bold text-muted-foreground tracking-wide uppercase">Average Rating</h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[24px] font-bold text-foreground leading-none">{stats.avgRating}</span>
            <div className="flex items-center text-amber-500">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <p className="text-[11.5px] text-muted-foreground mt-2">Based on approved reviews</p>
        </div>

        {/* Stat 2: Total */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <h4 className="text-[12px] font-bold text-muted-foreground tracking-wide uppercase">Total Reviews</h4>
          <p className="text-[24px] font-bold text-foreground mt-2 leading-none">{stats.total}</p>
          <p className="text-[11.5px] text-muted-foreground mt-2">Submitted across listings</p>
        </div>

        {/* Stat 3: Approved */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] border-l-[3px] border-l-emerald-500">
          <h4 className="text-[12px] font-bold text-muted-foreground tracking-wide uppercase">Approved</h4>
          <p className="text-[24px] font-bold text-emerald-500 mt-2 leading-none">{stats.approved}</p>
          <p className="text-[11.5px] text-muted-foreground mt-2">Published to property pages</p>
        </div>

        {/* Stat 4: Pending */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] border-l-[3px] border-l-amber-500">
          <h4 className="text-[12px] font-bold text-muted-foreground tracking-wide uppercase">Pending</h4>
          <p className="text-[24px] font-bold text-amber-500 mt-2 leading-none">{stats.pending}</p>
          <p className="text-[11.5px] text-muted-foreground mt-2">Awaiting moderation splits</p>
        </div>

        {/* Stat 5: Rejected */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] border-l-[3px] border-l-red-500">
          <h4 className="text-[12px] font-bold text-muted-foreground tracking-wide uppercase">Rejected</h4>
          <p className="text-[24px] font-bold text-red-500 mt-2 leading-none">{stats.rejected}</p>
          <p className="text-[11.5px] text-muted-foreground mt-2">Hidden from public view</p>
        </div>

      </div>

      {/* ── Filter Toolbar ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] font-bold text-muted-foreground mr-2">Filter Reviews:</span>
          <div className="inline-flex rounded-md bg-muted/20 border border-border p-0.5">
            {["All", "Approved", "Pending", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-[4px] text-[12px] font-bold transition-all ${
                  selectedStatus === status
                    ? "bg-[#604ae3] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[12.5px] text-muted-foreground font-semibold">
          Showing {filteredReviews.length} reviews
        </p>
      </div>

      {/* ── Reviews Grid / List ─────────────────────────────────────── */}
      {filteredReviews.length === 0 ? (
        <div className="bg-card border border-border rounded-[8px] p-12 text-center shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <AlertCircle className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-[16px] font-bold text-foreground">No Reviews Found</h3>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-md mx-auto">
            There are no reviews matching your filter selection. New reviews from buyers appear here for review splits.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className={`bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.03)] space-y-4 transition-all hover:border-border/80 ${
                r.status === "Pending" ? "border-l-[4px] border-l-amber-500" :
                r.status === "Rejected" ? "border-l-[4px] border-l-red-500" :
                "border-l-[4px] border-l-emerald-500"
              }`}
            >
              {/* Top review header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <img
                    src={r.customerAvatar || "/assets/images/users/avatar-6.jpg"}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                    alt=""
                  />
                  <div>
                    <h4 className="text-[13.5px] font-bold text-foreground">{r.customerName}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Property:{" "}
                      <Link href={`/properties/${r.propertyId}`} className="text-primary hover:underline font-bold">
                        {r.propertyName}
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Star rating rendering */}
                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                    <span className="text-[12px] font-bold mr-1">{r.rating}</span>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < r.rating ? "fill-current" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11.5px] text-muted-foreground font-semibold">
                    {r.createdAt}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* Review Response / Reply display */}
              {r.response ? (
                <div className="bg-muted/30 border border-border p-3.5 rounded-[6px] text-[12.5px] relative mt-2.5">
                  <div className="flex items-center gap-1.5 text-primary font-bold mb-1">
                    <MessageSquare className="h-4 w-4" /> Agent Response:
                  </div>
                  <p className="text-muted-foreground italic font-medium leading-normal">
                    &ldquo;{r.response}&rdquo;
                  </p>
                </div>
              ) : null}

              {/* Action moderation buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {r.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(r.id, "Approved")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, "Rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1 shadow-sm transition-all"
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </>
                  )}
                  {r.status === "Approved" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "Rejected")}
                      className="border border-border text-muted-foreground hover:bg-muted text-[12px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1 transition-all"
                    >
                      <X className="h-4 w-4" /> Reject Review
                    </button>
                  )}
                  {r.status === "Rejected" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "Approved")}
                      className="border border-border text-muted-foreground hover:bg-muted text-[12px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1 transition-all"
                    >
                      <Undo className="h-4 w-4" /> Re-Approve
                    </button>
                  )}
                </div>

                {!r.response && r.status === "Approved" && (
                  <div className="w-full sm:w-auto text-right">
                    {activeReplyId === r.id ? (
                      <div className="flex gap-2 max-w-md ml-auto">
                        <input
                          type="text"
                          placeholder="Type response splits..."
                          value={replyTexts[r.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="flex-1 text-[12.5px] border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1 outline-none focus:border-primary transition-colors font-medium"
                        />
                        <button
                          onClick={() => handleSendResponse(r.id)}
                          className="bg-primary hover:bg-primary/95 text-white text-[12px] font-bold px-3 py-1 rounded-[5px] transition-colors shrink-0"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="bg-muted hover:bg-muted/80 text-foreground text-[12px] font-bold px-2 py-1 rounded-[5px] transition-colors border border-border"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReplyId(r.id)}
                        className="text-primary hover:text-primary-focus text-[12.5px] font-bold flex items-center gap-1 inline-flex hover:underline ml-auto"
                      >
                        <MessageSquare className="h-4 w-4" /> Write Response
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
