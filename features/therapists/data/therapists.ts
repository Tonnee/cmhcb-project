import { type Therapist } from "@/components/shared/therapist-card";

export const THERAPISTS_DATA: Therapist[] = [
  {
    id: "nazme-ara",
    image: "/home-therapist/Nazme Ara.jpg",
    name: "Nazme Ara",
    role: "Clinical Psychologist | Trainer",
    bio: "Nazme Ara has over 16 years of experience working with children, adolescents, adults, couples, and families on a wide range of mental health issues. She specializes in CBT, marital therapy, Systemic Family Therapy, Psychodrama, and trauma-focused therapy. As a trainer and group facilitator, she integrates evidence-based and creative approaches to support healing, growth, and meaningful relationships.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka (DU)",
      "MS in Clinical Psychology, University of Dhaka",
      "BS in Clinical Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavior Therapy (CBT)",
      "Systemic Family Therapy",
      "Psychodrama Sociometry and Group Psychotherapy",
      "Marital Therapy",
      "Dialectical Behavior Therapy (DBT)",
      "Therapeutic Play (Foundation)",
    ],
    expertise: [
      "Family & Couple Relationships",
      "Child & Adolescent Mental Health",
      "Trauma & Depression",
      "Anxiety-related Disorders (OCD, Phobias, Panic Disorder, Conversion, etc.)",
    ],
    experience: [
      "16 years of Individual & Couple Counselling",
      "13 years of Family Counselling",
      "2,000+ sessions conducted",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 2,000" },
        ],
      },
      {
        category: "Family Therapy",
        items: [
          { label: "90-minute session", amount: "BDT 3,500", note: "Single Therapist" },
          { label: "90-minute session", amount: "BDT 6,500", note: "Two Therapists" },
        ],
      },
    ],
    services: ["individual-therapy", "family-therapy", "couple-therapy", "child-therapy"],
  },
  {
    id: "zohra-parveen",
    image: "/home-therapist/Zohra Parveen.png",
    name: "Zohra Parveen",
    role: "Clinical Psychologist | Trainer | Clinical Supervisor",
    bio: "Zohra Parveen has over 23 years of experience supporting children, adolescents, adults, couples, and families. Trained in CBT, DBT, and Systemic Family and Couple Therapy, she works across diverse areas including relationship issues, anxiety, depression, addiction, and trauma. She currently serves as an Executive Committee Member of BCPS and Clinical Supervisor at the Health Equity Initiative, Malaysia.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka (DU)",
      "MS in Clinical Psychology (Gold Medalist), University of Dhaka",
      "MSc in Psychology, University of Dhaka",
      "BSc in Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavior Therapy (CBT)",
      "Dialectical Behavior Therapy (DBT)",
      "Systemic Family Therapy",
      "Couple Therapy",
      "Marital Therapy",
    ],
    expertise: [
      "Couple, Family, and Marriage Relationships",
      "Positive Parenting",
      "Addiction (Substance, Screen/Mobile)",
      "Depression & Suicide Prevention / Self-harm",
      "Stress & Anger Management",
      "OCD, Anxiety, Panic Attacks, Conversion Disorder",
      "Psycho-sexual Dysfunction",
    ],
    experience: [
      "23 years of Individual & Couple Counselling",
      "2,000+ sessions conducted",
      "Executive Committee Member of BCPS",
      "Clinical Supervisor at Health Equity Initiative, Malaysia",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 2,000" },
        ],
      },
      {
        category: "Family Therapy",
        items: [
          { label: "90-minute session", amount: "BDT 3,500", note: "Single Therapist" },
          { label: "90-minute session", amount: "BDT 6,500", note: "Two Therapists" },
        ],
      },
    ],
    services: ["individual-therapy", "family-therapy", "couple-therapy", "child-therapy"],
  },
  {
    id: "nazma-khatun",
    image: "/home-therapist/Nazma Khatun.jpg",
    name: "Nazma Khatun",
    role: "Associate Professor | Clinical Psychologist",
    bio: "Dedicated to helping individuals and families navigate life's challenges. She specializes in children's & men's mental well-being, relationship conflicts, divorce, and post-divorce adjustment. Using approaches like SFT, CBT, and DBT, Nazma creates a safe, supportive space.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka (DU)",
      "MS in Clinical Psychology, University of Dhaka",
      "BS in Clinical Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavior Therapy (CBT)",
      "Systemic Family Therapy",
      "Dialectical Behavior Therapy (DBT)",
    ],
    expertise: [
      "Children's Mental Health Issues",
      "High-Conflict Relationships",
      "Divorce and Post-divorce Stress",
      "Men's Mental Health Crises",
    ],
    experience: [
      "20 years of Individual & Couple Counselling",
      "2,000+ sessions conducted",
    ],
    fees: [
      {
        category: "Individual Therapy (Online Only)",
        items: [
          { label: "50-minute session", amount: "BDT 2,000" },
        ],
      },
    ],
    services: ["individual-therapy", "child-therapy", "couple-therapy"],
  },
  {
    id: "saria-mahima",
    image: "/home-therapist/Saria Mahima.jpg",
    name: "Saria Mahima",
    role: "Psychologist",
    bio: "Passionately dedicated to training CBT, teaching Mindfulness, and providing psychotherapy with a very limited case load.",
    education: [
      "MS in Clinical Psychology, University of Dhaka (DU)",
    ],
    training: [
      "Cognitive Behavior Therapy (DU)",
      "Psychodrama (DU)",
      "Mindfulness (UK)",
    ],
    expertise: [
      "Depressive Disorders",
      "Generalised Anxiety Disorder (GAD)",
      "Bipolar Disorder",
      "Adolescent problems",
    ],
    experience: [
      "18 years of experience (with a 3-year gap)",
      "500+ sessions conducted",
    ],
    fees: [
      {
        category: "Individual Therapy (Online Only)",
        items: [
          { label: "50-minute session", amount: "BDT 2,000" },
        ],
      },
    ],
    services: ["individual-therapy", "child-therapy"],
  },
  {
    id: "mahbub-asem",
    image: "/home-therapist/Mahbub Asem.png",
    name: "Mahbub Asem",
    role: "Assistant Clinical Psychologist | MPhil Researcher",
    bio: "Mahbub Asem is an MPhil researcher at the University of Dhaka, specializing in clinical psychology. Trained in CBT, he provides psychotherapy for adults facing various mental health challenges with a compassionate and evidence-based approach to build resilience.",
    education: [
      "MPhil Researcher, University of Dhaka (DU)",
      "MS in Clinical Psychology, University of Dhaka",
      "BS in Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavior Therapy (CBT)",
      "Marital Therapy",
      "Dialectical Behavior Therapy (DBT)",
    ],
    expertise: [
      "Student Counselling",
      "Relationship Issues",
      "Anxiety-related Disorders (OCD, Phobias, Panic Disorder, etc.)",
      "Personality Disorders",
    ],
    experience: [
      "2 years of Individual Counselling",
      "500+ sessions conducted",
      "Research in Mental Health, Psychology, and Politics",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "First Session (One-time, 50 mins)", amount: "BDT 1,500" },
          { label: "Follow-up Sessions (50 mins)", amount: "BDT 1,000" },
        ],
      },
    ],
    services: ["individual-therapy", "couple-therapy", "psychometric-assessment"],
  },
  {
    id: "farhana-khan",
    image: "/home-therapist/Farhana Khan.jpg",
    name: "Farhana Khan",
    role: "Assistant Clinical Psychologist | MPhil Researcher",
    bio: "Farhana Khan is an MPhil researcher at the University of Dhaka, specializing in Clinical Psychology. Trained in CBT, she works with adults experiencing depression, anxiety-related disorders, relationship difficulties, and trauma. She provides personalized, tailored therapy for each client.",
    education: [
      "MPhil Researcher, University of Dhaka (DU)",
      "MS in Clinical Psychology, University of Dhaka",
      "BS in Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavior Therapy (CBT)",
      "Marital Therapy",
      "Dialectical Behavior Therapy (DBT)",
      "Systemic Family Therapy",
    ],
    expertise: [
      "Depression",
      "Anxiety-related Disorders (OCD, Phobias, Panic Disorder, etc.)",
      "Relationship Issues",
      "Trauma",
    ],
    experience: [
      "2 years of Individual Counselling",
      "500+ sessions conducted",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "First Session (One-time, 50 mins)", amount: "BDT 1,500" },
          { label: "Follow-up Sessions (50 mins)", amount: "BDT 1,000" },
        ],
      },
    ],
    services: ["individual-therapy", "couple-therapy"],
  },
  {
    id: "nila",
    image: "/home-therapist/Ms. Nila.png",
    name: "Nila",
    role: "Clinical Psychologist",
    bio: "Nila is a Clinical Psychologist on the CMHC,B expert panel roster, providing evidence-based mental health support, individual therapy, and psychological counseling.",
    education: [
      "MPhil in Clinical Psychology",
      "MS in Psychology",
    ],
    training: [
      "Cognitive Behavioral Therapy (CBT)",
      "Trauma-Informed Therapy",
      "Mindfulness-Based Approaches",
    ],
    expertise: [
      "Clinical Psychology",
      "Mental Health Counseling",
      "Psychological Assessment",
    ],
    experience: [
      "Expert Panel Roster Member at CMHC,B",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 2,000" },
        ],
      },
    ],
    services: ["individual-therapy", "psychometric-assessment"],
  },
];
