import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable } from 'react-native';
import debounce from 'lodash.debounce';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import { Fontisto } from '@expo/vector-icons';
import { RetrieveAllCWords } from '../../utils/actions-proverbs/Cultural_words';
import { Picker } from '@react-native-picker/picker';

export default function Report() {
    const [words, setWords] = useState([]);
    const [filteredWords, setFilteredWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [filterType, setFilterType] = useState('All');
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const data = await RetrieveAllCWords();
                const wordsList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date()
                }));
                setWords(wordsList);
                setFilteredWords(wordsList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching words:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchWords();
    }, []);

    const debouncedFilterWords = useCallback(
        debounce(() => {
            const filtered = words.filter(word => {
                const matchesSearchQuery = searchQuery
                    ? word.headings && word.headings.some(heading =>
                        heading.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    : true;
                const wordDate = word.createdAt instanceof Date ? word.createdAt : new Date(word.createdAt);
                const matchesDateRange = wordDate >= startDate && wordDate <= endDate;
                const matchesFilterType = filterType === 'All' ||
                    (word.headings && word.headings.includes(filterType));
                return matchesSearchQuery && matchesDateRange && matchesFilterType;
            });
            setFilteredWords(filtered);
        }, 300),
        [words, searchQuery, startDate, endDate, filterType]
    );

    useEffect(() => {
        debouncedFilterWords();
    }, [searchQuery, startDate, endDate, filterType, debouncedFilterWords]);

    const handleTextChange = (text) => {
        setSearchQuery(text);
    };

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            if (selectedDate > endDate) {
                setDateError('Start date cannot be later than end date.');
            } else {
                setDateError('');
            }
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
            if (selectedDate >= startDate) {
                setEndDate(selectedDate);
                setDateError('');
            } else {
                setDateError('End date cannot be earlier than start date.');
            }
        }
    };

    const generateReport = async () => {
        if (dateError) {
            alert(dateError);
            return;
        }
        const rowCount = filteredWords.length;
        const htmlContent = `
          <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .report-container { padding: 20px; }
                    h1 { color: #333; }
                    .todo-item { margin-bottom: 10px; }
                    .heading { font-size: 16px; font-weight: bold; }
                    .summary { margin-bottom: 20px; }
                    hr { border: 0.5px solid #ccc; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h1>NEW ${filterType} ENTERED TO THE SYSTEM</h1>
                    <p>Date Range: ${startDate.toDateString()} - ${endDate.toDateString()}</p>
                    <p class="summary">Total Items: ${rowCount}</p>
                    <hr>
                    ${filteredWords.map(word => `
                        <div class="todo-item">
                            ${word.headings.map(heading => `
                                <p class="heading">${heading}</p>
                            `).join('')}
                            <p>Created: ${word.createdAt.toDateString()}</p>
                        </div>
                        <hr>
                    `).join('')}
                </div>
            </body>
            </html>
        `;

        try {
            await Print.printAsync({ html: htmlContent });
            alert("Report generated successfully!");
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Error generating report: " + error.message);
        }
    };

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (error) {
        return <View style={styles.container}><Text>Error: {error}</Text></View>;
    }

    return (
        <View style={styles.PageContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder='Search words'
                placeholderTextColor='#aaaaaa'
                onChangeText={handleTextChange}
                value={searchQuery}
            />
            <View style={styles.btns}>
                <Pressable
                    style={[styles.Filterbtn, { backgroundColor: showDateFilter ? '#4CAF50' : '#007BFF' }]}
                    onPress={() => setShowDateFilter(!showDateFilter)}
                >
                    <Text style={styles.name}>{showDateFilter ? 'Hide Filter' : 'Show Filter'}</Text>
                </Pressable>
                <Pressable style={[styles.Filterbtn, { backgroundColor: '#f44336' }]} onPress={generateReport}>
                    <Text style={styles.name}>Generate Report</Text>
                </Pressable>
            </View>
            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            {showDateFilter && (
                <View style={styles.dateFilterContainer}>
                    <Text style={[styles.dateText, { color: 'blue', fontWeight: 'bold' }]}>
                        Choose The Dates
                    </Text>
                    <View style={styles.filterRow}>
                        <Text style={styles.dateText}>Select Filter Type:</Text>
                        <Picker
                            selectedValue={filterType}
                            style={{ height: 50, width: 150 }}
                            onValueChange={(itemValue) => setFilterType(itemValue)}
                        >
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="Cultural" value="Cultural" />
                            <Picker.Item label="Number" value="Numbers" />
                        </Picker>
                    </View>
                    <View style={styles.dateRow}>
                        <Pressable onPress={() => setShowStartDatePicker(true)}>
                            <Fontisto name="date" size={24} color="black" />
                        </Pressable>
                        <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
                    </View>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode='date'
                            display='default'
                            onChange={handleStartDateChange}
                        />
                    )}
                    <View style={styles.dateRow}>
                        <Pressable onPress={() => setShowEndDatePicker(true)}>
                            <Fontisto name="date" size={24} color="black" />
                        </Pressable>
                        <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
                    </View>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode='date'
                            display='default'
                            onChange={handleEndDateChange}
                        />
                    )}
                </View>
            )}
            {filteredWords.length > 0 ? (
                <FlatList
                    data={filteredWords}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <View style={styles.card}>
                                <View style={styles.innerContainer}>
                                    {item.headings && item.headings.map((heading, index) => (
                                        <Text key={index} style={styles.itemHeading}>
                                            {heading}
                                        </Text>
                                    ))}
                                    <Text style={[styles.dateText, { alignSelf: 'flex-end', fontSize: 12 }]}>
                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.Text}>No Words found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    PageContainer: {
        flex: 1,
        padding: 10,
        paddingTop: 30
    },
    btns: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    name: {
        fontWeight: 'bold',
        color: 'white',
    },
    Text: {
        paddingTop: 30,
        textAlign: 'center',
    },
    Filterbtn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: '#888',
        borderWidth: 1,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 14,
        marginVertical: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    container: {
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    innerContainer: {
        padding: 10,
    },
    itemHeading: {
        fontSize: 16,
        marginBottom: 5,
    },
    dateText: {
        marginTop: 5,
        fontSize: 14,
    },
    dateFilterContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginTop: 10,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
});
