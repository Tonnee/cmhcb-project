export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string; // e.g. "2023-10-15T00:00:00Z"
  author: string;
  tags: string[];
  isFeatured?: boolean;
}

const sampleContent = `
  <p>Mental health is just as important as physical health, yet it often doesn't receive the same level of attention. In today's fast-paced world, stress and anxiety have become increasingly common, affecting people of all ages and backgrounds.</p>
  
  <h3>The Impact of Modern Life</h3>
  <p>Our modern lifestyle, characterized by constant connectivity and high performance expectations, can take a significant toll on our psychological well-being. The pressure to succeed, combined with the blur between work and personal life, often leads to burnout and chronic stress.</p>
  
  <h3>Strategies for Balance</h3>
  <p>To maintain mental well-being, it's essential to implement daily practices that foster resilience. This includes setting healthy boundaries, practicing mindfulness, and ensuring adequate rest. Regular physical activity and a balanced diet also play crucial roles in supporting brain health.</p>
  
  <h3>Seeking Professional Support</h3>
  <p>While self-care is vital, there are times when professional intervention is necessary. Therapy provides a safe space to explore emotions, identify negative thought patterns, and develop effective coping mechanisms. At CMHC,B, we are committed to providing compassionate care tailored to your individual needs.</p>
`;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-anxiety-in-modern-world",
    title: "Understanding Anxiety in the Modern World: Coping Strategies",
    excerpt: "An in-depth look at how modern lifestyles contribute to anxiety and evidence-based strategies to regain control and balance.",
    content: sampleContent,
    image: "/hero-image/psychotherapy-counseling-session.png",
    publishedAt: "2023-11-20T10:00:00Z",
    author: "Dr. Sarah Ahmed",
    tags: ["Anxiety", "Mental Health", "Coping"],
    isFeatured: true,
  },
  {
    id: "2",
    slug: "benefits-of-group-therapy",
    title: "The Transformative Power of Group Therapy",
    excerpt: "Discover why sharing your experiences in a supportive group environment can accelerate healing and build lasting resilience.",
    content: sampleContent,
    image: "/hero-image/group-therapy-support-circle.png",
    publishedAt: "2023-10-05T08:30:00Z",
    author: "Dr. Rahman Khan",
    tags: ["Group Therapy", "Support", "Community"],
  },
  {
    id: "3",
    slug: "navigating-family-dynamics",
    title: "Navigating Complex Family Dynamics",
    excerpt: "Learn how family therapy can help resolve long-standing conflicts and foster healthier communication patterns.",
    content: sampleContent,
    image: "/hero-image/family-therapy-psychologist-office.png",
    publishedAt: "2023-09-15T14:15:00Z",
    author: "Ayesha Hossain",
    tags: ["Family Therapy", "Relationships"],
  },
  {
    id: "4",
    slug: "importance-of-child-psychology",
    title: "Recognizing Early Signs: Child Psychology Explained",
    excerpt: "A guide for parents on how to recognize emotional distress in children and when to seek professional help.",
    content: sampleContent,
    image: "/compassionate-mental-health-professional.png",
    publishedAt: "2023-12-02T09:00:00Z",
    author: "Dr. Sarah Ahmed",
    tags: ["Child Therapy", "Parenting"],
  },
  {
    id: "5",
    slug: "workplace-stress-management",
    title: "Managing Workplace Stress and Preventing Burnout",
    excerpt: "Practical tips for maintaining work-life balance and protecting your mental health in high-pressure corporate environments.",
    content: sampleContent,
    image: "/hero-image/psychotherapy-counseling-session.png",
    publishedAt: "2024-01-10T11:45:00Z",
    author: "Tariq Hasan",
    tags: ["Burnout", "Workplace", "Stress"],
  },
];
