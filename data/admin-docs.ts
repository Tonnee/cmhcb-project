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
      "Wrap key words in <span class=\"text-accent\">Word</span> to highlight them in warm gold.",
      "Wrap key words in <span class=\"text-primary\">Word</span> to highlight them in dark green.",
    ],
    previewImage: "/hero-image/hero-bg.png",
    imageCaption: "Homepage Hero Section: background wallpaper and foreground counselor artwork.",
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
  // 7. Appointments & Inquiries (Editable/Interactive)
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

  // ---------------------------------------------------------------------------
  // 8. Other Static Pages Content (Editable via Admin)
  // ---------------------------------------------------------------------------
  {
    id: "page-about",
    title: "About Us Page (Mission, Vision & Core Values)",
    category: "pages",
    isEditable: true,
    livePage: { name: "About Us (/about)", url: "/about" },
    adminPath: "/admin/pages/about",
    summary:
      "Customizes the dedicated About Us page hero title, institutional narrative, Mission statement, Vision statement, and the 3 core values.",
    fields: [
      "About Hero Title & Hero Description",
      "About Hero Photograph",
      "Mission Statement Title & Body",
      "Vision Statement Title & Body",
      "Core Values List (Title, Description, and Icon)",
    ],
    imageSpecs: {
      recommendedDimensions: "1000 x 750 px",
      aspectRatio: "4:3 or 3:2",
      format: "PNG or WebP",
      maxFileSize: "< 2 MB",
    },
    steps: [
      "Open Admin Dashboard > 'Other Pages' > 'About Us'.",
      "Update the Hero description, Mission text, and Vision paragraphs.",
      "Modify core values or replace the banner image.",
      "Click 'Save Changes' to update the `/about` webpage.",
    ],
    previewImage: "/hero-image/about-counseling-professionals.png",
    imageCaption: "About Us page displaying institutional mission, vision, and core values.",
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions (FAQ) Management",
    category: "pages",
    isEditable: true,
    livePage: { name: "FAQs (/faqs)", url: "/faqs" },
    adminPath: "/admin/pages/faq",
    summary:
      "Update the FAQ page header banner, introductory text, and add/edit/reorder categorized question and answer accordions.",
    fields: [
      "FAQ Page Hero Title & Subtitle",
      "Hero Banner Image",
      "FAQ Items List: Category (General, Therapy, Fees, Privacy)",
      "Question String & Comprehensive Answer Body",
    ],
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'FAQ'.",
      "Edit the hero heading or click '+ Add FAQ Item'.",
      "Select the category, enter the question, and provide the clear clinical answer.",
      "Click 'Save Changes' to update the live FAQ accordions.",
    ],
    previewImage: "/understanding-anxiety-workshop-event.png",
    imageCaption: "FAQ page featuring categorized accordions for therapy inquiries and policies.",
  },
  {
    id: "page-success-stories",
    title: "Success Stories & Client Testimonials",
    category: "pages",
    isEditable: true,
    livePage: { name: "Success Stories (/success-stories)", url: "/success-stories" },
    adminPath: "/admin/pages/success-stories",
    summary:
      "Manage client feedback, heartfelt recovery stories, avatar photos, client roles, and toggle which testimonials are featured on the homepage.",
    fields: [
      "Client Name / Anonymous Alias",
      "Role / Profession / Demographic Tag",
      "Client Avatar Photograph",
      "Testimonial Quote / Review Text",
      "Featured on Homepage Carousel Toggle",
    ],
    imageSpecs: {
      recommendedDimensions: "200 x 200 px (Square)",
      aspectRatio: "1:1",
      format: "PNG or WebP",
      maxFileSize: "< 500 KB",
    },
    steps: [
      "Navigate to Admin Dashboard > 'Other Pages' > 'Success Stories'.",
      "Click '+ Add Testimonial' or edit an existing review.",
      "Enter client name, quote, and upload a square avatar photograph.",
      "Toggle 'Featured' on if you want it to appear in the homepage review carousel.",
      "Click 'Save Testimonial'.",
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
      "Manage emergency crisis phone lines, active operational hours, primary crisis badges, and the official critical emergency disclaimer advisory.",
    fields: [
      "Support Page Hero Title & Description",
      "Emergency Advisory Disclaimer Text (e.g., National Hotline 999)",
      "Helpline Contacts: Title, Phone Number, Operating Hours, Description",
      "Primary Status Toggle (highlights in bold green)",
    ],
    steps: [
      "Go to Admin Dashboard > 'Other Pages' > 'Support'.",
      "Update the critical helpline contact numbers and operating schedules.",
      "Ensure the mandatory Emergency Hotline disclaimer text is accurate.",
      "Click 'Save Support Page'.",
    ],
    previewImage: "/hero-image/group-therapy-support-circle.png",
    imageCaption: "Crisis support directory with quick dial buttons and emergency notice banner.",
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
  // 9. Static & Code-Only Content (Non-Editable in Dashboard)
  // ---------------------------------------------------------------------------
  {
    id: "static-guide",
    title: "Homepage 'Guide' Section (Guiding You Toward Well-Being)",
    category: "static",
    isEditable: false,
    livePage: { name: "Homepage (Middle Section)", url: "/#guide" },
    summary:
      "The 'Guiding You Toward Mental Well-Being' feature section on the homepage containing the counselor portrait photo and the 'Book Appointment' button.",
    fields: [
      "Section Title: 'Guiding You Toward Mental Well-Being'",
      "Descriptive narrative paragraph",
      "Counselor desk photograph (/compassionate-mental-health-professional.png)",
      "'Book Appointment' direct link button",
    ],
    steps: [
      "Notice: This is a static component hardcoded into the frontend codebase.",
      "There is no form in the Admin Portal to edit this section.",
      "To update the wording, button link, or photograph, submit a technical request to the developer team.",
    ],
    codeLocation: "features/home/components/guide.tsx",
    staticNotice:
      "STATIC SYSTEM CONTENT: This section is hardcoded in `features/home/components/guide.tsx`. It does not have an admin dashboard input form. To update, developers must edit the file directly in the codebase.",
    previewImage: "/compassionate-mental-health-professional.png",
    imageCaption: "Static Guide Section: Counselor portrait and fixed introductory message.",
  },
  {
    id: "static-about-teaser",
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
      "Navigate to Admin Portal > Landing Page.",
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
