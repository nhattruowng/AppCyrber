// import * as React from "react";
// import {Image, StyleSheet, Text, View} from "react-native";
// import Rectangle162 from "../assets/rectangle-162.svg"
// import Vector from "../assets/vector.svg"
// import Vector1 from "../assets/vector1.svg"
// import Group12 from "../assets/group-12.svg"
// import Community from "../assets/community.svg"
// import { FontFamily, Color, Border } from "../GlobalStyles";

// const DOnBoarding = () => {
  	
//   	return (
//     		<View style={styles.dOnBoarding}>
//       			<Image style={[styles.beautifulYoungSportyWomanTIcon, styles.iconPosition]} resizeMode="cover" source="beautiful-young-sporty-woman-training-workout-gym 3.png" />
//       			<Rectangle162 style={[styles.dOnBoardingChild, styles.childPosition]} width={393} height={852} />
//       			<View style={[styles.parent, styles.gradientPosition]}>
//         				<Text style={styles.text}>16:04</Text>
//         				<Vector style={styles.vectorIcon} width={13} height={11} />
//         				<Vector1 style={styles.vectorIcon1} width={15} height={8} />
//         				<Group12 style={[styles.frameChild, styles.childPosition]} width={17} height={9} />
//       			</View>
//       			<View style={[styles.gradientButton, styles.gradientLayout1]}>
//         				<View style={[styles.gradientButtonChild, styles.gradientLayout1]} />
//         				<View style={[styles.gradientButtonItem, styles.gradientLayout1]} />
//       			</View>
//       			<Text style={[styles.aCommunityFor, styles.getStartedTypo]}>A community for you, challenge yourself</Text>
//       			<View style={[styles.gradientButtonParent, styles.gradientLayout]}>
//         				<View style={[styles.gradientButton1, styles.gradientLayout]}>
//           					<View style={[styles.gradientButton2, styles.gradientLayout]}>
//             						<View style={[styles.gradientButton3, styles.gradientLayout]}>
//               							<View style={[styles.gradientButtonInner, styles.rectangleViewLayout]} />
//               							<View style={[styles.rectangleView, styles.rectangleViewLayout]} />
//             						</View>
//           					</View>
//         				</View>
//         				<Text style={[styles.getStarted, styles.getStartedTypo]}>Get Started</Text>
//       			</View>
//       			<View style={styles.rectangleParent}>
//         				<View style={[styles.groupChild, styles.groupLayout]} />
//         				<View style={[styles.groupItem, styles.groupLayout]} />
//         				<View style={[styles.groupInner, styles.groupLayout]} />
//       			</View>
//       			<Community style={[styles.communityIcon, styles.iconPosition]} width={64} height={43} />
//     		</View>);
// };

