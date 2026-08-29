import React from "react";
import { ShieldCheck, Lock, Database, UserCheck, Mail } from "lucide-react";

const Privacy_policy = () => {
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
            <ShieldCheck size={18} className="text-violet-400" />

            <span className="text-[11px] mt-2 font-medium uppercase tracking-widest text-violet-400">
              Your Privacy Matters
            </span>
          </div>

          <h1
            className="mb-4 text-gray-100"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            }}
          >
            Privacy <em className="italic text-violet-300">Policy</em>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500">
            This Privacy Policy explains how we collect, use, protect, and
            manage information when you use our website and services.
          </p>

          <p className="mt-3 text-xs text-gray-600">
            Last updated: August 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                1. Introduction
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              We respect your privacy and are committed to protecting your
              personal information. This Privacy Policy describes what
              information we may collect, why we collect it, how we use it, and
              the choices available to you.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              By using this website, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </section>

          {/* Information Collection */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Database className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                2. Information We Collect
              </h2>
            </div>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              Depending on how you interact with our website, we may collect the
              following information:
            </p>

            <ul className="space-y-3 text-sm leading-7 text-gray-400">
              <li>
                <strong className="text-gray-300">Account Information:</strong>{" "}
                Name, username, email address, and other information required to
                create and manage your account.
              </li>

              <li>
                <strong className="text-gray-300">Content:</strong> Information
                you submit through blog posts, comments, messages, or other
                features.
              </li>

              <li>
                <strong className="text-gray-300">
                  Technical Information:
                </strong>{" "}
                Browser type, device information, IP address, operating system,
                and general usage information.
              </li>

              <li>
                <strong className="text-gray-300">Usage Information:</strong>{" "}
                Pages visited, interactions with website features, and general
                activity on the platform.
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <UserCheck className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                3. How We Use Your Information
              </h2>
            </div>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              Information may be used to:
            </p>

            <ul className="space-y-2 text-sm leading-7 text-gray-400">
              <li>• Create and manage user accounts.</li>
              <li>• Provide and improve website functionality.</li>
              <li>• Publish and manage user-generated content.</li>
              <li>• Respond to questions, comments, and support requests.</li>
              <li>• Detect suspicious activity and protect our platform.</li>
              <li>• Improve website performance and user experience.</li>
              <li>• Comply with applicable legal requirements.</li>
            </ul>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                4. Data Security
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              We take reasonable technical and organizational measures to
              protect information against unauthorized access, alteration,
              disclosure, or destruction. However, no internet-based service can
              guarantee complete security.
            </p>
          </section>

          {/* Cookies */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              5. Cookies and Similar Technologies
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              Our website may use cookies or similar technologies to maintain
              sessions, remember preferences, improve functionality, and
              understand how visitors use the website.
            </p>
          </section>

          {/* Third Party */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              6. Third-Party Services
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              Some website features may depend on third-party services such as
              hosting providers, analytics tools, authentication services, or
              other technology providers. These services may process information
              according to their own privacy policies.
            </p>
          </section>

          {/* User Rights */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              7. Your Privacy Choices
            </h2>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              Depending on applicable law, you may have rights regarding your
              personal information, including the ability to:
            </p>

            <ul className="space-y-2 text-sm leading-7 text-gray-400">
              <li>• Request access to personal information.</li>
              <li>• Request correction of inaccurate information.</li>
              <li>• Request deletion where legally applicable.</li>
              <li>• Withdraw certain permissions or consent.</li>
              <li>• Ask questions about how your information is processed.</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              8. Children's Privacy
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              Our services are not intentionally designed to collect personal
              information from children where prohibited by applicable law. If
              you believe a child has provided personal information, please
              contact us so that appropriate action can be taken.
            </p>
          </section>

          {/* Changes */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              9. Changes to This Privacy Policy
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              We may update this Privacy Policy from time to time. Changes will
              be reflected on this page with an updated revision date. We
              encourage you to review this page periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.04] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="text-violet-400" size={22} />

              <h2 className="text-xl font-semibold text-gray-100">
                10. Contact Us
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              If you have questions about this Privacy Policy or how your
              information is handled, please contact the website administrator
              through the available contact channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy_policy;
