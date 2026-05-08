import { type FeatureCardVariant } from "@/components/shared/feature-card";
import { type ServiceDescriptionData } from "@/features/services/components/service-description";
import { type FaqItem } from "@/features/services/components/service-faq";

export interface TrainingItem {
  slug: string;
  title: string;
  heroTitle: string;
  heroDescription: string;
  description: ServiceDescriptionData;
  faq: FaqItem[];
  features: string[];
  duration: string;
  fees: string;
  variant: FeatureCardVariant;
}

export const TRAININGS: TrainingItem[] = [
  {
    slug: "psychological-first-aid",
    title: "Psychological First Aid (PFA)",
    heroTitle: "Psychological First Aid (PFA)",
    heroDescription:
      "Learn to provide immediate, compassionate support to individuals in crisis. This training equips participants with evidence-based PFA skills recognised by WHO and international mental health bodies.",
    description: {
      introduction: {
        title: "What Is Psychological First Aid?",
        description:
          "Psychological First Aid (PFA) is an evidence-informed approach to help people in the immediate aftermath of a crisis event. It focuses on reducing distress, meeting basic needs, and connecting people to support services — without requiring clinical expertise.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Teachers, school counsellors, and educators",
            "Community health workers and NGO staff",
            "First responders and social workers",
            "HR professionals and workplace managers",
            "Anyone supporting people during crises",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Core principles and actions of WHO PFA",
            "How to Look, Listen, and Link effectively",
            "Supporting children and vulnerable groups",
            "Self-care strategies for helpers",
            "Ethical and cultural considerations",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Do I need a psychology background to attend?",
        answer:
          "No. PFA is designed for non-clinicians. Anyone who works with or supports people can benefit from this training.",
      },
      {
        question: "Is the training recognised internationally?",
        answer:
          "Yes. The curriculum is aligned with WHO and Sphere Handbook guidelines for psychological first aid.",
      },
      {
        question: "Will I receive a certificate?",
        answer:
          "Yes. Participants who complete the full training receive a certificate of participation from CMHCB.",
      },
    ],
    features: ["WHO-aligned curriculum", "Crisis support skills", "Certificate awarded"],
    duration: "2 Days / 16 Hrs",
    fees: "BDT 5,000",
    variant: "primary",
  },
  {
    slug: "anger-management",
    title: "Anger Management",
    heroTitle: "Anger Management",
    heroDescription:
      "Develop practical strategies to understand, manage, and channel anger constructively. This training helps individuals and professionals reduce conflict and build healthier responses.",
    description: {
      introduction: {
        title: "What Is Anger Management Training?",
        description:
          "Anger management training teaches participants to recognise triggers, understand the physiological and psychological roots of anger, and apply evidence-based techniques to respond rather than react.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Individuals experiencing frequent anger episodes",
            "Managers and team leaders",
            "Parents and caregivers",
            "Teachers and student counsellors",
            "HR and conflict resolution professionals",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Recognising personal anger triggers",
            "CBT-based techniques for emotional regulation",
            "De-escalation strategies in interpersonal conflicts",
            "Assertiveness vs aggression",
            "Relaxation and mindfulness practices",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this training suitable for someone with severe anger issues?",
        answer:
          "This training is educational in nature. Those with severe anger issues are encouraged to also seek individual therapy alongside the training.",
      },
      {
        question: "How long is the training?",
        answer: "The training runs for one full day, approximately 8 hours including breaks.",
      },
    ],
    features: ["CBT-based techniques", "Conflict de-escalation", "Emotional regulation"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,000",
    variant: "secondary",
  },
  {
    slug: "stress-management",
    title: "Stress Management",
    heroTitle: "Stress Management",
    heroDescription:
      "Build resilience and learn practical tools to identify, reduce, and manage stress effectively in personal and professional life.",
    description: {
      introduction: {
        title: "What Is Stress Management Training?",
        description:
          "Stress management training provides participants with an understanding of the stress response and equips them with a toolkit of evidence-based strategies to manage pressures at work and at home.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Working professionals and executives",
            "Students facing academic pressure",
            "Caregivers and healthcare workers",
            "Anyone experiencing chronic stress",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Understanding the stress response cycle",
            "Identifying personal stressors and warning signs",
            "Time management and prioritisation techniques",
            "Breathing, relaxation, and grounding exercises",
            "Building a sustainable stress management plan",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can this training be delivered for corporate teams?",
        answer:
          "Yes. CMHCB offers group and corporate rates for in-house stress management programmes.",
      },
      {
        question: "Is this training evidence-based?",
        answer:
          "Yes. The content draws from CBT, mindfulness-based stress reduction (MBSR), and positive psychology frameworks.",
      },
    ],
    features: ["Burnout prevention", "Resilience building", "Practical coping tools"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,000",
    variant: "secondary",
  },
  {
    slug: "relaxation",
    title: "Relaxation",
    heroTitle: "Relaxation Techniques",
    heroDescription:
      "Learn a range of scientifically grounded relaxation methods to reduce tension, improve sleep, and restore calm in everyday life.",
    description: {
      introduction: {
        title: "What Is Relaxation Training?",
        description:
          "Relaxation training introduces participants to a suite of techniques — from progressive muscle relaxation to guided imagery — that activate the parasympathetic nervous system and counteract the physical effects of stress.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Individuals with sleep difficulties",
            "Those managing anxiety or chronic tension",
            "Healthcare and wellness professionals",
            "Yoga and mindfulness practitioners seeking additional skills",
          ],
        },
        {
          title: "Techniques Covered",
          items: [
            "Progressive Muscle Relaxation (PMR)",
            "Diaphragmatic breathing",
            "Guided imagery and visualisation",
            "Body scan meditation",
            "Autogenic training",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Do I need any prior experience?",
        answer: "No prior experience is needed. The training is suitable for complete beginners.",
      },
      {
        question: "Will I practise the techniques during the session?",
        answer:
          "Yes. A significant portion of the session involves guided practice so participants leave with hands-on experience.",
      },
    ],
    features: ["PMR & breathing exercises", "Guided visualisation", "Sleep improvement tools"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 2,500",
    variant: "secondary",
  },
  {
    slug: "helping-children-self-confidence",
    title: "Helping Children to Develop Self-Confidence",
    heroTitle: "Helping Children to Develop Self-Confidence",
    heroDescription:
      "A practical training for parents, teachers, and caregivers on fostering healthy self-esteem and confidence in children.",
    description: {
      introduction: {
        title: "Why Self-Confidence Matters in Childhood",
        description:
          "Self-confidence is a foundational building block of children's emotional and social development. This training empowers adults who work with or care for children to create environments that nurture confidence, resilience, and a positive self-concept.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Parents and primary caregivers",
            "School teachers and class teachers",
            "Child psychologists and counsellors",
            "Social workers working with children",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "The psychology of self-esteem in children",
            "Language that builds vs. undermines confidence",
            "Praise, encouragement, and growth mindset strategies",
            "Handling failure and setbacks constructively",
            "Age-appropriate confidence-building activities",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this training suitable for parents of toddlers?",
        answer:
          "Yes. The training covers techniques appropriate for children from early childhood through adolescence.",
      },
      {
        question: "Will I get resources to take home?",
        answer:
          "Yes. Participants receive a curated resource pack with activities and reading materials.",
      },
    ],
    features: ["Child psychology-based", "Growth mindset tools", "For parents & teachers"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,500",
    variant: "secondary",
  },
  {
    slug: "managing-childrens-misbehavior",
    title: "Managing Children's Misbehavior",
    heroTitle: "Managing Children's Misbehavior",
    heroDescription:
      "Equip yourself with positive, evidence-based strategies to understand and respond to challenging behaviour in children without punishment or conflict.",
    description: {
      introduction: {
        title: "Understanding Children's Behaviour",
        description:
          "Children's misbehavior is often a form of communication. This training helps parents and educators understand the underlying needs driving difficult behaviour and respond with strategies that are effective, compassionate, and developmentally appropriate.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Parents of school-age children",
            "Primary and secondary school teachers",
            "School counsellors and behaviour support staff",
            "Child and family support workers",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Why children misbehave: needs behind behaviour",
            "Positive discipline vs punishment",
            "Setting clear and consistent boundaries",
            "De-escalation strategies for tantrums and outbursts",
            "Building cooperative relationships with children",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this different from traditional discipline methods?",
        answer:
          "Yes. This training focuses on positive discipline — understanding and addressing the causes of behaviour rather than purely focusing on consequences.",
      },
      {
        question: "Is this training relevant for teenagers?",
        answer:
          "Yes. While much content focuses on younger children, strategies are adapted for adolescent behaviour as well.",
      },
    ],
    features: ["Positive discipline methods", "De-escalation strategies", "Boundary setting"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,500",
    variant: "secondary",
  },
  {
    slug: "study-skills",
    title: "Study Skills",
    heroTitle: "Study Skills",
    heroDescription:
      "Help students and learners maximise their potential with evidence-based study techniques, time management, and exam preparation strategies.",
    description: {
      introduction: {
        title: "Why Study Skills Training Matters",
        description:
          "Effective studying is a skill that can be taught and refined. This training provides learners with a structured approach to learning — from note-taking and memory techniques to managing exam anxiety.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Secondary and higher secondary students",
            "University and college students",
            "Parents wanting to support their children",
            "Teachers and academic coaches",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Evidence-based memorisation and recall techniques",
            "Active reading and structured note-taking",
            "Time management and study schedule design",
            "Managing exam stress and performance anxiety",
            "Goal setting and motivation strategies",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this training suitable for all academic levels?",
        answer:
          "Yes. Strategies are adaptable for students from secondary school through to postgraduate level.",
      },
      {
        question: "Can schools book this as a group session?",
        answer:
          "Yes. CMHCB regularly delivers study skills workshops for schools and educational institutions.",
      },
    ],
    features: ["Memory & recall techniques", "Exam anxiety management", "Academic coaching"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,000",
    variant: "secondary",
  },
  {
    slug: "basic-counseling-skills",
    title: "Basic Counseling Skills",
    heroTitle: "Basic Counseling Skills",
    heroDescription:
      "A foundational training for those who want to develop active listening, empathy, and basic counselling competencies to support others more effectively.",
    description: {
      introduction: {
        title: "What Are Basic Counseling Skills?",
        description:
          "Basic counselling skills training equips participants with core helping skills used by professional counsellors — active listening, reflective questioning, empathy, and non-judgmental communication — applicable in both professional and personal contexts.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Teachers, nurses, and healthcare workers",
            "HR professionals and managers",
            "NGO workers and community volunteers",
            "Aspiring counsellors and mental health students",
            "Anyone in a helping or support role",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Active listening and attending skills",
            "Paraphrasing, summarising, and reflecting feelings",
            "Open and closed questioning techniques",
            "Establishing rapport and building trust",
            "Ethical boundaries in helping relationships",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Does this training qualify me as a counsellor?",
        answer:
          "No. This is an introductory skills training. Professional counselling requires a full academic qualification and supervised practice. This training is a valuable foundation for those in helping roles.",
      },
      {
        question: "How long is the training?",
        answer:
          "This is a 3-day intensive training covering theory, demonstration, and practice sessions.",
      },
    ],
    features: ["Active listening skills", "Empathy & rapport building", "Ethical helping boundaries"],
    duration: "3 Days / 24 Hrs",
    fees: "BDT 8,000",
    variant: "secondary",
  },
  {
    slug: "child-development-parenting",
    title: "Child Development and Parenting Skills",
    heroTitle: "Child Development and Parenting Skills",
    heroDescription:
      "Understand the key stages of child development and learn practical parenting strategies that support healthy psychological, emotional, and social growth.",
    description: {
      introduction: {
        title: "Understanding Child Development",
        description:
          "This training provides parents and caregivers with a grounded understanding of child development milestones — cognitive, emotional, social, and physical — and translates that knowledge into everyday parenting strategies that promote well-being and resilience.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "New and expectant parents",
            "Parents of children aged 2–17",
            "Foster carers and adoptive parents",
            "Early childhood educators and teachers",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Key developmental stages from infancy to adolescence",
            "Attachment theory and secure bonding",
            "Responsive parenting strategies",
            "Supporting emotional literacy in children",
            "Navigating common developmental challenges",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this training suitable for parents of teenagers?",
        answer:
          "Yes. The training covers the full developmental arc from infancy through adolescence, with dedicated focus on teen development.",
      },
      {
        question: "Can both parents attend together?",
        answer:
          "Absolutely — attending together is encouraged, as it promotes a consistent parenting approach at home.",
      },
    ],
    features: ["Attachment & bonding theory", "Developmental milestones", "Responsive parenting"],
    duration: "2 Days / 16 Hrs",
    fees: "BDT 5,000",
    variant: "secondary",
  },
  {
    slug: "how-to-be-a-good-communicator",
    title: "How to be a Good Communicator",
    heroTitle: "How to be a Good Communicator",
    heroDescription:
      "Strengthen your communication skills — verbal, non-verbal, and written — to connect more effectively with others in personal and professional settings.",
    description: {
      introduction: {
        title: "Why Communication Skills Matter",
        description:
          "Effective communication is at the heart of every healthy relationship and productive workplace. This training focuses on developing clarity, empathy, and confidence in communication across diverse contexts and audiences.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Professionals at all levels",
            "Team leaders and managers",
            "Students and recent graduates",
            "Anyone wanting to improve interpersonal effectiveness",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Verbal and non-verbal communication essentials",
            "Assertive vs passive vs aggressive communication",
            "Active listening and reflective responding",
            "Giving and receiving feedback constructively",
            "Cross-cultural and emotionally intelligent communication",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is this training only for corporate professionals?",
        answer:
          "Not at all. The skills are universal and benefit anyone in any setting — home, school, or workplace.",
      },
      {
        question: "Is public speaking covered?",
        answer:
          "Basic presentation confidence is included; we offer a dedicated public speaking workshop separately.",
      },
    ],
    features: ["Assertive communication", "Non-verbal awareness", "Feedback skills"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,000",
    variant: "secondary",
  },
  {
    slug: "burnout-management",
    title: "Burn-out Management",
    heroTitle: "Burn-out Management",
    heroDescription:
      "Recognise the warning signs of burnout, understand its causes, and build sustainable recovery and prevention strategies for yourself and your team.",
    description: {
      introduction: {
        title: "What Is Burnout?",
        description:
          "Burnout is a state of chronic stress that leads to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness. This training helps individuals and organisations identify burnout early and implement evidence-based strategies for recovery and long-term prevention.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Healthcare workers and helping professionals",
            "Managers and HR practitioners",
            "Educators and social workers",
            "Anyone experiencing signs of work exhaustion",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "The three dimensions of burnout: exhaustion, cynicism, inefficacy",
            "Recognising early warning signs in yourself and others",
            "Boundary setting and workload management",
            "Recovery techniques and rest strategies",
            "Building organisational cultures that prevent burnout",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can this training be delivered at my workplace?",
        answer:
          "Yes. CMHCB delivers burnout management workshops for corporate and institutional clients.",
      },
      {
        question: "Is this training based on the WHO definition of burnout?",
        answer:
          "Yes. The content aligns with the WHO ICD-11 classification of burnout as an occupational phenomenon.",
      },
    ],
    features: ["Burnout early warning signs", "Boundary & workload tools", "Recovery strategies"],
    duration: "1 Day / 8 Hrs",
    fees: "BDT 3,500",
    variant: "secondary",
  },
  {
    slug: "creative-therapy",
    title: "Creative Therapy",
    heroTitle: "Creative Therapy",
    heroDescription:
      "Explore how art, music, movement, and creative expression can be used as powerful therapeutic tools for emotional healing and self-discovery.",
    description: {
      introduction: {
        title: "What Is Creative Therapy?",
        description:
          "Creative therapy uses non-verbal expressive arts — visual art, music, drama, and movement — as pathways to emotional processing, communication, and healing. This training introduces participants to the theory and practice of creative therapeutic approaches.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Mental health professionals seeking new tools",
            "Art, drama, and music teachers",
            "Social workers and community workers",
            "Occupational therapists and rehabilitation workers",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "Foundations of art, music, and drama therapy",
            "Using creative expression with children and adults",
            "Facilitating creative therapy activities safely",
            "Ethical considerations in creative practice",
            "Integrating creative methods with other therapeutic approaches",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Do I need to be artistic to attend?",
        answer:
          "No. Creative therapy is not about artistic skill — it is about using creative expression as a medium for therapeutic process.",
      },
      {
        question: "Is this a qualifying course in art therapy?",
        answer:
          "No. This is an introductory training. Full qualification in creative arts therapy requires dedicated postgraduate-level study.",
      },
    ],
    features: ["Arts-based healing tools", "Child & adult applications", "Safe facilitation skills"],
    duration: "2 Days / 16 Hrs",
    fees: "BDT 6,000",
    variant: "secondary",
  },
  {
    slug: "introduction-to-psychodrama",
    title: "Introduction on Psychodrama",
    heroTitle: "Introduction on Psychodrama",
    heroDescription:
      "Discover psychodrama — an action-based therapeutic method that uses role play, group dynamics, and dramatic enactment to promote insight and emotional healing.",
    description: {
      introduction: {
        title: "What Is Psychodrama?",
        description:
          "Psychodrama is a form of action therapy developed by J.L. Moreno, in which participants enact significant life events or emotional themes through structured role play. This introductory training provides both theoretical grounding and experiential practice with psychodrama techniques.",
      },
      sections: [
        {
          title: "Who Should Attend?",
          items: [
            "Counsellors and psychotherapists",
            "Group therapy facilitators",
            "Drama and performing arts educators",
            "Mental health students and trainees",
          ],
        },
        {
          title: "What You Will Learn",
          items: [
            "History and theoretical foundations of psychodrama",
            "Core elements: protagonist, director, auxiliary ego, audience",
            "Warm-up, enactment, and sharing phases",
            "Key techniques: role reversal, doubling, mirroring",
            "Ethical and safety considerations in group work",
          ],
        },
      ],
    },
    faq: [
      {
        question: "Is prior therapy experience required?",
        answer:
          "Some familiarity with group work or therapeutic settings is helpful, but not mandatory for this introductory level.",
      },
      {
        question: "Will there be live enactment during the training?",
        answer:
          "Yes. Experiential practice is a core part of this training. Participation in role play activities is encouraged.",
      },
    ],
    features: ["Role play & enactment", "Group dynamics theory", "Moreno's core techniques"],
    duration: "2 Days / 16 Hrs",
    fees: "BDT 6,000",
    variant: "secondary",
  },
];
