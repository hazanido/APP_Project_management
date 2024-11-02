import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/logo1.png')} 
                style={styles.logo}
            />
          
            <Text style={styles.title}>אפליקציה לניהול פרויקטים</Text>

            <Text style={styles.description}>אפליקציה לניהול פרויקטים בצורה פשוטה ויעילה. אפשרות ליצירת פרויקטים, מעקב אחר משימות ושיתוף פעולה בין חברי הצוות.</Text>

            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Image
                    source={require('../../assets/continue_he.png')} 
                    style={styles.buttonImage}
                />
            </TouchableOpacity>
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
    logo: {
        width: 300, 
        height: 300, 
        marginBottom: 150,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        margin: 10,
    },
    buttonImage: {
        width: 200, 
        height: 50, 
        borderRadius: 15, 
        overflow: 'hidden',
    },
});

export default HomeScreen;
