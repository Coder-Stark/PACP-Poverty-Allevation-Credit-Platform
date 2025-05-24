import React from 'react'

function FinanceOverview() {
  return (
    <section
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-20 lg:px-40 text-center"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
        Finance Overview
      </h1>
      <p className="text-lg md:text-xl drop-shadow-lg mt-4">
        Here You will see the overall stats of company soon.
      </p>
    </section>
  );
}

export default FinanceOverview