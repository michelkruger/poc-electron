import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo à Página Inicial</h1>
      <ul>
        <li><Link to="/cadastro-cliente">Cadastro de Cliente</Link></li>
        <li><Link to="/cadastro-fornecedor">Cadastro de Fornecedor</Link></li>
        <li><Link to="/teste-db">teste indexedDB</Link></li>
      </ul>
    </div>
  );
};

export default Home;