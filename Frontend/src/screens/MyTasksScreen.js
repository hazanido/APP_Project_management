import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyTasksScreen = () => {
    return (
        <View style={styles.container}>
            <Text>המשימות שלי</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default MyTasksScreen;
