import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { ThemeContext } from "./SettingsContext";
import Toast from "react-native-toast-message";

export default Quiz = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [allTranslations, setAllTranslations] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const translationsRef = ref(db, "translations");

    onValue(translationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const translations = Object.values(data).map(
          (item) => item.translatedtext
        );
        setAllTranslations(translations);

        const quizItems = Object.keys(data).map((key) => ({
          question: data[key].enteredtext,
          correctAnswer: data[key].translatedtext,
          options: generateOptions(data[key].translatedtext, translations),
        }));
        const shuffledQuizItems = shuffleArray(quizItems);
        setQuizData(shuffledQuizItems);
      }
    });
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateOptions = (correctAnswer, translations) => {
    const wrongAnswers = generateWrongAnswers(correctAnswer, translations);
    const options = [...wrongAnswers, correctAnswer];
    return shuffleArray(options);
  };

  const generateWrongAnswers = (correctAnswer, translations) => {
    const wrongAnswers = [];
    const availableAnswers = translations.filter((t) => t !== correctAnswer);

    while (wrongAnswers.length < 3 && availableAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableAnswers.length);
      const randomWord = availableAnswers.splice(randomIndex, 1)[0];
      wrongAnswers.push(randomWord);
    }
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(`Dummy Answer ${wrongAnswers.length + 1}`);
    }
    return wrongAnswers;
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      Toast.show({
        text1: "Correct!",
        text2: "Good job!",
        type: "success",
        position: "top",
        visibilityTime: 2000,
      });
    } else {
      setLives(lives - 1);
      Toast.show({
        text1: "Wrong!",
        text2: `The correct answer was: ${quizData[currentQuestionIndex].correctAnswer}`,
        type: "error",
        position: "top",
        visibilityTime: 2000,
      });
    }

    if (lives <= 1) {
      setShowResult(true);
      if (score >= highScore) {
        setHighScore(score);
      }
      return;
    }
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      if (score >= highScore) {
        setHighScore(score);
      }
    }
  };

  const restartQuiz = () => {
    const reshuffledQuizItems = shuffleArray([...quizData]);
    setQuizData(reshuffledQuizItems);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setShowResult(false);
  };

  if (quizData.length === 0) {
    return <Text style={{textAlign:'auto',alignContent:"center"}}>Loading...</Text>;
  }

  if (showResult) {
    return (
      <ImageBackground
        style={[styles.backgroundImage, {backgroundColor: isDarkMode ? "#000" : "#E9E3E6"}]}
      >
        <Image
          source={
            isDarkMode
              ? require("../assets/images/Untitled-1.png")
              : require("../assets/images/blck logo2.png")
          }
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.container}>
          <View>
            <Text
              style={[styles.resultText, { fontWeight: "bold", fontSize: 30, color: isDarkMode ? "white" : "#736F72" }]}
            >
              Your Score
            </Text>
            <Text style={[styles.resultCount,{ color: isDarkMode ? "white" : "#736F72" }]}>
              {score} / {quizData.length}
            </Text>
          </View>
          <Text style={[styles.highScoreText,{ color: isDarkMode ? "white" : "#736F72" }]}>Highest Score: {highScore}</Text>
          <TouchableOpacity style={styles.btn1} onPress={restartQuiz}>
            <Text>Restart Quiz </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View
      style={[
        styles.page,
        { backgroundColor: isDarkMode ? "#000" : "#E9E3E6" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headertit,
            { color: isDarkMode ? "white" : "#736F72" },
          ]}
        >
          Quize
        </Text>
        <Image
          source={
            isDarkMode
              ? require("../assets/images/Untitled-1.png")
              : require("../assets/images/blck logo2.png")
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.livesText1,{ color: isDarkMode ? "white" : "#736F72" }]}>Lives</Text>
      <Text style={styles.count}>{lives}</Text>

      <View style={styles.question}>
        <Text
          style={[
            styles.questiontext,
            { fontWeight: "bold", color: isDarkMode ? "white" : "#000"  },
          ]}
        >
          Question
        </Text>
        <Text
          style={[
            styles.q2,
            { color: isDarkMode ? "white" : "#000" },
          ]}
        >
          {quizData[currentQuestionIndex].question}
        </Text>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <Text
        style={[styles.infotext, { color: isDarkMode ? "white" : "#736F72" }]}
      >
        Choose the correct Answer
      </Text>

      <FlatList
        data={quizData[currentQuestionIndex].options}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  selectedAnswer === item ? "#B2B2B2" : "white",
              },
            ]}
            onPress={() => handleAnswerSelect(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        <Text>Next </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    width: "auto",
    backgroundColor: "red",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  headertit: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 5,
  },
  livesText1: {
    fontSize: 18,
    color: 'black',
    fontWeight: '400',
    marginBottom: 5,
    alignSelf: 'flex-end',
    right:20,
  },
  count: {
    fontSize: 25,
    color: 'red', 
    fontWeight: '900',
    alignSelf: 'flex-end',
    right: 40,
    marginBottom:15
  },
  question: {
    width: "100%",
    padding: 3,
    left:15,
    marginBottom: 10,
  },
  questiontext: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom:5
  },
  q2: {
    fontSize: 25,
    fontWeight:'900',
    marginBottom:10
  },
  infotext: {
    fontSize: 15,
    alignSelf: 'flex-start',
    fontWeight: "500",
    marginBottom: 25,
    marginLeft:15
  },
  optionButton: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical:10,
    borderRadius: 10,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 20,
  },

  backgroundImage:{
    flex:1,
    width:'100%',
    height:'100%',
    paddingHorizontal:15,
    paddingTop:100,
    alignItems:'center'              
  },



  optionText: {
    fontSize: 15,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },

  resultCount:{
    fontSize:90,
    fontWeight:'900',
    textAlign:'center',
    marginBottom:20
  },

  highScoreText: {
    fontSize: 20,
    marginBottom: 30,
    textAlign:'center',
    fontWeight: "bold",
  },

  btn: {
    width: "50%",
    marginTop: 40,
    marginBottom: 120,
    borderRadius: 10,
    padding: 8,
    backgroundColor: "white",
    shadowColor: "black",
    elevation: 9,
    alignSelf: "center",
    color:'black',
    alignItems:'center'
  },
  
  btn1: {
    width: "100%",
    borderColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal:50,
    backgroundColor: "white",
    shadowColor: "black",
    elevation: 9,
    alignSelf: "center",
    alignItems:'center'
  },
  
});
