import * as React from "react";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/layout/container";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { TherapistCard } from "@/components/shared/therapist-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { BlogCard } from "@/features/blog/components/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Shared icon components to match blog/page.tsx
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

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find the matched author from therapists data
  const matchedAuthor = THERAPISTS_DATA.find(t => 
    post.author.toLowerCase().includes(t.name.toLowerCase()) || 
    t.name.toLowerCase().includes(post.author.toLowerCase())
  ) || THERAPISTS_DATA[0];

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
        currentPage={post.title}
        title={post.title}
        description={post.excerpt}
        ctaLabel="" // Remove CTA as requested (or just empty)
        className="bg-dark-green"
      >
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 font-sans text-base">
             <div className="flex items-center gap-2">
               <UserIcon className="w-5 h-5 shrink-0 text-accent" />
               <Link 
                 href={`/therapists/${matchedAuthor.id}`}
                 className="font-medium hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30"
               >
                 By {post.author}
               </Link>
             </div>
             <div className="flex items-center gap-2">
               <CalendarIcon className="w-5 h-5 shrink-0 text-accent" />
               <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-xs font-medium tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      <Container className="py-20">
        <article 
          className="font-sans text-dark text-lg leading-relaxed [&>p]:mb-8 [&>h3]:font-marcellus [&>h3]:text-3xl [&>h3]:text-dark [&>h3]:mb-6 [&>h3]:mt-12 [&>h3]:leading-tight"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Container>

      {/* Meet Author Section - 1 column layout similar to ServiceProfessionals */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-6 items-center">
            {/* Left side info */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <h2 className="font-marcellus text-[32px] lg:text-[40px] text-dark leading-tight">
                  Meet the <span className="text-primary">Author</span>
                </h2>
                <p className="font-sans text-xl leading-relaxed text-dark max-w-xl">
                  {matchedAuthor.bio}
                </p>
              </div>
              <Button 
                href={`/therapists/${matchedAuthor.id}`} 
                variant="primary"
                className="self-start"
              >
                View Therapist Profile
              </Button>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[320px]">
                <TherapistCard therapist={matchedAuthor} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Read More Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <Container>
          <SectionHeading 
            subtitle="Related Content"
            title={<>Read More <span className="text-primary-dark">Articles</span></>}
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
