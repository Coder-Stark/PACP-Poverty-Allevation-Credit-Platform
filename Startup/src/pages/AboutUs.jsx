import React from 'react'

function AboutUs() {
  return (
    <section className="body-font">
      {/* About PACP Section */}
      <div className="container px-5 py-10 mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
          ABOUT PACP
        </h1>
        <div className="mt-6 max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
          <p>
            PACP (Poverty Alleviation Credit Platform) is built to bridge the gap between 
            traditional banking and underserved communities. While banks often limit access 
            to credit and savings for low-income individuals, PACP creates an inclusive 
            ecosystem where every member has equal opportunity to save and borrow.
          </p>
          <p className="mt-4">
            Through features like <span className="font-semibold">Recurring Deposits (RD)</span>,{" "}
            <span className="font-semibold">Fixed Deposits (FD)</span>, and{" "}
            <span className="font-semibold">Personal Loans</span>, we ensure:
          </p>
          <ul className="mt-4 text-left max-w-2xl mx-auto list-disc list-inside">
            <li>✅ <strong>Secure Savings</strong> : members earn competitive returns on their deposits.</li>
            <li>✅ <strong>Affordable Loans</strong> : lower interest rates and flexible repayment options.</li>
            <li>✅ <strong>Financial Inclusion</strong> : accessible to individuals and small businesses often ignored by banks.</li>
          </ul>
          <p className="mt-4">
            Our mission is to <span className="font-semibold">alleviate poverty</span> by empowering 
            communities with financial tools that promote independence, growth, and stability. 
            PACP combines the <span className="font-semibold">trust of cooperative models</span> with 
            the <span className="font-semibold">convenience of digital platforms</span>, ensuring 
            that money truly works for everyone.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg flex justify-center mt-5">
        OUR TEAM
      </h1>
      <div className="container px-5 py-20 mx-auto">
        <div className="flex flex-wrap justify-center -m-4">
          <div className="p-4 lg:w-2/3">
            <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
              <img
                alt="team"
                className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4 shadow-lg"
                src="https://res.cloudinary.com/doayyhpdi/image/upload/v1748063724/Screenshot_2025-05-24_104505_cd86v9.png"
              />
              <div className="flex-grow sm:pl-8">
                <h2 className="title-font font-medium text-2xl">Shivam Kumar</h2>
                <h3 className="text-gray-500 mb-3">Full Stack Developer</h3>
                <p className="mb-4">
                  I am the sole developer behind PACP, responsible for designing, developing, 
                  and deploying the entire platform. My expertise lies in building 
                  scalable web & mobile applications using the <strong>MERN stack</strong> 
                  and <strong>React Native</strong>, ensuring seamless integration between 
                  frontend and backend systems.
                </p>
                <p className="mb-4">
                  From <strong>UI/UX design</strong> to <strong>database architecture</strong>, 
                  I handled every aspect of the project including authentication, role-based access, 
                  financial modules (RD, FD, Loans), and deployment. My focus has been on creating a 
                  clean UI, a robust backend, and an easy-to-use platform that truly makes a 
                  difference for underserved communities.
                </p>
        
                {/* Social Links */}
                <span className="inline-flex">
                  <span className="mr-2">Contact me:</span>
                  <a
                    href="https://www.linkedin.com/in/shivam-kumar-fullstack-developer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M19 0h-14c-2.761 0-5 
                        2.239-5 5v14c0 2.761 2.239 5 
                        5 5h14c2.761 0 5-2.239 
                        5-5v-14c0-2.761-2.239-5-5-5zm-11 
                        19h-3v-10h3v10zm-1.5-11.268c-.966 
                        0-1.75-.792-1.75-1.764s.784-1.764 
                        1.75-1.764 1.75.792 
                        1.75 1.764-.784 1.764-1.75 
                        1.764zm13.5 11.268h-3v-5.604c0-1.337-.025-3.059-1.865-3.059-1.868 
                        0-2.156 1.459-2.156 
                        2.966v5.697h-3v-10h2.881v1.367h.041c.401-.759 
                        1.379-1.559 2.839-1.559 3.036 
                        0 3.6 2.001 3.6 4.599v5.593z" />
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        
    </section>
  )
}

export default AboutUs
