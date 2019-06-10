import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { PageContainer, ScrollPageLayout, Center, HorizontalSpace, FullInput, FloatingBottomButton } from '../../../common/bits';
import styled from 'styled-components/native';

const Label = styled.Text`
    font-size: 20;
`;

interface DefineProps {
    photoURI: string,
}

export default function Define(props: DefineProps) {

    const [name, setName] = useState("");

    return(
        <PageContainer>
            <ScrollPageLayout>
                <Center>
                    <Image source={{uri: props.photoURI}} style={{resizeMode: "contain", width: "70%", aspectRatio: 1}} />
                </Center>
                <HorizontalSpace />
                <Label>Item Name</Label>
                <FullInput value={name} placeholder='(optional)' onChangeText={(text) => setName(text)} />
                <HorizontalSpace />
                
            </ScrollPageLayout>
            <FloatingBottomButton text='add item' allowed={name.length > 5} onPress={() => { }} icon />
        </PageContainer>
    );
}