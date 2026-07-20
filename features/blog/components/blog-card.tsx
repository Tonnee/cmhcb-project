import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiCalendarDays, HiUser } from "react-icons/hi2";
import { BlogPost } from "@/features/blog/data/blogs";
import { Tag } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/link-button";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className = "" }: BlogCardProps): React.JSX.Element {
  return (
    <div
      className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 ${className}`}
    >
      {/* Absolute click target for the entire card to navigate to the blog post */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-0"
        aria-label={post.title}
      />

      <div className="relative w-full h-60 overflow-hidden shrink-0 pointer-events-none">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="font-marcellus text-xl text-primary-dark mb-3 leading-snug group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 gap-4">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 text-xs text-light-ash">
              <HiCalendarDays className="w-4 h-4 text-accent shrink-0" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-light-ash">
              <HiUser className="w-4 h-4 text-accent shrink-0" />
              <Link
                href={`/therapists/${post.author.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`}
                className="text-primary hover:underline font-medium relative z-20"
              >
                {post.author}
              </Link>
            </div>
          </div>

          <div className="pointer-events-auto">
            <LinkButton href={`/blog/${post.slug}`} variant="accent" className="relative z-20">
              Read More
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
