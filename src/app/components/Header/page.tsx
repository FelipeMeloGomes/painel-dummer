import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import styles from "./styles";

interface IHeader {
  title: string;
  highlight: string;
  slogan: string;
}

const Header = ({ title, highlight, slogan }: IHeader) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < slogan.length) {
        setTypedText((prev) => prev + slogan[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    return () => clearInterval(typingInterval);
  }, [slogan]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0f0", "#00f"],
  });

  return (
    <View style={styles.header}>
      <Animated.Text
        style={[
          styles.logoText,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {title}{" "}
        <Animated.Text style={{ color: animatedColor, fontWeight: "900" }}>
          {highlight}
        </Animated.Text>
      </Animated.Text>
      <Text style={styles.slogan}>{typedText}</Text>
    </View>
  );
};

export default Header;
