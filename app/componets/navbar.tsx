import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for the burger menu

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-lg font-semibold text-gray-800">
            Employee Management System
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 text-gray-600">
            <NavLinks />
          </div>

          <div className="sm:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none cursor-pointer"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-[200px] bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <ul className="flex flex-col space-y-2 py-4 px-4">
                  <NavLinks />
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation Links Component (Reused for Desktop & Mobile)
function NavLinks() {
  return (
    <>
      <a href="/employees" className="hover:text-indigo-600">
        Employees
      </a>

      <a href="/employees/new" className="hover:text-indigo-600">
        New Employee
      </a>

      <a href="/timesheets" className="hover:text-indigo-600">
        Timesheets
      </a>

      <a href="/timesheets/new" className="hover:text-indigo-600">
        New Timesheet
      </a>
    </>
  );
}
