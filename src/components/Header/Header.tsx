import React from 'react';
import { Masthead, MastheadMain, MastheadBrand, MastheadContent, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate()

    return(
        <Masthead id="light200-masthead" backgroundColor="light200">
            <MastheadMain>
            <MastheadBrand><Button variant="plain" onClick={() => navigate("/")}>🍊</Button></MastheadBrand>
            </MastheadMain>
            <MastheadContent>
                <Button variant="plain" onClick={() => navigate("/")}>
                    <TextContent  style={{"color": "black"}}>
                        <Text component={TextVariants.h3}>Tangerine</Text>
                    </TextContent>
                </Button>                
            </MastheadContent>
        </Masthead>
    )
}
