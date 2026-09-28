export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "date"
  | "radio"
  | "checkbox";

export interface FormFieldConfig {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  isSystemField?: boolean;
  enabled: boolean;
  helpText?: string;
  order?: number;
}

export const FORM_FIELD_TYPES: { value: FormFieldType; label: string; description: string }[] = [
  { value: "text", label: "Single-line Text", description: "Standard text input (e.g., Name, Occupation)" },
  { value: "number", label: "Numeric Input", description: "Number with stepper (e.g., Age, Experience)" },
  { value: "email", label: "Email Address", description: "Validated email input with formatting" },
  { value: "tel", label: "Phone / Contact", description: "Telephone or mobile number" },
  { value: "textarea", label: "Multi-line Text Area", description: "Larger text block for notes, history, or queries" },
  { value: "select", label: "Dropdown Select", description: "Dropdown menu with customizable options" },
  { value: "date", label: "Date Picker", description: "Calendar date selector" },
  { value: "radio", label: "Radio Choice Group", description: "Single-select choice pills or circles" },
  { value: "checkbox", label: "Checkbox (Yes / No)", description: "Binary consent or affirmation checkbox" },
];

export const DEFAULT_APPOINTMENT_FORM_FIELDS: FormFieldConfig[] = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "Client legal or preferred name for intake records.",
    order: 0,
  },
  {
    id: "age",
    label: "Age",
    type: "number",
    placeholder: "e.g. 28",
    required: true,
    isSystemField: true,
    enabled: true,
    order: 1,
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select Gender",
    required: true,
    options: ["Female", "Male", "Other", "Prefer not to say"],
    isSystemField: true,
    enabled: true,
    order: 2,
  },
  {
    id: "contact",
    label: "Contact Details (Phone / Email)",
    type: "text",
    placeholder: "e.g. +880 1700-000000 or client@email.com",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "Our coordinator will reach out to this contact to confirm your booking.",
    order: 3,
  },
  {
    id: "service",
    label: "Preferred Clinical Service",
    type: "select",
    placeholder: "Choose a service",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "Select which therapy or counseling service you need.",
    order: 4,
  },
  {
    id: "therapist",
    label: "Preferred Therapist",
    type: "select",
    placeholder: "Select a therapist",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "You may choose a specific therapist or any available practitioner.",
    order: 5,
  },
  {
    id: "date",
    label: "Preferred Date",
    type: "date",
    placeholder: "Pick a date",
    required: true,
    isSystemField: true,
    enabled: true,
    order: 6,
  },
  {
    id: "time",
    label: "Preferred Time Slot",
    type: "select",
    placeholder: "Select a time slot",
    required: true,
    options: [
      "Morning (10:00 AM - 01:00 PM)",
      "Afternoon (02:00 PM - 05:00 PM)",
      "Evening (06:00 PM - 09:00 PM)",
    ],
    isSystemField: true,
    enabled: true,
    order: 7,
  },
  {
    id: "preference",
    label: "Consultation Medium",
    type: "radio",
    required: true,
    options: ["in-person", "online"],
    defaultValue: "in-person",
    isSystemField: true,
    enabled: true,
    helpText: "In-person sessions take place at our Dhanmondi center.",
    order: 8,
  },
  {
    id: "message",
    label: "Reason for Visit / Symptoms Note",
    type: "textarea",
    placeholder: "Briefly describe the challenges or symptoms you wish to discuss...",
    required: false,
    isSystemField: true,
    enabled: true,
    helpText: "This information remains strictly confidential between you and your clinician.",
    order: 9,
  },
];

export const DEFAULT_TRAINING_FORM_FIELDS: FormFieldConfig[] = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "This name will appear on your certificate of participation.",
    order: 0,
  },
  {
    id: "age",
    label: "Age",
    type: "number",
    placeholder: "e.g. 26",
    required: true,
    isSystemField: true,
    enabled: true,
    order: 1,
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select Gender",
    required: true,
    options: ["Female", "Male", "Other", "Prefer not to say"],
    isSystemField: true,
    enabled: true,
    order: 2,
  },
  {
    id: "contact",
    label: "Contact (Phone Number / Email)",
    type: "text",
    placeholder: "e.g. +880 1700-000000 or email@example.com",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "Cohort schedule, Zoom links, and invoices will be sent here.",
    order: 3,
  },
  {
    id: "training",
    label: "Selected Training Program",
    type: "select",
    placeholder: "Choose a training program",
    required: true,
    isSystemField: true,
    enabled: true,
    helpText: "Select the training cohort you wish to join.",
    order: 4,
  },
  {
    id: "preference",
    label: "Mode of Attendance",
    type: "radio",
    required: true,
    options: ["online", "in-person"],
    defaultValue: "online",
    isSystemField: true,
    enabled: true,
    order: 5,
  },
  {
    id: "message",
    label: "Educational Background / Specific Goals",
    type: "textarea",
    placeholder: "Mention your university, current occupation, or specific questions...",
    required: false,
    isSystemField: true,
    enabled: true,
    helpText: "Helps instructors tailor practical discussions to participant backgrounds.",
    order: 6,
  },
];
