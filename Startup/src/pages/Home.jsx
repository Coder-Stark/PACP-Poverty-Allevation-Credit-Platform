import React from "react";

function Home() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-20 lg:px-40 text-center"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
        WELCOME TO STARTUP (REAL NAME LATER)
      </h1>
      <p className="text-lg md:text-xl drop-shadow-lg mt-4">
        We are here to make sure that money works for you
      </p>
    </section>
  );
}

export default Home;
