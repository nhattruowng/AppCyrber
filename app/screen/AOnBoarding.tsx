import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Color, FontFamily } from "../GlobalStyles";
import Group from '../../assets/images/Group.png'

const AOnBoarding = () => {
  return (
    <View style={styles.aOnBoarding}>
      <Image
        style={styles.beautifulYoungSportyWomanTIcon}
        resizeMode="cover"
        source={require("../../assets/images/beautiful-young-sporty-woman-training-workout-gym 3.png")}
      />
      <Text style={[styles.welcomeTo, styles.fitbodyClr]}>Welcome to</Text>
      <Text style={[styles.fitbody, styles.textFlexBox]}>
        <Text style={styles.fitbodyTxt}>
          <Text style={styles.fit}>FIT</Text>
          <Text style={styles.body}>BODY</Text>
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  childPosition: {
    top: "50%",
    left: "50%",
    position: "absolute",
  },
  fitbodyClr: {
    color: Color.color1,
    left: "50%",
  },
  textFlexBox: {
    alignItems: "center",
    display: "flex",
    textTransform: "capitalize",
    position: "absolute",
  },
  beautifulYoungSportyWomanTIcon: {
    width: 393,
    left: "50%",
    top: 0,
    marginLeft: -196.5,
    position: "absolute",
    height: 852,
  },
  aOnBoardingChild: {
    marginTop: -426,
    marginLeft: -196.5,
    top: "50%",
  },
  welcomeTo: {
    marginLeft: -64.5,
    top: 326,
    fontSize: 25,
    lineHeight: 28,
    fontWeight: "700",
    fontFamily: FontFamily.leagueSpartanBold,
    textAlign: "left",
    position: "absolute",
  },
  text: {
    left: 35,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: FontFamily.leagueSpartanMedium,
    color: "#fff",
    width: 30,
    height: 14,
    top: 9,
    textAlign: "left",
  },
  vectorIcon: {
    left: 302,
    top: 9,
    position: "absolute",
  },
  vectorIcon1: {
    top: 11,
    left: 320,
    borderRadius: 58,
    position: "absolute",
  },
  frameChild: {
    marginTop: -5,
    marginLeft: 144.5,
  },
  parent: {
    left: 0,
    height: 32,
    width: 393,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  groupIcon: {
    top: "43.66%",
    right: "26.87%",
    bottom: "46.38%",
    left: "26.72%",
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  fit: {
    fontWeight: "800",
    fontFamily: FontFamily.poppinsExtraBoldItalic,
    fontStyle: "italic",
  },
  body: {
    fontFamily: FontFamily.poppinsItalic,
    fontStyle: "italic",
  },
  fitbodyTxt: {
    width: "100%",
  },
  fitbody: {
    marginLeft: -187.5,
    top: 445,
    fontSize: 54,
    textAlign: "center",
    width: 374,
    height: 81,
    color: Color.color1,
    left: "50%",
  },
  aOnBoarding: {
    borderRadius: 20,
    backgroundColor: Color.color4,
    flex: 1,
    overflow: "hidden",
    height: 852,
    width: "100%",
  },
});

export default AOnBoarding;
