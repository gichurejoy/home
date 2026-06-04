"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogCreatePage() {
  const router = useRouter();
  
  // Form state fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Home Staging");
  const [description, setDescription] = useState("");
  
  const [authorName, setAuthorName] = useState("Dominic Keller");
  const [createDate, setCreateDate] = useState(new Date().toISOString().split("T")[0]);
  const [authorDesc, setAuthorDesc] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the post title and content description!");
      return;
    }

    alert(`Blog post created successfully!\n\nTitle: ${title}\nCategory: ${category}\nAuthor: ${authorName}\nDate: ${createDate}`);
    router.push("/posts");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Blog Create</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Publish a new article, staging guide, or market research note</p>
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
          <li className="text-primary font-medium">Create Post</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Side: Photo Upload and Blog Content */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* 1. Drag & Drop Image Uploader */}
            <div className="bg-card border border-border rounded-[8px] p-5 sm:p-6 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4">
              <h4 className="text-[14.5px] font-bold text-foreground">Add Blog Cover Photo</h4>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[6px] p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  id="cover-photo"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="cover-photo" className="cursor-pointer flex flex-col items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                    <i className="ri-upload-cloud-2-line text-[24px]" />
                  </div>
                  <h5 className="text-[13.5px] font-bold text-foreground">
                    Drop your images here, or <span className="text-primary">click to browse</span>
                  </h5>
                  <p className="text-[11.5px] text-muted-foreground mt-1">
                    Supports PNG, JPG, or JPEG formats. Max file size: 5MB.
                  </p>
                </label>
              </div>

              {/* Uploaded Files Mock Preview */}
              {files.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider block">Selected Files</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded border border-border bg-muted/30 flex items-center justify-between text-[12.5px]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate mb-0.5">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="h-7 w-7 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center transition-all"
                        >
                          <i className="ri-delete-bin-line text-[14px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Blog Main Information Card */}
            <div className="bg-card border border-border rounded-[8px] p-5 sm:p-6 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4">
              <h4 className="text-[14.5px] font-bold text-foreground border-b border-border pb-3">Blog Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="blog-title" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    BLOG TITLE
                  </label>
                  <input
                    type="text"
                    id="blog-title"
                    required
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Enter blog article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="blog-category" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    CATEGORY
                  </label>
                  <select
                    id="blog-category"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Home Staging">Home Staging</option>
                    <option value="Real Estate Market">Real Estate Market</option>
                    <option value="Home Improvement">Home Improvement</option>
                    <option value="Architecture Trends">Architecture Trends</option>
                    <option value="Agent Guides">Agent Guides</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="blog-detail" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    DESCRIPTION (ARTICLE CONTENT)
                  </label>
                  <textarea
                    id="blog-detail"
                    required
                    rows={8}
                    className="w-full bg-background border border-border rounded-[5px] p-3.5 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground leading-relaxed"
                    placeholder="Write your blog post content detail here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Author Info & Submit */}
          <div className="space-y-6">
            
            {/* 3. Blog User Information */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4">
              <h4 className="text-[14.5px] font-bold text-foreground border-b border-border pb-3">Blog User Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="blog-user-name" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    AUTHOR NAME
                  </label>
                  <input
                    type="text"
                    id="blog-user-name"
                    required
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="create-date" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    PUBLISH DATE
                  </label>
                  <input
                    type="date"
                    id="create-date"
                    required
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-primary text-foreground"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="user-detail" className="block text-[12px] font-bold text-muted-foreground mb-1.5">
                    AUTHOR PROFILE DESCRIPTION
                  </label>
                  <textarea
                    id="user-detail"
                    rows={4}
                    className="w-full bg-background border border-border rounded-[5px] p-3 text-[13px] focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
                    placeholder="Short description about the author..."
                    value={authorDesc}
                    onChange={(e) => setAuthorDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Discard all draft details?")) {
                    router.push("/posts");
                  }
                }}
                className="w-1/2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[13px] font-bold py-2 rounded-[5px] transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                className="w-1/2 bg-primary hover:bg-[#4d36cd] text-white text-[13px] font-bold py-2 rounded-[5px] transition-colors shadow-sm"
              >
                Publish Post
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
