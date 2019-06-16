import React, { useState, useMemo } from 'react';
import { Image, FlatList, Text, Animated } from 'react-native';
import { PageContainer, ScrollPageLayout, Center, HorizontalSpace, FullInput, FloatingBottomButton, height, Row, CircleButton, drobeAccent, Touchable, P, FullButton, PageLayout, Modal, width, grey, dangerColor } from '../../../common/ui/basicComponents';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Item, Classes } from '../../../common/data/types';
import { Cell, Section, TableView } from "react-native-tableview-simple";

const warningBorder = {
    borderWidth: 5,
    borderColor: dangerColor
};

interface DefineProps {
    navigation: any,
    photoURI: string,
}

export default function Define(props: DefineProps) {

    const [name, setName] = useState("");
    const [itemClass, setItemClass] = useState<Item['class']>();
    const [itemType, setItemType] = useState<Item['type']>();

    const [showValidity, setShowValidity] = useState(false);

    return (
        <PageContainer>
            <ScrollPageLayout>
                <HorizontalSpace />
                <Center>
                    <Image source={{ uri: props.photoURI }} style={{ resizeMode: "contain", height: height * 0.30, width: "100%" }} />
                </Center>
                <HorizontalSpace />
                <FullInput value={name} placeholder='Item Name (optional)' onChangeText={(text) => setName(text)} />
                <HorizontalSpace />
                <Row style={{ justifyContent: 'space-between'}}>
                    <CircleButton onPress={() => { setItemClass('top') }}>
                        <MaterialCommunityIcons name='arrow-up' size={35} color={itemClass === "top" ? drobeAccent : undefined} />
                    </CircleButton>
                    <CircleButton onPress={() => { setItemClass('bottom') }}>
                        <MaterialCommunityIcons name='arrow-down' size={35} color={itemClass === "bottom" ? drobeAccent : undefined} />
                    </CircleButton>
                    <CircleButton onPress={() => { setItemClass('shoes') }}>
                        <MaterialCommunityIcons name='arrow-left' size={35} color={itemClass === "shoes" ? drobeAccent : undefined} />
                    </CircleButton>
                    <CircleButton onPress={() => { setItemClass('full') }}>
                        <MaterialCommunityIcons name='arrow-right' size={35} color={itemClass === "full" ? drobeAccent : undefined} />
                    </CircleButton>
                    <CircleButton onPress={() => { setItemClass('accessory') }}>
                        <MaterialCommunityIcons name='arrow-top-left' size={35} color={itemClass === "accessory" ? drobeAccent : undefined} />
                    </CircleButton>
                </Row>
                <HorizontalSpace />

                {/* {!!itemClass ? (
                    <FlatList data={Classes[itemClass]} renderItem={({ item }) => {
                        return <Touchable onPress={() => setItemType(item as any)} style={{ paddingVertical: 2.5, borderBottomWidth: 1, backgroundColor: grey }}>
                            <P>{item}</P>
                        </Touchable>
                    }} keyExtractor={(item) => { return item }} />
                ) : (
                    <FullButton><P>choose type...</P></FullButton>
                )} */}

                <HorizontalSpace />

                <TableView>
                    <Section sectionPaddingBottom={0} sectionPaddingTop={0}>
                        {!!itemClass ? (
                                Classes[itemClass].map((item, index) => <Cell key={index} title={item} accessoryColor={drobeAccent} accessory={item === itemType ? "Checkmark" : undefined} onPress={() => {setItemType(item as any)}}/>)
                            ) : (
                                <Cell title='choose type...'></Cell>
                        )}
                    </Section>
                </TableView>


            </ScrollPageLayout>
            <FloatingBottomButton text='add item' allowed={name.length > 5} onPress={() => {
                setShowValidity(true);
            }} icon />
        </PageContainer>
    );
}