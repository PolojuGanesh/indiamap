import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const LoginRoute = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken) {
    return <Navigate to="/dashboard" replace />;
  }

  const onGetUsername = (event) => {
    setUsername(event.target.value);
  };

  const onGetPassword = (event) => {
    setPassword(event.target.value);
  };

  const onSuccessfulLogin = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    navigate("/dashboard"); // Redirect to dashboard
  };

  const onFailureLogin = (error) => {
    setErrorMsg(error);
    setShowErrorMsg(true);
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = "http://localhost:3000/login/";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      onSuccessfulLogin(data.jwtToken);
    } else {
      onFailureLogin(data.error_msg);
    }
  };

  return (
    <div className="login-main-container">
      <form onSubmit={onSubmitForm} className="login-form-container">
        <label className="label" htmlFor="username">
          USERNAME
        </label>
        <input
          value={username}
          onChange={onGetUsername}
          placeholder="Username"
          className="input"
          type="text"
          id="username"
        />
        <label className="label" htmlFor="password">
          PASSWORD
        </label>
        <input
          value={password}
          onChange={onGetPassword}
          placeholder="Password"
          className="input"
          type={checked ? "text" : "password"}
          id="password"
        />
        <div className="checkbox-label-container">
          <input
            onChange={() => setChecked((prev) => !prev)}
            type="checkbox"
            id="checkbox"
            className="checkbox"
          />
          <label htmlFor="checkbox" className="checkbox-label">
            {checked ? "HIDE PASSWORD" : "SHOW PASSWORD"}
          </label>
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
        {showErrorMsg && <p className="error-msg-para">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginRoute;
