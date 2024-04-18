import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, CardBody, CardHeader, Input } from "reactstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  password: string;
}

// Função para abrir o banco de dados IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('clientes_db', 1);

    request.onerror = () => {
      reject('Erro ao abrir o banco de dados IndexedDB');
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result as IDBDatabase);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      const objectStore = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('nome', 'nome', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    };
  });
};

// Função para adicionar um cliente ao IndexedDB
const adicionarClienteIndexedDB = async (cliente: Cliente): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(['clientes'], 'readwrite');
  const objectStore = transaction.objectStore('clientes');
  const request = objectStore.add(cliente);
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Erro ao adicionar cliente ao IndexedDB');
  });
};

// Função para buscar um cliente pelo ID no IndexedDB
const buscarClienteIndexedDB = async (id: number): Promise<Cliente | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(['clientes'], 'readonly');
  const objectStore = transaction.objectStore('clientes');
  const request = objectStore.get(id);
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as Cliente);
    request.onerror = () => reject('Erro ao buscar cliente no IndexedDB');
  });
};

function RegisterCustomer() {
  const [clienteData, setClienteData] = useState<Cliente>({
    id: 0,
    nome: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Função para popular os campos com os dados do cliente ao montar o componente
    const fetchClienteData = async () => {
      try {
        const cliente = await buscarClienteIndexedDB(0); 
        if (cliente) {
          setClienteData(cliente);
        } else {
          toast.warning("Cliente não encontrado no IndexedDB.");
        }
      } catch (error) {
        toast.error("Erro ao buscar cliente no IndexedDB: " + error);
      }
    };

    fetchClienteData();
  }, []);

  // Função para a busca dos dados do cliente no IndexedDB e população dos campos
  const handleSearchData = async () => {
    try {
      const cliente = await buscarClienteIndexedDB(1);
      if (cliente) {
        setClienteData(cliente);
        toast.success("Dados do cliente carregados com sucesso!");
      } else {
        toast.warning("Cliente não encontrado no IndexedDB.");
      }
    } catch (error) {
      toast.error("Erro ao buscar dados do cliente: " + error);
    }
  };

  // Função para adicionar dados ao indexedDB
  const handleSaveData = async () => {
    try {
      await adicionarClienteIndexedDB(clienteData);
      toast.success("Cliente salvo com sucesso no IndexedDB!");
    } catch (error) {
      toast.error("Erro ao salvar cliente no IndexedDB: " + error);
    }
  };

  return (
    <div className="main">
      <ToastContainer />
      <form>
        <Card>
          <CardHeader> Cadastro de usuário </CardHeader>
          <CardBody>
            <FloatingLabel controlId="name-label" label="Nome" className="mb-3">
              <Input
                type="text"
                value={clienteData.nome}
                onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="email-label" label="Email" className="mb-3">
              <Input
                type="email"
                value={clienteData.email}
                onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="password-label" label="Senha" className="mb-3">
              <Input
                type="password"
                value={clienteData.password}
                onChange={(e) => setClienteData({ ...clienteData, password: e.target.value })}
              />
            </FloatingLabel>

            {/* Campos de cep e demais campos do endereço... */}
            <Button className="mb-3" onClick={handleSearchData}>Buscar Dados do Cliente</Button>

            {/* Demais campos de cadastro... */}

            <div className="d-flex justify-content-end">
              <Button style={{marginRight:'10px'}} onClick={() => window.history.back()}> voltar </Button>
              <Button style={{marginRight:'10px'}} type="button" onClick={handleSaveData}> Salvar no IndexedDB </Button>
              <Button type="submit"> Salvar </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}

export default RegisterCustomer;
