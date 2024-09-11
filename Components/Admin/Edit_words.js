import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import { fetchTodos, deleteTodo } from "../../utils/actions-proverbs/Cultural_words";

export default function Edit_words () {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [additionalInput2, setAdditionalInput2] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = fetchTodos(setTodos, setFilteredTodos, setLoading, setError);
        return () => unsubscribe();
    }, []);

    const debouncedFilterTodos = useCallback(debounce(() => {
        const filtered = todos.filter(todo => {
            const matchesAdditionalInput2 = additionalInput2
                ? todo.headings && todo.headings.some(heading => heading.toLowerCase().includes(additionalInput2.toLowerCase()))
                : true;
            const matchesSearchQuery = searchQuery
                ? todo.headings && todo.headings.some(heading => heading.toLowerCase().includes(searchQuery.toLowerCase()))
                : true;
            return matchesAdditionalInput2 && matchesSearchQuery;
        });
        setFilteredTodos(filtered);
    }, 300), [todos, additionalInput2, searchQuery]);

    useEffect(() => {
        debouncedFilterTodos();  
    }, [additionalInput2, searchQuery, debouncedFilterTodos]);

    const handleTextChange = (text) => {
        setAdditionalInput2(text);
        setSearchQuery(text);
        debouncedFilterTodos();
    };

    return (
        <View style={styles.PageContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder='Search todos'
                placeholderTextColor='#aaaaaa'
                onChangeText={handleTextChange}
                value={additionalInput2}
            />
            {filteredTodos.length > 0 ? (
                <FlatList
                    data={filteredTodos}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <Pressable style={styles.card}
                                onPress={() => navigation.navigate('Details', { item })}
                            >
                                <View style={styles.innerContainer}>
                                    {item.headings && item.headings.map((heading, index) => (
                                        <Text key={index} style={styles.itemHeading}>
                                            {heading}
                                        </Text>
                                    ))}
                                </View>
                                <FontAwesome
                                    name='trash'
                                    color='red'
                                    onPress={() => deleteTodo(item, setTodos, setFilteredTodos)}
                                    style={styles.deletebtn}
                                />
                            </Pressable>
                        </View>
                    )}
                />
            ) : (
                <Text>No todos found. Add a todo to get started!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    PageContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#bfdad9',
        justifyContent: 'center',
        paddingTop: 10
    },
    searchInput: {
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
        color: '#000',
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: 'row',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    deletebtn: {
        fontSize: 24,
        marginRight: 15,
    },
    innerContainer: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    itemHeading: {
        paddingTop: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
    }
});
