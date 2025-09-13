import React, { useEffect, useState } from "react";
import axios from "axios";

function FinanceOverview() {
  const [stats, setStats] = useState({
    activeMembers: 0,
    inactiveMembers: 0,
    totalAdmins: 0,
    rdInvestedSum: 0,
    rdCurrentSum: 0,
    fdInvestedSum: 0,
    fdMaturitySum: 0,
    totalContributions: 0,
    /*
    loanDisbursedSum: 0,
    loanOutstandingSum: 0,
    loanRepaidSum: 0,
    availableLoanPool: 0,
    */
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/finance-overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error Fetching Finance Overview: ", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg text-center mt-8">
        Finance Overview
      </h1>
      <p className="text-lg md:text-xl drop-shadow-lg mt-4 text-center">
        The overall stats of the company.
      </p>

      <section className="flex flex-col items-center justify-center w-full px-4 md:px-20 lg:px-40 mb-8">
        <h2 className="text-2xl font-semibold mt-8">Members & Admins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full">
          {/* Overall Users */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">Total Signups</p>
            <p className="text-2xl font-bold mt-2">
              {stats.totalAdmins + stats.activeMembers + stats.inactiveMembers}
            </p>
          </div>

          {/* Active Members */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">Active Members</p>
            <p className="text-2xl font-bold mt-2">{stats.activeMembers}</p>
          </div>

          {/* Inactive Members */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">Inactive Members</p>
            <p className="text-2xl font-bold mt-2">{stats.inactiveMembers}</p>
          </div>

          {/* Total Admins */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">Total Admins</p>
            <p className="text-2xl font-bold mt-2">{stats.totalAdmins}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8">RD Deposits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 w-full">
          {/* RD Invested */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">RD Invested</p>
            <p className="text-2xl font-bold mt-2">{stats.rdInvestedSum}</p>
          </div>

          {/* RD Current */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">RD Current</p>
            <p className="text-2xl font-bold mt-2">{stats.rdCurrentSum}</p>
          </div>
        </div>


        <h2 className="text-2xl font-semibold mt-8">FD Deposits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 w-full">
          {/* FD Invested */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">FD Invested</p>
            <p className="text-2xl font-bold mt-2">{stats.fdInvestedSum}</p>
          </div>

          {/* FD Maturity */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-medium">FD Maturity</p>
            <p className="text-2xl font-bold mt-2">{stats.fdMaturitySum}</p>
          </div>
        </div>

          {/* Total Contributions */}
          <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
            <p className="text-2xl font-medium">Total Contributions (RD + FD)</p>
            <p className="text-3xl font-bold mt-2">{stats.totalContributions}</p>
          </div>
      </section>
    </>
  );
}

export default FinanceOverview;
