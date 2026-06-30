import { PrismaClient } from "@prisma/client";
import { THERAPISTS_DATA } from "../features/therapists/data/therapists";
import { EVENTS_DATA } from "../features/events/data/events";
import { BLOG_POSTS } from "../features/blog/data/blogs";
import { TESTIMONIALS } from "../data/testimonials";

const prisma = new PrismaClient();

const SERVICES_SEED_DATA = [
  {
    title: "Psychometric Assessment",
    slug: "psychometric-assessment",
    icon: "HiClipboardDocumentCheck",
    shortDescription: "understand personality, emotional functioning, and mental health needs",
    longDescription: "A psychometric assessment is a structured, standardized evaluation that measures cognitive ability, personality traits, emotional functioning, and behavioural patterns. At CMHCB, our assessments are conducted by qualified mental health professionals using internationally validated instruments, providing an objective picture of your psychological profile to guide effective intervention.",
    approach: "Internationally validated psychometric instruments\nAdministered by trained and certified psychologists\nConfidential scoring and professional interpretation\nWritten report with clear findings and recommendations\nDebrief session to discuss results and next steps",
    isFeatured: true,
  },
  {
    title: "Individual Therapy",
    slug: "individual-therapy",
    icon: "HiUser",
    shortDescription: "one-on-one therapy sessions providing a safe, confidential space",
    longDescription: "Individual therapy is a collaborative process where a therapist works closely with an individual to understand thoughts, emotions, and behaviors, helping them manage difficulties and improve overall psychological well-being. Our one-on-one therapy sessions provide a safe, confidential space where you can explore your thoughts and feelings, build resilience, and develop personalized strategies.",
    approach: "Evidence-based methods\nClient-centered care\nEthical & confidential practice\nCulturally sensitive support",
    isFeatured: true,
  },
  {
    title: "Child Therapy",
    slug: "child-therapy",
    icon: "HiFaceSmile",
    shortDescription: "Specialized, child-centered therapeutic techniques help children navigate emotional challenges",
    longDescription: "Child therapy at CMHCB is a developmentally sensitive approach to supporting children's emotional health and psychological well-being. Our therapists work with children aged 4–17, using age-appropriate techniques such as play therapy and CBT for children, to help them express and process emotional difficulties in a safe, nurturing environment.",
    approach: "Play, art, and narrative therapy techniques\nStrength-based, culturally sensitive interventions\nRegular parent consultations to reinforce progress\nCollaboration with schools and educators when needed\nWarm, child-friendly therapeutic environment",
    isFeatured: true,
  },
  {
    title: "Family Therapy",
    slug: "family-therapy",
    icon: "HiUsers",
    shortDescription: "We help families strengthen communication, resolve conflicts, and understand relationship dynamics",
    longDescription: "Family therapy is a form of psychotherapy that works with families as a whole to nurture change and development. At CMHCB, our therapists help family members improve communication, understand each other's perspectives, and resolve conflicts that may be creating tension or disconnection within the household.",
    approach: "Systemic and structural family therapy frameworks\nGuided communication and active listening exercises\nFlexible formats — full family or sub-group sessions\nBetween-session tasks to reinforce new skills at home\nConfidential and culturally informed practice",
    isFeatured: false,
  },
  {
    title: "Couple Therapy",
    slug: "couple-therapy",
    icon: "HiHeart",
    shortDescription: "Whether navigating conflict or deepening connection, our couple therapy sessions provide structure",
    longDescription: "Couple therapy at CMHCB is a professionally guided process that helps partners understand and resolve interpersonal difficulties. Using evidence-based methods such as the Gottman Method and Emotionally Focused Therapy (EFT), our therapists support couples in breaking negative cycles, rebuilding trust, and cultivating a secure, fulfilling relationship.",
    approach: "Gottman Method and Emotionally Focused Therapy (EFT)\nStructured de-escalation and communication tools\nBoth joint and individual sessions when needed\nRegular review of relationship goals and satisfaction\nConfidential, non-judgmental, and respectful practice",
    isFeatured: false,
  },
  {
    title: "IQ Test",
    slug: "iq-test",
    icon: "HiAcademicCap",
    shortDescription: "standardized intelligence assessments measure cognitive abilities across key domains",
    longDescription: "An IQ and cognitive assessment is a comprehensive evaluation of intellectual functioning — measuring abilities such as reasoning, problem-solving, verbal comprehension, processing speed, and working memory. At CMHCB, we use internationally standardized instruments to produce a detailed, professionally interpreted report for individuals, parents, educators, and clinicians.",
    approach: "Internationally validated IQ and cognitive instruments\nAdministered by trained and certified psychologists\nFull-scale IQ score with detailed subscale breakdowns\nWritten report with professional interpretation\nDebrief session to discuss results and recommendations",
    isFeatured: false,
  },
];

