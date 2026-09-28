"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  HiPlus,
  HiTrash,
  HiArrowTopRightOnSquare,
  HiCheck,
  HiChevronUp,
  HiChevronDown,
  HiQuestionMarkCircle,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";
import {
  type FormFieldConfig,
  type FormFieldType,
  FORM_FIELD_TYPES,
} from "@/types/form-fields";
import { safeJsonParse } from "@/lib/json";
import {
  saveAppointmentFormFieldsAction,
  saveTrainingFormFieldsAction,
} from "@/app/(admin)/admin/actions";

interface FormFieldsBuilderProps {
  title: string;
  description: string;
  targetType: "appointment" | "training";
  initialFields?: string | FormFieldConfig[] | null;
  defaultFields: FormFieldConfig[];
  previewUrl: string;
}

export function FormFieldsBuilder({
  title,
  description,
  targetType,
  initialFields,
  defaultFields,
  previewUrl,
}: FormFieldsBuilderProps): React.JSX.Element {
  const router = useRouter();

  const [fields, setFields] = React.useState<FormFieldConfig[]>(() => {
    if (!initialFields) return defaultFields;
    if (typeof initialFields === "string") {
      const parsed = safeJsonParse<FormFieldConfig[]>(initialFields, []);
      if (parsed && parsed.length > 0) return parsed;
      return defaultFields;
    }
    if (Array.isArray(initialFields) && initialFields.length > 0) {
      return initialFields;
    }
    return defaultFields;
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Field manipulation helpers
  const handleAddField = () => {
    const customId = `custom_${Date.now()}`;
    const newField: FormFieldConfig = {
      id: customId,
      label: "New Information Field",
      type: "text",
      placeholder: "Enter details here...",
      required: false,
      enabled: true,
      isSystemField: false,
      options: ["Option 1", "Option 2"],
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const handleUpdateField = (
    index: number,
    key: keyof FormFieldConfig,
    value: any
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const handleRemoveField = (index: number) => {
    const target = fields[index];
    if (target.isSystemField) {
      alert("System core fields cannot be deleted. You can disable them or customize their label instead.");
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }
    const updated = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFields(updated);
  };

  const handleOptionsChange = (index: number, commaSeparatedString: string) => {
    const options = commaSeparatedString
      .split(",")
      .map((opt) => opt.trim())
      .filter(Boolean);
    handleUpdateField(index, "options", options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate that all fields have non-empty labels
    for (const f of fields) {
      if (!f.label || f.label.trim().length === 0) {
        setError("All form fields must have a visible label.");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res =
        targetType === "appointment"
          ? await saveAppointmentFormFieldsAction(fields)
          : await saveTrainingFormFieldsAction(fields);

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update form fields configuration.");
      }
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "An unexpected error occurred while saving."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-5xl bg-white border border-muted/50 rounded-2xl p-6 md:p-8 shadow-xs text-sm font-sans"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-muted pb-4">
        <div>
          <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            {title}
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-dark border border-primary/20">
              {fields.filter((f) => f.enabled !== false).length} Active Fields
            </span>
          </h2>
          <p className="text-xs text-light-ash mt-0.5 max-w-2xl">{description}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            View Live Form <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleAddField}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <HiPlus className="w-4 h-4" /> Add New Field
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100 flex items-center gap-2">
          <HiCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          Form fields updated successfully! Visitors to the public page will see the new fields immediately.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Guidance Note */}
      <div className="bg-light-ash/5 border border-muted/70 rounded-xl p-3.5 flex items-start gap-3 text-xs text-light-ash">
        <HiShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-dark">Zero-Error Architecture:</span> Any new fields added here are stored dynamically without requiring database migration or SQL schema alteration. Visitor submissions are safely recorded and rendered on your admin detail modals.
        </div>
      </div>

      {/* Fields List */}
      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <div
            key={field.id || idx}
            className={`border rounded-2xl p-4 md:p-5 transition-all duration-200 flex flex-col gap-3 relative ${
              field.enabled === false
                ? "bg-muted/10 border-muted/50 opacity-60"
                : "bg-white border-muted/70 shadow-xs hover:border-primary/40"
            }`}
          >
            {/* Field Header / Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-muted/40 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-light-ash bg-light-ash/10 px-2 py-0.5 rounded-md">
                  #{idx + 1}
                </span>

                {field.isSystemField ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary-dark border border-primary/20">
                    System Core Field
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-accent/15 text-accent border border-accent/20">
                    <HiSparkles className="w-3 h-3 mr-1" /> Custom Field
                  </span>
                )}

                <span className="text-[11px] text-light-ash font-mono">
                  Key: {field.id}
                </span>
              </div>

              {/* Action buttons (Move & Delete & Enable) */}
              <div className="flex items-center gap-1.5 ml-auto">
                <label className="flex items-center gap-1.5 cursor-pointer mr-2 text-xs font-medium text-dark select-none">
                  <input
                    type="checkbox"
                    checked={field.enabled !== false}
                    onChange={(e) =>
                      handleUpdateField(idx, "enabled", e.target.checked)
                    }
                    className="w-4 h-4 rounded-sm text-primary focus:ring-primary border-muted cursor-pointer"
                  />
                  <span>Active</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 text-light-ash hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-light-ash/10 rounded-md transition-colors"
                  title="Move Up"
                >
                  <HiChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === fields.length - 1}
                  className="p-1.5 text-light-ash hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-light-ash/10 rounded-md transition-colors"
                  title="Move Down"
                >
                  <HiChevronDown className="w-4 h-4" />
                </button>

                {!field.isSystemField && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ml-1 cursor-pointer"
                    title="Delete field"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Field Attributes Editor */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              {/* Field Label */}
              <div className="sm:col-span-5 flex flex-col gap-1">
                <label className="text-xs font-bold text-dark flex items-center justify-between">
                  <span>Field Label <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-light-ash font-normal">Shown to visitors</span>
                </label>
                <input
                  type="text"
                  required
                  value={field.label}
                  onChange={(e) => handleUpdateField(idx, "label", e.target.value)}
                  placeholder="e.g. Emergency Contact Number"
                  className="px-3 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-semibold text-dark"
                />
              </div>

              {/* Field Type Dropdown */}
              <div className="sm:col-span-4 flex flex-col gap-1">
                <label className="text-xs font-bold text-dark flex items-center justify-between">
                  <span>Input Field Type</span>
                  <span className="text-[10px] text-light-ash font-normal">HTML control</span>
                </label>
                {field.isSystemField && field.id !== "message" ? (
                  <div className="px-3 py-2 border border-muted bg-light-ash/10 rounded-xl text-xs font-medium text-dark/70 capitalize">
                    {field.type} (System default)
                  </div>
                ) : (
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleUpdateField(idx, "type", e.target.value as FormFieldType)
                    }
                    className="px-3 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-medium text-dark capitalize"
                  >
                    {FORM_FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} ({t.value})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Required Toggle */}
              <div className="sm:col-span-3 flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 border border-muted rounded-xl bg-light-ash/5 cursor-pointer hover:bg-light-ash/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      handleUpdateField(idx, "required", e.target.checked)
                    }
                    className="w-4 h-4 rounded-sm text-primary focus:ring-primary border-muted cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-dark">
                      Mandatory (Required)
                    </span>
                    <span className="text-[10px] text-light-ash">
                      Must be filled by visitor
                    </span>
                  </div>
                </label>
              </div>

              {/* Placeholder text */}
              <div className="sm:col-span-6 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-light-ash">
                  Placeholder / Input Hint
                </label>
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    handleUpdateField(idx, "placeholder", e.target.value)
                  }
                  placeholder="e.g. Type your response here..."
                  className="px-3 py-1.5 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs text-dark"
                />
              </div>

              {/* Help Text / Note */}
              <div className="sm:col-span-6 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-light-ash">
                  Supporting Note / Helper Text
                </label>
                <input
                  type="text"
                  value={field.helpText || ""}
                  onChange={(e) =>
                    handleUpdateField(idx, "helpText", e.target.value)
                  }
                  placeholder="Optional hint displayed beneath the input"
                  className="px-3 py-1.5 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs text-dark"
                />
              </div>

              {/* Options for Select and Radio */}
              {(field.type === "select" || field.type === "radio") && (
                <div className="sm:col-span-12 flex flex-col gap-1 p-3 bg-light-ash/5 rounded-xl border border-muted">
                  <label className="text-xs font-bold text-dark flex items-center justify-between">
                    <span>
                      Dropdown / Radio Choices (Comma-Separated)
                    </span>
                    <span className="text-[11px] text-light-ash font-normal">
                      Separate each option with a comma
                    </span>
                  </label>
                  <input
                    type="text"
                    value={(field.options || []).join(", ")}
                    onChange={(e) => handleOptionsChange(idx, e.target.value)}
                    placeholder="e.g. Option A, Option B, Option C"
                    className="px-3 py-2 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs text-dark font-medium"
                  />
                  {field.options && field.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {field.options.map((opt, oIdx) => (
                        <span
                          key={oIdx}
                          className="px-2 py-0.5 rounded-md bg-white border border-muted text-[11px] font-medium text-dark"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-muted pt-4">
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to reset form fields to standard defaults? Any custom added fields will be removed."
              )
            ) {
              setFields(defaultFields);
              setError(null);
              setSuccess(false);
            }
          }}
          disabled={isSubmitting}
          className="bg-light-ash/10 hover:bg-light-ash/20 text-dark font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Reset to Defaults
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleAddField}
            className="border border-primary text-primary hover:bg-primary/5 font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <HiPlus className="w-4 h-4" /> Add Field
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-sans text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs"
          >
            {isSubmitting ? "Saving Configuration..." : "Save Form Fields Configuration"}
          </button>
        </div>
      </div>
    </form>
  );
}
