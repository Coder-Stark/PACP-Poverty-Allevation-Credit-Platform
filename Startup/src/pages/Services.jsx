import React from 'react'

function Services() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg flex justify-center mt-5">
        OUR SERVICES
      </h1>
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-wrap -m-4">

          <div className="p-4 md:w-1/3">
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="blog" />
              <div className="p-6">
                <h2 className="tracking-widest text-xl flex justify-center title-font font-extrabold mb-1">
                  Recurring Deposit (RD)
                </h2>
                <p className="leading-relaxed mb-3">
                  Our Recurring Deposit (RD) scheme empowers members to save monthly with a guaranteed return. With a competitive monthly interest rate of <strong>1%</strong> (equivalent to <strong>12% annually</strong>), your savings grow faster than in traditional banks. RD is ideal for salaried individuals or small business owners looking to build a future corpus through disciplined investments.
                </p>
              </div>

            </div>
          </div>

          <div className="p-4 md:w-1/3">
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/721x401" alt="blog"/>
              <div className="p-6">
                <h2 className="tracking-widest text-xl flex justify-center title-font font-extrabold mb-1">
                  Fixed Deposit (FD)
                </h2>
                <p className="leading-relaxed mb-3">
                  Our Fixed Deposit (FD) plans offer highly attractive interest rates based on tenure:
                  <ul className="list-inside mt-2">
                    <li>✔ 36+ months – <strong>8.0%</strong></li>
                    <li>✔ 30–35 months – <strong>7.5%</strong></li>
                    <li>✔ 24–29 months – <strong>7.0%</strong></li>
                    <li>✔ 18–23 months – <strong>6.5%</strong></li>
                    <li>✔ 12–17 months – <strong>6.0%</strong></li>
                    <li>✔ 6–11 months – <strong>5.0%</strong></li>
                    <li>✔ Less than 6 months – <strong>2.5%</strong></li>
                  </ul>
                  Compared to traditional banks, our FD rates are significantly higher, helping your money grow faster with flexible tenures to suit your goals.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 md:w-1/3">
            <div className="h-full border-2 border-gray-300 border-opacity-60 rounded-lg overflow-hidden">
              <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/722x402" alt="blog"/>
              <div className="p-6">
                <h2 className="tracking-widest text-xl flex justify-center title-font font-extrabold mb-1">
                  Personal Loans
                </h2>
                <p className="leading-relaxed mb-3">
                  We offer quick and transparent personal loans with flexible interest rates based on tenure:
                  <ul className="list-inside mt-2">
                    <li>✔ 24+ months – <strong>17.0%</strong> annually</li>
                    <li>✔ 18–23 months – <strong>16.5%</strong></li>
                    <li>✔ 12–17 months – <strong>16.0%</strong></li>
                    <li>✔ 6–11 months – <strong>15.5%</strong></li>
                    <li>✔ Less than 6 months – <strong>15.0%</strong></li>
                  </ul>
                  Our loans are processed faster with minimal documentation, lower interest than many private lenders, and are designed to meet personal, business, or emergency needs. Choose us for transparency and customer-first service.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Services