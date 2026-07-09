"use client";

import Link from "next/link";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { LEGAL_INTERLINKS, SUPPORT_INTERLINKS } from "../../utils/interlinks";

const CONTENT = {
  terms: {
    title: "Terms & Conditions",
    body: "By using India Local Connect you agree to list accurate business information, respect community guidelines, and comply with applicable Indian laws for local commerce and advertising."
  },
  privacy: {
    title: "Privacy Policy",
    body: "We collect business contact details, listing content, and usage analytics to operate the directory. Data is stored securely in our MySQL database and is not sold to third parties."
  },
  disclaimer: {
    title: "Disclaimer",
    body: "Listings are submitted by business owners and verified when possible. India Local Connect does not guarantee service quality and recommends customers confirm details directly with businesses."
  }
};

export default function LegalPage({ type }) {
  const page = CONTENT[type] || CONTENT.terms;

  return (
    <article className="page-section content-prose">
      <h1 className="heading-page text-ink">{page.title}</h1>
      <p className="mt-6 max-w-3xl">{page.body}</p>
      <PageInterlinks title="Legal pages" links={LEGAL_INTERLINKS} className="mt-8" />
      <PageInterlinks title="Need help?" links={SUPPORT_INTERLINKS} className="mt-6" />
      <p className="text-body mt-6">
        <Link href="/" className="font-bold text-teal">
          Return to directory home
        </Link>
      </p>
    </article>
  );
}
