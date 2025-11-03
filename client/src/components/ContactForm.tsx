// ContactForm.tsx
// A minimal contact form for the single-scroll flow.
import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted", { name, email, message });
    // Clear only the message field after submission
    setMessage("");
  };

  return (
    <section
      id="contact-form"
      className="min-h-screen py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100"
      aria-label="Contact form section"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Get In Touch
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
          aria-label="Contact form"
        >
          <div className="mb-6">
            <label
              htmlFor="contact-name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your name"
              required
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="contact-email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="contact-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="contact-message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
              placeholder="Your message here..."
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            aria-label="Submit contact form"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
