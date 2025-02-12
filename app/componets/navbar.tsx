const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <div className="flex-shrink-0">Employee Management System</div>
            <div className="hidden sm:block">
              <ul className="flex space-x-4 text-gray-600">
                <li>
                  <a href="/employees" className="hover:text-indigo-600">
                    Employees
                  </a>
                </li>
                <li>
                  <a href="/employees/new" className="hover:text-indigo-600">
                    New Employee
                  </a>
                </li>
                <li>
                  <a href="/timesheets" className="hover:text-indigo-600">
                    Timesheets
                  </a>
                </li>
                <li>
                  <a href="/timesheets/new" className="hover:text-indigo-600">
                    New Timesheet
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
