import React, { useState, useMemo, createRef, useEffect } from 'react';
import { Image, FlatList, Text, Animated, ScrollView, View, Button, TouchableWithoutFeedback } from 'react-native';
import { PageContainer, ScrollPageLayout, Center, HorizontalSpace, FullInput, FloatingBottomButton, height, Row, CircleButton, drobeAccent, P, FullButton, PageLayout, Modal, width, grey, dangerColor, HR, Label, Header } from '../../../common/ui/basicComponents';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Item, Classes, Sizes, Prices } from '../../../common/data/types';
import { Cell, Section, TableView } from "react-native-tableview-simple";

import ColorPicker from '../../../common/ui/colorPicker';

const ButtonText = styled.Text`
    font-size: 25;
    font-weight: 700;
`;

interface DefineProps {
    navigation: any,
    photoURI: string,
}

export default function Define(props: DefineProps) {

    const scrollRef = useMemo(() => createRef<ScrollView>(), []);

    const [name, setName] = useState("");
    const [itemClass, setItemClass] = useState<Item['class']>();
    const [itemType, setItemType] = useState<Item['type']>();
    const [itemColors, setItemColors] = useState<Item['colors']>();
    const [itemNote, setItemNote] = useState<Item['note']>();
    const [itemBrand, setItemBrand] = useState<Item['brand']>();
    const [itemSize, setItemSize] = useState<Item['size']>();
    const [itemPrice, setItemPrice] = useState<Item['price']>();

    const [showModal, setShowModal] = useState(false);

    const [showValidity, setShowValidity] = useState(false);

    const [classComponentY, setClassComponentY] = useState(0);
    const [colorComponentY, setColorComponentY] = useState(0);

    const onPickClass = useMemo(() => (pickedClass: Item['class']) => {
        setItemType(null);
        setItemClass(pickedClass);
        scrollRef.current.scrollTo({ y: classComponentY });
    }, [classComponentY]);

    const onPickSize = useMemo(() => (size: Item['size']) => {
        if (size === itemSize) {
            setItemSize(null);
        } else {
            setItemSize(size);
        }
    }, []);

    const onPickPrice = useMemo(() => (price: Item['price']) => {
        if (price === itemPrice) {
            setItemPrice(null);
        } else {
            setItemPrice(price);
        }
    }, []);

    return (
        <PageContainer>
            <ScrollPageLayout ref={scrollRef}>

                <HorizontalSpace />

                <Center>
                    <Image source={{ uri: props.photoURI }} style={{ resizeMode: "contain", height: height * 0.30, width: "100%" }} />
                </Center>

                <HorizontalSpace />

                <FullInput value={name} placeholder='item name (optional)' onChangeText={(text) => setName(text)} />

                <HorizontalSpace onLayout={(event) => {
                    setClassComponentY(event.nativeEvent.layout.y)
                }} />

                <Row style={{ justifyContent: 'space-between' }}>
                    {Object.keys(Classes).map((_itemClass, index) => {
                        return (
                            <CircleButton key={index} selected={itemClass === _itemClass} defaultHeight onPress={() => { onPickClass(_itemClass as any) }} >
                                {/* temp! replace with custom icons later */}
                                <MaterialCommunityIcons name='close' size={35} color={itemClass === _itemClass ? "#fff" : "#000"} />
                            </CircleButton>
                        );
                    })}
                </Row>

                <HorizontalSpace />

                <TableView>
                    <Section sectionPaddingBottom={0} sectionPaddingTop={0}>
                        {!!itemClass ? (
                            !!itemType ? (
                                <Cell title={itemType} accessoryColor={drobeAccent} accessory='Checkmark' onPress={() => setItemType(null)} />
                            ) : (
                                    // accessoryColor={drobeAccent} accessory={item === itemType ? "Checkmark" : undefined}
                                    Classes[itemClass].map((item, index) => <Cell key={index} title={item} onPress={() => { setItemType(item as any) }} />)
                                )

                        ) : (
                                <Cell title='choose type...'></Cell>
                            )}
                    </Section>
                </TableView>


                <HorizontalSpace onLayout={(event) => {
                    setColorComponentY(event.nativeEvent.layout.y)
                }} />

                <FullButton onPress={() => setShowModal(true)}><P>add color...</P></FullButton>

                <HorizontalSpace />
                <HR />

                <HorizontalSpace />

                <FullInput multiline numberOfLines={4} style={{ aspectRatio: 4 }} value={itemNote} placeholder='item note (optional)' onChangeText={(text) => setItemNote(text)} />

                <HorizontalSpace />

                <FullInput value={itemBrand} placeholder='brand (optional)' onChangeText={(text) => setItemBrand(text)} />

                <HorizontalSpace />

                <Row style={{ justifyContent: 'space-between' }}>
                    {Sizes.map((size, index) => {
                        return (
                            <CircleButton key={index} defaultHeight selected={itemSize === size} onPress={() => onPickSize(size as any)}>
                                <ButtonText style={{ color: itemSize === size ? "#fff" : "#000" }}>{size}</ButtonText>
                            </CircleButton>
                        );
                    })}
                </Row>

                <HorizontalSpace />

                <Row style={{ justifyContent: 'space-between' }}>
                    {Prices.map((price, index) => {
                        return (
                            <CircleButton key={index} defaultHeight selected={itemPrice === price} onPress={() => onPickPrice(price as any)}>
                                <Text style={{ color: itemPrice === price ? "#fff" : "#000", textAlign: 'center', }}>{"$".repeat(price)}</Text>
                            </CircleButton>
                        );
                    })}
                </Row>
                {/* <Row style={{ justifyContent: 'space-between' }}>
                    <CircleButton defaultHeight selected={itemPrice === 1} onPress={() => onPickPrice(1)}>
                        <P style={{ color: itemPrice === 1 ? "#fff" : "#000" }}>$</P>
                    </CircleButton>
                    <CircleButton defaultHeight selected={itemPrice === 2} onPress={() => onPickPrice(2)}>
                        <P style={{ color: itemPrice === 2 ? "#fff" : "#000" }}>$$</P>
                    </CircleButton>
                    <CircleButton defaultHeight selected={itemPrice === 3} onPress={() => onPickPrice(3)}>
                        <P style={{ color: itemPrice === 3 ? "#fff" : "#000" }}>$$$</P>
                    </CircleButton>
                    <CircleButton defaultHeight selected={itemPrice === 4} onPress={() => onPickPrice(4)}>
                        <View>
                        <Text style={{ color: itemPrice === 4 ? "#fff" : "#000" }}>$$</Text>
                        <Text style={{ color: itemPrice === 4 ? "#fff" : "#000" }}>$$</Text>
                        </View>
                    </CircleButton>
                </Row> */}

                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />

            </ScrollPageLayout>
            <FloatingBottomButton text='add item' allowed={name.length > 5} onPress={() => {
                setShowValidity(true);
            }} icon />

            {showModal && <Modal onClose={() => setShowModal(false)} closeButton>
                <ColorPicker onConfirm={() => {}} />

            </Modal>}

        </PageContainer>
    );
}
