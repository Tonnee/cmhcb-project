"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

import { createWorkshopRegistrationAction } from "@/features/workshops/actions";

export interface WorkshopRegistrationFormProps {
  workshopTitle: string;
  workshopId?: string;
}

export default function WorkshopRegistrationForm({
  workshopTitle,
  workshopId,
}: WorkshopRegistrationFormProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    name: "",
    contact: "",
    email: "",
    notes: "",
  });
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await createWorkshopRegistrationAction({
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        notes: formData.notes,
        workshopId: workshopId || "default-workshop",
        workshopTitle: workshopTitle,
      });

      if (res.success) {
        setStatus("success");
      } else {
        setStatus("idle");
        setErrorMsg(res.error || "Failed to register. Please try again.");
      }
    } catch (err: unknown) {
      setStatus("idle");
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 text-center animate-fade-in">
        <h3 className="font-marcellus text-xl text-primary-dark mb-2">Registration Confirmed!</h3>
        <p className="font-sans text-sm text-light-ash">
          Thank you for registering for &ldquo;{workshopTitle}&rdquo;. We will contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-sans font-medium border border-red-100 animate-fade-in">
          {errorMsg}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-sans text-sm font-semibold text-dark ml-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30 text-dark"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact" className="font-sans text-sm font-semibold text-dark ml-1">
          Contact Number
        </label>
        <input
          type="tel"
          id="contact"
          placeholder="+880"
          value={formData.contact}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30 text-dark"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-sans text-sm font-semibold text-dark ml-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30 text-dark"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="font-sans text-sm font-semibold text-dark ml-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          placeholder="Any specific questions or requirements?"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30 resize-none text-dark"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="mt-4 w-full justify-center h-14 text-lg rounded-2xl"
      >
        {status === "submitting" ? "Registering..." : "Confirm Registration"}
      </Button>
    </form>
  );
}
