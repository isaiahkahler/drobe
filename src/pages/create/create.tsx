import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CreateProps { }

export default function Create(props: CreateProps) {
    return (
        <View style={styles.container}>
            <Text>Create</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  