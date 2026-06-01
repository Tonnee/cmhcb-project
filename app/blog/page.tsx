import * as React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { BlogList } from "@/features/blog/components/blog-list";
import { Button } from "@/components/ui/button";
import { RightArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/shared/section-heading";
import { Tag } from "@/components/ui/tag";

// Simple icon components for the meta details
function CalendarIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Mental Health Blog & Resources | CMHC,B",
  description: "Explore our latest articles, insights, and resources on mental health, therapy, and well-being.",
};

export default function BlogPage(): React.JSX.Element {
  // Assuming the first featured post or the first post in the array is the featured one
  const featuredPost = BLOG_POSTS.find(post => post.isFeatured) || BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.filter(post => post.id !== featuredPost.id);

  return (
    <main className="pt-12 pb-24">
      {/* Featured Blog Section */}
      <section className="mb-40">
        <Container>
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
            ]}
          />
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-[86px]">
            {/* Left side - Featured Image */}
            <div className="shrink-0 w-full lg:w-[474px]">
              <div className="relative w-full h-[350px] lg:h-full min-h-[350px] lg:min-h-[400px] rounded-[24px] overflow-hidden bg-gray-100 group">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 474px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                  {featuredPost.tags.map(tag => (
                    <Tag key={tag} variant="glass-light">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Featured Content */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-sans font-medium text-base text-accent mb-6 uppercase tracking-wider">
                Featured Blog
              </p>

              <h1 className="font-marcellus text-[40px] leading-tight text-dark mb-6 max-w-[500px]">
                {featuredPost.title}
              </h1>

              <p className="font-sans text-base text-light-ash mb-12 max-w-xl leading-relaxed">
                {featuredPost.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-col gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-marcellus text-lg text-dark leading-tight">
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-sans text-sm text-light-ash">Date of Publish</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-marcellus text-lg text-dark leading-tight">
                      <Link 
                        href={`/therapists/${featuredPost.author.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`}
                        className="hover:text-primary transition-colors"
                      >
                        {featuredPost.author}
                      </Link>
                    </span>
                    <span className="font-sans text-sm text-light-ash">Author</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <Button href={`/blog/${featuredPost.slug}`} variant="primary" className="group">
                  <span className="flex items-center gap-2">
                    Read More
                    <span className="transition-transform group-hover:translate-x-1">
                      <RightArrowIcon className="w-4 h-4" />
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* All Blogs List Section */}
      <section>
        <Container>
                  <SectionHeading
          subtitle="All Blogs"            
            title={<>Latest <span className="text-primary-dark">Articles</span> & Insights</>}
            className="mt-20 mb-10"
          />
          
          <BlogList posts={remainingPosts} />
        </Container>
      </section>
    </main>
  );
}
