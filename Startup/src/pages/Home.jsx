import React from "react";

function Home() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center w-full h-[605px] md:h-[700px] lg:h-screen px-4 md:px-20 lg:px-40 text-white text-center"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center opacity-95 blur-[1px]"
        style={{ backgroundImage: "url('https://raw.githubusercontent.com/Coder-Stark/assets/refs/heads/master/image.png')" }}
      ></div>

      {/* Content */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg z-10">
        WELCOME TO STARTUP (REAL NAME LATER)
      </h1>
      <p className="text-lg md:text-xl drop-shadow-lg z-10">
        We are here to make sure that money works for you
      </p>
    </section>
  );
}

export default Home;
