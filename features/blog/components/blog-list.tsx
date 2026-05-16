"use client";

import * as React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Image from "next/image";
import { BlogPost } from "@/features/blog/data/blogs";
import { BlogCard } from "@/features/blog/components/blog-card";
import { Select } from "@/components/ui/select";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");

  // Filter and sort the posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let result = [...posts];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-10">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm transition-shadow"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiMagnifyingGlass className="w-5 h-5" />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="sort-order" className="font-sans text-sm text-dark font-medium whitespace-nowrap">
            Sort by:
          </label>
          <Select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
        </div>
      </div>

      {/* Grid Section */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="font-marcellus text-2xl text-dark mb-2">No articles found</p>
          <p className="font-sans text-light-ash">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
