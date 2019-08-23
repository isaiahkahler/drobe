import React from 'react';
import { PageContainer, ScrollPageLayout } from '../../../common/ui/basicComponents';
import { Picker } from 'react-native';

export default function Create() {
    return(
        <PageContainer>
            <ScrollPageLayout>
                <Picker>
                    <Picker.Item label="hello" value='hello'/>
                    <Picker.Item label="hi" value='hi'/>
                </Picker>
            </ScrollPageLayout>
        </PageContainer>
    );
}