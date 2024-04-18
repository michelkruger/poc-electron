import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterCustomer from './pages/registerCustomer';
import RegisterCompany from './pages/registerCompany';
import RegisterCompanyIndexed from './pages/registerCustomerIndexed';
import Home from './pages/home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-cliente" element={<RegisterCustomer />} />
        <Route path="/cadastro-fornecedor" element={<RegisterCompany />} />
        <Route path="/teste-db" element={<RegisterCompanyIndexed />} />
      </Routes>
    </Router>
  );
};

export default App;