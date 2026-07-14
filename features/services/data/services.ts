import { type FeatureCardVariant } from "@/components/shared/feature-card";
import { type ServiceDescriptionData } from "@/features/services/components/service-description";
import { type FaqItem } from "@/components/shared/faq";

export interface ServiceItem {
  slug: string;
  title: string;
  image: string;
  icon: string;
  iconVariant: "primary" | "accent";
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  description: ServiceDescriptionData;
  faq: FaqItem[];
  features: string[];
  duration: string;
  fees: string;
  variant: FeatureCardVariant;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "psychometric-assessment",
    title: "Psychometric Assessment",
    image: "/home-service-images/psychometric-assessment.png",
    icon: "/home-service-images/psychometric-assessment-icon.png",
    iconVariant: "primary",
    shortDescription: "Comprehensive standardized evaluations to understand personality, cognitive traits, and mental health needs",
    heroTitle: "Psychometric Assessment",
    heroDescription:
      "Using standardized, evidence-based tools, our specialists conduct thorough psychological evaluations to support accurate diagnosis, treatment planning, and a deeper understanding of your mental health.",
    description: {
      introduction: {
        title: "What Is a Psychometric Assessment?",
        description:
          "A psychometric assessment is a structured, standardized evaluation that measures cognitive ability, personality traits, emotional functioning, and behavioural patterns. At CMHCB, our assessments are conducted by qualified mental health professionals using internationally validated instruments, providing an objective picture of your psychological profile to guide effective intervention.",
      },
      sections: [
        {
          title: "Who Is It For?",
          items: [
            "Individuals seeking clarity about their mental health",
            "Students requiring psychoeducational evaluation reports",
            "Clients referred by physicians or therapists for diagnostic support",
            "Organizations needing psychological screening for staff",
            "Parents seeking assessments for child development concerns",
          ],
        },
        {
          title: "Our Assessment Approach",
          items: [
            "Internationally validated psychometric instruments",
            "Administered by trained and certified psychologists",
            "Confidential scoring and professional interpretation",
            "Written report with clear findings and recommendations",
            "Debrief session to discuss results and next steps",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is a psychometric assessment?",
        answer:
          "A psychometric assessment is a standardized evaluation conducted by a qualified psychologist to measure aspects of your mental functioning — including cognitive ability, personality traits, emotional regulation, and behaviour patterns.",
      },
      {
        question: "Who should consider a psychometric assessment?",
        answer:
          "Anyone seeking a deeper understanding of their mental health, students needing psychoeducational reports, individuals referred by a doctor or therapist, and organizations requiring staff psychological screening.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "A typical psychometric assessment at CMHCB takes approximately 30 minutes, though complex evaluations may take longer depending on the instruments used.",
      },
      {
        question: "What do I receive after the assessment?",
        answer:
          "You receive a comprehensive written report summarizing your results, a professional interpretation of findings, and a debrief session with the assessing psychologist to discuss the results and recommended next steps.",
      },
      {
        question: "Is the assessment confidential?",
        answer:
          "Yes. All assessments and their results are strictly confidential and shared only with your written consent, in accordance with professional ethical guidelines.",
      },
      {
        question: "How do I book a psychometric assessment?",
        answer:
          "You can book directly through our website by clicking 'Book an Appointment', or contact our support team via phone or email and we will schedule a session at your convenience.",
      },
    ],
    features: [
      "Standardized evaluation tools",
      "Psychological screening",
      "Treatment planning support",
    ],
    duration: "30 mins",
    fees: "300 BDT",
    variant: "primary",
  },
  {
    slug: "individual-therapy",
    title: "Individual Therapy",
    image: "/home-service-images/individual-therapy.png",
    icon: "/home-service-images/individual-therapy-icon.png",
    iconVariant: "accent",
    shortDescription: "Personalized one-on-one therapy to manage stress, build resilience, and improve emotional well-being",
    heroTitle: "Individual Therapy",
    heroDescription:
      "Our one-on-one therapy sessions provide a safe, confidential space where you can explore your thoughts and feelings, build resilience, and develop personalized strategies for emotional well-being.",
    description: {
      introduction: {
        title: "What Is Individual Therapy?",
        description:
          "Individual therapy is a collaborative process where a therapist works closely with an individual to understand thoughts, emotions, and behaviors, helping them manage difficulties and improve overall psychological well-being.",
      },
      sections: [
        {
          title: "Who Is It For?",
          items: [
            "Stress, anxiety, or depression",
            "Emotional distress or life transitions",
            "Trauma, grief, or loss",
            "Self-esteem and confidence issues",
            "Relationship or work-related concerns",
          ],
        },
        {
          title: "Our Therapeutic Approach",
          items: [
            "Evidence-based methods",
            "Client-centered care",
            "Ethical & confidential practice",
            "Culturally sensitive support",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is individual therapy?",
        answer:
          "Individual therapy is a one-on-one session with a trained mental health professional where you can openly discuss emotional, psychological, or personal challenges in a safe and confidential environment.",
      },
      {
        question: "Who can take individual therapy?",
        answer:
          "Individual therapy is suitable for anyone experiencing stress, anxiety, depression, grief, relationship difficulties, low self-esteem, or simply wanting to improve their mental well-being and self-awareness.",
      },
      {
        question: "How long is each session?",
        answer:
          "Each individual therapy session at CMHCB is 60 minutes. The frequency of sessions is agreed upon between you and your therapist based on your goals and clinical needs.",
      },
      {
        question: "How much does a session cost?",
        answer:
          "Individual therapy sessions are priced at 1,000 BDT per session. Please contact us for information about packages or reduced-rate options.",
      },
      {
        question: "Is individual therapy confidential?",
        answer:
          "Yes. Everything discussed in your sessions is kept strictly confidential. Information is only shared with your written consent, or in rare circumstances required by law to ensure safety.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "The number of sessions varies depending on your goals and the nature of your concerns. Some clients benefit from short-term therapy (6–12 sessions), while others prefer ongoing support over a longer period.",
      },
      {
        question: "Is therapy only for serious mental illness?",
        answer:
          "Not at all. Therapy is beneficial for anyone seeking personal growth, stress management, or emotional support — not just those with a diagnosed mental health condition.",
      },
      {
        question: "Can I take therapy online?",
        answer:
          "Yes. CMHCB offers both in-person and online individual therapy sessions to accommodate your schedule and location.",
      },
      {
        question: "How do I book an appointment?",
        answer:
          "You can book through our website or contact our team directly. We will match you with a suitable therapist and schedule your first session at a time that works for you.",
      },
    ],
    features: [
      "Emotional well-being focus",
      "Personalized coping strategies",
    ],
    duration: "60 mins",
    fees: "1,000 BDT",
    variant: "secondary",
  },
  {
    slug: "child-therapy",
    title: "Child Therapy",
    image: "/home-service-images/child-therapy.png",
    icon: "/home-service-images/child-therapy-icon.png",
    iconVariant: "primary",
    shortDescription: "Developmentally appropriate therapy helping children navigate emotional and behavioral challenges",
    heroTitle: "Child Therapy",
    heroDescription:
      "Specialized, child-centered therapeutic techniques help children navigate emotional challenges, develop healthy coping skills, and thrive — with parent-guided intervention at every step.",
    description: {
      introduction: {
        title: "What Is Child Therapy?",
        description:
          "Child therapy at CMHCB is a developmentally sensitive approach to supporting children's emotional health and psychological well-being. Our therapists work with children aged 4–17, using age-appropriate techniques such as play therapy and CBT for children, to help them express and process emotional difficulties in a safe, nurturing environment.",
      },
      sections: [
        {
          title: "Who Is It For?",
          items: [
            "Children experiencing anxiety, fears, or excessive worry",
            "Behavioural difficulties and emotional outbursts",
            "School-related stress and academic struggles",
            "ADHD, learning difficulties, and developmental delays",
            "Childhood trauma, grief, or family changes",
          ],
        },
        {
          title: "Our Therapeutic Approach",
          items: [
            "Play, art, and narrative therapy techniques",
            "Strength-based, culturally sensitive interventions",
            "Regular parent consultations to reinforce progress",
            "Collaboration with schools and educators when needed",
            "Warm, child-friendly therapeutic environment",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is child therapy?",
        answer:
          "Child therapy is a professional, developmentally appropriate approach to supporting children's emotional health using age-suitable techniques such as play therapy, art therapy, and child-adapted CBT in a safe environment.",
      },
      {
        question: "What age group is child therapy for?",
        answer:
          "CMHCB's child therapy services are designed for children aged 4–17. Our therapists adapt their methods to suit the developmental stage of each child.",
      },
      {
        question: "Do parents attend sessions with the child?",
        answer:
          "In most cases children are seen individually, but parent guidance sessions are held every 4–6 weeks. Family sessions may also be arranged when clinically appropriate.",
      },
      {
        question: "How long is each session?",
        answer:
          "Child therapy sessions at CMHCB are 90 minutes, providing adequate time for the child to engage, process, and wind down from therapeutic activities.",
      },
      {
        question: "How will I know if my child needs therapy?",
        answer:
          "Signs may include persistent emotional distress, behavioural changes, social withdrawal, declining school performance, trauma responses, or difficulty managing emotions. A professional consultation can help clarify whether therapy is appropriate.",
      },
      {
        question: "Is child therapy confidential?",
        answer:
          "Yes, sessions are confidential. Parents are informed of the general progress and direction of therapy, but specific disclosures are kept private unless there is a safety concern.",
      },
      {
        question: "How do I book a session for my child?",
        answer:
          "Contact us to schedule an initial consultation where we will assess your child's needs and recommend an appropriate therapeutic plan.",
      },
    ],
    features: [
      "Emotional development support",
      "Parent-guided intervention",
    ],
    duration: "90 mins",
    fees: "1,500 BDT",
    variant: "secondary",
  },
  {
    slug: "family-therapy",
    title: "Family Therapy",
    image: "/home-service-images/family-therapy.png",
    icon: "/home-service-images/family-therapy-icon.png",
    iconVariant: "accent",
    shortDescription: "Collaborative counseling to resolve conflicts, improve communication, and strengthen family dynamics",
    heroTitle: "Family Therapy",
    heroDescription:
      "We help families strengthen communication, resolve conflicts, and understand the dynamics that shape their relationships — creating a foundation for healthier, more connected family life.",
    description: {
      introduction: {
        title: "What Is Family Therapy?",
        description:
          "Family therapy is a form of psychotherapy that works with families as a whole to nurture change and development. At CMHCB, our therapists help family members improve communication, understand each other's perspectives, and resolve conflicts that may be creating tension or disconnection within the household.",
      },
      sections: [
        {
          title: "Who Is It For?",
          items: [
            "Families with persistent conflict or communication breakdown",
            "Households affected by a member's mental health challenges",
            "Families adjusting to major life changes or loss",
            "Blended families and co-parenting difficulties",
            "Children and parents experiencing relationship strain",
          ],
        },
        {
          title: "Our Therapeutic Approach",
          items: [
            "Systemic and structural family therapy frameworks",
            "Guided communication and active listening exercises",
            "Flexible formats — full family or sub-group sessions",
            "Between-session tasks to reinforce new skills at home",
            "Confidential and culturally informed practice",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is family therapy?",
        answer:
          "Family therapy is a type of psychotherapy where a therapist works with family members together to address communication issues, resolve conflicts, and strengthen family relationships.",
      },
      {
        question: "Who attends family therapy sessions?",
        answer:
          "Ideally, all immediate family members attend, but sessions can also involve sub-groups (e.g., parents only, or parent and child). The therapist will advise on the most beneficial format for your situation.",
      },
      {
        question: "How long is each session?",
        answer:
          "Family therapy sessions are 90 minutes to allow sufficient time for all members to participate meaningfully.",
      },
      {
        question: "Can family therapy help after a major crisis?",
        answer:
          "Yes. Family therapy is particularly effective following events such as bereavement, divorce, a mental health diagnosis within the family, or significant life transitions that have disrupted family dynamics.",
      },
      {
        question: "How many sessions are typically needed?",
        answer:
          "This varies by family. Some families find 8–12 sessions sufficient, while others benefit from longer engagement. Your therapist will review progress regularly and adjust the plan accordingly.",
      },
      {
        question: "Is everything discussed in family therapy confidential?",
        answer:
          "Yes. Family therapy is conducted under strict confidentiality guidelines. Information is only shared outside the session with the family's consent, or if required for safety reasons.",
      },
    ],
    features: [
      "Conflict resolution support",
      "Identify family dynamics",
    ],
    duration: "90 mins",
    fees: "3,000 BDT",
    variant: "secondary",
  },
  {
    slug: "couple-therapy",
    title: "Couple Therapy",
    image: "/home-service-images/couple-therapy.png",
    icon: "/home-service-images/couple-therapy-icon.png",
    iconVariant: "primary",
    shortDescription: "Guided support for partners to rebuild trust, enhance intimacy, and resolve relationship issues",
    heroTitle: "Couple Therapy",
    heroDescription:
      "Whether navigating conflict or deepening connection, our couple therapy sessions provide a structured environment to improve communication, rebuild trust, and strengthen emotional bonds.",
    description: {
      introduction: {
        title: "What Is Couple Therapy?",
        description:
          "Couple therapy at CMHCB is a professionally guided process that helps partners understand and resolve interpersonal difficulties. Using evidence-based methods such as the Gottman Method and Emotionally Focused Therapy (EFT), our therapists support couples in breaking negative cycles, rebuilding trust, and cultivating a secure, fulfilling relationship.",
      },
      sections: [
        {
          title: "Who Is It For?",
          items: [
            "Couples experiencing frequent arguments or unresolved conflict",
            "Partners feeling emotionally distant or disconnected",
            "Relationships affected by trust issues or infidelity",
            "Couples navigating major life transitions together",
            "Partners wanting to deepen intimacy and connection",
          ],
        },
        {
          title: "Our Therapeutic Approach",
          items: [
            "Gottman Method and Emotionally Focused Therapy (EFT)",
            "Structured de-escalation and communication tools",
            "Both joint and individual sessions when needed",
            "Regular review of relationship goals and satisfaction",
            "Confidential, non-judgmental, and respectful practice",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is couple therapy?",
        answer:
          "Couple therapy is a professional, structured process in which partners work with a trained therapist to improve communication, resolve conflicts, rebuild trust, and strengthen their emotional connection.",
      },
      {
        question: "Do both partners need to attend?",
        answer:
          "Yes, couple therapy is most effective when both partners participate. However, individual sessions may be incorporated when additional one-on-one support is clinically beneficial.",
      },
      {
        question: "Is couple therapy only for couples in crisis?",
        answer:
          "No. Many couples seek therapy proactively to deepen their connection, improve communication, or navigate life transitions together. Therapy is valuable at any stage of a relationship.",
      },
      {
        question: "How long is each session?",
        answer:
          "Couple therapy sessions at CMHCB are 90 minutes, giving both partners ample time to be heard and to work through issues together.",
      },
      {
        question: "What therapeutic methods do you use?",
        answer:
          "Our couples therapists use evidence-based methods including the Gottman Method, Emotionally Focused Therapy (EFT), and solution-focused techniques tailored to each couple's specific needs.",
      },
      {
        question: "Is everything discussed kept confidential?",
        answer:
          "Yes. Sessions are strictly confidential. Nothing shared by either partner is disclosed outside of therapy without consent, except in situations required by law for safety.",
      },
      {
        question: "How do we book our first session?",
        answer:
          "You can book through our website or call our team. We will schedule an initial intake session where we will understand your relationship goals and begin building your therapy plan.",
      },
    ],
    features: [
      "Communication improvement",
      "Emotional connection building",
    ],
    duration: "90 mins",
    fees: "1,500 BDT",
    variant: "secondary",
  },
  {
    slug: "iq-test",
    title: "IQ Test",
    image: "/home-service-images/iq-test.png",
    icon: "/home-service-images/iq-test-icon.png",
    iconVariant: "accent",
    shortDescription: "Standardized cognitive testing to evaluate reasoning, memory, problem-solving, and general intelligence",
    heroTitle: "IQ & Cognitive Assessment",
    heroDescription:
      "Our standardized intelligence assessments measure cognitive abilities across key domains, providing a professionally interpreted report that informs educational, clinical, and developmental decisions.",
    description: {
      introduction: {
        title: "What Is an IQ & Cognitive Assessment?",
        description:
          "An IQ and cognitive assessment is a comprehensive evaluation of intellectual functioning — measuring abilities such as reasoning, problem-solving, verbal comprehension, processing speed, and working memory. At CMHCB, we use internationally standardized instruments to produce a detailed, professionally interpreted report for individuals, parents, educators, and clinicians.",
      },
      sections: [
        {
          title: "Who Should Get Tested?",
          items: [
            "Children with suspected learning difficulties or giftedness",
            "Students applying for academic accommodations",
            "Adults seeking clarity about cognitive strengths and limitations",
            "Individuals referred by clinicians for diagnostic support",
            "Organizations conducting cognitive screening for specific roles",
          ],
        },
        {
          title: "Our Assessment Approach",
          items: [
            "Internationally validated IQ and cognitive instruments",
            "Administered by trained and certified psychologists",
            "Full-scale IQ score with detailed subscale breakdowns",
            "Written report with professional interpretation",
            "Debrief session to discuss results and recommendations",
          ],
        },
      ],
    },
    faq: [
      {
        question: "What is an IQ test?",
        answer:
          "An IQ test is a standardized assessment that measures intellectual functioning across domains such as verbal comprehension, visual-spatial processing, working memory, and processing speed, resulting in a full-scale IQ score.",
      },
      {
        question: "Who should take an IQ test?",
        answer:
          "IQ testing is appropriate for children with suspected giftedness or learning difficulties, students seeking academic accommodations, adults seeking cognitive self-understanding, and individuals referred by clinicians for diagnostic purposes.",
      },
      {
        question: "How is the test administered?",
        answer:
          "The assessment is conducted in person by a trained and certified psychologist using internationally validated instruments in a comfortable, distraction-free environment.",
      },
      {
        question: "How long does an IQ assessment take?",
        answer:
          "A full IQ and cognitive assessment at CMHCB takes approximately 90 minutes, including the test administration and a brief debrief.",
      },
      {
        question: "What will I receive after the assessment?",
        answer:
          "You will receive a written report with your full-scale IQ score, subscale breakdowns, a professional interpretation of your cognitive profile, and actionable recommendations for education, therapy, or career planning.",
      },
      {
        question: "Is the assessment suitable for children?",
        answer:
          "Yes. We offer age-normed cognitive assessments for children and adolescents, using instruments specifically validated for different age groups.",
      },
      {
        question: "How do I book an IQ assessment?",
        answer:
          "Book online through our website or contact our team directly. We will confirm your appointment and provide preparation instructions before your assessment date.",
      },
    ],
    features: [
      "Standardized intelligence testing",
      "Professional interpretation report",
    ],
    duration: "90 mins",
    fees: "3,000 BDT",
    variant: "secondary",
  },
];
