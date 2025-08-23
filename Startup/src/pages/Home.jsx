import React from "react";

function Home() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-20 lg:px-40 text-center"
    >
      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
        WELCOME TO <br /> PACP (Poverty Alleviation Credit Platform)
      </h1>

      {/* Subline */}
      <p className="text-lg md:text-xl drop-shadow-lg mt-4">
        We are here to make sure that money works for you
      </p>

      {/* Intro Section */}
      <div className="mt-8 max-w-3xl text-base md:text-lg text-gray-200 leading-relaxed">
        <p>
          PACP is a modern web application similar to online banking systems,
          offering services like <span className="font-semibold">Recurring Deposits (RD)</span>,{" "}
          <span className="font-semibold">Fixed Deposits (FD)</span>,{" "}
          <span className="font-semibold">Personal Loans</span>, and{" "}
          <span className="font-semibold">member account management</span>.
        </p>

        <p className="mt-4">
          Our platform is designed as a <span className="font-semibold">cooperative credit system</span>{" "}
          where members can save, grow, and borrow money with complete
          transparency. With PACP, financial opportunities reach everyone not
          just the privileged few.
        </p>

        <p className="mt-4 italic text-yellow-300">
          ✨ Your money, your community, your growth.
        </p>
      </div>
    </section>
  );
}

export default Home;
