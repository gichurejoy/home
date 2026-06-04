"use client";

import { useState, useMemo } from "react";
import { mockPosts, BlogPost } from "@/data/mockPosts";
import Link from "next/link";

export default function BlogGridPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get list of unique categories
  const categories = useMemo(() => {
    const list = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [posts]);

  // Search & Filter
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this blog post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Blog Grid</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Fresh articles, real estate news, and staging advice</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Blog Grid</li>
        </ol>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="Search articles or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>

            {/* Category Quick Filter */}
            <div className="flex flex-wrap items-center gap-1 shrink-0">
              <span className="text-[13px] text-muted-foreground font-semibold mr-1">Category:</span>
              <div className="inline-flex flex-wrap rounded-[5px] bg-background border border-border p-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-[4px] text-[11.5px] font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#604ae3] text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href="/posts/create"
              className="bg-[#0acf97] text-white text-[13px] font-bold px-3.5 py-2 rounded-[5px] flex items-center gap-1 hover:bg-[#09b986] transition-all shadow-sm"
            >
              <i className="ri-add-line text-[15px]" /> Create Post
            </Link>
          </div>
        </div>
      </div>

      {/* ── Blog Grid Layout ───────────────────────────────────────── */}
      {filteredPosts.length === 0 ? (
        <div className="bg-card border border-border rounded-[8px] p-12 text-center text-muted-foreground shadow-sm">
          No articles found matching the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.08)] flex flex-col group hover:shadow-[0_0_35px_rgba(154,161,171,0.15)] transition-all"
            >
              {/* Cover Image */}
              <div className="relative h-[200px] overflow-hidden shrink-0 bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/villa-pool.png";
                  }}
                />
                {/* Category tag Overlay */}
                <span className="absolute top-3 left-3 bg-[#604ae3] text-white text-[10.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {post.category}
                </span>

                {/* Actions overlay */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/posts/create?edit=${post.id}`}
                    className="h-7 w-7 rounded-[4px] bg-white dark:bg-card text-primary dark:text-foreground hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white flex items-center justify-center shadow transition-all"
                    title="Edit Post"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="ri-edit-line text-[13px]" />
                  </Link>
                  <button
                    onClick={(e) => handleDeletePost(post.id, e)}
                    className="h-7 w-7 rounded-[4px] bg-white dark:bg-card text-danger dark:text-foreground hover:bg-danger hover:text-white dark:hover:bg-danger dark:hover:text-white flex items-center justify-center shadow transition-all"
                    title="Delete Post"
                  >
                    <i className="ri-delete-bin-line text-[13px]" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Link href={`/posts/${post.id}`} className="block">
                    <h3 className="text-[16px] font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Footer */}
                <div className="pt-4 border-t border-border mt-5 flex items-center justify-between text-[12px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="h-6 w-6 rounded-full object-cover border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`;
                      }}
                    />
                    <span className="font-medium text-foreground">{post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{post.date}</span>
                    <span className="inline-block h-1 w-1 bg-muted-foreground/30 rounded-full" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
