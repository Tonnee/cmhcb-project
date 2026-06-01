import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/features/blog/data/blogs";
import { Tag } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/link-button";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className = "" }: BlogCardProps): React.JSX.Element {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 ${className}`}
    >
      <div className="relative w-full h-[240px] overflow-hidden shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="font-marcellus text-xl text-dark mb-3 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-sans text-xs text-light-ash font-medium">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <LinkButton variant="accent">Read More</LinkButton>
        </div>
      </div>
    </Link>
  );
}
