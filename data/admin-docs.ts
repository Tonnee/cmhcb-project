import type { AdminDocItem } from "@/types/admin-docs";

export const STATIC_CONTENT_GENERIC_NOTICE = {
  title: "Static System Content — No Admin Panel Option",
  message:
    "This section or element is hardcoded directly in the website source code and does not have an admin dashboard editor. Modifying the text, structure, or media of static components requires a code modification by the engineering/development team.",
  actionGuide:
    "To update static content, please contact the development team with the specific text and image assets required, or submit a technical change request referencing the file location provided below.",
};

export const ADMIN_DOCS_ITEMS: AdminDocItem[] = [
  // ---------------------------------------------------------------------------
  // 1. Landing Page Sections (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "landing-hero",
    title: "Homepage Hero Banner & Visuals",
    category: "landing",
    isEditable: true,
    livePage: { name: "Homepage (Top Banner)", url: "/" },
    adminPath: "/admin/landing-page",
    summary:
      "Controls the primary introductory headline, subtitle paragraph, background banner wallpaper, and the floating hero character illustration.",
    fields: [
      "Hero Headline (supports HTML highlight tags)",
      "Hero Subtitle (descriptive introduction text)",
      "Background Banner Image",
      "Hero Figure Illustration (transparent PNG)",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 800 px (Background) / 800 x 950 px (Figure)",
      aspectRatio: "16:9 or 21:9 for Background, Transparent 4:5 for Figure",
      format: "PNG (with transparency for figure), WebP or JPG for Background",
      maxFileSize: "< 2 MB per image",
      notes: "Ensure the figure has a cleanly cut transparent alpha channel background.",
    },
    steps: [
      "Open the Admin Sidebar and click on 'Landing Page'.",
      "In the 'Hero Section' card, update the Hero Headline and Subtitle text.",
      "To change the background image, click 'Change Background' and select your image file.",
      "To update the floating portrait figure, click 'Change Figure' and upload a transparent PNG.",
      "Click 'Save Changes' at the bottom right. The live homepage updates immediately.",
    ],
    proTips: [
      'Wrap key words in <span class="text-accent">Word</span> to highlight them in warm gold.',
      'Wrap key words in <span class="text-primary">Word</span> to highlight them in dark green.',
    ],
    previewImage: "/hero-image/hero-bg.png",
    imageCaption: "Homepage Hero Section: background wallpaper and foreground counselor artwork.",
  },
  {
    id: "landing-section-headings",
    title: "Homepage Section Headings & Subtitles",
    category: "landing",
    isEditable: true,
    livePage: { name: "Homepage Sections", url: "/" },
    adminPath: "/admin/landing-page",
    summary:
      "Configure the section headings, badges/subtitles, and calendar descriptions across the Homepage for Services, Therapists, Upcoming Events, and Guide sections.",
    fields: [
      "Services Section: Title & Subtitle Badge",
      "Therapists Section: Title & Subtitle Badge",
      "Upcoming Events Section: Title, Subtitle Badge & Annual Event Calendar Paragraph",
      "Guide Section: Title & Subtitle Badge",
    ],
    steps: [
      "Navigate to Admin Dashboard > 'Landing Page'.",
      "Scroll to the 'Homepage Section Headings' card.",
      "Customize the titles, badges, and the annual calendar narrative for upcoming events.",
      "Click 'Save Changes' to update the homepage section headings instantly.",
    ],
    proTips: [
      "You can enter HTML in titles (e.g., using <span class='text-primary-dark'>word</span>) to emphasize branded accent words.",
    ],
    previewImage: "/understanding-anxiety-workshop-event.png",
    imageCaption: "Homepage section headings customized dynamically via the admin panel.",
  },
  {
    id: "landing-about-teaser",
    title: "Homepage 'About' Mission Statement with Inline Badges",
    category: "landing",
    adminPath: "/admin/landing-page",
    isEditable: true,
    livePage: { name: "Homepage (About Teaser)", url: "/#about" },
    summary:
      "The mission sentence on the homepage: 'We connect licensed therapists [therapist], mental health programs [brain], and personalized care [heart] services...'.",
    fields: [
      "Mission statement text with inline badge token placeholders ([therapist], [brain], [heart], [client], [chart])",
      "Therapist portrait badge avatar upload",
      "Client portrait badge avatar upload",
    ],
    steps: [
      "Navigate to Admin Portal > 'Landing Page'.",
      "Scroll to the 'About Mission Statement & Badges' section right below the Hero Banner.",
      "Edit the statement or insert badge tokens ([therapist], [brain], [heart], [client], [chart]) using the quick badge pills.",
      "Upload new square avatars for the therapist or client badges if desired.",
      "Click 'Save Changes' at the top or bottom of the form.",
    ],
    codeLocation: "features/home/components/about.tsx",
    previewImage: "/home-about-image/licensed-mental-health-therapist.png",
    imageCaption: "Homepage inline badges highlighting therapists, programs, and care icons.",
  },
  {
    id: "landing-wellbeing",
    title: "Well-Being Commitment & Impact Statistics",
    category: "landing",
    isEditable: true,
    livePage: { name: "Homepage (Well-Being Section)", url: "/#well-being" },
    adminPath: "/admin/landing-page",
    summary:
      "Manages the 'Our Commitment to Your Well-Being' headline, supporting summary, and the 4 live animated impact counters.",
    fields: [
      "Well-Being Headline",
      "Well-Being Subtitle",
      "Years of Experience Count (e.g., 20+)",
      "Happy Clients Count (e.g., 1500+)",
      "Sessions Completed Count (e.g., 2800+)",
      "Satisfaction Rate Percentage (e.g., 94%)",
      "Optional Feature Banner Image",
    ],
    steps: [
      "Navigate to Admin Dashboard > 'Landing Page'.",
      "Scroll to the 'Well-Being & Impact Counters' panel.",
      "Adjust the headline, narrative paragraph, and numeric values for each metric.",
      "Click 'Save Changes'. The numbers will automatically count up on the live homepage.",
    ],
    proTips: [
      "Only enter numeric digits for the counters (e.g., 20, 1500). The '+' and '%' symbols are formatted automatically.",
    ],
    previewImage: "/home-service-images/well-being-bg.png",
    imageCaption: "Well-Being Section: Mission statement and four key performance statistics.",
  },
  {
    id: "landing-guide",
    title: "Homepage 'Guide' Section (Pathway Toward Well-Being)",
    category: "landing",
    isEditable: true,
    livePage: { name: "Homepage (Middle Section)", url: "/#guide" },
    adminPath: "/admin/landing-page",
    summary:
      "The 'Guiding You Toward Mental Well-Being' feature section on the homepage containing counseling highlights, customizable section title, subtitle badge, and appointment booking CTA.",
    fields: [
      "Guide Section Title",
      "Guide Section Subtitle Badge",
      "Counselor desk visual artwork",
      "Direct 'Book Appointment' link",
    ],
    steps: [
      "Open Admin Dashboard > 'Landing Page'.",
      "Locate the 'Homepage Section Headings' card and find the Guide Section inputs.",
      "Update the section title or badge to match current campaign messaging.",
      "Click 'Save Changes' to update the live homepage.",
    ],
    previewImage: "/compassionate-mental-health-professional.png",
    imageCaption: "Homepage Guide Section highlighting therapeutic guidance and appointment access.",
  },
  {
    id: "landing-training-cta",
    title: "Homepage Training Program CTA Banner",
    category: "landing",
    isEditable: true,
    livePage: { name: "Homepage (Training Call-to-Action)", url: "/#training" },
    adminPath: "/admin/landing-page",
    summary:
      "The dedicated promotional banner on the homepage that encourages users to explore and enroll in CMHCB mental health training workshops.",
    fields: [
      "Training CTA Headline",
      "Training CTA Subtitle",
      "Featured Training Program Graphic",
    ],
    imageSpecs: {
      recommendedDimensions: "800 x 600 px",
      aspectRatio: "4:3 or 16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 1.5 MB",
      notes: "Use high-clarity photographs of real workshops or graphic illustrations.",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Landing Page'.",
      "Locate the 'Training CTA Section' block.",
      "Update the headline, subtitle, or upload a new promotional program banner image.",
      "Click 'Save Changes' to update the live banner.",
    ],
    previewImage: "/mental-health-training-program.png",
    imageCaption: "Training CTA section featuring highlighted program information and an action button.",
  },
  {
    id: "landing-footer",
    title: "Footer Contact Details & Social Media Links",
    category: "landing",
    isEditable: true,
    livePage: { name: "Global Footer (All Pages)", url: "/#footer" },
    adminPath: "/admin/landing-page",
    summary:
      "Configures the official phone number, support email, 3-line office address, and social media channels displayed across the global footer.",
    fields: [
      "Support Hotline Phone (e.g., +880 1974-349569)",
      "Primary Inquiries Email (e.g., info@cmhcbd.com)",
      "Office Address Line 1, Line 2, Line 3",
      "Social Media Profiles: Facebook, Instagram, Twitter/X, LinkedIn, YouTube, WhatsApp",
      "Enable / Disable toggle for each social channel",
    ],
    steps: [
      "Go to Admin Dashboard > 'Landing Page'.",
      "Scroll down to 'Footer Contact Information & Social Channels'.",
      "Enter the updated telephone number, official email address, and office street lines.",
      "Paste full HTTPS URLs for active social media profiles, and toggle on/off as needed.",
      "Click 'Save Changes' to update the global site footer immediately.",
    ],
    proTips: [
      "Always include the country code '+880' for the phone number so international visitors can call directly.",
    ],
    previewImage: "/hero-image/contact-us-banner.png",
    imageCaption: "Global Footer displaying office address, contact links, and social channel icons.",
  },

  // ---------------------------------------------------------------------------
  // 2. Services Management (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "services-management",
    title: "Clinical Services Directory & Details",
    category: "services",
    isEditable: true,
    livePage: { name: "Services Catalog (/services)", url: "/services" },
    adminPath: "/admin/services",
    summary:
      "Manage all psychotherapy and psychological counseling service offerings, detail pages, icons, pricing, FAQs, and informational highlight blocks.",
    fields: [
      "Service Title & Unique Slug (e.g., individual-psychotherapy)",
      "Vector Icon Identifier (e.g., HiHeart, HiUserGroup)",
      "Short Description (shown on cards) & Detailed Long Description",
      "Clinical Therapeutic Approach (e.g., CBT, DBT, Humanistic)",
      "Duration (e.g., 50 Minutes) & Session Fees (e.g., BDT 2,500)",
      "Target Audience ('Who Is It For?')",
      "Delivery Format (In-person / Online) & Consultation Languages",
      "Featured on Homepage Toggle & Show in Navigation Menu Toggle",
      "Hero Banner Image & Service Info Blocks",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 800 px (Detail Page Cover)",
      aspectRatio: "3:2 or 16:9",
      format: "WebP or JPG",
      maxFileSize: "< 2 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Services'.",
      "To edit an existing service, click the 'Edit' pencil icon next to the service item.",
      "To create a new service, click the '+ Add New Service' button at the top.",
      "Fill in the Title, Slug, Descriptions, Session Details, and upload the service hero image.",
      "Configure Service Info Blocks (bullet lists and callouts) if needed.",
      "Click 'Save Service' to publish.",
    ],
    proTips: [
      "Slugs must be lower-case with hyphens only (e.g., child-adolescent-therapy).",
      "Use 'Show in Navbar' to control whether the service appears in the top navigation dropdown.",
    ],
    previewImage: "/mental-health-services-bangladesh.jpg",
    imageCaption: "Services page showcasing psychotherapy specialties and consultation offerings.",
  },
  {
    id: "page-services",
    title: "Services Catalog Page Header & Section Title",
    category: "pages",
    isEditable: true,
    livePage: { name: "Services Catalog (/services)", url: "/services" },
    adminPath: "/admin/pages/services",
    summary:
      "Customize the primary hero banner, title, subtitle description, hero background photo, and the catalog section title on the main Services page.",
    fields: [
      "Hero Section Title & Hero Description",
      "Hero Background Image Upload",
      "Catalog Section Title (e.g. 'All Services')",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px",
      aspectRatio: "16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'Services'.",
      "Update the Hero Title, Hero Description, or Catalog Section Heading.",
      "Upload a new high-resolution hero background image if needed.",
      "Click 'Save Services Page Content'.",
    ],
    previewImage: "/mental-health-services-bangladesh.jpg",
    imageCaption: "Services page hero banner and dynamic catalog section heading.",
  },

  // ---------------------------------------------------------------------------
  // 3. Training Programs (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "trainings-management",
    title: "Professional Trainings & Course Syllabi",
    category: "trainings",
    isEditable: true,
    livePage: { name: "Trainings (/training)", url: "/training" },
    adminPath: "/admin/trainings",
    summary:
      "Manage professional mental health certification courses, training curricula, syllabus sections, fees, duration, and assigned instructor profiles.",
    fields: [
      "Course Title & Unique Slug",
      "Hero Title & Overview Description",
      "Syllabus Modules (Title & Curriculum Topics)",
      "Frequently Asked Questions (Q&A Accordions)",
      "Course Highlights & Key Features List",
      "Duration, Course Fees, Training Format & Language",
      "Assigned Lead Trainers / Instructors",
      "Cover Banner Image",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 700 px",
      aspectRatio: "16:9 or 16:10",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 2 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Trainings'.",
      "Click '+ Create New Training' or select 'Edit' on an existing course.",
      "Define the Course Title, Slug, Introduction, and Duration/Fee specifications.",
      "Add syllabus breakdown sections with bulleted topic modules.",
      "Upload the promotional cover banner.",
      "Click 'Save Training' to update the live catalog.",
    ],
    previewImage: "/training_hero.png",
    imageCaption: "Training course page with syllabus modules, trainer bios, and registration links.",
  },
  {
    id: "page-training",
    title: "Trainings Catalog Page Header & Section Title",
    category: "pages",
    isEditable: true,
    livePage: { name: "Trainings (/training)", url: "/training" },
    adminPath: "/admin/pages/training",
    summary:
      "Configure the main Training catalog hero banner, overview description, background artwork, and the catalog section title.",
    fields: [
      "Hero Section Title & Hero Description",
      "Hero Background Image Upload",
      "Catalog Section Title (e.g. 'All Training Programs')",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px",
      aspectRatio: "16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Other Pages' > 'Training'.",
      "Adjust the training overview text and the catalog section title.",
      "Upload a new hero background photo.",
      "Click 'Save Training Page Content'.",
    ],
    previewImage: "/training_hero.png",
    imageCaption: "Main trainings catalog header and section heading editor.",
  },

  // ---------------------------------------------------------------------------
  // 4. Therapists Directory (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "therapists-directory",
    title: "Therapists & Counselors Directory",
    category: "therapists",
    isEditable: true,
    livePage: { name: "Therapists Team (/therapists)", url: "/therapists" },
    adminPath: "/admin/therapists",
    summary:
      "Add, edit, or reorder mental health practitioners, clinical psychologists, counselors, their credentials, fees, and appointment availability.",
    fields: [
      "Therapist Full Name & Professional Role / Designation",
      "Profile Portrait Photograph",
      "Comprehensive Biography & Clinical Philosophy",
      "Academic Education & Degrees (e.g., M.Sc in Clinical Psychology)",
      "Specialized Clinical Training & Certifications",
      "Areas of Expertise (e.g., Anxiety, Depression, Trauma)",
      "Years of Experience & Consultation Fees",
      "Assigned Services & Display Sorting Order",
      "Frequently Asked Questions (FAQs) Builder (surfaces on therapist profile & under 'Therapist' tab on /faqs)",
    ],
    imageSpecs: {
      recommendedDimensions: "800 x 1000 px",
      aspectRatio: "4:5 portrait orientation",
      format: "PNG or WebP",
      maxFileSize: "< 1.5 MB",
      notes: "Professional studio headshot with balanced lighting and neutral background.",
    },
    steps: [
      "Open Admin Dashboard > 'Therapists'.",
      "Click '+ Add New Therapist' or click 'Edit' on an existing profile.",
      "Upload the portrait photo, enter full name, and clinical credentials.",
      "Specify consultation fees and tags for areas of clinical focus.",
      "Add custom Q&A items in the Frequently Asked Questions (FAQ) builder to surface on the therapist profile and under the 'Therapist' tab on /faqs.",
      "Set the display order integer (0 displays first) to control catalog sorting.",
      "Click 'Save Therapist' to update the public directory.",
    ],
    previewImage: "/experienced-mental-health-therapists.png",
    imageCaption: "Therapists directory displaying practitioner credentials and booking links.",
  },

  // ---------------------------------------------------------------------------
  // 5. Events & Workshops (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "events-workshops",
    title: "Workshops, Seminars & Community Events",
    category: "events",
    isEditable: true,
    livePage: { name: "Events & Workshops (/events-workshops)", url: "/events-workshops" },
    adminPath: "/admin/events-workshops",
    summary:
      "Publish upcoming psychoeducation seminars, interactive workshops, date/time, venue details, speaker credentials, and review user registrations.",
    fields: [
      "Event Title & Slug",
      "Event Date, Schedule Time & Venue Location",
      "Lead Speaker / Author Name",
      "Comprehensive Event Description & Agenda",
      "Event Tags (e.g., Stress, Parenting, Mindfulness)",
      "Featured / Latest Event Badge Toggles",
      "Event Cover Image & Photo Gallery",
      "Participant Registrations Submissions List",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 800 px",
      aspectRatio: "3:2 or 16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 2 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Events & Workshops'.",
      "Click '+ Create Workshop' or edit an existing item.",
      "Enter the Date, Time, Location, Speaker, and detailed agenda.",
      "Upload the event promotional image and any gallery photos.",
      "Switch on 'Featured' to display this event on the homepage.",
      "Click 'Publish Workshop'.",
    ],
    previewImage: "/understanding-anxiety-workshop-event.png",
    imageCaption: "Workshop detail page displaying event time, location, speaker, and sign-up form.",
  },

  // ---------------------------------------------------------------------------
  // 6. Blog Articles (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "blogs-management",
    title: "Mental Health Blog & Psychoeducation Articles",
    category: "blogs",
    isEditable: true,
    livePage: { name: "Mental Health Blog (/blog)", url: "/blog" },
    adminPath: "/admin/blogs",
    summary:
      "Create and edit educational articles, wellness tips, psychological research summaries, cover photos, author credits, and search tags.",
    fields: [
      "Article Title & URL Slug",
      "Short Excerpt (displayed in article feeds)",
      "Full Article Content (rich formatting and paragraphs)",
      "Cover Feature Photograph",
      "Publication Date & Author Byline",
      "Category Tags & Featured Article Toggle",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 700 px",
      aspectRatio: "16:9",
      format: "WebP or JPG",
      maxFileSize: "< 1.5 MB",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Blogs'.",
      "Click '+ Write New Article' to create a post, or 'Edit' on an existing article.",
      "Compose the Title, Excerpt, and formatted Article Body.",
      "Upload the cover photograph and add relevant tags.",
      "Click 'Publish Article' to make it live on the blog.",
    ],
    previewImage: "/mental-health-services-bangladesh.jpg",
    imageCaption: "Blog article displaying title, author byline, featured photo, and reading content.",
  },

  // ---------------------------------------------------------------------------
  // 7. Appointments & Training Inquiries (Editable/Interactive)
  // ---------------------------------------------------------------------------
  {
    id: "appointments-manager",
    title: "Client Appointment Bookings Management",
    category: "appointments",
    isEditable: true,
    livePage: { name: "Appointment Booking Form (/appointment)", url: "/appointment" },
    adminPath: "/admin/appointments",
    summary:
      "Review client therapy booking inquiries, view contact details, preferred consultation medium (Online vs In-person), and update booking status.",
    fields: [
      "Client Full Name, Age, Gender, Contact Phone & Email",
      "Selected Service & Preferred Therapist",
      "Requested Date & Time Slot",
      "Consultation Medium (Online or In-Person)",
      "Client Confidential Notes / Symptoms",
      "Booking Status: PENDING, APPROVED, CANCELLED, COMPLETED",
    ],
    steps: [
      "Go to Admin Dashboard > 'Appointments'.",
      "Use the status filters to view 'Pending' bookings.",
      "Click on an appointment record to inspect client contact details and requested service.",
      "Select 'Approved' or 'Completed' from the status dropdown to update the record.",
    ],
    previewImage: "/hero-image/psychotherapy-counseling-session.png",
    imageCaption: "Admin appointments portal with filterable status tabs and patient intake cards.",
  },
  {
    id: "training-requests-manager",
    title: "Training Course Applications & Trainee Intake",
    category: "trainings",
    isEditable: true,
    livePage: { name: "Training Applications", url: "/training" },
    adminPath: "/admin/training-requests",
    summary:
      "Track, approve, or update trainee applications submitted across all professional mental health certification courses.",
    fields: [
      "Applicant Name, Phone Number & Email",
      "Selected Training Program Course",
      "Educational Background & Profession",
      "Application Status (PENDING, APPROVED, REJECTED, CANCELLED)",
      "Submission Timestamp & Internal Notes",
    ],
    steps: [
      "Navigate to Admin Dashboard > 'Training Requests'.",
      "Filter requests by course or status.",
      "Click to expand an application to examine professional credentials.",
      "Update status to 'Approved' upon verifying tuition payment or enrollment eligibility.",
    ],
    previewImage: "/training_hero.png",
    imageCaption: "Admin training requests workspace with status toggles and applicant profiles.",
  },

  // ---------------------------------------------------------------------------
  // 8. Other Static Pages Content (Editable via Admin)
  // ---------------------------------------------------------------------------
  {
    id: "page-about",
    title: "About Us Page (Mission, Vision, Values & Feature Photos)",
    category: "pages",
    isEditable: true,
    livePage: { name: "About Us (/about)", url: "/about" },
    adminPath: "/admin/pages/about",
    summary:
      "Full administrator control over the About Us page: Hero banner, Mission statement & dedicated photo, Vision statement & dedicated photo, and Core Values heading, subtitle, description, and list.",
    fields: [
      "About Hero Title, Description & Hero Background Image",
      "Mission & Vision Section: Title & Subtitle Badge",
      "Mission Statement: Title, Narrative Text & Dedicated Mission Photo upload",
      "Vision Statement: Title, Narrative Text & Dedicated Vision Photo upload",
      "Core Values Section: Heading, Subtitle Badge & Detailed Description",
      "Core Values List: Individual Value Title, Description, and Icon",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 800 px (Hero), 800 x 600 px (Mission & Vision Photos)",
      aspectRatio: "16:9 for Hero, 4:3 for Mission and Vision",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Open Admin Dashboard > 'Other Pages' > 'About Us'.",
      "Update the Hero overview, Mission & Vision titles, and narratives.",
      "Upload customized feature photos for both Mission and Vision cards.",
      "Configure Core Values heading, description, or individual value items.",
      "Click 'Save Changes' to update the `/about` webpage immediately.",
    ],
    previewImage: "/hero-image/about-counseling-professionals.png",
    imageCaption: "About Us page displaying institutional mission, vision, photos, and core values.",
  },
  {
    id: "page-success-stories",
    title: "Success Stories & Client Testimonials",
    category: "pages",
    isEditable: true,
    livePage: { name: "Success Stories (/success-stories)", url: "/success-stories" },
    adminPath: "/admin/pages/success-stories",
    summary:
      "Manage client feedback, heartfelt recovery stories, avatar photos, client roles, section heading and subtitle, and toggle which testimonials are featured on the homepage.",
    fields: [
      "Hero Title, Hero Description & Hero Background Image",
      "Section Heading (e.g. 'Transformative Journeys') & Section Subtitle (e.g. 'Real Stories')",
      "Client Name / Anonymous Alias",
      "Role / Profession / Demographic Tag",
      "Client Avatar Photograph",
      "Testimonial Quote / Review Text",
      "Featured on Homepage Carousel Toggle",
    ],
    imageSpecs: {
      recommendedDimensions: "200 x 200 px (Avatar Square), 1920 x 1080 px (Hero)",
      aspectRatio: "1:1 for Avatars, 16:9 for Hero",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 2 MB",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Other Pages' > 'Success Stories'.",
      "Customize the Hero Banner and the Section Heading & Subtitle.",
      "Click '+ Add Testimonial' or edit an existing review.",
      "Enter client name, quote, and upload a square avatar photograph.",
      "Toggle 'Featured' on if you want it to appear in the homepage review carousel.",
      "Click 'Save Changes'.",
    ],
    previewImage: "/home-service-images/well-being-bg.png",
    imageCaption: "Client testimonials carousel displaying quotes, client names, and photos.",
  },
  {
    id: "page-support",
    title: "Crisis Support & Emergency Helpline Contacts",
    category: "pages",
    isEditable: true,
    livePage: { name: "Support & Crisis Lines (/support)", url: "/support" },
    adminPath: "/admin/pages/support",
    summary:
      "Manage emergency crisis phone lines, active operational hours, section heading/subtitle, primary crisis badges, and the official critical emergency disclaimer advisory.",
    fields: [
      "Support Page Hero Title, Description & Hero Background Image",
      "Helpline Section: Heading (e.g. 'Emergency Helplines') & Subtitle (e.g. 'Immediate Assistance')",
      "Emergency Advisory Disclaimer Text (e.g., National Hotline 999 notice)",
      "Helpline Contacts: Title, Phone Number, Operating Hours, Description, Icon",
      "Primary Status Toggle (highlights card with special alert border)",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px",
      aspectRatio: "16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'Support'.",
      "Adjust the Hero banner and the Helpline Section Title / Subtitle.",
      "Update the critical helpline contact numbers, icons, and operating schedules.",
      "Ensure the mandatory Emergency Hotline disclaimer text is accurate.",
      "Click 'Save Support Page'.",
    ],
    previewImage: "/hero-image/group-therapy-support-circle.png",
    imageCaption: "Crisis support directory with quick dial buttons and emergency notice banner.",
  },
  {
    id: "page-affiliation",
    title: "Affiliation & Trusted Partners Network",
    category: "pages",
    isEditable: true,
    livePage: { name: "Affiliation Program (/affiliation)", url: "/affiliation" },
    adminPath: "/admin/pages/affiliation",
    summary:
      "Control the complete Affiliation page: Hero banner, Trusted Partners section (heading, subtitle, partner logos and links), Partnership Benefits (heading, subtitle, benefit items), and Partnership CTA banner.",
    fields: [
      "Hero Title, Description & Hero Background Image",
      "Partners Network: Section Heading & Subtitle Badge",
      "Partner Organizations List: Name, Organization Type, Abbreviation, Logo Image, Website URL",
      "Partnership Benefits: Section Heading & Subtitle Badge",
      "Benefit Items List: Title, Description, and Icon name",
      "Partnership Call-to-Action: Title, Description & Promises Checkmark list",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px (Hero), 200 x 200 px (Partner Logos)",
      aspectRatio: "16:9 for Hero, 1:1 for Logos",
      format: "PNG (transparent for logos), WebP, or JPG",
      maxFileSize: "< 5 MB for Hero, < 1 MB for Logos",
    },
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'Affiliation'.",
      "Customize the Hero banner and both section headings (Partners & Benefits).",
      "Add or update partner organizations with their logos and website links.",
      "Edit the benefits of joining the CMHCB partner network.",
      "Click 'Save Affiliation Page Content'.",
    ],
    previewImage: "/hero-image/psychotherapy-counseling-session.png",
    imageCaption: "Affiliation page showing partner network logos and collaboration benefits.",
  },
  {
    id: "page-contact",
    title: "Contact Us Page & Direct Inquiries",
    category: "pages",
    isEditable: true,
    livePage: { name: "Contact Us (/contact)", url: "/contact" },
    adminPath: "/admin/pages/contact",
    summary:
      "Manage contact coordinates, Google Maps interactive location embed, support phone numbers, email addresses, 3-line office address, and the 'Get in Touch' section title and narrative.",
    fields: [
      "Hero Title, Description, Background Image & Image Alt text",
      "'Get in Touch' Section: Section Heading & Introductory Description",
      "Primary Phone Number & Inquiries Email Address",
      "Physical Office Address Line 1, Line 2, and Line 3",
      "Google Maps iframe embed URL",
      "Social Media URLs: Facebook, Instagram, Twitter/X, LinkedIn",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px",
      aspectRatio: "16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Open Admin Dashboard > 'Other Pages' > 'Contact'.",
      "Update Hero banner details and the 'Get in Touch' section heading and text.",
      "Enter new phone, email, street address lines, or Google Maps embed link.",
      "Click 'Save Changes' to update `/contact` immediately.",
    ],
    previewImage: "/hero-image/contact-us-banner.png",
    imageCaption: "Contact page displaying direct inquiries, interactive map, and office address.",
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions (FAQ) Management",
    category: "pages",
    isEditable: true,
    livePage: { name: "FAQs (/faqs)", url: "/faqs" },
    adminPath: "/admin/pages/faq",
    summary:
      "Update the FAQ page hero banner, FAQ section heading, subtitle badge, intro description paragraph, and add/edit/reorder categorized question and answer accordions.",
    fields: [
      "FAQ Page Hero Title, Description & Hero Background Image",
      "FAQ Section: Heading, Subtitle Badge & Introductory Description",
      "FAQ Items List: Category (Services, Trainings, Therapist, Others)",
      "Question String & Comprehensive Answer Body",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px",
      aspectRatio: "16:9",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'FAQ'.",
      "Edit the hero heading, FAQ section title, subtitle, or intro description.",
      "Click '+ Add FAQ Item' to append a new question and answer.",
      "Select the category tab, enter the question, and provide the clear clinical answer.",
      "Click 'Save Changes' to update the live FAQ accordions.",
    ],
    previewImage: "/understanding-anxiety-workshop-event.png",
    imageCaption: "FAQ page featuring categorized accordions for therapy inquiries and policies.",
  },
  {
    id: "page-community-service",
    title: "Community Service & Social Outreach Policy",
    category: "pages",
    isEditable: true,
    livePage: { name: "Community Service (/legal/community-service)", url: "/legal/community-service" },
    adminPath: "/admin/pages/community-service",
    summary:
      "Full administrative control over the Community Service & Outreach page: Hero banner, Workshop/Seminar feature image, Introduction block, Impact statistics, Outreach program pillars (heading, badge, description, and cards), Eligibility criteria, Guidelines, and Session Request CTA.",
    fields: [
      "Hero Title, Subtitle, Description & Hero Background Image upload",
      "Introduction Block: Heading, Paragraph 1, Paragraph 2 & Workshop Feature Image upload",
      "Outreach Statistics: Impact counters (value, title, description)",
      "Program Pillars: Section Heading, Badge, Description & Individual Pillar cards (badge, title, description, icon)",
      "Eligibility & Verification: Title, Description & Criteria list",
      "Operational Guidelines: Title, Description & Guidelines list",
      "Outreach Request CTA: Title, Description & Coordinator contact email",
    ],
    imageSpecs: {
      recommendedDimensions: "1920 x 1080 px (Hero), 800 x 600 px (Workshop/Seminar Feature Image)",
      aspectRatio: "16:9 for Hero, 4:3 for Workshop Image",
      format: "PNG, WebP, or JPG",
      maxFileSize: "< 5 MB",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Other Pages' > 'Community Service'.",
      "Upload high-resolution images for both the Hero Background and the Workshop Feature Image.",
      "Customize the Introduction block, Impact Statistics, and Outreach Program Pillars heading and description.",
      "Add or adjust individual program pillars, eligibility criteria, or operational guidelines.",
      "Click 'Save Community Service Page Content' to publish updates.",
    ],
    previewImage: "/hero-image/community-service-outreach.png",
    imageCaption: "Community Service and outreach policy page with workshop photos and program pillars.",
  },
  {
    id: "page-gallery",
    title: "Media Gallery (Photos & Event Recordings)",
    category: "pages",
    isEditable: true,
    livePage: { name: "Media Gallery (/gallery)", url: "/gallery" },
    adminPath: "/admin/pages/gallery",
    summary:
      "Upload photographs, workshop event moments, counseling center photos, and video links categorized by events, activities, and special occasions.",
    fields: [
      "Media Type (Photo or Video URL)",
      "Image File Upload or Video Stream URL",
      "Descriptive Alt Text & Display Caption",
      "Category Tag (Event, Workshop, Activity, Occasion)",
    ],
    imageSpecs: {
      recommendedDimensions: "1200 x 900 px",
      aspectRatio: "4:3 or 16:9",
      format: "JPG or WebP",
      maxFileSize: "< 3 MB",
    },
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'Gallery'.",
      "Click '+ Upload Media'.",
      "Select the image or enter a video embed link, provide a descriptive caption, and pick a category.",
      "Click 'Upload to Gallery'.",
    ],
    previewImage: "/hero-image/psychotherapy-counseling-session.png",
    imageCaption: "Interactive media gallery displaying event photographs and workshop highlights.",
  },

  // ---------------------------------------------------------------------------
  // 9. Admin Access & User Management (Editable)
  // ---------------------------------------------------------------------------
  {
    id: "admins-management",
    title: "Admin Users, Roles & Security Whitelist",
    category: "admins",
    isEditable: true,
    livePage: { name: "Admin Portal", url: "/admin" },
    adminPath: "/admin/admins",
    summary:
      "Manage authorized administrator accounts, assign roles (Super Admin vs Admin), view recent administrative activity logs, and review the security email whitelist.",
    fields: [
      "Admin Name & Email Address",
      "Assigned Role (admin or super_admin)",
      "Security Whitelist Enforcement (`admin@cmhcb.org`, `satonnee@gmail.com`)",
      "Audit Activity Logs (recorded user, action, target entity, timestamp)",
      "Password reset and profile credentials update",
    ],
    steps: [
      "Go to Admin Dashboard > 'Admins'.",
      "View the list of active administrator profiles.",
      "To add a new admin, click '+ Add Admin' (must be authorized on the security whitelist).",
      "Inspect recent activity logs to audit changes made across the portal.",
    ],
    previewImage: "/cmhcb-mental-health-care.png",
    imageCaption: "Admin management console with role-based access control and security audit logs.",
  },

  // ---------------------------------------------------------------------------
  // 10. Static & Code-Only Content (Non-Editable in Dashboard)
  // ---------------------------------------------------------------------------
  {
    id: "static-header-nav",
    title: "Main Header Navbar & CMHCB Logo Branding",
    category: "static",
    isEditable: false,
    livePage: { name: "Site-Wide Header (All Pages)", url: "/" },
    summary:
      "The persistent top navigation bar featuring the CMHC,B logo, navigation dropdowns (About, Services, Therapists, Training, Blog, Contact), and emergency helpline trigger.",
    fields: [
      "CMHCB Logo Vector Asset (/cmhcb-mental-health-care.png)",
      "Navigation Menu Links & Routing Structure",
      "Emergency Call Button Link & Floating Modals",
    ],
    steps: [
      "The top navigation structure and logo branding are programmed into `components/layout/header/`.",
      "To add or rename navigation tabs, contact the development team.",
    ],
    codeLocation: "components/layout/header/",
    staticNotice:
      "STATIC SYSTEM CONTENT: Header links, branding logos, and navigation hierarchy are defined in `components/layout/header/` and require engineering deployment to alter.",
    previewImage: "/cmhcb-mental-health-care.png",
    imageCaption: "Site-wide navigation header containing institutional logo and menu items.",
  },
  {
    id: "static-footer-copyright",
    title: "Footer Legal Copyright Notice & Layout Grid",
    category: "static",
    isEditable: false,
    livePage: { name: "Global Footer (Bottom Notice)", url: "/#footer" },
    summary:
      "The layout grid, column arrangement, and '© 2026 Center for Mental Health and Care, Bangladesh. All rights reserved.' copyright line.",
    fields: [
      "Copyright statement and year indicator",
      "Institutional layout column structure",
      "Static quick navigation link groupings",
    ],
    steps: [
      "Note: You CAN edit the footer phone, email, address, and social links in Admin > Landing Page.",
      "However, the bottom copyright text and layout grid are hardcoded in `components/layout/footer/`.",
    ],
    codeLocation: "components/layout/footer/",
    staticNotice:
      "STATIC SYSTEM CONTENT: The copyright disclaimer and structural grid are located in `components/layout/footer/`. Contact developers to adjust legal copyright statements.",
    previewImage: "/cmhcb-mental-health-care-bw.png",
    imageCaption: "Footer copyright bar and institutional site-map grid.",
  },
  {
    id: "static-auth-pages",
    title: "Authentication, Login & Security Flows",
    category: "static",
    isEditable: false,
    livePage: { name: "Admin Login (/login)", url: "/login" },
    summary:
      "The administrator login screen, password reset requesting, CSRF protection, and Supabase auth token validation.",
    fields: [
      "Login form inputs (Email, Password, Remember Me)",
      "Forgot Password and Token Reset forms",
      "Security rate-limiting and session inactivity handlers",
    ],
    steps: [
      "Authentication screens and security workflows are hardcoded in `app/login/` and `app/auth/`.",
      "Admin credentials and passwords can be updated inside Admin Dashboard > Admins.",
    ],
    codeLocation: "app/login/ & app/auth/",
    staticNotice:
      "STATIC SYSTEM CONTENT: Authentication forms and security mechanisms are hardcoded for security compliance in `app/login/`.",
    previewImage: "/cmhcb-mental-health-care.png",
    imageCaption: "Secure administrator authentication and session login interface.",
  },
  {
    id: "static-error-pages",
    title: "404 Not Found & Error Fallback Screens",
    category: "static",
    isEditable: false,
    livePage: { name: "Page Not Found (/404)", url: "/not-found" },
    summary:
      "The custom 404 'Page Not Found' screen and server error boundary illustrations that guide lost visitors back to safety.",
    fields: [
      "404 Error illustration and heading",
      "Helpful suggestions and 'Return to Home' button",
      "Application Error Boundary (`app/error.tsx`)",
    ],
    steps: [
      "404 and Error templates are system components stored in `app/not-found.tsx` and `app/error.tsx`.",
      "Modifications to error phrasing require code updates.",
    ],
    codeLocation: "app/not-found.tsx & app/error.tsx",
    staticNotice:
      "STATIC SYSTEM CONTENT: Error boundaries and 404 fallbacks are maintained directly in Next.js route handlers `app/not-found.tsx`.",
    previewImage: "/cmhcb-mental-health-care.png",
    imageCaption: "System 404 Not Found and server error recovery templates.",
  },
];
