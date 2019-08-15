import React, { useState, useMemo, createRef, useEffect } from 'react';
import { Image, FlatList, Text, Animated, ScrollView, View, Button, TouchableWithoutFeedback } from 'react-native';
import { PageContainer, ScrollPageLayout, Center, HorizontalSpace, FullInput, FloatingBottomButton, height, Row, CircleButton, drobeAccent, P, FullButton, PageLayout, Modal, width, grey, dangerColor, HR, Label, Header, iconSize } from '../../../common/ui/basicComponents';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Item, Classes, Sizes, Prices } from '../../../common/data/types';
import { Cell, Section, TableView } from "react-native-tableview-simple";
import Color from 'color';
import ColorPicker from '../../../common/ui/colorPicker';
import { TriangleColorPicker } from '../../../common/ui/colorpicker/TriangleColorPicker';
import { roundColor } from '../../../common/data/helpers';

const ButtonText = styled.Text`
    font-size: 25;
    font-weight: 700;
`;

interface DefineProps {
    navigation: any,
    item?: Item,
    photoURI?: string,
    onSubmit: (Item) => void,
}

export default function Define(props: DefineProps) {

    const scrollRef = useMemo(() => createRef<ScrollView>(), []);

    const [itemClass, setItemClass] = useState<Item['class']>();
    const [itemType, setItemType] = useState<Item['type']>();
    const [itemName, setItemName] = useState('');
    const [itemColors, setItemColors] = useState<Item['colors']>();

    const [itemDate, setItemDate] = useState<Item['date']>(Date.now());
    const [itemUses, setItemUses] = useState<Item['uses']>(0);
    const [itemLaundry, setItemLaundry] = useState<Item['laundry']>(0);

    const [itemPhotoURI, setItemPhotoURI] = useState<Item['photoURI']>(!!props.photoURI ? props.photoURI : undefined);
    const [itemExtraPhotos, setItemExtraPhotos] = useState<Item['extraPhotos']>();
    const [itemNote, setItemNote] = useState<Item['note']>();
    const [itemBrand, setItemBrand] = useState<Item['brand']>();
    const [itemSize, setItemSize] = useState<Item['size']>();
    const [itemPrice, setItemPrice] = useState<Item['price']>();

    if (!!props.item) {
        if (!!props.item.class) {
            setItemClass(props.item.class)
        }
        if (!!props.item.type) {
            setItemType(props.item.type)
        }
        if (!!props.item.name) {
            setItemName(props.item.name)
        }
        if (!!props.item.colors) {
            setItemColors(props.item.colors)
        }
        if (!!props.item.date) {
            setItemDate(props.item.date)
        }
        if (!!props.item.uses) {
            setItemUses(props.item.uses)
        }
        if (!!props.item.laundry) {
            setItemLaundry(props.item.laundry)
        }
        if (!!props.item.photoURI) {
            setItemPhotoURI(props.item.photoURI)
        }
        if (!!props.item.extraPhotos) {
            setItemExtraPhotos(props.item.extraPhotos)
        }
        if (!!props.item.note) {
            setItemNote(props.item.note)
        }
        if (!!props.item.brand) {
            setItemBrand(props.item.brand)
        }
        if (!!props.item.size) {
            setItemSize(props.item.size)
        }
        if (!!props.item.price) {
            setItemPrice(props.item.price)
        }
    }


    const isValid = useMemo(() => {
        return !!itemClass && !!itemType && !!itemColors;
    }, [itemClass, itemType, itemColors]);

    const [showModal, setShowModal] = useState(false);

    const [showValidity, setShowValidity] = useState(false);

    const [classComponentY, setClassComponentY] = useState(0);

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


                {!!itemPhotoURI &&
                    <>
                        <HorizontalSpace />
                        <Center>
                            <Image source={{ uri: itemPhotoURI }} style={{ resizeMode: "contain", height: height * 0.30, width: "100%" }} />
                        </Center>
                    </>
                }

                <HorizontalSpace />

                {/* <FullButton onPress={() => { }}><P>add another photo (optional)</P></FullButton> */}
                <Row>
                    <CircleButton defaultHeight>
                        <MaterialCommunityIcons name='camera' size={iconSize}/>
                    </CircleButton>
                </Row>

                <HorizontalSpace />

                <FullInput value={itemName} placeholder='item name (optional)' onChangeText={(text) => setItemName(text)} />

                <HorizontalSpace onLayout={(event) => {
                    setClassComponentY(event.nativeEvent.layout.y)
                }} />

                <Row style={{ justifyContent: 'space-between' }}>
                    {Object.keys(Classes).map((_itemClass, index) => {
                        return (
                            <CircleButton key={index} selected={itemClass === _itemClass} defaultHeight onPress={() => { onPickClass(_itemClass as any) }} >
                                {/* temp! replace with custom icons later */}
                                <MaterialCommunityIcons name='close' size={iconSize} color={itemClass === _itemClass ? "#fff" : "#000"} />
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


                <HorizontalSpace />

                <FullButton onPress={() => setShowModal(true)}><P>add {!!itemColors && 'another'} color...</P></FullButton>

                <HorizontalSpace />

                <Row>
                    {!!itemColors && itemColors.map((itemColor, index) => {
                        return (
                            <CircleButton key={index} style={{ backgroundColor: itemColor }} defaultHeight><P></P></CircleButton>
                        );
                    })}
                </Row>

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

                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />
                <HorizontalSpace />

            </ScrollPageLayout>
            <FloatingBottomButton text='add item' allowed={isValid} onPress={() => {
                setShowValidity(true);
            }} icon />

            {showModal && <Modal onClose={() => setShowModal(false)} closeButton>
                {/* <ColorPicker onConfirm={() => {}} /> */}
                <TriangleColorPicker onColorSelected={color => {
                    setShowModal(false);
                    if (!!itemColors) {
                        setItemColors([...itemColors, color]);
                    } else {
                        setItemColors([color]);
                    }
                }}
                    style={{ width: "100%", aspectRatio: 1 }} />
            </Modal>}

        </PageContainer>
    );
}
