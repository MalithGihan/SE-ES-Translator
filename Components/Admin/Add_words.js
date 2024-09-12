import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Keyboard } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AddCWord } from "../../utils/actions-proverbs/Cultural_words";

export default Add_words = () => {
    const [inputs, setInputs] = useState(['']);
    const navigation = useNavigation();

    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
    };

    const removeInputField = (index) => {
        if (inputs.length > 1) {
            const newInputs = inputs.filter((_, i) => i !== index);
            setInputs(newInputs);
        } else {
            alert('You need at least one input field.');
        }
    };

    const addInputField = () => {
        setInputs([...inputs, '']);
    };

    const addCulturalWord = async () => {
        const nonEmptyInputs = inputs.filter(input => input.trim().length > 0);
        if (nonEmptyInputs.length > 0) {
            try {
                // Call AddCWord and wait for it to return the new cultural word
                const newTodo = await AddCWord(nonEmptyInputs);
                
                // Reset the inputs and navigate to the Details screen
                setInputs(['']);
                Keyboard.dismiss();
                navigation.navigate('Details', { item: newTodo });

                alert('Cultural words added successfully!');
            } catch (error) {
                console.error('Error adding cultural word:', error);
                alert('Error adding cultural word: ' + error.message);
            }
        } else {
            alert('Please enter at least one non-empty input.');
        }
    };

    return (
        <View style={styles.PageContainer}>
            {inputs.map((input, index) => (
                <View key={index} style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Add New Cultural Word'
                        placeholderTextColor='#aaaaaa'
                        onChangeText={(text) => handleInputChange(text, index)}
                        value={input}
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                    />
                    <TouchableOpacity onPress={() => removeInputField(index)}>
                        <FontAwesome name='trash' color='red' style={styles.removeIcon} />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addInputField}>
                <Text style={styles.addButtonText}>Add Input Field</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={addCulturalWord}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    PageContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#bfdad9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff',
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        marginRight: 10,
        color: '#000',
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        width: 80,
        backgroundColor: '#0288D1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        height: 50,
        width: 150,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeIcon: {
        fontSize: 24,
        marginLeft: 10,
    },
});
