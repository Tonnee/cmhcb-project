"use client";

import * as React from "react";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertBlogPostAction } from "@/app/(admin)/admin/actions";
import { HiXMark } from "react-icons/hi2";
import { safeJsonParse } from "@/lib/json";
import { z } from "zod";

interface BlogFormProps {
  post?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    publishedAt: string;
    author: string;
    tags: string; // JSON string
    isFeatured: boolean;
    lastUpdatedBy?: string | null;
    updatedAt?: string | Date;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().min(1, "Image URL is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.array(z.string()).default([]),
});

export default function EditBlogForm({
  post,
  onClose,
  onSuccess,
}: BlogFormProps): React.JSX.Element {
  // Input states
  const [title, setTitle] = React.useState(post?.title || "");
  const [slug, setSlug] = React.useState(post?.slug || "");
  const [excerpt, setExcerpt] = React.useState(post?.excerpt || "");
  const [content, setContent] = React.useState(post?.content || "");
  const [imageUrl, setImageUrl] = React.useState(post?.image || "");
  const [author, setAuthor] = React.useState(post?.author || "");
  const [tagsString, setTagsString] = React.useState<string>(() => {
    if (!post) return "Wellness, Mental Health";
    const parsed = safeJsonParse<any[]>(post.tags, []);
    return Array.isArray(parsed) ? parsed.join(", ") : "";
  });
  const [isFeatured, setIsFeatured] = React.useState(post?.isFeatured || false);

  // Status states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Handle Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading) return;

    setIsSaving(true);
    setErrorMsg("");

    try {
      // Split tags by comma
      const tags = tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        id: post?.id,
        slug: slug.trim() || undefined,
        title,
        excerpt,
        content,
        image: imageUrl,
        author,
        tags,
        isFeatured,
        publishedAt: post?.publishedAt, // preserve initial date if editing
      };

      // Zod validation on client
      const validation = blogPostSchema.safeParse(payload);
      if (!validation.success) {
        setErrorMsg(validation.error.issues.map((issue) => issue.message).join(", "));
        setIsSaving(false);
        return;
      }

      const result = await upsertBlogPostAction(payload);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.error || "Failed to save blog post details.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2 font-sans">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            {post ? "Edit Blog Post" : "Compose Blog Post"}
          </h2>
          {post?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{post.lastUpdatedBy}</span> on {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
        >
          <HiXMark className="w-5 h-5" />
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans text-sm">
        {/* Core Text fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navigating Stress in the Modern World"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">URL Slug (Optional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. navigating-stress-modern-world (auto if empty)"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Short Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary description displayed on the blog list..."
            className="w-full h-16 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Nazme Ara"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="Anxiety, Coping, Wellness"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Image File upload */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-primary shrink-0"
            />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark">Featured Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash"
              disabled={isUploading}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading image to Supabase...</span>}
        </div>

        {/* Featured Toggle */}
        <label className="flex items-center gap-2 cursor-pointer w-fit text-light-ash">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-muted text-primary focus:ring-primary w-4 h-4"
          />
          <span className="font-semibold text-dark">Feature this post on the main blog page header</span>
        </label>

        {/* Content text area */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Blog Article Body (HTML format supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write HTML paragraphs, headers, and bullet points detailing the article body..."
            className="w-full h-44 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary font-mono text-xs"
            required
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-muted pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
            disabled={isSaving || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