// const styles = StyleSheet.create({
//   	iconPosition: {
//     		left: "50%",
//     		position: "absolute"
//   	},
//   	childPosition: {
//     		top: "50%",
//     		left: "50%",
//     		position: "absolute"
//   	},
//   	gradientPosition: {
//     		left: 0,
//     		top: 0
//   	},
//   	gradientLayout1: {
//     		height: 169,
//     		width: 394,
//     		position: "absolute"
//   	},
//   	getStartedTypo: {
//     		justifyContent: "center",
//     		textAlign: "center",
//     		fontFamily: FontFamily.poppinsBold,
//     		fontWeight: "700",
//     		alignItems: "center",
//     		display: "flex",
//     		color: Color.font2,
//     		textTransform: "capitalize",
//     		left: "50%",
//     		position: "absolute"
//   	},
//   	gradientLayout: {
//     		height: 44,
//     		width: 211,
//     		position: "absolute"
//   	},
//   	rectangleViewLayout: {
//     		borderRadius: Border.br_81xl,
//     		height: 44,
//     		width: 211,
//     		left: 0,
//     		top: 0,
//     		position: "absolute"
//   	},
//   	groupLayout: {
//     		width: 20,
//     		borderRadius: Border.br_xs,
//     		height: 4,
//     		left: "50%",
//     		top: 0,
//     		position: "absolute"
//   	},
//   	beautifulYoungSportyWomanTIcon: {
//     		width: 393,
//     		top: 0,
//     		left: "50%",
//     		marginLeft: -196.5,
//     		height: 852
//   	},
//   	dOnBoardingChild: {
//     		marginTop: -426,
//     		marginLeft: -196.5,
//     		top: "50%"
//   	},
//   	text: {
//     		left: 35,
//     		fontSize: 13,
//     		fontWeight: "500",
//     		fontFamily: FontFamily.leagueSpartanMedium,
//     		textAlign: "left",
//     		width: 30,
//     		height: 14,
//     		alignItems: "center",
//     		display: "flex",
//     		color: Color.font2,
//     		textTransform: "capitalize",
//     		top: 9,
//     		position: "absolute"
//   	},
//   	vectorIcon: {
//     		left: 302,
//     		top: 9,
//     		position: "absolute"
//   	},
//   	vectorIcon1: {
//     		top: 11,
//     		left: 320,
//     		borderRadius: 58,
//     		position: "absolute"
//   	},
//   	frameChild: {
//     		marginTop: -5,
//     		marginLeft: 144.5
//   	},
//   	parent: {
//     		height: 32,
//     		width: 393,
//     		position: "absolute",
//     		overflow: "hidden"
//   	},
//   	gradientButtonChild: {
//     		backgroundColor: "#b3a0ff",
//     		left: 0,
//     		top: 0
//   	},
//   	gradientButtonItem: {
//     		left: 0,
//     		top: 0
//   	},
//   	gradientButton: {
//     		top: 337,
//     		left: -1,
//     		shadowOpacity: 1,
//     		elevation: 4,
//     		shadowRadius: 4,
//     		shadowOffset: {
//       			width: 0,
//       			height: 4
//     		},
//     		shadowColor: "rgba(0, 0, 0, 0.25)"
//   	},
//   	aCommunityFor: {
//     		marginLeft: -154.5,
//     		top: 405,
//     		fontSize: 20,
//     		width: 309
//   	},
//   	gradientButtonInner: {
//     		backgroundColor: "rgba(255, 255, 255, 0.09)"
//   	},
//   	rectangleView: {
//     		borderStyle: "solid",
//     		borderColor: Color.font2,
//     		borderWidth: 0.5
//   	},
//   	gradientButton3: {
//     		shadowOpacity: 1,
//     		elevation: 4,
//     		shadowRadius: 4,
//     		shadowOffset: {
//       			width: 0,
//       			height: 4
//     		},
//     		shadowColor: "rgba(0, 0, 0, 0.25)",
//     		left: 0,
//     		top: 0
//   	},
//   	gradientButton2: {
//     		shadowOpacity: 1,
//     		elevation: 4,
//     		shadowRadius: 4,
//     		shadowOffset: {
//       			width: 0,
//       			height: 4
//     		},
//     		shadowColor: "rgba(0, 0, 0, 0.25)",
//     		left: 0,
//     		top: 0
//   	},
//   	gradientButton1: {
//     		shadowOpacity: 1,
//     		elevation: 4,
//     		shadowRadius: 4,
//     		shadowOffset: {
//       			width: 0,
//       			height: 4
//     		},
//     		shadowColor: "rgba(0, 0, 0, 0.25)",
//     		left: 0,
//     		top: 0
//   	},
//   	getStarted: {
//     		marginLeft: -63.5,
//     		top: 10,
//     		fontSize: 18,
//     		width: 127,
//     		height: 23
//   	},
//   	gradientButtonParent: {
//     		top: 524,
//     		left: 91
//   	},
//   	groupChild: {
//     		marginLeft: -10,
//     		backgroundColor: Color.color2,
//     		width: 20,
//     		borderRadius: Border.br_xs
//   	},
//   	groupItem: {
//     		marginLeft: 14,
//     		backgroundColor: Color.font2,
//     		width: 20,
//     		borderRadius: Border.br_xs
//   	},
//   	groupInner: {
//     		marginLeft: -34,
//     		backgroundColor: Color.color2,
//     		width: 20,
//     		borderRadius: Border.br_xs
//   	},
//   	rectangleParent: {
//     		marginLeft: -34.5,
//     		top: 474,
//     		width: 68,
//     		height: 4,
//     		left: "50%",
//     		position: "absolute"
//   	},
//   	communityIcon: {
//     		marginLeft: -31.5,
//     		top: 354
//   	},
//   	dOnBoarding: {
//     		borderRadius: 20,
//     		backgroundColor: Color.color4,
//     		flex: 1,
//     		width: "100%",
//     		overflow: "hidden",
//     		height: 852
//   	}
// });

// export default DOnBoarding;
