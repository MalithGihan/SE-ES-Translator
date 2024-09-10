import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, { G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";

export default NextButton = ({ percentage, scrollTo }) => {
  const size = 100;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animateCircle = (toValue) => {
    Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateCircle(percentage);
  }, [percentage]);

  useEffect(() => {
    const listenerId = progressAnimation.addListener((value) => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;

      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      progressAnimation.removeAllListeners()
    };

  }, [percentage]);


  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            stroke="gray"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            ref={progressRef}
            stroke="gray"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
        <AntDesign name="arrowright" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    backgroundColor: "gray",
    borderRadius: 100,
    padding: 15,
  },
});
