import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/Maaunlogo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isEmployer, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const logoTo = isEmployer ? '/' : '/jobs';

  return (
    <nav className="bg-blue-700 border-b border-blue-500 py-5">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to={logoTo}>
              <img className="w-8 md:w-10 lg:w-15 h-auto" src={Logo} alt="Maaun jobs" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">Maaun Group Jobs</span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex flex-wrap items-center gap-2">
                {isEmployer && (
                  <NavLink to="/" className={linkClass}>
                    Home
                  </NavLink>
                )}
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>
                <NavLink to="/contact" className={linkClass}>
                  Contact
                </NavLink>
                {isEmployer && (
                  <NavLink to="/applications" className={linkClass}>
                    Applications
                  </NavLink>
                )}
                {isEmployer && (
                  <NavLink to="/add-job" className={linkClass}>
                    Add Job
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 text-sm border border-white/30"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;