import React, { useState, useMemo, createRef, useEffect } from 'react';
import { Image, Text, ScrollView, ActionSheetIOS, Alert, View, Animated } from 'react-native';
import { PageContainer, ScrollPageLayout, Center, HorizontalSpace, FullInput, FloatingBottomButton, Row, CircleButton, P, FullButton, PageLayout, Modal, HR, Label, Header, Column } from '../../../common/ui/basicComponents';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Item, Classes, Sizes, Prices } from '../../../common/data/types';
import { Cell, Section, TableView } from "react-native-tableview-simple";
import ColorPicker from '../../../common/ui/colorPicker';
import { TriangleColorPicker } from '../../../common/ui/colorpicker/TriangleColorPicker';
import { takePhoto, chooseFromLibrary } from '../../../common/data/photoHelper';
import { isIos, height, drobeAccent, dangerColor,iconSize } from '../,./../../../common/data/constants';

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


                {!!itemPhotoURI && !itemExtraPhotos &&
                    <>
                        <HorizontalSpace />
                        <Center>
                            <Image source={{ uri: itemPhotoURI }} style={{ resizeMode: "contain", height: height * 0.30, width: "100%" }} />
                        </Center>
                    </>
                }

                {!!itemExtraPhotos &&
                    <>
                        <HorizontalSpace />
                        {/* <FlatList 
                            data={[itemPhotoURI].concat(itemExtraPhotos)}
                            horizontal
                            renderItem={(data) => {
                                return(
                                    <Image source={{uri: data.item}} style={{resizeMode: 'contain', height: height * 0.3, aspectRatio: 1}} />
                                    // <View style={{width: 100, height: 100, backgroundColor: drobeAccent}} />
                                );
                            }}
                            // style={{alignItems: "center"}}
                            contentContainerStyle={{alignItems: "center", alignContent: 'center'}}
                            keyExtractor={(item, index) => index.toString()}
                        /> */}
                        <ScrollView
                            horizontal
                        // pagingEnabled
                        >
                            <Image source={{ uri: itemPhotoURI }} style={{ resizeMode: "contain", height: height * 0.30, aspectRatio: 1 }} />
                            {itemExtraPhotos.map((item, index) => {
                                return (
                                    <Image source={{ uri: item }} key={index} style={{ resizeMode: 'contain', height: height * 0.3, aspectRatio: 1 }} />
                                );
                            })}
                        </ScrollView>
                    </>
                }

                <HorizontalSpace />

                <Row>
                    <CircleButton defaultHeight onPress={() => {
                        if (isIos) {
                            ActionSheetIOS.showActionSheetWithOptions({
                                options: ['take photo', 'choose from library', 'cancel'],
                                cancelButtonIndex: 2,
                            },
                                (index) => {
                                    if (index === 0) {
                                        takePhoto((photoURI) => {
                                            if (!!itemExtraPhotos) {
                                                setItemExtraPhotos([...itemExtraPhotos, photoURI]);
                                            } else {
                                                setItemExtraPhotos([photoURI]);
                                            }
                                        }, () => { });
                                    } else if (index === 1) {
                                        chooseFromLibrary((photoURI) => {
                                            if (!!itemExtraPhotos) {
                                                setItemExtraPhotos([...itemExtraPhotos, photoURI]);
                                            } else {
                                                setItemExtraPhotos([photoURI]);
                                            }

                                        }, () => { });
                                    }
                                }
                            );
                        } else {
                            Alert.alert(
                                "Choose photo from...",
                                '',
                                [
                                    {
                                        text: 'camera', onPress: () => {
                                            takePhoto((photoURI) => {
                                                if (!!itemExtraPhotos) {
                                                    setItemExtraPhotos([...itemExtraPhotos, photoURI]);
                                                } else {
                                                    setItemExtraPhotos([photoURI]);
                                                }
                                            }, () => { });
                                        }
                                    },
                                    {
                                        text: 'library', onPress: () => {
                                            chooseFromLibrary((photoURI) => {
                                                if (!!itemExtraPhotos) {
                                                    setItemExtraPhotos([...itemExtraPhotos, photoURI]);
                                                } else {
                                                    setItemExtraPhotos([photoURI]);
                                                }

                                            }, () => { });
                                        }
                                    }
                                ]
                            )
                        }
                    }}>
                        <MaterialIcons name='add-a-photo' size={iconSize - 5} />
                    </CircleButton>
                </Row>

                <HorizontalSpace />

                <FullInput value={itemName} placeholder='item name (optional)' onChangeText={(text) => setItemName(text)} />

                <HorizontalSpace onLayout={(event) => {
                    setClassComponentY(event.nativeEvent.layout.y)
                }} />



                <RequiredField showLabel={showValidity} padding>

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
                    
                </RequiredField>


                <HorizontalSpace />





                <TableView>
                    <Section sectionPaddingBottom={0} sectionPaddingTop={0}>

                        {!!itemClass && (
                            !!itemType ? (
                                <Cell title={itemType} accessoryColor={drobeAccent} accessory='Checkmark' onPress={() => setItemType(null)} />
                            ) : (
                                    Classes[itemClass].map((item, index) => <Cell key={index} title={item} onPress={() => { setItemType(item as any) }} />)
                                )
                        )}
                    </Section>
                </TableView>


                <HorizontalSpace />

                <FullButton onPress={() => setShowModal(true)}><P>add {!!itemColors && 'another'} color...</P></FullButton>

                <HorizontalSpace />

                <Row>
                    {!!itemColors && itemColors.map((itemColor, index) => {
                        return (
                            <CircleButton
                                key={index}
                                style={{ backgroundColor: itemColor }}
                                defaultHeight
                                onPress={() => {

                                }}
                            ><P></P></CircleButton>
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


interface RequiredFieldProps {
    children?: React.ReactNode,
    showLabel?: boolean,
    padding?: boolean,
}


const AnimatedColumn = Animated.createAnimatedComponent(Column);

function RequiredField(props: RequiredFieldProps) {

    const width = new Animated.Value(0);

    const padding = new Animated.Value(0);

    const opacity = new Animated.Value(0);


    useEffect(() => {
        if(props.showLabel){
            Animated.timing(width, {
                toValue: 2,
                duration: 1000,
            }).start();
            props.padding && Animated.timing(padding, {
                toValue: 10,
                duration: 1000,
            }).start();
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000
            }).start();
        }
    }, [props.showLabel]);

    return (
        <AnimatedColumn
            style={{
                borderWidth: width,
                borderRadius: 15,
                borderColor: dangerColor,
                padding: padding,
            }}
        >
            <Row style={{
                top: -15,
                position: "absolute",
                alignSelf: "center"
            }}>
                <Animated.View style={{
                    backgroundColor: "#fff",
                    padding: 5,
                    opacity: opacity
                }}>
                    <Text style={{ color: dangerColor }}>Required</Text>
                </Animated.View>
            </Row>
            {props.children}
        </AnimatedColumn>
    );
}