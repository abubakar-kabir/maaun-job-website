import React from 'react';

const ContactPage = () => {
  return (
    <section className="bg-blue-50 min-h-[60vh] py-12 px-6">
      <div className="container m-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact us</h1>
        <p className="text-gray-600 mb-8">
          Reach the Maaun Group Jobs team for questions about listings or applications.
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</h2>
            <a href="mailto:contact@maaun.edu.ng" className="text-blue-700 font-medium hover:underline">
              contact@maaun.edu.ng
            </a>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</h2>
            <a href="tel:+2348067583471" className="text-blue-700 font-medium hover:underline">
              +234-80-6758-3471
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
