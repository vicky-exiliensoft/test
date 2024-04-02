"use client"; // Indicates that this code runs on the client-side

import React, { useState, useEffect } from "react"; // Importing necessary dependencies from React
import Sidebar from "@/app/sidebar/page"; // Importing Sidebar component
import Form from "react-bootstrap/Form"; // Importing Form component from React Bootstrap
import Container from "react-bootstrap/Container"; // Importing Container component from React Bootstrap
import Button from "react-bootstrap/Button"; // Importing Button component from React Bootstrap
import Row from "react-bootstrap/Row"; // Importing Row component from React Bootstrap
import Col from "react-bootstrap/Col"; // Importing Col component from React Bootstrap
import { AiFillLock } from "react-icons/ai"; // Importing AiFillLock icon from React Icons
import Link from "next/link"; // Importing Link component from Next.js
import { newRulesValidation } from "@/utility/yupValidation"; // Importing Yup validation schema
import * as Yup from "yup"; // Importing Yup for validation

const Dashboard: React.FC = () => {
  // Define Dashboard component as a functional component
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // State for sidebar open/close
  const [rules, setRules] = useState<string[]>([]); // State for rules
  const [newRuleName, setNewRuleName] = useState<string>(""); // State for new rule name
  const [newRuleCondition, setNewRuleCondition] = useState<string>(""); // State for new rule condition
  const [newRuleAction, setNewRuleAction] = useState<string>(""); // State for new rule action
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // State for validation errors
    newRuleName: "",
    newRuleCondition: "",
    newRuleAction: "",
  });

  useEffect(() => {
    // Effect hook to handle sidebar resizing
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Function to handle input change
    const { name, value } = event.target;
    switch (name) {
      case "newRuleName":
        setNewRuleName(value);
        break;
      case "newRuleCondition":
        setNewRuleCondition(value);
        break;
      case "newRuleAction":
        setNewRuleAction(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Function to handle form submission
    event.preventDefault();
    try {
      await newRulesValidation.validate({ newRuleName, newRuleCondition, newRuleAction }, { abortEarly: false });
      const newRule = `${newRuleName}: ${newRuleCondition} => ${newRuleAction}`;
      if (newRule.trim() !== "") {
        setRules([...rules, newRule]);
        setNewRuleName("");
        setNewRuleCondition("");
        setNewRuleAction("");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Handle Yup validation errors
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle other types of errors
        // console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="d-flex scrollable-content">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <Container className="mt-4">
        <div className="alert alert-primary" role="alert">
          Add Rules
        </div>
        <Row>
          {/* Left side form for adding rules */}
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formRuleName">
                <Form.Label>
                  <AiFillLock /> Rule Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter rule name"
                  name="newRuleName" // Add name attribute
                  value={newRuleName}
                  onChange={handleChange}
                />
                {errors.newRuleName && <Form.Text className="text-danger">{errors.newRuleName}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRuleCondition">
                <Form.Label>
                  <AiFillLock /> Rule Condition
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter rule condition"
                  name="newRuleCondition" // Add name attribute
                  value={newRuleCondition}
                  onChange={handleChange}
                />
                {errors.newRuleCondition && <Form.Text className="text-danger">{errors.newRuleCondition}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRuleAction">
                <Form.Label>
                  <AiFillLock /> Rule Action
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter rule action"
                  name="newRuleAction" // Add name attribute
                  value={newRuleAction}
                  onChange={handleChange}
                />
                {errors.newRuleAction && <Form.Text className="text-danger">{errors.newRuleAction}</Form.Text>}
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Rule
              </Button>
              <Button variant="danger" className="m-4">
                <Link className="text-light" href="/home">
                  Go to Home
                </Link>
              </Button>
            </Form>
          </Col>
          {/* Right side form for applied rules */}
          <Col md={6}>
            <h4>Applied Rules</h4>
            {rules.length > 0 ? (
              rules.map((rule, index) => (
                <div key={index} className="bg-lightblue p-2 mb-2">
                  <Form.Group className="mb-0">
                    <Form.Label>Applied Rule Name</Form.Label>
                    <Form.Control type="text" value={rule.split(":")[0]} disabled />
                  </Form.Group>
                  <Form.Group className="mb-0">
                    <Form.Label>Applied Rule Condition</Form.Label>
                    <Form.Control type="text" value={rule.split(":")[1].split("=>")[0]} disabled />
                  </Form.Group>
                  <Form.Group className="mb-0">
                    <Form.Label>Applied Rule Action</Form.Label>
                    <Form.Control type="text" value={rule.split("=>")[1]} disabled />
                  </Form.Group>
                </div>
              ))
            ) : (
              <p>No rules applied yet.</p>
            )}
          </Col>
        </Row>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/996/790/large_2x/robot-chatbot-icon-sign-free-vector.jpg"
            alt="Chatbot Icon"
            style={{ width: "215px", height: "193px", opacity: "0.7" }}
          />
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
