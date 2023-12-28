import { Form, Button, FormGroup, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import React, { useState } from "react";
import BASE_URL from "../apiConfig";

const Login = ({ setToken }) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      email: username,
      password: password,
    });
    setToken(token);
    console.log("token koji je stigao:", token);
  };

  function setRole(role) {
    sessionStorage.setItem("role", JSON.stringify(role));
  }

  async function loginUser(credentials) {
    return fetch(`${BASE_URL}/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((data) => data.json())
      .then((data) => {
        const { token, role } = data;
        console.log("data:", data);
        console.log("token:", token);
        console.log("role:", role);
        setRole(role);
        return { token };
      });
  }

  return (
    <div>
      <Form className="monitor-container" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <FormGroup>
          <Form.Label>Username</Form.Label>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Form.Label>Password</Form.Label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <div className="submit-button-container">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
        <br />
      </Form>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
