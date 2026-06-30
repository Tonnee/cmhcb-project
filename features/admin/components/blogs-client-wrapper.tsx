"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiPencil, HiTrash, HiNewspaper } from "react-icons/hi2";
import EditBlogForm from "./edit-blog-form";
import { deleteBlogPostAction } from "@/app/(admin)/admin/actions";

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
}

interface BlogsClientWrapperProps {
  initialPosts: BlogPostDB[];
}

export default function BlogsClientWrapper({
  initialPosts,
}: BlogsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPostDB | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

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
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-marcellus text-3xl font-bold text-dark-green">
            Manage Blog Posts
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Write wellness insights, manage drafts, delete outdated articles, and feature relevant posts.
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

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-6 py-4 font-semibold text-dark">Article</th>
                <th className="px-6 py-4 font-semibold text-dark">Author</th>
                <th className="px-6 py-4 font-semibold text-dark">Date Published</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {initialPosts.map((post) => (
                <tr key={post.id} className="hover:bg-light/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark-green max-w-xs truncate">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary/10 shrink-0 relative flex items-center justify-center text-primary-dark">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HiNewspaper className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-dark truncate">{post.title}</span>
                        <span className="text-[10px] text-light-ash">/{post.slug}</span>
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

              {initialPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-light-ash font-sans">
                    No articles written yet. Click "Write Post" to compose your first article.
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
