"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { getAllServicesForFormAction, getAllTherapistsForFormAction } from "@/app/(admin)/admin/actions";

export function AppointmentForm() {
  return (
    <React.Suspense fallback={<div className="p-10 bg-white rounded-[32px] h-[600px] animate-pulse" />}>
      <AppointmentFormContent />
    </React.Suspense>
  );
}

interface ServiceOption {
  slug: string;
  title: string;
}

interface TherapistOption {
  id: string;
  name: string;
  role: string;
}

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const therapistId = searchParams.get("therapist");
  const serviceSlug = searchParams.get("service");

  const [services, setServices] = React.useState<ServiceOption[]>([]);
  const [therapists, setTherapists] = React.useState<TherapistOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    service: "",
    therapist: "",
    date: "",
    time: "",
    message: "",
    preference: "in-person",
  });

  // Load services and therapists from the database
  React.useEffect(() => {
    async function loadFormData() {
      setIsLoading(true);
      try {
        // Fetch services dynamically from DB
        const servicesRes = await getAllServicesForFormAction();
        if (servicesRes.success) {
          setServices(servicesRes.data);
        }

        // Fetch therapists dynamically from DB
        const therapistsRes = await getAllTherapistsForFormAction();
        if (therapistsRes.success) {
          setTherapists(therapistsRes.data);
        }
      } catch (err) {
        console.error("Failed to load form data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFormData();
  }, []);

  // Pre-fill from URL once data is loaded
  React.useEffect(() => {
    if (isLoading) return;

    if (therapistId) {
      const therapist = therapists.find((t) => t.id === therapistId);
      if (therapist) {
        setFormData((prev) => ({
          ...prev,
          therapist: therapist.id,
          service: serviceSlug || prev.service,
        }));
      }
    } else if (serviceSlug) {
      // Validate the service slug exists in DB data
      const serviceExists = services.some((s) => s.slug === serviceSlug);
      if (serviceExists) {
        setFormData((prev) => ({
          ...prev,
          service: serviceSlug,
        }));
      }
    }
  }, [therapistId, serviceSlug, therapists, services, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment Form Submitted:", formData);
    // Add submission logic here
    alert("Thank you! Your appointment request has been submitted.");
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-muted bg-white font-sans text-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark transition-all duration-200 placeholder:text-light-ash/50";
  const labelClasses = "block font-sans text-sm font-medium text-dark mb-1.5 ml-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-muted/30"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className={labelClasses}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className={labelClasses}>
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Your age"
            required
            value={formData.age}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className={labelClasses}>
            Gender
          </label>
          <Select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </Select>
        </div>

        {/* Contact */}
        <div className="md:col-span-2">
          <label htmlFor="contact" className={labelClasses}>
            Contact Number / Email
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="How can we reach you?"
            required
            value={formData.contact}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Choose Service — now dynamically loaded from DB */}
        <div>
          <label htmlFor="service" className={labelClasses}>
            Choose Service
          </label>
          <Select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? "Loading services..." : "Select Service"}
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </Select>
        </div>

        {/* Select Therapist — now dynamically loaded from DB */}
        <div>
          <label htmlFor="therapist" className={labelClasses}>
            Select Therapist
          </label>
          <Select
            id="therapist"
            name="therapist"
            required
            value={formData.therapist}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? "Loading therapists..." : "Choose a Therapist"}
            </option>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.name} - {therapist.role}
              </option>
            ))}
          </Select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className={labelClasses}>
            Pick Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className={labelClasses}>
            Pick Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Session Preference */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Session Preference</label>
          <div className="flex flex-wrap gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="preference"
                value="online"
                checked={formData.preference === "online"}
                onChange={handleChange}
                className="w-5 h-5 accent-primary-dark border-muted focus:ring-primary-dark focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="font-sans text-dark group-hover:text-primary-dark transition-colors">
                Online Session
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="preference"
                value="in-person"
                checked={formData.preference === "in-person"}
                onChange={handleChange}
                className="w-5 h-5 accent-primary-dark border-muted focus:ring-primary-dark focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="font-sans text-dark group-hover:text-primary-dark transition-colors">
                In Person Session
              </span>
            </label>
          </div>
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us a bit about why you're seeking help..."
            value={formData.message}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      <Button type="submit" variant="primary-dark" className="w-full py-4 text-lg cursor-pointer">
        Submit Appointment Request
      </Button>
    </form>
  );
}
