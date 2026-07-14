import { PrismaClient } from "@prisma/client";
import { THERAPISTS_DATA } from "../features/therapists/data/therapists";
import { EVENTS_DATA } from "../features/events/data/events";
import { BLOG_POSTS } from "../features/blog/data/blogs";
import { TESTIMONIALS } from "../data/testimonials";
import { TRAININGS } from "../features/training/data/trainings";
import { SERVICES } from "../features/services/data/services";
import { TRAINING_INFO_BLOCKS } from "../features/training/data/training-info-blocks";

const prisma = new PrismaClient();

const iconMap: Record<string, string> = {
  "psychometric-assessment": "HiClipboardDocumentCheck",
  "individual-therapy": "HiUser",
  "child-therapy": "HiFaceSmile",
  "family-therapy": "HiUsers",
  "couple-therapy": "HiHeart",
  "iq-test": "HiAcademicCap",
};

const bgImageMap: Record<string, string> = {
  "psychometric-assessment": "/psychometric-assessment-counseling.png",
  "individual-therapy": "/individual-psychotherapy-counseling.png",
  "child-therapy": "/child-therapy-counseling-session.png",
  "family-therapy": "/family-therapy-counseling-center.png",
  "couple-therapy": "/couple-counseling-relationship-therapy.png",
  "iq-test": "/iq-cognitive-assessment.png",
};

async function main() {
  console.log("Cleaning up current database tables...");
  await prisma.therapist.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.landingPageContent.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceInfoBlock.deleteMany();
  await prisma.trainingInfoBlock.deleteMany();
  await prisma.training.deleteMany();

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

  console.log("Seeding Services from features/services/data/services...");
  let sIndex = 0;
  for (const s of SERVICES) {
    const whoIsItFor = s.description.sections.find((sec) =>
      sec.title.toLowerCase().includes("who")
    )?.items.join("\n") || "";

    const approach = s.description.sections.find((sec) =>
      sec.title.toLowerCase().includes("approach") || sec.title.toLowerCase().includes("methods")
    )?.items.join("\n") || "";

    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        icon: iconMap[s.slug] || "HiUser",
        shortDescription: s.shortDescription,
        longDescription: s.description.introduction.description,
        approach: approach,
        whoIsItFor: whoIsItFor,
        isFeatured: s.slug === "psychometric-assessment" || s.slug === "individual-therapy" || s.slug === "child-therapy",
        image: s.image,
        bgImage: bgImageMap[s.slug] || "/pages-hero-background/1.png",
        duration: s.duration,
        fees: s.fees,
        format: "In-person / Online",
        language: "Bangla / English",
        faqs: JSON.stringify(s.faq || []),
        order: sIndex,
      },
      create: {
        id: `srv-${s.slug}`,
        title: s.title,
        slug: s.slug,
        icon: iconMap[s.slug] || "HiUser",
        shortDescription: s.shortDescription,
        longDescription: s.description.introduction.description,
        approach: approach,
        whoIsItFor: whoIsItFor,
        isFeatured: s.slug === "psychometric-assessment" || s.slug === "individual-therapy" || s.slug === "child-therapy",
        image: s.image,
        bgImage: bgImageMap[s.slug] || "/pages-hero-background/1.png",
        duration: s.duration,
        fees: s.fees,
        format: "In-person / Online",
        language: "Bangla / English",
        faqs: JSON.stringify(s.faq || []),
        order: sIndex,
      },
    });
    sIndex++;
  }

  console.log("Seeding Service Info Blocks...");
  const SERVICE_INFO_BLOCKS_DATA = [
    {
      heading: "Who Can Benefit",
      items: JSON.stringify([
        "Individuals seeking emotional support",
        "Families and couples",
        "Students and working professionals",
        "Organizations and institutions",
      ]),
      ctaLabel: "Book Appointment",
      ctaHref: "/appointment",
      image: "/couple-therapy-counselor-session.jpg",
      imageAlt: "Couple in a therapy session discussing mental health with a counselor at CMHCB",
      order: 0,
    },
    {
      heading: "Why Choose CMHC,B",
      items: JSON.stringify([
        "Qualified and experienced professionals",
        "Ethical practice and confidentiality",
        "Personalized care plans",
        "Trusted mental health center in Bangladesh",
      ]),
      ctaLabel: "Schedule a Session",
      ctaHref: "/appointment",
      image: "/family-psychotherapy-consultation.jpg",
      imageAlt: "Family participating in a psychotherapy consultation session",
      order: 1,
    },
  ];

  for (const block of SERVICE_INFO_BLOCKS_DATA) {
    await prisma.serviceInfoBlock.create({
      data: block,
    });
  }

  console.log("Seeding Training Info Blocks...");
  for (let i = 0; i < TRAINING_INFO_BLOCKS.length; i++) {
    const block = TRAINING_INFO_BLOCKS[i];
    await prisma.trainingInfoBlock.create({
      data: {
        id: `tib-seed-${i}`,
        heading: block.heading,
        items: JSON.stringify(block.items),
        ctaLabel: block.cta.label,
        ctaHref: block.cta.href,
        image: block.image.src,
        imageAlt: block.image.alt,
        order: i,
      },
    });
  }

  console.log("Seeding Trainings...");
  let tIndex = 0;
  for (const t of TRAININGS) {
    await prisma.training.create({
      data: {
        id: `trn-${t.slug}`,
        title: t.title,
        slug: t.slug,
        heroTitle: t.heroTitle,
        heroDescription: t.heroDescription,
        introTitle: t.description.introduction.title,
        introDescription: t.description.introduction.description,
        sections: JSON.stringify(t.description.sections),
        faq: JSON.stringify(t.faq),
        features: JSON.stringify(t.features),
        duration: t.duration,
        fees: t.fees,
        variant: t.variant,
        bgImage: "/pages-hero-background/1.png",
        order: tIndex,
      },
    });
    tIndex++;
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
