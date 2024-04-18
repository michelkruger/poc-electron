//states
import { useEffect, useState } from "react";

//Components
import { Input, Card, CardHeader, CardBody, Button, Row, Col } from "reactstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Styles
import "../App.css";

function RegisterCompany() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>();
  const [cep, setCep] = useState<number>()
  const [state, setState] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [neighborhood, setNeighborhood] = useState<string>("")
  const [street, setStreet] = useState<string>("")

  useEffect(() => {

    if (cep && cep.toString().length > 8) {
      setCep(Number(cep.toString().slice(0, 8)));
      return
    } else if (cep && cep.toString().length < 8) {
      
      setState("")
      setNeighborhood("")
      setStreet("")
      setCity("")
    }
    
    const fetchAddress = async () => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
          throw new Error('Erro ao obter informações de endereço. Por favor, verifique o CEP fornecido.');
        }
        const data = await response.json();

        console.log(data, 'data')
        //alert('oii')
        setState(data.uf)
        setNeighborhood(data.bairro)
        setStreet(data.logradouro)
        setCity(data.localidade)

        toast.success('Endereço encontrado com sucesso!')
      } catch (error) {
        toast.error('Endereço não encontrado!')
        console.log(error)
      }
    };
  
    if (cep && cep.toString().length === 8) {
      fetchAddress();
    }

    return () => {}
  }, [cep]);
  

  return (
    <div className="main">
       <ToastContainer />
      <form>
        <Card>
          <CardHeader> Cadastro de Empresa</CardHeader>
          <CardBody>
            <FloatingLabel
              controlId="name-label"
              label="Empresa"
              className="mb-3"
            >
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="email-label"
              label="Email"
              className="mb-3"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="password-label"
              label="Senha"
              className="mb-3"
            >
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>

            {/* Campos de cep */}
            <FloatingLabel
              controlId="cep-label"
              label="Cep"
              className="mb-3"
            >
              <Input
                type="number"
                value={cep || ''}
                onChange={(e) => setCep(parseInt(e.target.value))}
              />
            </FloatingLabel>

            <Row>
              <Col>
              <FloatingLabel
              controlId="cep-label"
              label="Estado"
              className="mb-3"
            >
              <Input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled
              />
            </FloatingLabel>
              </Col>
              <Col>
              <FloatingLabel
                controlId="city-label"
                label="Cidade"
                className="mb-3"
              >
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled
                />
              </FloatingLabel>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <FloatingLabel
                  controlId="neighborhood-label"
                  label="Bairro"
                  className="mb-3"
                >
                  <Input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    disabled
                  />
                </FloatingLabel>
              </Col>

              <Col>
                <FloatingLabel
                  controlId="street-label"
                  label="Rua"
                  className="mb-3"
                >
                  <Input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    disabled
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button style={{marginRight:'10px'}}  onClick={() => window.history.back()}> voltar </Button>
              <Button className="ml-2" > Salvar </Button>
            </div>

          </CardBody>
        </Card>
      </form>
    </div>
  );
}

export default RegisterCompany;
