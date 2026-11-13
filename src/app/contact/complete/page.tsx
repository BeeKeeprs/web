import type { Metadata } from "next";
import ContactComplete from "./ContactComplete";

export const metadata: Metadata = { title: "문의 작성 완료 | 아워비", robots: { index: false, follow: false } };

export default function ContactCompletePage() {
  return <ContactComplete />;
}
