import React from "react";
import {
  FileText,
  UserCheck,
  ShieldAlert,
  Copyright,
  Scale,
  Mail,
} from "lucide-react";

const Terms = () => {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] px-6 py-16 text-gray-300"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed -right-20 -top-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none fixed bottom-10 left-[5%] h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <FileText size={18} className="text-violet-400" />

            <span className="text-[11px] font-medium uppercase tracking-widest text-violet-400">
              Website Rules
            </span>
          </div>

          <h1
            className="mb-4 text-gray-100"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            }}
          >
            Terms & <em className="italic text-violet-300">Conditions</em>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500">
            These Terms and Conditions explain the rules and responsibilities
            that apply when you access or use this website.
          </p>

          <p className="mt-3 text-xs text-gray-600">
            Last updated: August 30, 2026
          </p>
        </div>

        <div className="space-y-6">
          {/* Acceptance */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                1. Acceptance of Terms
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              By accessing or using this website, you agree to comply with these
              Terms and Conditions. If you do not agree with any part of these
              terms, you should not use the website.
            </p>
          </section>

          {/* Eligibility */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <UserCheck className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                2. User Accounts
              </h2>
            </div>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              If you create an account, you are responsible for maintaining the
              confidentiality of your account credentials and for activity
              performed through your account.
            </p>

            <ul className="space-y-2 text-sm leading-7 text-gray-400">
              <li>• Provide accurate information when registering.</li>
              <li>• Keep your password confidential.</li>
              <li>• Do not share your account with unauthorized users.</li>
              <li>
                • Notify the administrator of suspected unauthorized access.
              </li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <ShieldAlert className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                3. Acceptable Use
              </h2>
            </div>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              You agree not to use the website to:
            </p>

            <ul className="space-y-2 text-sm leading-7 text-gray-400">
              <li>• Violate applicable laws or regulations.</li>
              <li>• Attempt to gain unauthorized access to systems.</li>
              <li>• Upload malicious software or harmful code.</li>
              <li>• Harass, abuse, or threaten other users.</li>
              <li>• Publish fraudulent, misleading, or illegal content.</li>
              <li>• Interfere with the normal operation of the website.</li>
              <li>
                • Attempt to bypass security or authentication mechanisms.
              </li>
            </ul>
          </section>

          {/* User Content */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              4. User-Generated Content
            </h2>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              Users may be allowed to publish posts, comments, or other content.
              You are responsible for the content you submit.
            </p>

            <p className="text-sm leading-7 text-gray-400">
              You must have the necessary rights to publish your content and
              must not submit content that infringes another person's
              intellectual property, privacy, or other legal rights.
            </p>
          </section>

          {/* Copyright */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Copyright className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                5. Intellectual Property
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              Unless otherwise stated, website software, design, branding,
              graphics, text, and other original materials are owned by or
              licensed to the website operator. You may not reproduce,
              distribute, modify, or commercially exploit protected material
              without appropriate authorization.
            </p>
          </section>

          {/* Blog Content */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              6. Blog and Educational Content
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              Articles and educational materials published on this website are
              provided for general informational purposes. While we aim to
              provide useful and accurate information, we do not guarantee that
              all content is complete, current, or error-free.
            </p>
          </section>

          {/* Availability */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              7. Website Availability
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              We may modify, suspend, or discontinue portions of the website at
              any time. We do not guarantee that the website will always be
              available, uninterrupted, secure, or free from technical errors.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <ShieldAlert className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                8. Disclaimer
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              The website and its content are provided on an "as is" and "as
              available" basis to the extent permitted by applicable law. We
              make no warranties regarding the availability, reliability,
              accuracy, or suitability of the website for a particular purpose.
            </p>
          </section>

          {/* Limitation */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Scale className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                9. Limitation of Liability
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              To the maximum extent permitted by applicable law, the website
              operator will not be responsible for indirect, incidental,
              special, consequential, or other losses arising from your use of
              or inability to use the website.
            </p>
          </section>

          {/* Termination */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              10. Account Suspension or Termination
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              We may suspend or terminate access to accounts or website features
              when we reasonably believe that a user has violated these Terms,
              applicable law, or the security of the platform.
            </p>
          </section>

          {/* Changes */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              11. Changes to These Terms
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              We may update these Terms and Conditions from time to time.
              Continued use of the website after changes are published
              constitutes acceptance of the updated terms, where legally
              applicable.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.04] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                12. Contact
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              If you have questions regarding these Terms and Conditions, please
              contact the website administrator through the available contact
              channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
