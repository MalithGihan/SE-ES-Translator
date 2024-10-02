import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import debounce from "lodash.debounce";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import { Fontisto } from "@expo/vector-icons";
import { getProverbs } from "../../utils/actions-proverbs/proverbAction";
import CustomButton from "../../Screens/Login/CustomButton";

export default ProverbsReport = () => {
  const [proverbs, setProverbs] = useState([]);
  const [filteredProverbs, setFilteredProverbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    const fetchProverbs = async () => {
      try {
        const data = await getProverbs();
        const proverbsList = data.map((proverb) => ({
          ...proverb,
          createdAt: proverb.createdAt
            ? new Date(proverb.createdAt)
            : new Date(),
        }));
        setProverbs(proverbsList);
        setFilteredProverbs(proverbsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching proverbs:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProverbs();
  }, []);

  const debouncedFilterProverbs = useCallback(
    debounce(() => {
      const filtered = proverbs.filter((proverb) => {
        const matchesSearchQuery = searchQuery
          ? proverb.sinhaleseProverb
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            proverb.englishTranslation
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;

        const proverbDate =
          proverb.createdAt instanceof Date
            ? proverb.createdAt
            : new Date(proverb.createdAt);
        const matchesDateRange =
          proverbDate >= startDate && proverbDate <= endDate;

        return matchesSearchQuery && matchesDateRange;
      });
      setFilteredProverbs(filtered);
    }, 300),
    [proverbs, searchQuery, startDate, endDate]
  );

  useEffect(() => {
    debouncedFilterProverbs();
  }, [searchQuery, startDate, endDate, debouncedFilterProverbs]);

  const handleTextChange = (text) => {
    setSearchQuery(text);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const generateReport = async () => {
    const rowCount = filteredProverbs.length;
    const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .report-container { padding: 20px; }
                    h1 { color: #333; }
                    .proverb-item { margin-bottom: 10px; }
                    .heading { font-size: 16px; font-weight: bold; }
                    .summary { margin-bottom: 20px; }
                    hr { border: 0.5px solid #ccc; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h1>Proverbs Report</h1>
                    <p>Date Range: ${startDate.toDateString()} - ${endDate.toDateString()}</p>
                    <p class="summary">Total Proverbs: ${rowCount}</p>
                    <hr>
                    ${filteredProverbs
                      .map(
                        (proverb) => `
                        <div class="proverb-item">
                            <p class="heading">Sinhalese Proverb: ${
                              proverb.sinhaleseProverb
                            }</p>
                            <p>English Translation: ${
                              proverb.englishTranslation
                            }</p>
                            <p>Created: ${proverb.createdAt.toDateString()}</p>
                        </div>
                        <hr>
                    `
                      )
                      .join("")}
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
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.PageContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search proverbs"
        placeholderTextColor="#aaaaaa"
        onChangeText={handleTextChange}
        value={searchQuery}
      />
      <View style={styles.btns}>
        <CustomButton
          title={showDateFilter ? "Hide Filter" : "Show Filter"}
          onPress={() => setShowDateFilter(!showDateFilter)}
          isLoading={loading}
          style={{marginHorizontal:20, paddingHorizontal:20}}
        />

        <CustomButton
          title={"Generate Report"}
          onPress={generateReport}
          isLoading={loading}
          style={{ marginHorizontal:20,borderColor: 'red'}}
        />
      </View>
      {showDateFilter && (
        <View style={styles.dateFilterContainer}>
          <Text
            style={[styles.dateText, { color: "black", fontWeight: "bold" }]}
          >
            Choose The Dates
          </Text>
          <View style={styles.dateRow}>
            <Pressable onPress={() => setShowStartDatePicker(true)}>
              <Fontisto name="date" size={24} color="black" />
            </Pressable>
            <Text style={styles.dateText}>
              Start Date: {startDate.toDateString()}
            </Text>
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          <View style={styles.dateRow}>
            <Pressable onPress={() => setShowEndDatePicker(true)}>
              <Fontisto name="date" size={24} color="black" />
            </Pressable>
            <Text style={styles.dateText}>
              End Date: {endDate.toDateString()}
            </Text>
          </View>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
      )}
      {filteredProverbs.length > 0 ? (
        <FlatList
          data={filteredProverbs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.card}>
                <View style={styles.innerContainer}>
                  <Text style={styles.itemHeading}>
                     {item.sinhaleseProverb}
                  </Text>
                  <Text style={styles.itemHeading}>
                     {item.englishTranslation}
                  </Text>
                  <Text style={styles.dateText}>
                    Created: {item.createdAt.toDateString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.Text}>No proverbs found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  PageContainer: {
    flex: 1,
    padding: 10,
    width:'100%'
  },
  btns: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  name: {
    fontWeight: "bold",
    color: "white",
  },
  Text: {
    paddingTop: 30,
    textAlign: "center",
  },
  Filterbtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "#888",
    borderWidth: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    marginBottom: 0,
    color: "#000",
    backgroundColor: "#fff",
  },
  dateFilterContainer: {
    marginVertical: 20,
    marginHorizontal:10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  dateText: {
    marginTop: 10,
    marginLeft: 10,
    textAlign:'right',
    fontSize: 16,
    color: "#333",
  },
  container: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  innerContainer: {
    justifyContent: "center",
  },
  itemHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  card: {
    width: "100%",
    minHeight: 60,
  },
});
