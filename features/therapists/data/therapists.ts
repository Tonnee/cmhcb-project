import { type Therapist } from "@/components/shared/therapist-card";

export const THERAPISTS_DATA: Therapist[] = [
  {
    id: "nazme-ara",
    image: "/home-therapist/therapist-ruma-khondaker-1.png",
    name: "Nazme Ara",
    role: "Clinical Psychologist | Trainer",
    bio: "Nazme is a Clinical Psychologist with over 16 years of experience working with children, adolescents, adults, couples, and families on a wide range of mental health issues. She specializes in CBT, marital therapy, systemic family therapy, psychodrama, and trauma-focused therapy. As a trainer and group facilitator, she integrates evidence-based and creative approaches to support healing, growth, and meaningful relationships.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka",
      "MS in Clinical Psychology, University of Dhaka",
      "BS in Clinical Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavioral Therapy (CBT)",
      "Systemic Family Therapy",
      "Psychodrama, Sociometry & Group Psychotherapy",
      "Marital Therapy",
      "Dialectical Behavior Therapy (DBT)",
      "Therapeutic Play (Foundation)",
    ],
    expertise: [
      "Family & Couple Relationship Issues",
      "Child & Adolescent Mental Health",
      "Trauma & Depression",
      "Anxiety Disorders (OCD, Phobia, Panic Disorder, Conversion Disorder, etc.)",
    ],
    experience: [
      "16 years Individual & Couple Counselling",
      "13 years Family Counselling",
      "2000+ Therapy Sessions Conducted",
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
          { label: "90-minute session", amount: "BDT 3,500", note: "Single therapist" },
          { label: "90-minute session", amount: "BDT 6,500", note: "Two therapists" },
        ],
      },
      {
        category: "Support Group Therapy",
        items: [
          { label: "4-session package (2 hrs each)", amount: "BDT 3,000", note: "Recommended 3 sets" },
          { label: "4-session package (3 hrs each)", amount: "BDT 3,200", note: "Recommended 3 sets" },
        ],
      },
    ],
    services: ["individual-therapy", "family-therapy", "couple-therapy"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "zohra-parveen",
    image: "/home-therapist/therapist-ruma-khondaker-2.png",
    name: "Zohra Parveen",
    role: "Clinical Psychologist | Trainer | Clinical Supervisor",
    bio: "Zohra Parveen is a senior Clinical Psychologist with over 23 years of experience working with children, adolescents, adults, couples, and families. She specializes in CBT, DBT, systemic family therapy, marital therapy, and trauma-focused interventions. She also works as a trainer, clinical supervisor, and group facilitator, integrating structured and creative therapeutic approaches.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka",
      "MS in Clinical Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavioral Therapy (CBT)",
      "Dialectical Behavior Therapy (DBT)",
      "Systemic Family Therapy",
      "Couple & Marital Therapy",
      "Trauma-Focused Therapy",
      "Clinical Supervision & Group Facilitation",
    ],
    expertise: [
      "Anxiety & Depression",
      "Trauma & PTSD",
      "Couple & Marital Issues",
      "Family Conflict",
      "Addiction & Emotional Regulation",
    ],
    experience: [
      "23+ years Clinical Practice",
      "5000+ Therapy Sessions",
      "Senior Clinical Supervisor Experience",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 3,000" },
        ],
      },
      {
        category: "Family Therapy",
        items: [
          { label: "90-minute session", amount: "BDT 5,000" },
        ],
      },
      {
        category: "Couple Therapy",
        items: [
          { label: "90-minute session", amount: "BDT 4,000" },
        ],
      },
    ],
    services: ["individual-therapy", "family-therapy", "couple-therapy"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "nazma-khatun",
    image: "/home-therapist/therapist-ruma-khondaker-3.png",
    name: "Nazma Khatun",
    role: "Clinical Psychologist | Associate Professor (University of Dhaka)",
    bio: "Nazma Khatun is a Clinical Psychologist and Associate Professor with over 15 years of experience in teaching, research, and clinical practice. She specializes in anxiety disorders, depression, trauma, and academic counseling. She combines academic knowledge with therapeutic practice to deliver structured psychological interventions.",
    education: [
      "MPhil in Clinical Psychology, University of Dhaka",
      "MS in Psychology, University of Dhaka",
      "BS in Psychology, University of Dhaka",
    ],
    training: [
      "Cognitive Behavioral Therapy (CBT)",
      "Mindfulness-Based Therapy",
      "Psychological Assessment",
      "Academic & Career Counseling",
      "Stress Management Interventions",
    ],
    expertise: [
      "Anxiety & Depression",
      "Trauma & Stress Disorders",
      "Academic Stress & Performance Issues",
      "Emotional Regulation",
    ],
    experience: [
      "15+ years Clinical & Academic Experience",
      "University Teaching Experience",
      "3000+ Sessions",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 2,500" },
        ],
      },
      {
        category: "Academic Counseling",
        items: [
          { label: "Per session", amount: "BDT 2,000" },
        ],
      },
    ],
    services: ["individual-therapy", "psychometric-assessment"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "saria-mahima",
    image: "/home-therapist/therapist-ruma-khondaker-4.png",
    name: "Saria Mahima",
    role: "Psychologist",
    bio: "Saria Mahima is a Psychologist working with adolescents and adults facing emotional and behavioral challenges. She focuses on anxiety, depression, stress, and adjustment difficulties using a supportive and client-centered approach.",
    education: [
      "MS in Psychology",
      "BS in Psychology",
    ],
    training: [
      "Basic CBT Training",
      "Counseling Skills Development",
      "Emotional Support Interventions",
    ],
    expertise: [
      "Anxiety & Depression",
      "Stress & Adjustment Issues",
      "Emotional Regulation",
      "Behavioral Concerns",
    ],
    experience: [
      "5+ years Clinical Experience",
      "1000+ Sessions",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 1,500" },
        ],
      },
    ],
    services: ["individual-therapy"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "mahbub-asem",
    image: "/home-therapist/therapist-ruma-khondaker-1.png",
    name: "Mahbub Asem",
    role: "Assistant Clinical Psychologist",
    bio: "Mahbub Asem is an Assistant Clinical Psychologist working under supervision in clinical settings. He supports clients dealing with anxiety, stress, emotional regulation issues, and behavioral concerns using CBT-based approaches.",
    education: [
      "MS in Clinical Psychology",
      "BS in Psychology",
    ],
    training: [
      "CBT Foundations",
      "Psychological Assessment Support",
      "Behavioral Intervention Techniques",
    ],
    expertise: [
      "Anxiety & Stress",
      "Emotional Regulation",
      "Behavioral Issues",
      "Supportive Counseling",
    ],
    experience: [
      "3+ years Clinical Support",
      "Supervised Therapy Practice",
    ],
    fees: [
      {
        category: "Individual Support Session",
        items: [
          { label: "50-minute session", amount: "BDT 1,200" },
        ],
      },
    ],
    services: ["individual-therapy", "psychometric-assessment"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "farhana-khan",
    image: "/home-therapist/therapist-ruma-khondaker-2.png",
    name: "Farhana Khan",
    role: "Assistant Clinical Psychologist",
    bio: "Farhana Khan is an Assistant Clinical Psychologist involved in mental health assessment and counseling support under supervision. She works with anxiety, low mood, stress, and adjustment difficulties using CBT-informed techniques.",
    education: [
      "MS in Clinical Psychology",
      "BS in Psychology",
    ],
    training: [
      "CBT Techniques",
      "Counseling Skills",
      "Psychological Assessment Support",
    ],
    expertise: [
      "Anxiety & Depression",
      "Stress Management",
      "Emotional Difficulties",
      "Adjustment Problems",
    ],
    experience: [
      "3–4 years Clinical Experience",
      "Supervised Practice",
    ],
    fees: [
      {
        category: "Individual Support Session",
        items: [
          { label: "50-minute session", amount: "BDT 1,200" },
        ],
      },
    ],
    services: ["individual-therapy", "psychometric-assessment"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
  {
    id: "nila",
    image: "/home-therapist/therapist-ruma-khondaker-3.png",
    name: "Nila",
    role: "Clinical Psychologist",
    bio: "Nila is a Clinical Psychologist with experience in supporting individuals dealing with anxiety, depression, trauma, and emotional distress. She uses a structured and compassionate approach to help clients improve emotional well-being and coping skills.",
    education: [
      "MPhil in Clinical Psychology",
      "MS in Psychology",
    ],
    training: [
      "Cognitive Behavioral Therapy (CBT)",
      "Trauma-Informed Therapy",
      "Mindfulness-Based Approaches",
      "Counseling Skills",
    ],
    expertise: [
      "Anxiety & Depression",
      "Trauma & Emotional Distress",
      "Stress Management",
      "Emotional Regulation",
    ],
    experience: [
      "7+ years Clinical Experience",
      "1500+ Sessions",
    ],
    fees: [
      {
        category: "Individual Therapy",
        items: [
          { label: "50-minute session", amount: "BDT 1,800" },
        ],
      },
    ],
    services: ["individual-therapy", "family-therapy"],
    activities: [
      "/understanding-anxiety-workshop-event.png",
      "/mental-health-training-program.png",
      "/compassionate-mental-health-professional.png",
    ],
  },
];
