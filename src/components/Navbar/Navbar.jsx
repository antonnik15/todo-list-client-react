import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import "./Navbar.scss";

const Navbar = () => {
  const { logout, isLogin } = useContext(AuthContext);

  return (
    <nav>
      <div className="nav-wrapper navbar #00acc1 cyan darken-1">
        <a href="/" className="brand-logo">Todo List Application</a>
        {
          isLogin
            ? <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="/" onClick={logout}>Log out</a></li>
            </ul>
            : <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="/">Log in</a></li>
            </ul>
        }
      </div>
    </nav>
  );
};

export default Navbar;