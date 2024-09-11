import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UpdateCword } from "../../utils/actions-proverbs/Cultural_words";

const Details = ({ route }) => {
    const { item } = route.params || {}; // Safeguard against missing item
    const [headings, setHeadings] = useState(item.headings || []); 
    const [currentHeading, setCurrentHeading] = useState(''); 
    const navigation = useNavigation();

    useEffect(() => {
        if (!item || !item.id) {
            alert("Invalid item data");
            navigation.goBack();
        }
    }, [item, navigation]);

    const handleUpdate = async () => {
        try {
            await UpdateCword(item.id, headings, navigation);
        } catch (error) {
            alert(error.message);
        }
    };

    const addHeading = () => {
        if (currentHeading.trim().length > 0) {
            setHeadings([...headings, currentHeading]);
            setCurrentHeading(''); 
        }
    };

    const removeHeading = (index) => {
        const updatedHeadings = headings.filter((_, i) => i !== index);
        setHeadings(updatedHeadings);
    };

    const handleCancel = () => {
        navigation.goBack(); 
    };

    return (
        <ScrollView contentContainerStyle={styles.formContainer}>
            {headings.map((heading, index) => (
                <View key={index} style={styles.headingContainer}>
                    <Text style={styles.headingText}>{heading}</Text>
                    <TouchableOpacity onPress={() => removeHeading(index)}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <TextInput
                style={styles.textField}
                placeholder='Add new heading'
                onChangeText={(text) => setCurrentHeading(text)}
                value={currentHeading}
            />
            <Pressable style={styles.buttonAdd} onPress={addHeading}>
                <Text style={styles.buttonText}>Add Heading</Text>
            </Pressable>
            <Pressable style={styles.buttonUpdate} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
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
    buttonAdd: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonUpdate: {
        width: '100%',
        height: 50,
        backgroundColor: '#0288D1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonCancel: {
        width: '100%',
        height: 50,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headingContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    headingText: {
        fontSize: 16,
        color: '#333',
    },
    removeText: {
        color: 'red',
        fontSize: 16,
    },
});
