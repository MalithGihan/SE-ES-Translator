import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Pressable, ScrollView, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UpdateCword } from "../../utils/actions-proverbs/Cultural_words";

const Details = ({ route }) => {
    const { item } = route.params || {};
    const [headings, setHeadings] = useState(item.headings || []);
    const navigation = useNavigation();

    useEffect(() => {
        if (!item || !item.id) {
            alert("Invalid item data");
            navigation.goBack();
        }
    }, [item, navigation]);

    const handleHeadingChange = (text, index) => {
        const updatedHeadings = [...headings];
        updatedHeadings[index] = text;
        setHeadings(updatedHeadings);
    };

    const handleUpdate = async () => {
        try {
            await UpdateCword(item.id, headings, navigation);
            Alert.alert('Success', 'Cultural word updated successfully.');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.formContainer}>
            {headings.map((heading, index) => (
                <TextInput
                    key={index}
                    style={styles.textField}
                    placeholder='Update heading'
                    onChangeText={(text) => handleHeadingChange(text, index)}
                    value={heading}
                />
            ))}
            <Pressable style={styles.buttonUpdate} onPress={handleUpdate}>
                <Text style={styles.buttonTextd}>Update</Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={handleCancel}>
                <Text style={styles.buttonTextc}>Cancel</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Details;

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#bfdad9',
    },
    textField: {
        width: '100%',
        height: 50,
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#000',
        backgroundColor: '#fff',
    },
    buttonUpdate: {
        width: '70%',
        height: 50,
        borderColor: 'blue',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonCancel: {
        width: '70%',
        height: 50,
        borderColor: 'red',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonTextd: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextc: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
