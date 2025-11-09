import React from 'react';
import ContactForm from './ContactForm';

const ContactSection: React.FC = () => {
  return (
   
    <section id="contacts" className="py-20">
     
      <h2 className="text-3xl font-bold mb-12 text-white text-center">Get In Touch</h2>
      <ContactForm />
    </section>
  );
};

export default ContactSection;
