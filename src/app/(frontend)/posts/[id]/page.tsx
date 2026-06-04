"use client";

import { useState, useMemo, use } from "react";
import { mockPosts, mockCategories, mockPopularPosts, BlogPost, BlogComment } from "@/data/mockPosts";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailsPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  
  // Find active post
  const activePost = useMemo(() => {
    // If id is "post-1" or matches any post-id. If not found, default to first post
    return posts.find((p) => p.id === postId) || posts.find((p) => p.id === "post-1") || posts[0];
  }, [posts, postId]);

  const [comments, setComments] = useState<BlogComment[]>(activePost.comments);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: BlogComment = {
      id: `comm-${Date.now()}`,
      authorName: "Dominic Keller",
      authorAvatar: "/assets/images/users/avatar-1.jpg",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      text: commentText
    };

    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Blog Details</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Read detailed property guides, market reports, and design articles</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li>
            <Link href="/posts" className="hover:text-primary transition-colors">Blog Grid</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Blog Details</li>
        </ol>
      </div>

      {/* ── Main Layout: 2 Columns ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Post Details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[8px] p-5 sm:p-6 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <span className="bg-[#604ae3]/10 text-[#604ae3] text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {activePost.category}
              </span>
              <h2 className="text-[20px] sm:text-[24px] font-extrabold text-foreground leading-snug">
                {activePost.title}
              </h2>
              
              {/* Author and Date row */}
              <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-muted-foreground pt-1 border-y border-border py-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={activePost.authorAvatar}
                    alt={activePost.authorName}
                    className="h-7 w-7 rounded-full object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activePost.authorName}`;
                    }}
                  />
                  <span className="font-semibold text-foreground">{activePost.authorName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-calendar-line" />
                  <span>{activePost.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-time-line" />
                  <span>{activePost.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-eye-line" />
                  <span>{activePost.views} views</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative rounded-[6px] overflow-hidden bg-muted" style={{ height: "360px" }}>
              <img
                src={activePost.coverImage}
                alt="Post cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/villa-pool.png";
                }}
              />
            </div>

            {/* Content text paragraphs */}
            <div className="text-[14px] text-foreground/80 leading-relaxed space-y-4 font-sans whitespace-pre-wrap">
              {activePost.content}
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <span className="text-[12.5px] font-bold text-foreground mr-1">Tags:</span>
              {activePost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded bg-[#f4f6fb] dark:bg-slate-700 text-[11.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments section card */}
          <div className="bg-card border border-border rounded-[8px] p-5 sm:p-6 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-6">
            <h3 className="text-[16px] font-bold text-foreground border-b border-border pb-3">
              Post Comments ({comments.length})
            </h3>
            
            {/* List of comments */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-[13px] text-muted-foreground italic">No comments yet. Be the first to reply!</p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-3.5 items-start p-3.5 rounded-[6px] bg-muted/20 border border-border">
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="h-9 w-9 rounded-full object-cover shrink-0 mt-0.5 border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${comm.authorName}`;
                      }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-foreground">{comm.authorName}</span>
                        <span className="text-[10px] text-muted-foreground">{comm.date}</span>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-border space-y-3">
              <label htmlFor="commentText" className="block text-[12.5px] font-bold text-foreground">
                Leave a Comment
              </label>
              <textarea
                id="commentText"
                rows={4}
                required
                className="w-full bg-background border border-border rounded-[5px] p-3 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="Write your comment details here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-[#4d36cd] text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors"
                >
                  Submit Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Sidebar widgets */}
        <div className="space-y-6">
          
          {/* Widget 1: Search */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-3">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider">Search Articles</h4>
            <div className="relative">
              <input
                type="search"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    alert(`Searching database for: ${(e.target as HTMLInputElement).value}`);
                  }
                }}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>
          </div>

          {/* Widget 2: Categories */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-3">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider">Categories</h4>
            <ul className="divide-y divide-border text-[13px]">
              {mockCategories.map((cat) => (
                <li key={cat.name} className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{cat.name}</span>
                  <span className="bg-muted text-muted-foreground text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Widget 3: Popular Posts */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-3">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider">Popular Posts</h4>
            <div className="space-y-3.5">
              {mockPopularPosts.map((pop) => (
                <div key={pop.id} className="flex gap-2.5 items-start">
                  <div className="h-10 w-14 bg-muted rounded shrink-0 overflow-hidden">
                    <img src="/villa-pool.png" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/posts/${pop.id}`}
                      className="text-[12.5px] font-bold text-foreground hover:text-primary line-clamp-2 leading-tight"
                    >
                      {pop.title}
                    </Link>
                    <div className="flex gap-2 mt-1 text-[10.5px] text-muted-foreground">
                      <span>{pop.date}</span>
                      <span>{pop.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: About Widget */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-2">
            <h4 className="text-[13.5px] font-bold text-foreground uppercase tracking-wider">Text Widget</h4>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Our blog delivers valuable content designed to help you excel in real estate management, home staging, and architectural designs. Stay tuned for expert advice.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
