import {useRef} from 'react';
import {handleSuccess, handleError} from '../utils'

function ContactUs() {
  const formRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const formData = new FormData(form);
  
    // Validate each required field
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const message = formData.get("message")?.trim();
  
    if (!name || !email || !message) {
      handleError("All fields are mandatory");
      return;
    }
  
    try {
      const res = await fetch('https://formspree.io/f/mrbqnkoq', {
        method: "POST",
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        handleSuccess("Form Submitted Successfully !!!");
        form.reset();
      } else {
        handleError("Form Submission Failed");
      }
    } catch (err) {
      console.error("Error in Submitting form: ", err);
      handleError("Unexpected error occurred");
    }
  };

  return (
    <section className="body-font relative">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg flex justify-center mt-5">
        CONTACT US
      </h1>
      <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder="0"
            title="map"
            marginHeight="0"
            marginWidth="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=28.703470264092626,77.0564683061852&z=15&output=embed"
            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
          ></iframe>
          <div className="bg-gray-300 relative flex flex-wrap py-6 rounded shadow-md">
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
              <p className="mt-1">Pratap Vihar Part 3, Kirari Suleman Nagar, New Delhi - 110086</p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
              <a href="mailto:startup@gmail.com" className="text-indigo-500 leading-relaxed">startup@gmail.com</a>
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
              <p className="leading-relaxed">9876543210</p> {/* Replace with your actual phone if needed */}
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 md:w-1/2 border border-gray-300 rounded-lg flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 p-5">
          <h2 className=" text-lg mb-1 font-medium title-font">Feedback</h2>
          <p className="leading-relaxed mb-5 text-gray-600">We value your feedback — let us know how we can improve or assist you better.</p>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm">Name</label>
              <input type="text" id="name" name="name" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm">Email</label>
              <input type="email" id="email" name="email" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm">Message</label>
              <textarea id="message" name="message" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            <button type="submit" className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg cursor-pointer">Send</button>
          </form>

          <p className="text-xs text-gray-500 mt-3">Your insights help us grow and serve you better — thank you for reaching out.</p>
        </div>

      </div>
    </section>
  )
}

export default ContactUs