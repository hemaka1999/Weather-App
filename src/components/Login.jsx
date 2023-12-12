import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../../public/images/sky.jpg"; 
import { useNavigate } from "react-router-dom"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // If authentication is successful, set isAuthenticated to true and store in local storage.
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/weather-details");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section>
      <div
        id="loginBackground"
        className="container-fluid py-5 vw-100"
        style={{
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 ">
            <div
              id="loginBox"
              className="card shadow-2-strong"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "1rem",
              }}
            >
              {" "}
              <div className="card-body p-5 text-center">
                <h3 className="mb-4 text-primary">
                  Mickey Arthur's Weather App
                </h3>
                <h5 className="mb-2 ">Sign in</h5>

                <form onSubmit={login}>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="typeEmailX-2"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typeEmailX-2">
                      Email
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="typePasswordX-2"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typePasswordX-2">
                      Password
                    </label>
                  </div>

                  <div className="form-check d-flex justify-content-start mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form1Example3"
                    />
                    <label className="form-check-label" htmlFor="form1Example3">
                      Remember password
                    </label>
                  </div>

                  <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
