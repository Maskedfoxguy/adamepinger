import React from 'react';

import ContactForm from './ContactForm';

const ContactSection: React.FC = () => {
  return (

    <section id="contacts" className="py-20 px-4">
      <div className="container mx-auto">
        {/* We can place the existing contact form inside our new section. */}
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactSection;