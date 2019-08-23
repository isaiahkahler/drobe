import React from 'react';
import { PageContainer, PageLayout, Tile, PC, drobeAccent } from '../../../common/ui/basicComponents';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { takePhoto, chooseFromLibrary } from '../../../common/data/photoHelper';
import { DefineNavigationProps } from '../../../common/data/types';

interface AddProps {
    navigation: any,
}

export default function Add(props: AddProps) {
    return (
        <PageContainer>
            <PageLayout style={{
                justifyContent: "space-evenly",
                alignItems: "center"
            }}>
                <Tile onPress={() => {
                    takePhoto((photoURI) => {
                        const navigationProps: DefineNavigationProps = {uri: photoURI} 
                        props.navigation.navigate('Define', navigationProps);
                    }, () => {})
                }}>
                    <MaterialCommunityIcons
                        name="camera"
                        size={50}
                        color={drobeAccent} />
                    <PC>take photo</PC>
                </Tile>
                <Tile onPress={() => {
                    chooseFromLibrary((photoURI) => {
                        const navigationProps: DefineNavigationProps = {uri: photoURI} 
                        props.navigation.navigate('Define', navigationProps);
                    }, () => {})
                }}>
                    <MaterialCommunityIcons
                        name="image-multiple"
                        size={50}
                        color={drobeAccent} />
                    <PC>choose from library</PC>
                </Tile>
            </PageLayout>
        </PageContainer>
    );
}