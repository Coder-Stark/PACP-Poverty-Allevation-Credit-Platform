import React from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -mx-4 -mb-10 text-center">
          <div className="sm:w-1/2 mb-10 px-4">
            <div className="rounded-lg h-64 overflow-hidden">
              <img alt="content" className="object-cover object-center h-full w-full" src="https://dummyimage.com/1201x501" />
            </div>
            <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">User's Stats</h2>
            <p className="leading-relaxed text-base">View and analyze individual user financial statistics including contributions, loans, and repayments.</p>
            <Link to="/admin/manage-users">
              <button className="flex mx-auto mt-6 text-white bg-purple-500 border-0 py-2 px-5 focus:outline-none hover:bg-purple-600 rounded cursor-pointer">
                Manage Users
              </button>
            </Link>
          </div>
          <div className="sm:w-1/2 mb-10 px-4">
            <div className="rounded-lg h-64 overflow-hidden">
              <img alt="content" className="object-cover object-center h-full w-full" src="https://dummyimage.com/1202x502" />
            </div>
            <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Finance Overview</h2>
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