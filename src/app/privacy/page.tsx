import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-bg-card rounded-card border border-border-light shadow-card p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-text hover:text-teal-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-6 h-6 text-teal-primary" />
          <h1 className="text-2xl font-heading font-bold text-text-main">
            Privacy Policy & DPDP Act Compliance
          </h1>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <p>
            FirstSteps Finder is engineered to comply strictly with India&apos;s Digital Personal Data Protection (DPDP) Act.
          </p>

          <h2 className="font-heading font-bold text-text-main text-base mt-4">
            1. Parental Consent & Child Data Minimization
          </h2>
          <p>
            We adhere to strict data minimization. We only record your child&apos;s age in months (e.g., 30 months) and prospective joining month. We strictly do not collect, request, or store:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Child photographs or videos</li>
            <li>Exact date of birth</li>
            <li>Aadhaar numbers or any government identification</li>
            <li>Medical or biometric records</li>
          </ul>

          <h2 className="font-heading font-bold text-text-main text-base mt-4">
            2. Data Residency
          </h2>
          <p>
            All user data, search preferences, and shortlist records are stored in Cloud Firestore databases situated in the `asia-south2` (Delhi) or `asia-south1` (Mumbai) regions to ensure Indian users&apos; data remains in India.
          </p>

          <h2 className="font-heading font-bold text-text-main text-base mt-4">
            3. Right to Erasure & Portability
          </h2>
          <p>
            You have full autonomy over your data. You can download a complete export of your search history and notes or permanently erase your account at any time through the Account Settings page.
          </p>
        </div>
      </div>
    </main>
  );
}
