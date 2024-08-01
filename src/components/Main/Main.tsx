import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  FormGroup,
  FileUpload,
  TextInput,
  Panel,
  PanelMain,
  PanelMainBody,
  Title,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Link, useNavigate } from 'react-router-dom';

import AddCircleIcon from "@patternfly/react-icons/dist/esm/icons/add-circle-o-icon"

export const Main = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    file: null
  });

  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const handleModalToggle = (_event) => {
    setModalOpen(!isModalOpen);
  };

  const confirmHandler = () => {
    addAgent();
    handleModalToggle();
  }

  useEffect(() => {
    getAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAgentData({
      ...agentData,
      [name]: files ? files[0] : value
    })
  }

  const getAgents = () => {
    axios.get('/api/agents')
      .then(response => {
        setData(response.data.data)
         setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
      });
  };

  const addAgent = () => {
    const { name, description, system_prompt, file } = agentData;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('system_prompt', system_prompt);
    formData.append('file', file);

    axios.post('/api/agents', formData)
      .then(() => {
        setAgentData({
          name: '',
          description: '',
          system_prompt: '',
          file: null
        });
        getAgents();
      })
      .catch(error => {
        console.error('Error adding agent:', error);
      })
  }

  const deleteAgent = (agent) => {
    axios.delete('/api/agents/' + agent.target.id)
      .then(() =>
        getAgents()
      )
      .catch(error => {
        console.error('Error deleting agent:', error);
      })
  }

  return (
    <Panel>
      <PanelMain>
        <PanelMainBody>
          {loading ? (
              <p>Loading Agents...</p>
          ) : (
            <div style={{"width": "90%", "display": "flex", "flexDirection": "column", "marginLeft": "2.5rem"}}>
              <div style={{"display": "flex", "justifyContent": "end", "paddingTop": "0.5rem"}}>
                <Button variant="primary" onClick={handleModalToggle} icon={<AddCircleIcon/>}>
                  Add Agent
                </Button>
              </div>
              <div style={{"marginTop": "2.5rem"}}>
              <Title headingLevel="h1" style={{"paddingBottom": "1.5rem"}}>Available Agents</Title>
              <Table aria-label="Simple table">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(agent => (
                  <Tr key={agent.id}>
                    <Td><Link to={`/${agent.id}`}>{agent.agent_name}</Link></Td>
                    <Td>{agent.description}</Td>
                    <Td>
                      <Button id={agent.id} onClick={() => navigate(`/${agent.id}/chat`)} variant="warning">Chat</Button>
                    </Td>
                    <Td>
                      <Button id={agent.id} onClick={() => navigate(`/${agent.id}`)} variant="secondary">Modify</Button>
                    </Td>
                    <Td>
                      <Button id={agent.id} onClick={deleteAgent} variant="danger">Delete</Button>
                    </Td>

                  </Tr>
                ))}
              </Tbody>
              </Table>
              </div>
              <Modal
                variant={ModalVariant.small}
                title="Create a new Agent"
                description="Enter the information below to create a new agent."
                isOpen={isModalOpen}
                onClose={handleModalToggle}
                actions={[
                  <Button key="addAgent" variant="primary" form="add-agent-button" onClick={confirmHandler}>
                    Confirm
                  </Button>,
                  <Button key="cancel" variant="link" onClick={handleModalToggle}>
                    Cancel
                  </Button>
                ]}
              >
                  <Form>
                    <FormGroup>
                      <FormGroup label="Agent Name" isRequired>
                        <TextInput id="name" isRequired type="text" name="name" value={agentData.name} onChange={handleChange}/>
                      </FormGroup>

                      <FormGroup label="Agent Description" isRequired>
                        <TextInput id="description" isRequired type="text" name="description" value={agentData.description} onChange={handleChange} />
                      </FormGroup>

                      <FormGroup label="System Prompt" isRequired>
                        <TextInput id="prompt" isRequired type="text" name="system_prompt" value={agentData.system_prompt} onChange={handleChange} />
                      </FormGroup>
                    </FormGroup>
                  </Form>
              </Modal>
            </div>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
}
