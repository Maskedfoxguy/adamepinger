// ContactForm.tsx
// A minimal contact form for the single-scroll flow.
// No backend wiring yet — the form prevents default submit and logs values so you can test.
import React, { useState } from "react";

const ContactForm: React.FC = () => {
  // Local state keeps this simple; later you can swap to form libraries or use refs.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    // For now we log — later step will send this to your backend or a service.
    console.log("Contact form submitted", { name, email, message });
    // Gentle UX: clear message so user gets visual feedback.
    setMessage("");
    // Note: add validation and spam protection later.
  };

  return (
    <section id="contact" aria-label="Contact section" className="py-12 px-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Contact</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto grid gap-4"
        aria-label="Contact form"
      >
        {/* Name input */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border rounded px-3 py-2"
            aria-label="Your name"
          />
        </label>

        {/* Email input */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border rounded px-3 py-2"
            aria-label="Your email"
          />
        </label>

        {/* Message textarea */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a short message..."
            rows={5}
            className="border rounded px-3 py-2"
            aria-label="Your message"
          />
        </label>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          aria-label="Send message"
        >
          Send message
        </button>
      </form>

      {/* Note: next steps — add client-side validation, loading states, and a POST to your backend or an email service. */}
    </section>
  );
};

export default ContactForm;