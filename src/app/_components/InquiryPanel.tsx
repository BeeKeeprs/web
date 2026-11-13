"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export type InquiryField = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "choice";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  half?: boolean; // sits next to the following half field
  options?: readonly (readonly [string, string])[];
};

type Props = {
  title: string;
  description: string;
  fields: InquiryField[];
  submitLabel: string;
  note?: string;
  defaults?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
};

/** One inquiry card for every form on the site: same field UI, required/optional tags and submit button. */
export default function InquiryPanel({ title, description, fields, submitLabel, note, defaults, onSubmit }: Props) {
  const [choices, setChoices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => { if (field.type === "choice" && field.options?.length) initial[field.name] = field.options[0][0]; });
    return { ...initial, ...defaults };
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (defaults) setChoices((current) => ({ ...current, ...defaults })); }, [defaults]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    fields.forEach((field) => { values[field.name] = field.type === "choice" ? choices[field.name] ?? "" : String(data.get(field.name) ?? "").trim(); });
    try {
      await onSubmit(values);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setSending(false);
    }
  }

  const renderField = (field: InquiryField, index: number) => {
    const tag = <i className={field.required ? "iq-required" : "iq-optional"}>{field.required ? "필수" : "선택"}</i>;
    if (field.type === "choice") {
      return (
        <fieldset className="iq-field iq-choice" key={field.name}>
          <legend>{field.label} {tag}</legend>
          <div className="iq-choices">
            {field.options?.map(([value, label], optionIndex) => (
              <label key={value}>
                <input type="radio" name={field.name} value={value} checked={choices[field.name] === value} onChange={() => setChoices((current) => ({ ...current, [field.name]: value }))} required={field.required && optionIndex === 0} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }
    const shared = { name: field.name, required: field.required, maxLength: field.maxLength, placeholder: field.placeholder, autoComplete: field.autoComplete };
    return (
      <label className="iq-field" key={`${field.name}-${index}`}>
        <span className="iq-label">{field.label} {tag}</span>
        {field.type === "textarea" ? <textarea rows={4} {...shared} /> : <input type={field.type ?? "text"} {...shared} />}
      </label>
    );
  };

  // Consecutive half fields share a row.
  const rows: InquiryField[][] = [];
  fields.forEach((field) => {
    const last = rows[rows.length - 1];
    if (field.half && last && last.length === 1 && last[0].half) last.push(field);
    else rows.push([field]);
  });

  return (
    <form className="iq-panel" onSubmit={submit}>
      <h3 className="iq-title">{title}</h3>
      <p className="iq-sub">{description}</p>
      {rows.map((row, rowIndex) => row.length > 1
        ? <div className="iq-row" key={rowIndex}>{row.map(renderField)}</div>
        : renderField(row[0], rowIndex))}
      {note && <p className="iq-note">{note}</p>}
      {error && <p className="iq-error" role="alert">{error}</p>}
      <button type="submit" className="iq-submit" disabled={sending}>{sending ? "보내고 있어요..." : submitLabel} <ArrowRight size={18} /></button>
    </form>
  );
}
