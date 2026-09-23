"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiGlobeAlt, HiInboxStack, HiArrowsUpDown, HiShare, HiPhone, HiEnvelope, HiMapPin, HiChatBubbleBottomCenterText, HiCheck, HiCalendarDays } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { uploadImageToSupabase } from "@/lib/supabase";
import { updateLandingPageContentAction } from "@/app/(admin)/admin/actions";
import { DEFAULT_FOOTER_SOCIALS, type FooterSocialItem } from "@/data/footer";

const SOCIAL_PLATFORM_ICONS: Record<string, React.JSX.Element> = {
  facebook: <FaFacebookF className="w-4 h-4" />,
  instagram: <FaInstagram className="w-4 h-4" />,
  twitter: <FaXTwitter className="w-4 h-4" />,
  linkedin: <FaLinkedinIn className="w-4 h-4" />,
  youtube: <FaYoutube className="w-4 h-4" />,
  whatsapp: <FaWhatsapp className="w-4 h-4" />,
};

interface LandingPageContentDB {
  id: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroFigureImage: string;
  wellbeingHeadline: string;
  wellbeingSubtitle: string;
  wellbeingImage?: string | null;
  experienceCount: number;
  stat1Suffix?: string | null;
  stat1Title?: string | null;
  stat1Description?: string | null;
  happyClientsCount: number;
  stat2Suffix?: string | null;
  stat2Title?: string | null;
  stat2Description?: string | null;
  sessionsCount: number;
  stat3Suffix?: string | null;
  stat3Title?: string | null;
  stat3Description?: string | null;
  satisfactionRate: number;
  stat4Suffix?: string | null;
  stat4Title?: string | null;
  stat4Description?: string | null;
  trainingHeadline: string;
  trainingSubtitle: string;
  trainingImage: string;
  trainingItem1Title?: string | null;
  trainingItem1Description?: string | null;
  trainingItem2Title?: string | null;
  trainingItem2Description?: string | null;
  trainingItem3Title?: string | null;
  trainingItem3Description?: string | null;
  trainingItem4Title?: string | null;
  trainingItem4Description?: string | null;
  appointmentHeadline?: string | null;
  appointmentSubtitle?: string | null;
  appointmentButtonText?: string | null;
  appointmentButtonLink?: string | null;
  eventsBottomText?: string | null;
  eventsButtonText?: string | null;
  eventsButtonLink?: string | null;
  reviewCard1Title?: string | null;
  reviewCard1Description?: string | null;
  reviewCard2Title?: string | null;
  reviewCard2Description?: string | null;
  reviewPhoto1Image?: string | null;
  reviewPhoto1Alt?: string | null;
  reviewPhoto2Image?: string | null;
  reviewPhoto2Alt?: string | null;
  footerSocials?: string | null;
  footerPhone?: string | null;
  footerEmail?: string | null;
  footerAddressLine1?: string | null;
  footerAddressLine2?: string | null;
  footerAddressLine3?: string | null;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditLandingPageFormProps {
  initialContent: LandingPageContentDB;
}

export default function EditLandingPageForm({
  initialContent,
}: EditLandingPageFormProps): React.JSX.Element {
  const router = useRouter();
  
  // State variables for form fields
  const [heroHeadline, setHeroHeadline] = React.useState(initialContent.heroHeadline);
  const [heroSubtitle, setHeroSubtitle] = React.useState(initialContent.heroSubtitle);
  const [heroBgImage, setHeroBgImage] = React.useState(initialContent.heroBgImage);
  const [bgPreviewUrl, setBgPreviewUrl] = React.useState(initialContent.heroBgImage);
  const [pendingBgFile, setPendingBgFile] = React.useState<File | null>(null);

  const [heroFigureImage, setHeroFigureImage] = React.useState(initialContent.heroFigureImage);
  const [figurePreviewUrl, setFigurePreviewUrl] = React.useState(initialContent.heroFigureImage);
  const [pendingFigureFile, setPendingFigureFile] = React.useState<File | null>(null);
  
  const [wellbeingHeadline, setWellbeingHeadline] = React.useState(initialContent.wellbeingHeadline);
  const [wellbeingSubtitle, setWellbeingSubtitle] = React.useState(initialContent.wellbeingSubtitle);
  const [wellbeingImage, setWellbeingImage] = React.useState(initialContent.wellbeingImage || "");
  const [wellbeingPreviewUrl, setWellbeingPreviewUrl] = React.useState(initialContent.wellbeingImage || "");
  const [pendingWellbeingFile, setPendingWellbeingFile] = React.useState<File | null>(null);
  
  const defaultStatValues = {
    stat1Title: "Years of Experience",
    stat1Suffix: "+",
    stat1Description: "Helping individuals navigate life's",
    stat2Title: "Happy Clients",
    stat2Suffix: "+",
    stat2Description: "Empowered through counseling and therapy",
    stat3Title: "Sessions Conducted",
    stat3Suffix: "+",
    stat3Description: "Providing guidance and support every day",
    stat4Title: "Satisfaction Positive",
    stat4Suffix: "%",
    stat4Description: "outcomes and improved well-being",
  };

  const [experienceCount, setExperienceCount] = React.useState(initialContent.experienceCount);
  const [stat1Title, setStat1Title] = React.useState(initialContent.stat1Title ?? defaultStatValues.stat1Title);
  const [stat1Suffix, setStat1Suffix] = React.useState(initialContent.stat1Suffix ?? defaultStatValues.stat1Suffix);
  const [stat1Description, setStat1Description] = React.useState(initialContent.stat1Description ?? defaultStatValues.stat1Description);

  const [happyClientsCount, setHappyClientsCount] = React.useState(initialContent.happyClientsCount);
  const [stat2Title, setStat2Title] = React.useState(initialContent.stat2Title ?? defaultStatValues.stat2Title);
  const [stat2Suffix, setStat2Suffix] = React.useState(initialContent.stat2Suffix ?? defaultStatValues.stat2Suffix);
  const [stat2Description, setStat2Description] = React.useState(initialContent.stat2Description ?? defaultStatValues.stat2Description);

  const [sessionsCount, setSessionsCount] = React.useState(initialContent.sessionsCount);
  const [stat3Title, setStat3Title] = React.useState(initialContent.stat3Title ?? defaultStatValues.stat3Title);
  const [stat3Suffix, setStat3Suffix] = React.useState(initialContent.stat3Suffix ?? defaultStatValues.stat3Suffix);
  const [stat3Description, setStat3Description] = React.useState(initialContent.stat3Description ?? defaultStatValues.stat3Description);

  const [satisfactionRate, setSatisfactionRate] = React.useState(initialContent.satisfactionRate);
  const [stat4Title, setStat4Title] = React.useState(initialContent.stat4Title ?? defaultStatValues.stat4Title);
  const [stat4Suffix, setStat4Suffix] = React.useState(initialContent.stat4Suffix ?? defaultStatValues.stat4Suffix);
  const [stat4Description, setStat4Description] = React.useState(initialContent.stat4Description ?? defaultStatValues.stat4Description);

  const [trainingHeadline, setTrainingHeadline] = React.useState(initialContent.trainingHeadline);
  const [trainingSubtitle, setTrainingSubtitle] = React.useState(initialContent.trainingSubtitle);
  const [trainingImage, setTrainingImage] = React.useState(initialContent.trainingImage);
  const [trainingPreviewUrl, setTrainingPreviewUrl] = React.useState(initialContent.trainingImage);
  const [pendingTrainingFile, setPendingTrainingFile] = React.useState<File | null>(null);

  const defaultTrainingItemValues = {
    item1Title: "Basic Counseling Skills Training",
    item1Description: "Learn foundational techniques for effective, empathetic, and ethical communication in mental health settings.",
    item2Title: "Child & Adolescent Mental Health",
    item2Description: "Understand psychological development, behavior management, and therapeutic strategies for young individuals.",
    item3Title: "Trauma-Informed Care",
    item3Description: "Equip yourself with the knowledge and tools to support individuals dealing with trauma and PTSD.",
  };

  const [trainingItem1Title, setTrainingItem1Title] = React.useState(initialContent.trainingItem1Title ?? defaultTrainingItemValues.item1Title);
  const [trainingItem1Description, setTrainingItem1Description] = React.useState(initialContent.trainingItem1Description ?? defaultTrainingItemValues.item1Description);

  const [trainingItem2Title, setTrainingItem2Title] = React.useState(initialContent.trainingItem2Title ?? defaultTrainingItemValues.item2Title);
  const [trainingItem2Description, setTrainingItem2Description] = React.useState(initialContent.trainingItem2Description ?? defaultTrainingItemValues.item2Description);

  const [trainingItem3Title, setTrainingItem3Title] = React.useState(initialContent.trainingItem3Title ?? defaultTrainingItemValues.item3Title);
  const [trainingItem3Description, setTrainingItem3Description] = React.useState(initialContent.trainingItem3Description ?? defaultTrainingItemValues.item3Description);

  const [trainingItem4Title, setTrainingItem4Title] = React.useState(initialContent.trainingItem4Title ?? "");
  const [trainingItem4Description, setTrainingItem4Description] = React.useState(initialContent.trainingItem4Description ?? "");

  const defaultAppointmentValues = {
    headline: "Take The Next Step - Schedule Your <span class=\"text-white\">Appointment</span>",
    subtitle: "Your path to healing, growth, and inner peace starts with a single step. Whether you are navigating life's transitions, seeking emotional support, or striving for balance, our compassionate professionals are here to walk with you in a safe, supportive space.",
    buttonText: "Book an Appointment",
    buttonLink: "/appointment",
  };

  const [appointmentHeadline, setAppointmentHeadline] = React.useState(initialContent.appointmentHeadline ?? defaultAppointmentValues.headline);
  const [appointmentSubtitle, setAppointmentSubtitle] = React.useState(initialContent.appointmentSubtitle ?? defaultAppointmentValues.subtitle);
  const [appointmentButtonText, setAppointmentButtonText] = React.useState(initialContent.appointmentButtonText ?? defaultAppointmentValues.buttonText);
  const [appointmentButtonLink, setAppointmentButtonLink] = React.useState(initialContent.appointmentButtonLink ?? defaultAppointmentValues.buttonLink);

  const defaultEventsValues = {
    bottomText: "Stay informed and engaged with CMHC,B's year-round programs, workshops, and awareness events. Our annual event calendar highlights key training sessions, mental health awareness days, and community initiatives designed to educate, support, and empower individuals across all age groups.",
    buttonText: "Explore all Events & Workshops",
    buttonLink: "/events-workshops",
  };

  const [eventsBottomText, setEventsBottomText] = React.useState(initialContent.eventsBottomText ?? defaultEventsValues.bottomText);
  const [eventsButtonText, setEventsButtonText] = React.useState(initialContent.eventsButtonText ?? defaultEventsValues.buttonText);
  const [eventsButtonLink, setEventsButtonLink] = React.useState(initialContent.eventsButtonLink ?? defaultEventsValues.buttonLink);

  // State variables for Review Highlights 2x2 section
  const defaultReviewValues = {
    card1Title: "Real Experiences, Real Impact",
    card1Description: "Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B.",
    card2Title: "Voices That Inspire Hope",
    card2Description: "Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B.",
    photo1Image: "/home-review/bangladeshi-woman-mental-health-therapy-client.png",
    photo1Alt: "Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB",
    photo2Image: "/home-review/bangladeshi-man-mental-health-therapy-client.png",
    photo2Alt: "Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB",
  };

  const [reviewCard1Title, setReviewCard1Title] = React.useState(initialContent.reviewCard1Title ?? defaultReviewValues.card1Title);
  const [reviewCard1Description, setReviewCard1Description] = React.useState(initialContent.reviewCard1Description ?? defaultReviewValues.card1Description);
  const [reviewCard2Title, setReviewCard2Title] = React.useState(initialContent.reviewCard2Title ?? defaultReviewValues.card2Title);
  const [reviewCard2Description, setReviewCard2Description] = React.useState(initialContent.reviewCard2Description ?? defaultReviewValues.card2Description);

  const [reviewPhoto1Image, setReviewPhoto1Image] = React.useState(initialContent.reviewPhoto1Image ?? defaultReviewValues.photo1Image);
  const [reviewPhoto1Alt, setReviewPhoto1Alt] = React.useState(initialContent.reviewPhoto1Alt ?? defaultReviewValues.photo1Alt);
  const [photo1PreviewUrl, setPhoto1PreviewUrl] = React.useState(initialContent.reviewPhoto1Image ?? defaultReviewValues.photo1Image);
  const [pendingPhoto1File, setPendingPhoto1File] = React.useState<File | null>(null);

  const [reviewPhoto2Image, setReviewPhoto2Image] = React.useState(initialContent.reviewPhoto2Image ?? defaultReviewValues.photo2Image);
  const [reviewPhoto2Alt, setReviewPhoto2Alt] = React.useState(initialContent.reviewPhoto2Alt ?? defaultReviewValues.photo2Alt);
  const [photo2PreviewUrl, setPhoto2PreviewUrl] = React.useState(initialContent.reviewPhoto2Image ?? defaultReviewValues.photo2Image);
  const [pendingPhoto2File, setPendingPhoto2File] = React.useState<File | null>(null);

  const [isUploadingPhoto1, setIsUploadingPhoto1] = React.useState(false);
  const [isUploadingPhoto2, setIsUploadingPhoto2] = React.useState(false);

  const handleUploadPhoto1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingPhoto1File(file);
    const localPreview = URL.createObjectURL(file);
    setPhoto1PreviewUrl(localPreview);

    setIsUploadingPhoto1(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setReviewPhoto1Image(publicUrl);
      setPhoto1PreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload Review Photo 1.");
    } finally {
      setIsUploadingPhoto1(false);
    }
  };

