import React, { useState } from "react";
import { Modal, Tab, Nav } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm"; // ✅ New component

export default function AuthModal({ show, onHide }) {
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchTab = (tab) => setActiveTab(tab);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {activeTab === "login"
            ? "Login"
            : activeTab === "register"
            ? "Register"
            : "Forgot Password"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={handleSwitchTab}>
          {/* Only show tabs for login/register */}
          {activeTab !== "forgot" && (
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="login">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="register">Register</Nav.Link>
              </Nav.Item>
            </Nav>
          )}

          <Tab.Content>
            <Tab.Pane eventKey="login">
              <LoginForm
                onSuccess={onHide}
                onForgotPassword={() => handleSwitchTab("forgot")}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="register">
              <RegisterForm onSuccess={onHide} />
            </Tab.Pane>
            <Tab.Pane eventKey="forgot">
              <ForgotPasswordForm
                onBackToLogin={() => handleSwitchTab("login")}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
