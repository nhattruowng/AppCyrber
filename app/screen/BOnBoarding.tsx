// import * as React from "react";
// import {Image, StyleSheet, Text, View} from "react-native";
// import Rectangle162 from "../assets/rectangle-162.svg"
// import Vector from "../assets/vector.svg"
// import Vector1 from "../assets/vector1.svg"
// import Group12 from "../assets/group-12.svg"
// import Workout from "../assets/work-out.svg"
// import { FontFamily, Color, Border, FontSize } from "../GlobalStyles";

// const BOnBoarding = () => {
  	
//   	return (
//     		<View style={styles.bOnBoarding}>
//       			<Image style={styles.beautifulYoungSportyWomanTIcon} resizeMode="cover" source="beautiful-young-sporty-woman-training-workout-gym 3.png" />
//       			<Rectangle162 style={[styles.bOnBoardingChild, styles.childPosition]} width={393} height={852} />
//       			<View style={[styles.parent, styles.gradientPosition]}>
//         				<Text style={styles.text}>16:04</Text>
//         				<Vector style={[styles.vectorIcon, styles.iconLayout]} width={13} height={11} />
//         				<Vector1 style={styles.vectorIcon1} width={15} height={8} />
//         				<Group12 style={[styles.frameChild, styles.childPosition]} width={17} height={9} />
//       			</View>
//       			<View style={[styles.gradientButton, styles.gradientLayout1]}>
//         				<View style={[styles.gradientButtonChild, styles.gradientLayout1]} />
//         				<View style={[styles.gradientButtonItem, styles.gradientLayout1]} />
//       			</View>
//       			<Image style={[styles.arrowIcon, styles.iconLayout]} resizeMode="cover" source="Arrow.png" />
//       			<Text style={[styles.startYourJourney, styles.nextTypo1]}>Start your journey towards a more active lifestyle</Text>
//       			<View style={[styles.gradientButtonParent, styles.gradientLayout]}>
//         				<View style={[styles.gradientButton1, styles.gradientLayout]}>
//           					<View style={[styles.gradientButton2, styles.gradientLayout]}>
//             						<View style={[styles.gradientButton3, styles.gradientLayout]}>
//               							<View style={[styles.gradientButtonInner, styles.rectangleViewLayout]} />
//               							<View style={[styles.rectangleView, styles.rectangleViewLayout]} />
//             						</View>
//           					</View>
//         				</View>
//         				<Text style={[styles.next, styles.nextTypo]}>Next</Text>
//       			</View>
//       			<View style={styles.rectangleParent}>
//         				<View style={[styles.groupChild, styles.groupLayout]} />
//         				<View style={[styles.groupItem, styles.groupLayout]} />
//         				<View style={[styles.groupInner, styles.groupLayout]} />
//       			</View>
//       			<Workout style={styles.workOutIcon} width={38} height={43} />
//       			<Text style={[styles.skip, styles.nextTypo]}>Skip</Text>
//     		</View>);
// };

// const styles = StyleSheet.create({
//   	childPosition: {
//     		top: "50%",
//     		left: "50%",
//     		position: "absolute"
//   	},
//   	gradientPosition: {
//     		left: 0,
//     		top: 0
//   	},
//   	iconLayout: {
//     		height: 11,
//     		position: "absolute"
//   	},
//   	gradientLayout1: {
//     		height: 169,
//     		width: 394,
//     		position: "absolute"
//   	},
//   	nextTypo1: {
//     		justifyContent: "center",
//     		textAlign: "center",
//     		fontFamily: FontFamily.poppinsBold,
//     		fontWeight: "700",
//     		alignItems: "center",
//     		display: "flex",
//     		color: Color.font2,
//     		textTransform: "capitalize",
//     		left: "50%"
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
//   	nextTypo: {
//     		fontSize: FontSize.subtitulo_size,
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
//     		left: "50%",
//     		top: 0,
//     		marginLeft: -196.5,
//     		position: "absolute",
//     		height: 852
//   	},
//   	bOnBoardingChild: {
//     		marginTop: -426,
//     		marginLeft: -196.5,
//     		top: "50%"
//   	},
//   	text: {
//     		left: 35,
//     		fontSize: 13,
//     		width: 30,
//     		height: 14,
//     		alignItems: "center",
//     		display: "flex",
//     		color: Color.font2,
//     		textTransform: "capitalize",
//     		textAlign: "left",
//     		fontFamily: FontFamily.subtitulo,
//     		fontWeight: "500",
//     		top: 9,
//     		position: "absolute"
//   	},
//   	vectorIcon: {
//     		left: 302,
//     		top: 9
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
//   	arrowIcon: {
//     		top: 67,
//     		left: 358,
//     		width: 6
//   	},
//   	startYourJourney: {
//     		marginLeft: -154.5,
//     		top: 405,
//     		fontSize: 20,
//     		width: 309,
//     		position: "absolute"
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
//   	next: {
//     		marginLeft: -48.5,
//     		top: 10,
//     		width: 97,
//     		height: 23,
//     		justifyContent: "center",
//     		textAlign: "center",
//     		fontFamily: FontFamily.poppinsBold,
//     		fontWeight: "700",
//     		alignItems: "center",
//     		display: "flex",
//     		color: Color.font2,
//     		textTransform: "capitalize",
//     		left: "50%"
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
//     		backgroundColor: Color.color2,
//     		width: 20,
//     		borderRadius: Border.br_xs
//   	},
//   	groupInner: {
//     		marginLeft: -34,
//     		backgroundColor: Color.font2,
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
//   	workOutIcon: {
//     		top: 353,
//     		left: 177,
//     		position: "absolute",
//     		overflow: "hidden"
//   	},
//   	skip: {
//     		top: 65,
//     		left: 315,
//     		color: Color.color1,
//     		textAlign: "left",
//     		fontFamily: FontFamily.subtitulo,
//     		fontWeight: "500",
//     		fontSize: FontSize.subtitulo_size
//   	},
//   	bOnBoarding: {
//     		borderRadius: 20,
//     		backgroundColor: Color.color4,
//     		flex: 1,
//     		width: "100%",
//     		overflow: "hidden",
//     		height: 852
//   	}
// });

// export default BOnBoarding;
