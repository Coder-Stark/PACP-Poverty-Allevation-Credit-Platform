import React from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <section className="body-font">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg flex justify-center mt-5">
        ADMIN DASHBOARD
      </h1>
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-wrap -mx-4 -mb-10 text-center">
          <div className="sm:w-1/2 mb-10 px-4">
            <div className="rounded-lg h-60 w-60 overflow-hidden justify-self-center">
              <img alt="content" className="object-cover object-center h-full w-full" src="https://res.cloudinary.com/doayyhpdi/image/upload/v1747643988/Screenshot_2025-05-19_140902_odd7vj.png" />
            </div>
            <h2 className="title-font text-2xl font-medium mt-6 mb-3">User's Stats</h2>
            <p className="leading-relaxed text-base">View and analyze individual user financial statistics including contributions, loans, and repayments.</p>
            <Link to="/admin/manage-users">
              <button className="flex mx-auto mt-6 text-white bg-purple-500 border-0 py-2 px-5 focus:outline-none hover:bg-purple-600 rounded cursor-pointer">
                Manage Users
              </button>
            </Link>
          </div>
          <div className="sm:w-1/2 mb-10 px-4">
            <div className="rounded-lg h-60 w-60 overflow-hidden justify-self-center">
              <img alt="content" className="object-cover object-center h-full w-full" src="https://res.cloudinary.com/doayyhpdi/image/upload/v1747644034/Screenshot_2025-05-19_141021_mpnheb.png" />
            </div>
            <h2 className="title-font text-2xl font-medium mt-6 mb-3">Finance Overview</h2>
            <p className="leading-relaxed text-base">Get a complete overview of total contributions, disbursed loans, and overall fund balance</p>
            <Link to="/admin/finance-overview">
              <button className="flex mx-auto mt-6 text-white bg-purple-500 border-0 py-2 px-5 focus:outline-none hover:bg-purple-600 rounded cursor-pointer">
                View Finance Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard