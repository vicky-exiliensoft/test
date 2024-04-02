"use client"; // Indicates that this code runs on the client-side

import React, { useState } from "react"; // Importing React library and useState hook
import axios from "axios"; // Importing axios for HTTP requests
import Link from "next/link"; // Importing Link component from Next.js
import { Container, Row, Col, Form, FormControl, Button } from "react-bootstrap"; // Importing components from React Bootstrap
import Image from "next/image";
import { CiMail } from "react-icons/ci";

// Home component
function forgetPassword() {
  const [email, setEmail] = useState(""); // State for email input
  const [message, setMessage] = useState(""); // State for success message
  const [error, setError] = useState(""); // State for error message
  const [emailError, setEmailError] = useState(""); // State for email validation error message

  // Function to handle email input change
  const handleChange = e => {
    setEmail(e.target.value);
    setEmailError(""); // Reset email error message when input changes
  };

  // Function to validate email format
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email format
    return re.test(String(email).toLowerCase());
  };

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      // Send request to reset password
      const response = await axios.post(process.env.FORGET_PASSWORD, { email });
      setMessage(response.data.message); // Set success message
      setError(""); // Reset error message
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); // Set error message from response
      } else {
        setError("An error occurred. Please try again later."); // Set generic error message
      }
      setMessage(""); // Reset success message
    }
  };

  // JSX structure of the Home component
  return (
    // <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
    //   <img src="https://static.vecteezy.com/system/resources/previews/004/996/790/large_2x/robot-chatbot-icon-sign-free-vector.jpg" alt="Chatbot Icon" style={{ width: "136px", height: "122px", opacity: "0.7" }} />
    // </div>
    <section className="login-sec">
      <Container fluid>
        <Row className="justify-content-center align-items-center divide-y-1">
          <Col md={4}>
            {/* Form */}
            <Form className="bg-dark shadow rounded px-4 pt-4 pb-4 mb-4 divide-y-2" onSubmit={handleSubmit}>
              <Image src={"../logo-square.svg"} alt="logo" width={80} height={200} className="img-fluid d-block mx-auto" />
              <h1 className="text-center mb-5 text-white fw-medium">Forget Password</h1>
              {/* Email input */}
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><CiMail /></span>
                  <FormControl
                    type="email"
                    placeholder="Email"
                    className={`shadow-none border ${emailError ? "border-danger" : ""}`}
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
              </Form.Group>
              {/* Buttons and messages */}
              <div className="d-flex justify-content-between align-items-center">
                {/* Reset Password button */}
                <Button
                  className="py-2 px-4 rounded focus:outline-none focus:shadow-outline w-75 d-block mx-auto"
                  type="submit"
                >
                  Reset Password
                </Button>
                {/* Success message */}
                {message && <p className="text-success">{message}</p>}
                {/* Error message */}
                {error && <p className="text-danger">{error}</p>}
                {/* Register now button */}
                {/* <Link href="/register">
                  <Button variant="dark" className="font-weight-bold py-2 px-4 rounded" type="button">
                    Register now
                  </Button>
                </Link> */}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
export default forgetPassword;
