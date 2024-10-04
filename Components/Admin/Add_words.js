import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AddCWord } from "../../utils/actions-proverbs/Cultural_words";
import { Picker } from '@react-native-picker/picker';

export default Add_words = () => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [selectedOption, setSelectedOption] = useState('Cultural');
    const navigation = useNavigation();

    const validateCulturalInputs = (inputs) => {
        return inputs.length == 5;
    };
    const validateNumberInputs = (numberInputs) => {
        return numberInputs.length == 2;
    };
    const addCulturalWord = async () => {
        const inputs = [selectedOption, input1, input2, input3, input4].filter(input => input.trim().length > 0);
        const numberInputs = [input1, input2].filter(input => input.trim().length > 0);
        try {
            if (selectedOption === 'Cultural' && validateCulturalInputs(inputs)) {
                const newTodo = await AddCWord(inputs);
                resetInputs();
                Keyboard.dismiss();
                navigation.navigate('Edit_words', { item: newTodo });
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Cultural words added successfully!'
                });
            } else if (selectedOption === 'Numbers' && validateNumberInputs(numberInputs)) {
                const newTodo = await AddCWord(inputs);
                resetInputs();
                Keyboard.dismiss();
                navigation.navigate('Edit_words', { item: newTodo });

                console.log("Number inputs:", numberInputs);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Numbers added successfully!'
                });
            } else {
                throw new Error('Please enter all input.');
            }
        } catch (error) {
            console.error('Please enter all input.:', error);
            Toast.show({
                type: 'error',
                text1: 'Please enter all input.',
                text2: `Please enter all input.`
            });
        }
    };

    const resetInputs = () => {
        setInput1('');
        setInput2('');
        setInput3('');
        setInput4('');
    };

    return (
        <View style={styles.PageContainer}>
            <Text style={styles.label}>Select Option</Text>
            <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Cultural" value="Cultural" />
                <Picker.Item label="Numbers" value="Numbers" />
            </Picker>

            {selectedOption === 'Cultural' && (
                <>
                    <Text style={styles.label}>Related English word</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter English word'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput1}
                            value={input1}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                        />
                    </View>
                    <Text style={styles.label}>Translation meaning</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter translation meaning'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput2}
                            value={input2}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                        />
                    </View>
                    <Text style={styles.label}>Cultural meaning</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter cultural meaning'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput3}
                            value={input3}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                        />
                    </View>
                    <Text style={styles.label}>Province</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter Province'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput4}
                            value={input4}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                        />
                    </View>
                </>
            )}

            {selectedOption === 'Numbers' && (
                <>
                    <Text style={styles.label}>Numeric number</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Numeric number : ex (1)'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput1}
                            value={input1}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                            keyboardType="numeric"
                        />
                    </View>
                    <Text style={styles.label}>Number in Word</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Number in Word : ex (එක)'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={setInput2}
                            value={input2}
                            underlineColorAndroid='transparent'
                            autoCapitalize='none'
                        />
                    </View>
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={addCulturalWord}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    PageContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 0,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 10,
        backgroundColor: '#fff',
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
        width: '70%',
        borderColor: 'blue',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
