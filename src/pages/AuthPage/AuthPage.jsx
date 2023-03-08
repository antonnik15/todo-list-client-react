import React, { useState, useContext } from "react";
import { BrowserRouter, Switch, Route, Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import "./AuthPage.scss";

const AuthPage = () => {

  const baseUrl = 'https://to-do-list-back-nest-ga3t5tpv3-antonnik15.vercel.app'

  const history = useHistory();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login } = useContext(AuthContext);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      let userId = '';
      await axios.post(`${baseUrl}/auth/registration`, { ...form }, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then((response) => {
        history.push("/");
        userId = response.data.userId;
      })
        .catch(function(error) {
          if (Array.isArray(error.response.data.message)) {
            const errorArray = error.response.data.message.map(e => e.message);
            errorArray.forEach(e => alert(`\n\n${e}`));
          }
          if (typeof error.response.data.message === "string") {
            alert(`\n\n${error.response.data.message}`);
          }
        });

      const text = "Test task";
      await axios.post(`${baseUrl}/todo/add`, { text, userId }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (e) {
      console.log(e);
    }
  };


  const loginHandler = async () => {
    try {
      await axios.post(`${baseUrl}/auth/login`, { ...form }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          login(response.data.token, response.data.userId);
        })
        .catch(function(error) {
          if (typeof error.response.data.message === "string") {
            alert(`\n\n${error.response.data.message}`);
          }
          if (Array.isArray(error.response.data.message)) {
            const errorArray = error.response.data.message.map(e => e.message);
            errorArray.forEach(e => alert(`\n\n${e}`));
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BrowserRouter>
      <Switch>
        <React.Fragment>
          <div className="container">
            <div className="auth-page">
              <Route path="/login">
                <h3> Login Here </h3>
                <form className="form form-login" onSubmit={e => e.preventDefault()}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        type="email"
                        name="email"
                        className="validate"
                        onChange={changeHandler} />
                      <label htmlFor="email"> Email </label>
                    </div>
                    <div className="input-field col s12">
                      <input
                        type="password"
                        name="password"
                        className="validate"
                        onChange={changeHandler} />
                      <label htmlFor="password"> Password </label>
                    </div>
                  </div>
                  <div className="row">
                    <button
                      className="waves-effect waves-light btn #00acc1 cyan darken-1"
                      onClick={loginHandler}>
                      Log In
                    </button>

                    <Link to="/registration" className="btn-outline btn-reg">Create account? </Link>
                  </div>
                </form>
              </Route>

              <Route path="/registration">
                <h3> Sign Up </h3>
                <form className="form form-login" onSubmit={e => e.preventDefault()}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        type="email"
                        name="email"
                        className="validate"
                        onChange={changeHandler} />
                      <label htmlFor="email"> Email </label>
                    </div>
                    <div className="input-field col s12">
                      <input
                        type="password"
                        name="password"
                        className="validate"
                        onChange={changeHandler} />
                      <label htmlFor="password"> Password </label>
                    </div>
                  </div>
                  <div className="row">
                    <button className="waves-effect waves-light btn #00acc1 cyan darken-1"
                            onClick={registerHandler}>
                      Sign Up
                    </button>
                    <Link to="/login" className="btn-outline btn-reg">Joined us before? Log in </Link>
                  </div>
                </form>
              </Route>

            </div>
          </div>
        </React.Fragment>
      </Switch>
    </BrowserRouter>
  );
};

export default AuthPage;