import axios from "axios"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { TextContent, Text, TextVariants, Button, List, ListItem, Panel, PanelMain, PanelMainBody } from "@patternfly/react-core"
import AngleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-left-icon"

export const Agent = () => {
    const { agentId } = useParams()

    const [agentInfo, setAgentInfo] = useState({id: '', agent_name: '', description: '', system_prompt: '', filenames: []})

    const navigate = useNavigate()

    useEffect(() => {
        getAgentInfo();
      }, []);

    const getAgentInfo = () => {
        axios.get(`/api/agents/${agentId}`)
          .then(response => {
            setAgentInfo(response.data)
          })
          .catch(error => {
            console.error('Error fetching agents:', error);
          });
    };

    const uploadFile = (agent) => {
        const file = agent.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        axios.post(`/api/agents/${agentId}/document_upload`, formData)
          .then(() =>
          getAgentInfo()
        )
          .catch(error => {
            console.error('Error uploading file:', error);
          })
      }

    return(
        <div style={{"marginLeft": "2.5rem"}}>
            <div style={{"paddingTop": "1rem", "paddingBottom": "2rem"}}>
                <Button variant="secondary" icon={<AngleLeftIcon/>} onClick={() => navigate("/")}>Back</Button>
            </div>
            <TextContent style={{"display": "flex", "flexDirection": "column", "justifyContent": "space-around", "height": "35rem"}}>
                <TextContent>
                    <Text component={TextVariants.h2}>Agent Name</Text>
                    <Text component={TextVariants.p}>{agentInfo.agent_name}</Text>
                </TextContent>
                <TextContent>
                    <Text component={TextVariants.h2}>Description</Text>
                    <Text component={TextVariants.p}>{agentInfo.description}</Text>
                </TextContent>
                <TextContent>
                    <Text component={TextVariants.h2}>System Prompt</Text>
                    <Text component={TextVariants.p}>{agentInfo.system_prompt}</Text>
                </TextContent>
                <TextContent>
                    <Text component={TextVariants.h2}>Uploaded File(s)</Text>
                    { agentInfo.filenames.length === 0 && <Text component={TextVariants.p}>No files uploaded.</Text> }
                </TextContent>
                <Panel isScrollable>
                    <PanelMain tabIndex={0}>
                        <PanelMainBody>
                            <List>
                                {
                                    agentInfo.filenames.map(filename => <ListItem key={filename}>{filename}</ListItem>)
                                }
                            </List>
                        </PanelMainBody>
                    </PanelMain>
                </Panel>
            </TextContent>
            <TextContent>
                    <Text component={TextVariants.p}>Supported file formats: ".md", ".txt" and ".pdf"</Text>
                </TextContent>
            <div style={{"display": "flex", "flexDirection": "column", "height": "7rem", "justifyContent": "space-around"}}>
                <input
                    id={agentId}
                    type="file"
                    name="file"
                    onChange={uploadFile}
                />
                <div>
                    <Button variant="warning" onClick={() => navigate(`/${agentId}/chat`)}>Chat With {agentInfo.agent_name}</Button>
                </div>
            </div>
        </div>
    )
}
