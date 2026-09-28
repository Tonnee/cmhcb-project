"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { getAllServicesForFormAction, getAllTherapistsForFormAction } from "@/app/(admin)/admin/actions";
import { z } from "zod";
import { createAppointmentAction } from "@/features/appointment/actions";
import type { FormFieldConfig } from "@/types/form-fields";
import { DEFAULT_APPOINTMENT_FORM_FIELDS } from "@/types/form-fields";

export const appointmentSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    age: z
      .string()
      .or(z.number())
      .transform((val) => String(val))
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      }, "Age must be a valid number"),
    gender: z.string().min(1, "Gender selection is required"),
    contact: z.string().min(1, "Contact details (Number / Email) are required"),
    service: z.string().min(1, "Please choose a service"),
    therapist: z.string().min(1, "Please select a therapist"),
    date: z.string().min(1, "Pick a valid date"),
    time: z.string().min(1, "Pick a valid time"),
    preference: z.enum(["online", "in-person"]).default("in-person"),
    message: z.string().optional(),
    customFields: z.record(z.string(), z.any()).optional().default({}),
  })
  .passthrough();

export interface AppointmentFormProps {
  formFields?: FormFieldConfig[] | null;
}

export function AppointmentForm({ formFields }: AppointmentFormProps = {}) {
  return (
    <React.Suspense fallback={<div className="p-10 bg-white rounded-[32px] h-[600px] animate-pulse" />}>
      <AppointmentFormContent formFields={formFields} />
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

function AppointmentFormContent({ formFields }: AppointmentFormProps) {
  const searchParams = useSearchParams();
  const therapistId = searchParams.get("therapist");
  const serviceSlug = searchParams.get("service");

  const [services, setServices] = React.useState<ServiceOption[]>([]);
  const [therapists, setTherapists] = React.useState<TherapistOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [createdId, setCreatedId] = React.useState<string | null>(null);

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

  const [customValues, setCustomValues] = React.useState<Record<string, any>>({});

  // Resolve active fields configuration
  const fieldMap = React.useMemo(() => {
    const map: Record<string, FormFieldConfig> = {};
    const sourceList = formFields && formFields.length > 0 ? formFields : DEFAULT_APPOINTMENT_FORM_FIELDS;
    for (const f of sourceList) {
      map[f.id] = f;
    }
    return map;
  }, [formFields]);

  const getField = (id: string, defaultDef: FormFieldConfig) => {
    const custom = fieldMap[id];
    if (!custom) return defaultDef;
    return {
      ...defaultDef,
      label: custom.label || defaultDef.label,
      placeholder: custom.placeholder ?? defaultDef.placeholder,
      required: custom.required ?? defaultDef.required,
      enabled: custom.enabled !== false,
      helpText: custom.helpText ?? defaultDef.helpText,
      options: custom.options && custom.options.length > 0 ? custom.options : defaultDef.options,
    };
  };

  const customFieldsList = React.useMemo(() => {
    if (!formFields || !Array.isArray(formFields)) return [];
    return formFields.filter((f) => !f.isSystemField && f.enabled !== false);
  }, [formFields]);

  // Load services and therapists from the database
  React.useEffect(() => {
    async function loadFormData() {
      setIsLoading(true);
      try {
        const servicesRes = await getAllServicesForFormAction();
        if (servicesRes.success) {
          setServices(servicesRes.data);
        }

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
      const serviceExists = services.some((s) => s.slug === serviceSlug);
      if (serviceExists) {
        setFormData((prev) => ({
          ...prev,
          service: serviceSlug,
        }));
      }
    }
  }, [therapistId, serviceSlug, therapists, services, isLoading]);

  // Render success message on confirmation
  if (isSuccess) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-primary/20 text-center animate-fade-in max-w-2xl mx-auto font-sans">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="font-marcellus text-2xl md:text-3xl text-primary-dark mb-2">Request Received!</h3>
        {createdId && (
          <div className="inline-block bg-primary/5 border border-primary/20 text-primary-dark font-mono font-bold text-sm px-4 py-1.5 rounded-full mb-4">
            Reference ID: {createdId}
          </div>
        )}
        <p className="font-sans text-base text-light-ash leading-relaxed">
          Thank you! Your appointment request has been securely submitted. Our administrative team will review it and contact you via your provided contact details to confirm the schedule.
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleCustomChange = (label: string, value: any) => {
    setCustomValues((prev) => ({ ...prev, [label]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate custom required fields
    for (const cf of customFieldsList) {
      if (cf.required) {
        const val = customValues[cf.label];
        if (val === undefined || val === null || String(val).trim() === "") {
          setErrorMsg(`${cf.label} is required.`);
          return;
        }
      }
    }

    const payload = {
      ...formData,
      customFields: customValues,
    };

    const validation = appointmentSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMsg(validation.error.issues.map((issue) => issue.message).join(", "));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAppointmentAction(payload);
      if (res.success) {
        if (res.appointmentId) {
          setCreatedId(res.appointmentId);
        }
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || "Failed to submit request. Please try again.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-muted bg-white font-sans text-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark transition-all duration-200 placeholder:text-light-ash/50";
  const labelClasses = "block font-sans text-sm font-medium text-dark mb-1.5 ml-1";

  // System field configs
  const nameField = getField("name", DEFAULT_APPOINTMENT_FORM_FIELDS[0]);
  const ageField = getField("age", DEFAULT_APPOINTMENT_FORM_FIELDS[1]);
  const genderField = getField("gender", DEFAULT_APPOINTMENT_FORM_FIELDS[2]);
  const contactField = getField("contact", DEFAULT_APPOINTMENT_FORM_FIELDS[3]);
  const serviceField = getField("service", DEFAULT_APPOINTMENT_FORM_FIELDS[4]);
  const therapistField = getField("therapist", DEFAULT_APPOINTMENT_FORM_FIELDS[5]);
  const dateField = getField("date", DEFAULT_APPOINTMENT_FORM_FIELDS[6]);
  const timeField = getField("time", DEFAULT_APPOINTMENT_FORM_FIELDS[7]);
  const preferenceField = getField("preference", DEFAULT_APPOINTMENT_FORM_FIELDS[8]);
  const messageField = getField("message", DEFAULT_APPOINTMENT_FORM_FIELDS[9]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-muted/30 font-sans"
    >
      {errorMsg && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name */}
        {nameField.enabled && (
          <div className="md:col-span-2">
            <label htmlFor="name" className={labelClasses}>
              {nameField.label} {nameField.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={nameField.placeholder || "Enter your full name"}
              required={nameField.required}
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
            />
            {nameField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{nameField.helpText}</p>
            )}
          </div>
        )}

        {/* Age */}
        {ageField.enabled && (
          <div>
            <label htmlFor="age" className={labelClasses}>
              {ageField.label} {ageField.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder={ageField.placeholder || "Your age"}
              required={ageField.required}
              value={formData.age}
              onChange={handleChange}
              className={inputClasses}
            />
            {ageField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{ageField.helpText}</p>
            )}
          </div>
        )}

        {/* Gender */}
        {genderField.enabled && (
          <div>
            <label htmlFor="gender" className={labelClasses}>
              {genderField.label} {genderField.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              id="gender"
              name="gender"
              required={genderField.required}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                {genderField.placeholder || "Select Gender"}
              </option>
              {(genderField.options || ["Female", "Male", "Other", "Prefer not to say"]).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            {genderField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{genderField.helpText}</p>
            )}
          </div>
        )}

        {/* Contact */}
        {contactField.enabled && (
          <div className="md:col-span-2">
            <label htmlFor="contact" className={labelClasses}>
              {contactField.label} {contactField.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder={contactField.placeholder || "How can we reach you?"}
              required={contactField.required}
              value={formData.contact}
              onChange={handleChange}
              className={inputClasses}
            />
            {contactField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{contactField.helpText}</p>
            )}
          </div>
        )}

        {/* Choose Service */}
        {serviceField.enabled && (
          <div>
            <label htmlFor="service" className={labelClasses}>
              {serviceField.label} {serviceField.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              id="service"
              name="service"
              required={serviceField.required}
              value={formData.service}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading services..." : serviceField.placeholder || "Select Service"}
              </option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </Select>
            {serviceField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{serviceField.helpText}</p>
            )}
          </div>
        )}

        {/* Select Therapist */}
        {therapistField.enabled && (
          <div>
            <label htmlFor="therapist" className={labelClasses}>
              {therapistField.label} {therapistField.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              id="therapist"
              name="therapist"
              required={therapistField.required}
              value={formData.therapist}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading therapists..." : therapistField.placeholder || "Choose a Therapist"}
              </option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name} - {therapist.role}
                </option>
              ))}
            </Select>
            {therapistField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{therapistField.helpText}</p>
            )}
          </div>
        )}

        {/* Date */}
        {dateField.enabled && (
          <div>
            <label htmlFor="date" className={labelClasses}>
              {dateField.label} {dateField.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required={dateField.required}
              value={formData.date}
              onChange={handleChange}
              className={inputClasses}
            />
            {dateField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{dateField.helpText}</p>
            )}
          </div>
        )}

        {/* Time */}
        {timeField.enabled && (
          <div>
            <label htmlFor="time" className={labelClasses}>
              {timeField.label} {timeField.required && <span className="text-red-500">*</span>}
            </label>
            {timeField.options && timeField.options.length > 0 ? (
              <Select
                id="time"
                name="time"
                required={timeField.required}
                value={formData.time}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {timeField.placeholder || "Select a time slot"}
                </option>
                {timeField.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            ) : (
              <input
                type="time"
                id="time"
                name="time"
                required={timeField.required}
                value={formData.time}
                onChange={handleChange}
                className={inputClasses}
              />
            )}
            {timeField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{timeField.helpText}</p>
            )}
          </div>
        )}

        {/* Session Preference */}
        {preferenceField.enabled && (
          <div className="md:col-span-2">
            <label className={labelClasses}>
              {preferenceField.label} {preferenceField.required && <span className="text-red-500">*</span>}
            </label>
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
            {preferenceField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{preferenceField.helpText}</p>
            )}
          </div>
        )}

        {/* Message */}
        {messageField.enabled && (
          <div className="md:col-span-2">
            <label htmlFor="message" className={labelClasses}>
              {messageField.label} {messageField.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={messageField.placeholder || "Tell us a bit about why you're seeking help..."}
              value={formData.message}
              onChange={handleChange}
              className={`${inputClasses} resize-none`}
            />
            {messageField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{messageField.helpText}</p>
            )}
          </div>
        )}

        {/* Dynamic Custom Fields */}
        {customFieldsList.map((cField) => (
          <div
            key={cField.id}
            className={cField.type === "textarea" ? "md:col-span-2" : "col-span-1"}
          >
            <label htmlFor={cField.id} className={labelClasses}>
              {cField.label} {cField.required && <span className="text-red-500">*</span>}
            </label>

            {cField.type === "textarea" ? (
              <textarea
                id={cField.id}
                name={cField.id}
                required={cField.required}
                rows={3}
                placeholder={cField.placeholder || ""}
                value={customValues[cField.label] || ""}
                onChange={(e) => handleCustomChange(cField.label, e.target.value)}
                className={`${inputClasses} resize-none`}
              />
            ) : cField.type === "select" ? (
              <Select
                id={cField.id}
                name={cField.id}
                required={cField.required}
                value={customValues[cField.label] || ""}
                onChange={(e) => handleCustomChange(cField.label, e.target.value)}
              >
                <option value="">{cField.placeholder || `Select ${cField.label}`}</option>
                {(cField.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            ) : cField.type === "radio" ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {(cField.options || []).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={cField.id}
                      value={opt}
                      required={cField.required}
                      checked={customValues[cField.label] === opt}
                      onChange={() => handleCustomChange(cField.label, opt)}
                      className="w-4 h-4 accent-primary-dark border-muted cursor-pointer"
                    />
                    <span className="font-sans text-dark group-hover:text-primary-dark transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            ) : cField.type === "checkbox" ? (
              <label className="flex items-center gap-2 p-3 border border-muted rounded-xl bg-light-ash/5 cursor-pointer hover:bg-light-ash/10 transition-colors mt-1">
                <input
                  type="checkbox"
                  id={cField.id}
                  name={cField.id}
                  required={cField.required}
                  checked={!!customValues[cField.label]}
                  onChange={(e) => handleCustomChange(cField.label, e.target.checked)}
                  className="w-4 h-4 rounded-sm text-primary focus:ring-primary border-muted cursor-pointer"
                />
                <span className="text-sm font-medium text-dark">
                  {cField.placeholder || cField.label}
                </span>
              </label>
            ) : (
              <input
                type={cField.type}
                id={cField.id}
                name={cField.id}
                required={cField.required}
                placeholder={cField.placeholder || ""}
                value={customValues[cField.label] || ""}
                onChange={(e) => handleCustomChange(cField.label, e.target.value)}
                className={inputClasses}
              />
            )}

            {cField.helpText && (
              <p className="text-[11px] text-light-ash mt-1 ml-1">{cField.helpText}</p>
            )}
          </div>
        ))}
      </div>

      <Button
        type="submit"
        variant="primary-dark"
        className="w-full py-4 text-lg cursor-pointer flex justify-center items-center gap-2 shadow-xs"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Submitting Request...</span>
          </>
        ) : (
          "Submit Appointment Request"
        )}
      </Button>
    </form>
  );
}