async function main() {
  console.log("Cleaning up current database tables...");
  await prisma.therapist.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.landingPageContent.deleteMany();
  await prisma.service.deleteMany();

  console.log("Seeding Therapists...");
  for (const t of THERAPISTS_DATA) {
    await prisma.therapist.create({
      data: {
        id: t.id || "",
        image: t.image || "",
        name: t.name || "",
        role: t.role || "",
        bio: t.bio || "",
        education: JSON.stringify(t.education || []),
        training: JSON.stringify(t.training || []),
        expertise: JSON.stringify(t.expertise || []),
        experience: JSON.stringify(t.experience || []),
        fees: JSON.stringify(t.fees || []),
        services: JSON.stringify(t.services || []),
        activities: JSON.stringify(t.activities || []),
      },
    });
  }

  console.log("Seeding Workshops (Filtered from Events)...");
  const workshops = EVENTS_DATA.filter((event) =>
    event.tags.some((tag) => tag.toLowerCase() === "workshop")
  );
  for (const w of workshops) {
    await prisma.workshop.create({
      data: {
        id: w.id || "",
        slug: w.slug || "",
        title: w.title || "",
        description: w.description || "",
        image: w.image || "",
        date: w.date || "",
        time: w.time || "",
        location: w.location || "",
        author: w.author || "",
        tags: JSON.stringify(w.tags || []),
        isFeatured: w.isFeatured || false,
        content: w.content || "",
        gallery: JSON.stringify(w.gallery || []),
      },
    });
  }

  console.log("Seeding Blog Posts...");
  for (const b of BLOG_POSTS) {
    const exists = await prisma.blogPost.findUnique({
      where: { slug: b.slug }
    });
    if (exists) continue;

    await prisma.blogPost.create({
      data: {
        id: b.id || "",
        slug: b.slug || "",
        title: b.title || "",
        excerpt: b.excerpt || "",
        content: b.content || "",
        image: b.image || "",
        publishedAt: b.publishedAt || "",
        author: b.author || "",
        tags: JSON.stringify(b.tags || []),
        isFeatured: b.isFeatured || false,
      },
    });
  }

  console.log("Seeding Testimonials...");
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({
      data: {
        id: t.id || "",
        name: t.name || "",
        role: t.role || "",
        avatar: t.avatar || "",
        quote: t.quote || "",
        isFeatured: true,
      },
    });
  }

  console.log("Seeding default Landing Page Content...");
  await prisma.landingPageContent.create({
    data: {
      id: "landing-content",
      heroHeadline: "Empowering Your <span class=\"text-accent\">Mind</span>, Transforming Your <span class=\"text-primary\">Life</span>",
      heroSubtitle: "At CMHC,B, we believe every individual deserves a supportive space to heal, grow, and thrive. Connect with the right therapist, right when you need it.",
      heroBgImage: "/hero-image/hero-bg.png",
      heroFigureImage: "/hero-image/hero-figure.png",
      wellbeingHeadline: "Our Commitment to Your <span class=\"text-accent\">Well-Being</span>",
      wellbeingSubtitle: "At CMHC,B, we are committed to delivering compassionate and effective mental health care. Explore how we've supported individuals on their path to emotional well-being and resilience.",
      experienceCount: 20,
      happyClientsCount: 1500,
      sessionsCount: 2800,
      satisfactionRate: 94,
      trainingHeadline: "Want to Make a <span class=\"text-primary-dark\">Difference</span> in <span class=\"text-accent\">Mental Health</span>?",
      trainingSubtitle: "Our specialized trainings equip professionals, educators, and caregivers with the tools needed to foster mental well-being in their communities.",
      trainingImage: "/mental-health-training-program.png",
    },
  });

  console.log("Seeding Services...");
  for (const s of SERVICES_SEED_DATA) {
    await prisma.service.create({
      data: {
        id: `srv-${s.slug}`,
        title: s.title,
        slug: s.slug,
        icon: s.icon,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription,
        approach: s.approach,
        isFeatured: s.isFeatured,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
