export type FaqCategory = "Services" | "Payment" | "Privacy Policy" | "Appointments";

export interface CategorizedFaq {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const CATEGORIZED_FAQS: CategorizedFaq[] = [
  {
    id: "faq-1",
    category: "Services",
    question: "What types of therapy do you offer?",
    answer: "We offer a wide range of psychological services including individual therapy, couples counselling, family therapy, child and adolescent therapy, as well as specialized group therapy sessions.",
  },
  {
    id: "faq-2",
    category: "Services",
    question: "Do you offer online or remote counselling?",
    answer: "Yes, we provide secure and confidential telehealth counselling sessions for clients who prefer or require remote support.",
  },
  {
    id: "faq-3",
    category: "Payment",
    question: "What are your payment options?",
    answer: "We accept all major credit and debit cards, bKash, Nagad, and bank transfers. Payment is typically collected before the start of the session.",
  },
  {
    id: "faq-4",
    category: "Payment",
    question: "Do you offer sliding scale fees?",
    answer: "Yes, we believe mental health care should be accessible. We offer a limited number of sliding scale spots based on financial need. Please contact our administrative team to learn more.",
  },
  {
    id: "faq-5",
    category: "Privacy Policy",
    question: "Is my information kept confidential?",
    answer: "Absolutely. We strictly adhere to privacy regulations and ethical guidelines. Your personal information and session details are strictly confidential unless there is a risk of harm to yourself or others.",
  },
  {
    id: "faq-6",
    category: "Privacy Policy",
    question: "How is my data protected?",
    answer: "All client records and data are stored securely using encrypted, HIPAA-compliant systems to ensure your privacy is fully protected at all times.",
  },
  {
    id: "faq-7",
    category: "Appointments",
    question: "How do I book an appointment?",
    answer: "You can book an appointment by calling our hotline, using the 'Book Appointment' button on our website, or by visiting our clinic in person.",
  },
  {
    id: "faq-8",
    category: "Appointments",
    question: "What is your cancellation policy?",
    answer: "We require at least 24 hours notice for any cancellations or rescheduling. Cancellations made with less than 24 hours notice may be subject to a cancellation fee.",
  },
];

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Services",
  "Appointments",
  "Payment",
  "Privacy Policy",
];