  const handleUploadPhoto2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingPhoto2File(file);
    const localPreview = URL.createObjectURL(file);
    setPhoto2PreviewUrl(localPreview);

    setIsUploadingPhoto2(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setReviewPhoto2Image(publicUrl);
      setPhoto2PreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload Review Photo 2.");
    } finally {
      setIsUploadingPhoto2(false);
    }
  };

  const handleResetReviewHighlights = () => {
    setReviewCard1Title(defaultReviewValues.card1Title);
    setReviewCard1Description(defaultReviewValues.card1Description);
    setReviewCard2Title(defaultReviewValues.card2Title);
    setReviewCard2Description(defaultReviewValues.card2Description);
    setReviewPhoto1Image(defaultReviewValues.photo1Image);
    setReviewPhoto1Alt(defaultReviewValues.photo1Alt);
    setPhoto1PreviewUrl(defaultReviewValues.photo1Image);
    setPendingPhoto1File(null);
    setReviewPhoto2Image(defaultReviewValues.photo2Image);
    setReviewPhoto2Alt(defaultReviewValues.photo2Alt);
    setPhoto2PreviewUrl(defaultReviewValues.photo2Image);
    setPendingPhoto2File(null);
  };

  // State variables for footer address, phone & email
  const [footerPhone, setFooterPhone] = React.useState(initialContent.footerPhone || "+8801974349569");
  const [footerEmail, setFooterEmail] = React.useState(initialContent.footerEmail || "info@cmhcbd.com");
  const [footerAddressLine1, setFooterAddressLine1] = React.useState(initialContent.footerAddressLine1 || "CMHC Office Room, 78/2 (2nd Floor)");
  const [footerAddressLine2, setFooterAddressLine2] = React.useState(initialContent.footerAddressLine2 || "New Airport Road, Tejkunipara");
  const [footerAddressLine3, setFooterAddressLine3] = React.useState(initialContent.footerAddressLine3 || "Tejgoan, Dhaka-1212");

  // State variables for footer socials
  const [footerSocials, setFooterSocials] = React.useState<FooterSocialItem[]>(() => {
    if (!initialContent.footerSocials) return DEFAULT_FOOTER_SOCIALS;
    try {
      const parsed = JSON.parse(initialContent.footerSocials);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingPlatforms = new Set(parsed.map((item: Partial<FooterSocialItem>) => item.platform?.toLowerCase()));
        const merged = [...parsed];
        for (const defaultItem of DEFAULT_FOOTER_SOCIALS) {
          if (!existingPlatforms.has(defaultItem.platform?.toLowerCase())) {
            merged.push(defaultItem);
          }
        }
        return merged;
      }
      return DEFAULT_FOOTER_SOCIALS;
    } catch {
      return DEFAULT_FOOTER_SOCIALS;
    }
  });

  const toggleSocialEnabled = (platform: string) => {
    setFooterSocials((prev) =>
      prev.map((item) =>
        item.platform === platform ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const updateSocialHref = (platform: string, href: string) => {
    setFooterSocials((prev) =>
      prev.map((item) =>
        item.platform === platform ? { ...item, href } : item
      )
    );
  };

  const handleToggleAllSocials = (enableAll: boolean) => {
    setFooterSocials((prev) =>
      prev.map((item) => ({ ...item, enabled: enableAll }))
    );
  };

  const handleResetSocials = () => {
    setFooterSocials(DEFAULT_FOOTER_SOCIALS);
  };

  // Status indicators
  const [isUploadingBg, setIsUploadingBg] = React.useState(false);
  const [isUploadingFigure, setIsUploadingFigure] = React.useState(false);
  const [isUploadingTraining, setIsUploadingTraining] = React.useState(false);
  const [isUploadingWellbeing, setIsUploadingWellbeing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // File Upload Handlers
  const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingBgFile(file);
    const localPreview = URL.createObjectURL(file);
    setBgPreviewUrl(localPreview);

    setIsUploadingBg(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroBgImage(publicUrl);
      setBgPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload hero background banner.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleUploadFigure = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFigureFile(file);
    const localPreview = URL.createObjectURL(file);
    setFigurePreviewUrl(localPreview);

    setIsUploadingFigure(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroFigureImage(publicUrl);
      setFigurePreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload hero figure illustration.");
    } finally {
      setIsUploadingFigure(false);
    }
  };

  const handleUploadWellbeing = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingWellbeingFile(file);
    const localPreview = URL.createObjectURL(file);
    setWellbeingPreviewUrl(localPreview);

    setIsUploadingWellbeing(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setWellbeingImage(publicUrl);
      setWellbeingPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload Well-Being image.");
    } finally {
      setIsUploadingWellbeing(false);
    }
  };

  const handleUploadTraining = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingTrainingFile(file);
    const localPreview = URL.createObjectURL(file);
    setTrainingPreviewUrl(localPreview);

    setIsUploadingTraining(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setTrainingImage(publicUrl);
      setTrainingPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload training display image.");
    } finally {
      setIsUploadingTraining(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalBg = heroBgImage;
      if (pendingBgFile && (!finalBg || finalBg.startsWith("blob:"))) {
        setIsUploadingBg(true);
        try {
          finalBg = await uploadImageToSupabase(pendingBgFile, "cmhcb-media");
          setHeroBgImage(finalBg);
          setBgPreviewUrl(finalBg);
        } catch {
          setError("Failed to upload hero background banner.");
          setIsSubmitting(false);
          setIsUploadingBg(false);
          return;
        } finally {
          setIsUploadingBg(false);
        }
      }

      let finalFigure = heroFigureImage;
      if (pendingFigureFile && (!finalFigure || finalFigure.startsWith("blob:"))) {
        setIsUploadingFigure(true);
        try {
          finalFigure = await uploadImageToSupabase(pendingFigureFile, "cmhcb-media");
          setHeroFigureImage(finalFigure);
          setFigurePreviewUrl(finalFigure);
        } catch {
          setError("Failed to upload hero figure image.");
          setIsSubmitting(false);
          setIsUploadingFigure(false);
          return;
        } finally {
          setIsUploadingFigure(false);
        }
      }

      let finalWellbeing = wellbeingImage;
      if (pendingWellbeingFile && (!finalWellbeing || finalWellbeing.startsWith("blob:"))) {
        setIsUploadingWellbeing(true);
        try {
          finalWellbeing = await uploadImageToSupabase(pendingWellbeingFile, "cmhcb-media");
          setWellbeingImage(finalWellbeing);
          setWellbeingPreviewUrl(finalWellbeing);
        } catch {
          setError("Failed to upload Well-Being image.");
          setIsSubmitting(false);
          setIsUploadingWellbeing(false);
          return;
        } finally {
          setIsUploadingWellbeing(false);
        }
      }

      let finalTraining = trainingImage;
      if (pendingTrainingFile && (!finalTraining || finalTraining.startsWith("blob:"))) {
        setIsUploadingTraining(true);
        try {
          finalTraining = await uploadImageToSupabase(pendingTrainingFile, "cmhcb-media");
          setTrainingImage(finalTraining);
          setTrainingPreviewUrl(finalTraining);
        } catch {
          setError("Failed to upload training image.");
          setIsSubmitting(false);
          setIsUploadingTraining(false);
          return;
        } finally {
          setIsUploadingTraining(false);
        }
      }

      let finalPhoto1 = reviewPhoto1Image;
      if (pendingPhoto1File && (!finalPhoto1 || finalPhoto1.startsWith("blob:"))) {
        setIsUploadingPhoto1(true);
        try {
          finalPhoto1 = await uploadImageToSupabase(pendingPhoto1File, "cmhcb-media");
          setReviewPhoto1Image(finalPhoto1);
          setPhoto1PreviewUrl(finalPhoto1);
        } catch {
          setError("Failed to upload Review Photo 1.");
          setIsSubmitting(false);
          setIsUploadingPhoto1(false);
          return;
        } finally {
          setIsUploadingPhoto1(false);
        }
      }

      let finalPhoto2 = reviewPhoto2Image;
      if (pendingPhoto2File && (!finalPhoto2 || finalPhoto2.startsWith("blob:"))) {
        setIsUploadingPhoto2(true);
        try {
          finalPhoto2 = await uploadImageToSupabase(pendingPhoto2File, "cmhcb-media");
          setReviewPhoto2Image(finalPhoto2);
          setPhoto2PreviewUrl(finalPhoto2);
        } catch {
          setError("Failed to upload Review Photo 2.");
          setIsSubmitting(false);
          setIsUploadingPhoto2(false);
          return;
        } finally {
          setIsUploadingPhoto2(false);
        }
      }

      const res = await updateLandingPageContentAction({
        heroHeadline,
        heroSubtitle,
        heroBgImage: finalBg,
        heroFigureImage: finalFigure,
        wellbeingHeadline,
        wellbeingSubtitle,
        wellbeingImage: finalWellbeing || null,
        experienceCount: Number(experienceCount),
        stat1Suffix,
        stat1Title,
        stat1Description,
        happyClientsCount: Number(happyClientsCount),
        stat2Suffix,
        stat2Title,
        stat2Description,
        sessionsCount: Number(sessionsCount),
        stat3Suffix,
        stat3Title,
        stat3Description,
        satisfactionRate: Number(satisfactionRate),
        stat4Suffix,
        stat4Title,
        stat4Description,
        trainingHeadline,
        trainingSubtitle,
        trainingImage: finalTraining,
        trainingItem1Title,
        trainingItem1Description,
        trainingItem2Title,
        trainingItem2Description,
        trainingItem3Title,
        trainingItem3Description,
        trainingItem4Title: trainingItem4Title || null,
        trainingItem4Description: trainingItem4Description || null,
        appointmentHeadline,
        appointmentSubtitle,
        appointmentButtonText,
        appointmentButtonLink,
        eventsBottomText,
        eventsButtonText,
        eventsButtonLink,
        reviewCard1Title,
        reviewCard1Description,
        reviewCard2Title,
        reviewCard2Description,
        reviewPhoto1Image: finalPhoto1,
        reviewPhoto1Alt,
        reviewPhoto2Image: finalPhoto2,
        reviewPhoto2Alt,
        footerSocials: JSON.stringify(footerSocials),
        footerPhone,
        footerEmail,
        footerAddressLine1,
        footerAddressLine2,
        footerAddressLine3,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
        // Hide success message after 4s
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(res.error || "Failed to save landing page changes.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {initialContent.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mb-4">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

      {/* Dynamic feedback messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-sans text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-sans text-sm font-semibold">
          Landing page customizations saved successfully! Your changes are now live.
        </div>
      )}

      {/* Hero Section Customs */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiGlobeAlt className="w-5 h-5 text-primary" />
          Hero Banner Customization
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Hero Headline
            </label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Hero Subtitle / Tagline
            </label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BG Banner Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Hero Background Banner
              </label>
              <span className="text-[11px] text-light-ash">Size: <strong>1920×1080 px</strong> (16:9 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {(bgPreviewUrl || heroBgImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bgPreviewUrl || heroBgImage} alt="Hero BG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                      <HiPhoto className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                  <span className="font-sans text-xs text-primary font-semibold">
                    {isUploadingBg ? "Uploading..." : "Upload New Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleUploadBg}
                    className="hidden"
                    disabled={isUploadingBg}
                  />
                </label>
              </div>
            </div>

            {/* Figure Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Hero Figure Illustration
              </label>
              <span className="text-[11px] text-light-ash">Size: <strong>800×800 px</strong> (1:1 / transparent) • Format: <strong>.png, .webp, .svg, .jpg</strong> (Max 10MB)</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {(figurePreviewUrl || heroFigureImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={figurePreviewUrl || heroFigureImage} alt="Hero Figure" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                      <HiPhoto className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                  <span className="font-sans text-xs text-primary font-semibold">
                    {isUploadingFigure ? "Uploading..." : "Upload New Illustration"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                    onChange={handleUploadFigure}
                    className="hidden"
                    disabled={isUploadingFigure}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Well Being Section Customs */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiInboxStack className="w-5 h-5 text-primary" />
          Well-Being Commitment Block
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Well-Being Title
            </label>
            <input
              type="text"
              value={wellbeingHeadline}
              onChange={(e) => setWellbeingHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Well-Being Subtitle / Paragraph
            </label>
            <textarea
              value={wellbeingSubtitle}
              onChange={(e) => setWellbeingSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Well-Being BG Banner Image Upload */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-sans text-xs font-semibold text-dark">
                  Well-Being Background Banner
                </label>
                {(wellbeingPreviewUrl || wellbeingImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setWellbeingImage("");
                      setWellbeingPreviewUrl("");
                      setPendingWellbeingFile(null);
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    Remove Banner
                  </button>
                )}
              </div>
              <span className="text-[11px] text-light-ash">Size: <strong>1920×1080 px</strong> (16:9 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {(wellbeingPreviewUrl || wellbeingImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={wellbeingPreviewUrl || wellbeingImage} alt="Well-Being BG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                      <HiPhoto className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                  <span className="font-sans text-xs text-primary font-semibold">
                    {isUploadingWellbeing ? "Uploading..." : "Upload New Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleUploadWellbeing}
                    className="hidden"
                    disabled={isUploadingWellbeing}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Well Being Animated Statistics Counters */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-muted pb-3 gap-2">
          <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiArrowsUpDown className="w-5 h-5 text-primary" />
            Animated Statistics Counters
          </h2>
          <span className="text-xs text-light-ash">
            Displayed on the homepage within the Well-Being Commitment section
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stat 1 Card */}
          <div className="p-5 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark-green uppercase tracking-wider">
                Counter 1
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dark-green text-white">
                Preview: {experienceCount}{stat1Suffix}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Counter Title
              </label>
              <input
                type="text"
                value={stat1Title}
                onChange={(e) => setStat1Title(e.target.value)}
                placeholder="Years of Experience"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Target Number
                </label>
                <input
                  type="number"
                  value={experienceCount}
                  onChange={(e) => setExperienceCount(Number(e.target.value))}
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                  min={0}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Suffix Symbol
                </label>
                <input
                  type="text"
                  value={stat1Suffix}
                  onChange={(e) => setStat1Suffix(e.target.value)}
                  placeholder="+"
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Description / Subtext
              </label>
              <input
                type="text"
                value={stat1Description}
                onChange={(e) => setStat1Description(e.target.value)}
                placeholder="Helping individuals navigate life's"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Stat 2 Card */}
          <div className="p-5 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark-green uppercase tracking-wider">
                Counter 2
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dark-green text-white">
                Preview: {happyClientsCount}{stat2Suffix}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Counter Title
              </label>
              <input
                type="text"
                value={stat2Title}
                onChange={(e) => setStat2Title(e.target.value)}
                placeholder="Happy Clients"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Target Number
                </label>
                <input
                  type="number"
                  value={happyClientsCount}
                  onChange={(e) => setHappyClientsCount(Number(e.target.value))}
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                  min={0}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Suffix Symbol
                </label>
                <input
                  type="text"
                  value={stat2Suffix}
                  onChange={(e) => setStat2Suffix(e.target.value)}
                  placeholder="+"
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Description / Subtext
              </label>
              <input
                type="text"
                value={stat2Description}
                onChange={(e) => setStat2Description(e.target.value)}
                placeholder="Empowered through counseling and therapy"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Stat 3 Card */}
          <div className="p-5 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark-green uppercase tracking-wider">
                Counter 3
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dark-green text-white">
                Preview: {sessionsCount}{stat3Suffix}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Counter Title
              </label>
              <input
                type="text"
                value={stat3Title}
                onChange={(e) => setStat3Title(e.target.value)}
                placeholder="Sessions Conducted"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Target Number
                </label>
                <input
                  type="number"
                  value={sessionsCount}
                  onChange={(e) => setSessionsCount(Number(e.target.value))}
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                  min={0}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Suffix Symbol
                </label>
                <input
                  type="text"
                  value={stat3Suffix}
                  onChange={(e) => setStat3Suffix(e.target.value)}
                  placeholder="+"
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Description / Subtext
              </label>
              <input
                type="text"
                value={stat3Description}
                onChange={(e) => setStat3Description(e.target.value)}
                placeholder="Providing guidance and support every day"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Stat 4 Card */}
          <div className="p-5 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark-green uppercase tracking-wider">
                Counter 4
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dark-green text-white">
                Preview: {satisfactionRate}{stat4Suffix}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Counter Title
              </label>
              <input
                type="text"
                value={stat4Title}
                onChange={(e) => setStat4Title(e.target.value)}
                placeholder="Satisfaction Positive"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Target Number
                </label>
                <input
                  type="number"
                  value={satisfactionRate}
                  onChange={(e) => setSatisfactionRate(Number(e.target.value))}
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                  min={0}
                  max={100}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-dark">
                  Suffix Symbol
                </label>
                <input
                  type="text"
                  value={stat4Suffix}
                  onChange={(e) => setStat4Suffix(e.target.value)}
                  placeholder="%"
                  className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Description / Subtext
              </label>
              <input
                type="text"
                value={stat4Description}
                onChange={(e) => setStat4Description(e.target.value)}
                placeholder="outcomes and improved well-being"
                className="w-full font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Training Section Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiInboxStack className="w-5 h-5 text-primary" />
          Training Section Customization
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Title
            </label>
            <input
              type="text"
              value={trainingHeadline}
              onChange={(e) => setTrainingHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Description / Subtitle
            </label>
            <textarea
              value={trainingSubtitle}
              onChange={(e) => setTrainingSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          {/* Training Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Display Image
            </label>
            <span className="text-[11px] text-light-ash">Size: <strong>800×600 px</strong> (4:3 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="relative w-20 h-24 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                {(trainingPreviewUrl || trainingImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={trainingPreviewUrl || trainingImage} alt="Training Display" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                    <HiPhoto className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                <span className="font-sans text-xs text-primary font-semibold">
                  {isUploadingTraining ? "Uploading..." : "Upload New Image"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUploadTraining}
                  className="hidden"
                  disabled={isUploadingTraining}
                />
              </label>
            </div>
          </div>

          {/* Training Features Checklist (homepage checklist items) */}
          <div className="flex flex-col gap-4 pt-4 border-t border-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
                <HiCheck className="w-4 h-4 text-primary" />
                Training Program Highlights / Checklist
              </label>
              <span className="text-[11px] text-light-ash">
                Bullet cards displayed beside the training photo with green checkmarks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="p-4 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HiCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-dark">Program #1</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Title</label>
                  <input
                    type="text"
                    value={trainingItem1Title}
                    onChange={(e) => setTrainingItem1Title(e.target.value)}
                    placeholder="Basic Counseling Skills Training"
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Description</label>
                  <textarea
                    value={trainingItem1Description}
                    onChange={(e) => setTrainingItem1Description(e.target.value)}
                    rows={3}
                    placeholder="Learn foundational techniques for effective, empathetic, and ethical communication..."
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors resize-y"
                    required
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HiCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-dark">Program #2</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Title</label>
                  <input
                    type="text"
                    value={trainingItem2Title}
                    onChange={(e) => setTrainingItem2Title(e.target.value)}
                    placeholder="Child & Adolescent Mental Health"
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Description</label>
                  <textarea
                    value={trainingItem2Description}
                    onChange={(e) => setTrainingItem2Description(e.target.value)}
                    rows={3}
                    placeholder="Understand psychological development, behavior management, and therapeutic strategies..."
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors resize-y"
                    required
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 bg-light-ash/5 border border-muted rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HiCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-dark">Program #3</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Title</label>
                  <input
                    type="text"
                    value={trainingItem3Title}
                    onChange={(e) => setTrainingItem3Title(e.target.value)}
                    placeholder="Trauma-Informed Care"
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] font-semibold text-dark">Description</label>
                  <textarea
                    value={trainingItem3Description}
                    onChange={(e) => setTrainingItem3Description(e.target.value)}
                    rows={3}
                    placeholder="Equip yourself with the knowledge and tools to support individuals dealing with trauma..."
                    className="w-full font-sans text-xs px-3 py-2 bg-white border border-muted focus:border-primary rounded-lg outline-hidden transition-colors resize-y"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Appointment Banner CTA Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary-dark shrink-0">
              <HiCalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Schedule Appointment CTA Banner
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Customize the headline, descriptive paragraph, and action button on the homepage appointment banner.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAppointmentHeadline(defaultAppointmentValues.headline);
              setAppointmentSubtitle(defaultAppointmentValues.subtitle);
              setAppointmentButtonText(defaultAppointmentValues.buttonText);
              setAppointmentButtonLink(defaultAppointmentValues.buttonLink);
            }}
            className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1 self-start sm:self-auto"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Banner Headline (HTML supported)
            </label>
            <input
              type="text"
              value={appointmentHeadline}
              onChange={(e) => setAppointmentHeadline(e.target.value)}
              placeholder="Take The Next Step - Schedule Your <span class=&quot;text-white&quot;>Appointment</span>"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Banner Subtitle / Paragraph
            </label>
            <textarea
              value={appointmentSubtitle}
              onChange={(e) => setAppointmentSubtitle(e.target.value)}
              rows={3}
              placeholder="Your path to healing, growth, and inner peace starts with a single step..."
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Button Label / Text
              </label>
              <input
                type="text"
                value={appointmentButtonText}
                onChange={(e) => setAppointmentButtonText(e.target.value)}
                placeholder="Book an Appointment"
                className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Button Link / Destination URL
              </label>
              <input
                type="text"
                value={appointmentButtonLink}
                onChange={(e) => setAppointmentButtonLink(e.target.value)}
                placeholder="/appointment"
                className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors font-mono text-xs"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events & Workshops CTA Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark shrink-0">
              <HiCalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Upcoming Events & Workshops Bottom CTA
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Customize the bottom paragraph and explore button that appear below the events grid on the homepage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEventsBottomText(defaultEventsValues.bottomText);
              setEventsButtonText(defaultEventsValues.buttonText);
              setEventsButtonLink(defaultEventsValues.buttonLink);
            }}
            className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1 self-start sm:self-auto"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Bottom CTA Paragraph / Subtext
            </label>
            <textarea
              value={eventsBottomText}
              onChange={(e) => setEventsBottomText(e.target.value)}
              rows={3}
              placeholder="Stay informed and engaged with CMHC,B's year-round programs..."
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Button Label / Text
              </label>
              <input
                type="text"
                value={eventsButtonText}
                onChange={(e) => setEventsButtonText(e.target.value)}
                placeholder="Explore all Events & Workshops"
                className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Button Link / Destination URL
              </label>
              <input
                type="text"
                value={eventsButtonLink}
                onChange={(e) => setEventsButtonLink(e.target.value)}
                placeholder="/events-workshops"
                className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors font-mono text-xs"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client Review Highlights (2×2 Grid) Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HiChatBubbleBottomCenterText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Client Review Highlights (2×2 Grid)
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Customize the 2 photos and 2 highlight cards in the 2×2 grid of the home review section.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetReviewHighlights}
            className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1 self-start sm:self-auto"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top-Left: Photo 1 */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl border border-muted bg-light-ash/5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Top-Left Photo (Client 1)
              </span>
              <span className="text-[10px] uppercase font-semibold text-light-ash tracking-wide">Image Tile</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-light/30 border border-muted rounded-xl overflow-hidden shrink-0">
                {(photo1PreviewUrl || reviewPhoto1Image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo1PreviewUrl || reviewPhoto1Image} alt="Review Photo 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                    <HiPhoto className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-white hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                <span className="font-sans text-xs text-primary font-semibold">
                  {isUploadingPhoto1 ? "Uploading..." : "Upload New Photo"}
                </span>
                <span className="text-[10px] text-light-ash mt-0.5">Recommended: 600×600 px (1:1)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUploadPhoto1}
                  className="hidden"
                  disabled={isUploadingPhoto1}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="review-photo-1-alt" className="font-sans text-[11px] font-semibold text-dark">
                Photo Alt Text (Accessibility & SEO)
              </label>
              <input
                id="review-photo-1-alt"
                type="text"
                value={reviewPhoto1Alt}
                onChange={(e) => setReviewPhoto1Alt(e.target.value)}
                placeholder="Description of the photo for screen readers"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Top-Right: Card 1 (Primary Dark) */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl border border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-dark text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Top-Right Card (Primary Dark)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-dark text-white">
                Primary Dark
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="review-card-1-title" className="font-sans text-[11px] font-semibold text-dark">
                Card Title
              </label>
              <input
                id="review-card-1-title"
                type="text"
                value={reviewCard1Title}
                onChange={(e) => setReviewCard1Title(e.target.value)}
                placeholder="Real Experiences, Real Impact"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="review-card-1-desc" className="font-sans text-[11px] font-semibold text-dark">
                Card Description
              </label>
              <textarea
                id="review-card-1-desc"
                value={reviewCard1Description}
                onChange={(e) => setReviewCard1Description(e.target.value)}
                rows={3}
                placeholder="Card description text..."
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors resize-y"
                required
              />
            </div>
          </div>

          {/* Bottom-Left: Card 2 (Accent Sand) */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl border border-amber-200 bg-accent/15">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent-dark text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Bottom-Left Card (Accent Sand)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-dark text-white">
                Accent Sand
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="review-card-2-title" className="font-sans text-[11px] font-semibold text-dark">
                Card Title
              </label>
              <input
                id="review-card-2-title"
                type="text"
                value={reviewCard2Title}
                onChange={(e) => setReviewCard2Title(e.target.value)}
                placeholder="Voices That Inspire Hope"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="review-card-2-desc" className="font-sans text-[11px] font-semibold text-dark">
                Card Description
              </label>
              <textarea
                id="review-card-2-desc"
                value={reviewCard2Description}
                onChange={(e) => setReviewCard2Description(e.target.value)}
                rows={3}
                placeholder="Card description text..."
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors resize-y"
                required
              />
            </div>
          </div>

          {/* Bottom-Right: Photo 2 */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl border border-muted bg-light-ash/5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-dark flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">4</span>
                Bottom-Right Photo (Client 2)
              </span>
              <span className="text-[10px] uppercase font-semibold text-light-ash tracking-wide">Image Tile</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-light/30 border border-muted rounded-xl overflow-hidden shrink-0">
                {(photo2PreviewUrl || reviewPhoto2Image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo2PreviewUrl || reviewPhoto2Image} alt="Review Photo 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                    <HiPhoto className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-white hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                <span className="font-sans text-xs text-primary font-semibold">
                  {isUploadingPhoto2 ? "Uploading..." : "Upload New Photo"}
                </span>
                <span className="text-[10px] text-light-ash mt-0.5">Recommended: 600×600 px (1:1)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUploadPhoto2}
                  className="hidden"
                  disabled={isUploadingPhoto2}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="review-photo-2-alt" className="font-sans text-[11px] font-semibold text-dark">
                Photo Alt Text (Accessibility & SEO)
              </label>
              <input
                id="review-photo-2-alt"
                type="text"
                value={reviewPhoto2Alt}
                onChange={(e) => setReviewPhoto2Alt(e.target.value)}
                placeholder="Description of the photo for screen readers"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-white border border-muted focus:border-primary rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Social Media Links Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HiShare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Footer Social Media Links
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Select which social media icons appear in the global website footer and customize their links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {footerSocials.filter((s) => s.enabled).length} of {footerSocials.length} Active
            </span>
            <button
              type="button"
              onClick={() => handleToggleAllSocials(true)}
              className="text-xs font-sans text-primary hover:text-primary-dark underline cursor-pointer px-1"
            >
              Select All
            </button>
            <span className="text-muted">•</span>
            <button
              type="button"
              onClick={() => handleToggleAllSocials(false)}
              className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1"
            >
              Deselect All
            </button>
            <span className="text-muted">•</span>
            <button
              type="button"
              onClick={handleResetSocials}
              className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {footerSocials.map((social) => {
            const icon = SOCIAL_PLATFORM_ICONS[social.platform.toLowerCase()] || <HiShare className="w-4 h-4" />;
            return (
              <div
                key={social.platform}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  social.enabled
                    ? "bg-primary/5 border-primary/30 shadow-xs"
                    : "bg-light-ash/5 border-muted opacity-75"
                }`}
              >
                {/* Header row with toggle */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        social.enabled
                          ? "bg-primary text-white"
                          : "bg-light-ash/20 text-light-ash"
                      }`}
                    >
                      {icon}
                    </div>
                    <div>
                      <span className="font-sans text-sm font-bold text-dark block leading-snug">
                        {social.label}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          social.enabled ? "text-emerald-600" : "text-light-ash"
                        }`}
                      >
                        {social.enabled ? "Visible in footer" : "Hidden in footer"}
                      </span>
                    </div>
                  </div>

                  {/* Toggle switch button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={social.enabled}
                    aria-label={`Toggle ${social.label} in footer`}
                    onClick={() => toggleSocialEnabled(social.platform)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      social.enabled ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        social.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* URL Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`social-url-${social.platform}`}
                    className="font-sans text-[11px] font-semibold text-light-ash"
                  >
                    Target Link / URL
                  </label>
                  <input
                    id={`social-url-${social.platform}`}
                    type="url"
                    value={social.href}
                    onChange={(e) => updateSocialHref(social.platform, e.target.value)}
                    placeholder={`https://${social.platform}.com/...`}
                    disabled={!social.enabled}
                    className={`w-full font-sans text-xs px-3 py-2 rounded-lg border outline-hidden transition-colors ${
                      social.enabled
                        ? "bg-white border-muted focus:border-primary text-dark"
                        : "bg-transparent border-muted/50 text-light-ash/70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Contact Information Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HiPhone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Footer Contact Information
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Configure the physical address, contact telephone, and email displayed in the website footer.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFooterPhone("+8801974349569");
              setFooterEmail("info@cmhcbd.com");
              setFooterAddressLine1("CMHC Office Room, 78/2 (2nd Floor)");
              setFooterAddressLine2("New Airport Road, Tejkunipara");
              setFooterAddressLine3("Tejgoan, Dhaka-1212");
            }}
            className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1 self-start sm:self-auto"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="footer-phone" className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
              <HiPhone className="w-4 h-4 text-primary" />
              Contact Phone Number
            </label>
            <input
              id="footer-phone"
              type="text"
              value={footerPhone}
              onChange={(e) => setFooterPhone(e.target.value)}
              placeholder="+8801974349569"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="footer-email" className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
              <HiEnvelope className="w-4 h-4 text-primary" />
              Contact Email Address
            </label>
            <input
              id="footer-email"
              type="email"
              value={footerEmail}
              onChange={(e) => setFooterEmail(e.target.value)}
              placeholder="info@cmhcbd.com"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>
        </div>

        {/* Address Lines */}
        <div className="flex flex-col gap-3">
          <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
            <HiMapPin className="w-4 h-4 text-primary" />
            Physical Address Lines
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 1 (Building / Room / Floor)</span>
              <input
                type="text"
                value={footerAddressLine1}
                onChange={(e) => setFooterAddressLine1(e.target.value)}
                placeholder="CMHC Office Room, 78/2 (2nd Floor)"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 2 (Street / Road / Area)</span>
              <input
                type="text"
                value={footerAddressLine2}
                onChange={(e) => setFooterAddressLine2(e.target.value)}
                placeholder="New Airport Road, Tejkunipara"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 3 (City / Postal Code)</span>
              <input
                type="text"
                value={footerAddressLine3}
                onChange={(e) => setFooterAddressLine3(e.target.value)}
                placeholder="Tejgoan, Dhaka-1212"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save bar */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50"
          disabled={isSubmitting || isUploadingBg || isUploadingFigure || isUploadingTraining || isUploadingPhoto1 || isUploadingPhoto2}
        >
          {isSubmitting ? "Saving Content..." : "Save Customizations"}
        </button>
      </div>
    </form>
  );
}