import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 4000);
  };

  const infoCards = [
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "support@yourstore.com",
      color: "violet",
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "+92 331 1068668",
      color: "emerald",
    },
    {
      icon: <MapPin size={18} />,
      label: "Location",
      value: "Hangu, KPK, Pakistan",
      color: "rose",
    },
  ];

  const iconColors = {
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  };

  const socials = [
    { icon: <Facebook size={15} />, label: "Facebook" },
    { icon: <Instagram size={15} />, label: "Instagram" },
    { icon: <Linkedin size={15} />, label: "LinkedIn" },
    { icon: <MessageCircle size={15} />, label: "WhatsApp" },
  ];

  return (
    <div
      className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Hero ── */}
      <div className="relative border-b border-white/[0.07] px-8 pb-14 pt-16 text-center overflow-hidden">
        {/* Glows */}
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-5 -right-10 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow */}
        <div className="relative mb-4 inline-flex items-center gap-2">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-violet-400" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-violet-600">
            Get in touch
          </span>
        </div>

        <h1
          className="relative mb-4 leading-[1.1] text-[#f0f0f8]"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
          }}
        >
          Let's <em className="italic text-violet-300">talk.</em>
        </h1>

        <p className="relative mx-auto max-w-md text-[14px] font-light leading-[1.8] text-[#5e5e78]">
          We'd love to hear from you — questions, feedback, or business
          inquiries. Drop us a message anytime.
        </p>
      </div>

      {/* ── Body grid ── */}
      <div className="mx-auto grid max-w-7xl gap-7 px-8 py-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Info cards */}
          {infoCards.map(({ icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-[14px] border border-white/[0.08]
                         bg-white/[0.03] px-5 py-[18px] transition hover:border-violet-500/30"
            >
              <div
                className={`flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center
                              rounded-[10px] border ${iconColors[color]}`}
              >
                {icon}
              </div>
              <div>
                <p className="mb-1 text-[11px] tracking-[0.04em] text-[#3e3e58]">
                  {label}
                </p>
                <p className="text-[13px] font-light text-[#b0b0c8]">{value}</p>
              </div>
            </div>
          ))}

          {/* Social card */}
          <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] px-5 py-[18px]">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-violet-600">
              Follow us
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[9px]
                             border border-white/10 bg-white/[0.03] text-[#5e5e78]
                             transition hover:border-violet-700 hover:bg-violet-700/10
                             hover:text-violet-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
            alt="Contact"
            className="h-44 w-full rounded-[14px] border border-white/[0.07] object-cover"
          />
        </div>

        {/* Right column — form */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
          <h2
            className="mb-1.5 text-[22px] text-[#f0f0f8]"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Send a message
          </h2>
          <p className="mb-6 text-[13px] font-light text-[#5e5e78]">
            Fill in the form below and we'll get back to you within 24 hours.
          </p>

          {/* Success banner */}
          {success && (
            <div
              className="mb-6 flex items-center gap-3 rounded-[10px] border
                            border-emerald-500/25 bg-emerald-500/8 px-4 py-3
                            text-[13px] text-emerald-400"
            >
              <CheckCircle size={16} />
              Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-[7px] block text-[12px] tracking-[0.03em] text-[#5e5e78]">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-[10px] border border-white/10 bg-white/[0.04]
                             px-3.5 py-2.5 text-[13px] text-[#c4c4d4] placeholder-[#3e3e58]
                             outline-none transition focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="mb-[7px] block text-[12px] tracking-[0.03em] text-[#5e5e78]">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-[10px] border border-white/10 bg-white/[0.04]
                             px-3.5 py-2.5 text-[13px] text-[#c4c4d4] placeholder-[#3e3e58]
                             outline-none transition focus:border-violet-500/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-[7px] block text-[12px] tracking-[0.03em] text-[#5e5e78]">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                className="w-full rounded-[10px] border border-white/10 bg-white/[0.04]
                           px-3.5 py-2.5 text-[13px] text-[#c4c4d4] placeholder-[#3e3e58]
                           outline-none transition focus:border-violet-500/50"
              />
            </div>

            <div>
              <label className="mb-[7px] block text-[12px] tracking-[0.03em] text-[#5e5e78]">
                Message
              </label>
              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                className="w-full resize-y rounded-[10px] border border-white/10 bg-white/[0.04]
                           px-3.5 py-2.5 text-[13px] text-[#c4c4d4] placeholder-[#3e3e58]
                           outline-none transition focus:border-violet-500/50"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[10px]
                         bg-violet-700 py-3 text-[13px] font-medium text-white
                         transition hover:bg-violet-800 cursor-pointer"
            >
              <Send size={15} />
              Send message
            </button>
          </form>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="px-8 pb-16">
        <div className="mb-6 text-center">
          <h2
            className="mb-1.5 text-[22px] text-[#f0f0f8]"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Find us
          </h2>
          <p className="text-[13px] font-light text-[#5e5e78]">
            Located in Hangu, KPK, Pakistan
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.0506637649!2d-74.3091754734254!3d40.697193340478705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1780173214721!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
