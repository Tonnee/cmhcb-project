export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string; // e.g. "2024-06-15T10:00:00Z"
  time: string; // e.g. "10:00 AM - 12:00 PM"
  location: string;
  author: string;
  tags: string[];
  isFeatured?: boolean;
  content?: string;
  gallery?: string[];
}

export const EVENTS_DATA: Event[] = [
  {
    id: "e1",
    slug: "understanding-anxiety-workshop",
    title: "Understanding Anxiety: Tools for Everyday Coping",
    description: "Join our interactive workshop to explore the roots of anxiety and learn practical coping strategies for daily life. Ideal for individuals, caregivers, and professionals seeking to better understand emotional regulation and stress.",
    image: "/understanding-anxiety-workshop-event.png",
    date: "2026-06-20T10:00:00Z",
    time: "10:00 AM - 12:00 PM",
    location: "Online via Zoom",
    author: "Ruma Khondaker",
    tags: ["Workshop", "Anxiety", "Mental Health"],
    isFeatured: true,
    content: "<p>This upcoming workshop will delve into the complexities of anxiety in the modern world. Participants will learn how to identify triggers, implement immediate calming techniques, and build long-term resilience through cognitive-behavioral tools.</p><h3>Key Learning Outcomes</h3><ul><li>Understanding the physiological basis of anxiety</li><li>Practical breathing and grounding exercises</li><li>Identifying negative thought patterns</li><li>Developing a personalized self-care toolkit</li></ul><p>Our expert facilitators will guide you through a series of interactive exercises designed to normalize the experience of anxiety and provide you with a roadmap for emotional well-being. Whether you are dealing with mild stress or more persistent anxious thoughts, this workshop offers a safe space to learn and grow.</p>",
  },
  {
    id: "e2",
    slug: "mindfulness-meditation-retreat",
    title: "Weekend Mindfulness & Meditation Retreat",
    description: "A transformative weekend dedicated to mindfulness practices, deep meditation, and emotional rejuvenation in a serene natural setting.",
    image: "/mental-health-training-program.png",
    date: "2024-07-15T09:00:00Z",
    time: "9:00 AM - 5:00 PM",
    location: "Green Valley Resort, Gazipur",
    author: "Dr. Nadia",
    tags: ["Retreat", "Mindfulness", "Well-being"],
    content: "<p>The Weekend Mindfulness & Meditation Retreat was a resounding success, bringing together individuals from all walks of life for a journey of inner peace. Set against the backdrop of the lush Green Valley, the retreat offered a perfect escape from the hustle and bustle of daily life.</p><p>Led by Dr. Nadia, the sessions focused on advanced meditation techniques, mindful movement, and silent reflection. Participants reported significant improvements in their stress levels and overall outlook on life by the end of the weekend.</p><h3>Retreat Highlights</h3><ul><li>Daily sunrise meditation sessions by the lake</li><li>Interactive workshops on mindful eating and communication</li><li>Guided nature walks and forest bathing</li><li>Evening support circles and reflection sessions</li></ul><p>We are grateful to all our participants for their openness and dedication to their personal growth. The energy created during this weekend will undoubtedly continue to ripple through their lives for months to come.</p>",
    gallery: [
      "/hero-image/psychotherapy-counseling-session.png",
      "/hero-image/family-therapy-psychologist-office.png",
      "/hero-image/group-therapy-support-circle.png",
      "/compassionate-mental-health-professional.png",
    ]
  },
  {
    id: "e3",
    slug: "parenting-in-digital-age",
    title: "Parenting in the Digital Age: Emotional Support",
    description: "Expert insights on navigating the challenges of raising children in a tech-driven world while maintaining strong emotional bonds.",
    image: "/compassionate-mental-health-professional.png",
    date: "2024-08-05T15:00:00Z",
    time: "3:00 PM - 5:00 PM",
    location: "CMHCB Seminar Hall, Dhaka",
    author: "Dr. Hasan",
    tags: ["Parenting", "Child Health", "Tech"],
    content: "<p>Our seminar on 'Parenting in the Digital Age' addressed one of the most pressing concerns for modern families: how to balance technology use with genuine emotional connection. Dr. Hasan provided a comprehensive framework for parents to understand the digital landscape their children inhabit.</p><p>The seminar covered topics ranging from screen time management and cyberbullying prevention to fostering open communication and digital literacy. The Q&A session was particularly vibrant, with parents sharing their personal struggles and success stories.</p><h3>Core Strategies Discussed</h3><ul><li>Establishing clear and collaborative digital boundaries</li><li>The importance of 'tech-free' family zones and times</li><li>Modeling healthy digital habits for children</li><li>Recognizing signs of digital fatigue and social media anxiety</li></ul>",
    gallery: [
      "/hero-image/group-therapy-support-circle.png",
      "/hero-image/family-therapy-psychologist-office.png",
      "/compassionate-mental-health-professional.png",
      "/cmhcb-mental-health-care-bw.png",
    ]
  },
  {
    id: "e4",
    slug: "workplace-wellness-seminar",
    title: "Workplace Wellness & Burnout Prevention",
    description: "A seminar designed for corporate professionals to identify early signs of burnout and implement effective wellness strategies.",
    image: "/hero-image/psychotherapy-counseling-session.png",
    date: "2024-09-10T11:00:00Z",
    time: "11:00 AM - 1:00 PM",
    location: "Lakeshore Hotel, Gulshan",
    author: "Dr. Rahman",
    tags: ["Corporate", "Wellness", "Burnout"],
    content: "<p>The 'Workplace Wellness & Burnout Prevention' seminar saw an impressive turnout of professionals from various sectors, all eager to improve their mental resilience in the workplace. Dr. Rahman led the session with data-driven insights and practical exercises.</p><p>The discussion centered on identifying the subtle signs of burnout before they become debilitating and implementing sustainable daily habits for long-term health. Corporate leaders also learned how to foster a culture of support and psychological safety within their teams.</p><h3>Key Takeaways</h3><ul><li>Identifying the three stages of burnout</li><li>Techniques for desk-based stress relief and micro-breaks</li><li>The role of sleep and nutrition in workplace performance</li><li>Building a supportive workplace culture</li></ul>",
    gallery: [
      "/hero-image/psychotherapy-counseling-session.png",
      "/hero-image/group-therapy-support-circle.png",
      "/mental-health-training-program.png",
      "/understanding-anxiety-workshop-event.png",
    ]
  },
  {
    id: "e5",
    slug: "art-therapy-for-emotional-healing",
    title: "Art Therapy for Emotional Healing",
    description: "Discover the therapeutic benefits of creative expression. No prior art experience necessary.",
    image: "/mental-health-training-program.png",
    date: "2024-10-12T14:00:00Z",
    time: "2:00 PM - 4:00 PM",
    location: "CMHCB Creative Studio",
    author: "Sara Ahmed",
    tags: ["Art Therapy", "Creative", "Healing"],
  },
  {
    id: "e6",
    slug: "couples-communication-workshop",
    title: "Couples Communication & Connection Workshop",
    description: "Learn evidence-based strategies to improve communication, resolve conflicts peacefully, and deepen emotional intimacy with your partner.",
    image: "/cmhcb-mental-health-care-bw.png",
    date: "2024-11-05T10:00:00Z",
    time: "10:00 AM - 1:00 PM",
    location: "Online via Zoom",
    author: "Dr. Nadia",
    tags: ["Couples", "Relationships", "Workshop"],
  },
  {
    id: "e7",
    slug: "teen-mental-health-seminar",
    title: "Navigating Teen Mental Health",
    description: "A seminar dedicated to helping parents and educators understand and support adolescent mental health challenges.",
    image: "/hero-image/family-therapy-psychologist-office.png",
    date: "2024-11-20T16:00:00Z",
    time: "4:00 PM - 6:00 PM",
    location: "CMHCB Main Auditorium",
    author: "Dr. Hasan",
    tags: ["Teens", "Parenting", "Education"],
  },
  {
    id: "e8",
    slug: "managing-seasonal-affective-disorder",
    title: "Managing Seasonal Affective Disorder (SAD)",
    description: "An informative session on understanding SAD and implementing effective strategies to maintain mood during the winter months.",
    image: "/understanding-anxiety-workshop-event.png",
    date: "2024-12-01T18:00:00Z",
    time: "6:00 PM - 7:30 PM",
    location: "Online via Zoom",
    author: "Dr. Rahman",
    tags: ["SAD", "Depression", "Wellness"],
  },
  {
    id: "e9",
    slug: "new-year-mindset-reset",
    title: "New Year Mindset Reset & Goal Setting",
    description: "Start the year with a clear mind and achievable goals. We will focus on values-based goal setting and mental resilience.",
    image: "/cmhcb-mental-health-care.png",
    date: "2025-01-10T10:00:00Z",
    time: "10:00 AM - 12:00 PM",
    location: "CMHCB Seminar Hall",
    author: "Ruma Khondaker",
    tags: ["New Year", "Mindset", "Workshop"],
  },
];
