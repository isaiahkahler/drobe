import React from 'react';
import { PageContainer, PageLayout, Tile, PC, drobeAccent } from '../../../common/ui/basicComponents';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AddProps {
    tryOpenCamera: () => void,
    tryOpenImagePicker: () => void,
    navigation: any,
}

export default function Add(props: AddProps) {
    return (
        <PageContainer>
            <PageLayout style={{
                justifyContent: "space-evenly",
                alignItems: "center"
            }}>
                {/* <Tile onPress={props.tryOpenCamera}> */}
                <Tile onPress={() => props.navigation.navigate('Define')}>
                    <MaterialCommunityIcons
                        name="camera"
                        size={50}
                        color={drobeAccent} />
                    <PC>take photo</PC>
                </Tile>
                <Tile onPress={props.tryOpenImagePicker}>
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