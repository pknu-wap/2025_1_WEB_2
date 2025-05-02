import React from "react";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider import
import Router from "./components/app/Router"; // Router 컴포넌트
import Header from "./components/Header"; // Header 컴포넌트

function App() {
  return (
    <AuthProvider>
      <Header />
      <Router />
    </AuthProvider>
  );
}

export default App;
