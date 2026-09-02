"use client";
import Image from "next/image";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiPencil, HiTrash, HiNewspaper, HiBars3 } from "react-icons/hi2";
import EditBlogForm from "./edit-blog-form";
import { deleteBlogPostAction, reorderBlogPostsAction } from "@/app/(admin)/admin/actions";

interface BlogPostDB {
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
  order?: number;
}

interface BlogsClientWrapperProps {
  initialPosts: BlogPostDB[];
}

export default function BlogsClientWrapper({
  initialPosts,
}: BlogsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [posts, setPosts] = React.useState<BlogPostDB[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPostDB | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  // Drag & Reorder state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isReordering, setIsReordering] = React.useState(false);

  React.useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Drag and Drop handlers for reordering blog posts
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null || draggedIndex === index) return;

    const newPosts = [...posts];
    const [draggedItem] = newPosts.splice(draggedIndex, 1);
    newPosts.splice(index, 0, draggedItem);
    setPosts(newPosts);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    setIsReordering(true);
    try {
      const orderedIds = posts.map((p) => p.id);
      const res = await reorderBlogPostsAction(orderedIds);
      if (!res.success) {
        alert(res.error || "Failed to save new blog post order.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Error saving blog post order:", err);
    } finally {
      setIsReordering(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPostDB) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post permanently?")) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteBlogPostAction(id, slug);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to delete blog post.");
      }
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    router.refresh();
  };

  const featuredPost = posts.find((p) => p.isFeatured);

  return (
    <div className="flex flex-col gap-8">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-marcellus text-3xl font-bold text-dark-green">
              Manage Blog Posts
            </h1>
            {featuredPost && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary-dark border border-primary/20">
                Featured: {featuredPost.title.slice(0, 24)}{featuredPost.title.length > 24 ? "…" : ""}
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-light-ash">
            Write wellness insights, manage drafts, delete outdated articles, and feature relevant posts. Drag rows to reorder — the featured post shows first on the blog page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 self-start sm:self-auto cursor-pointer"
        >
          <HiPlus className="w-5 h-5" />
          Write Post
        </button>
      </div>

      {/* Reordering indicator */}
      {isReordering && (
        <div className="text-xs text-primary font-medium animate-pulse px-1">
          Saving new order…
        </div>
      )}

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-4 py-4 font-semibold text-dark text-center w-16">Order</th>
                <th className="px-6 py-4 font-semibold text-dark">Article</th>
                <th className="px-6 py-4 font-semibold text-dark">Author</th>
                <th className="px-6 py-4 font-semibold text-dark">Date Published</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {posts.map((post, index) => (
                <tr
                  key={post.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-150 ${
                    draggedIndex === index
                      ? "bg-primary/10 opacity-70 border-2 border-dashed border-primary cursor-grabbing"
                      : "hover:bg-light/10 cursor-grab"
                  }`}
                >
                  {/* Order Serial & Drag Handle */}
                  <td className="px-4 py-4 text-center shrink-0">
                    <div className="flex items-center justify-center gap-1.5 text-light-ash">
                      <HiBars3
                        className="w-4 h-4 text-light-ash/50 hover:text-primary shrink-0 cursor-grab active:cursor-grabbing"
                        title="Drag up or down to reorder blog post serial"
                      />
                      <span className="font-semibold text-dark-green text-sm shrink-0 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-dark-green max-w-xs truncate">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary/10 shrink-0 relative flex items-center justify-center text-primary-dark">
                        {post.image ? (
                          <Image src={post.image} alt={post.title} width={48} height={48} unoptimized className="w-12 h-12 object-cover rounded-xl" />
                        ) : (
                          <HiNewspaper className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-dark truncate">{post.title}</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] text-light-ash">/{post.slug}</span>
                          {post.isFeatured && (
                            <span className="bg-primary/10 text-primary-dark text-[9px] font-semibold px-1.5 py-0.5 rounded">
                              Blog Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-light-ash">{post.author}</td>
                  <td className="px-6 py-4 text-light-ash text-xs">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(post)}
                        className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id, post.slug)}
                        className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Post"
                        disabled={isDeleting === post.id}
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-light-ash font-sans">
                    No articles written yet. Click &ldquo;Write Post&rdquo; to compose your first article.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-muted relative animate-in fade-in zoom-in duration-200">
            <EditBlogForm
              post={editingPost}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}