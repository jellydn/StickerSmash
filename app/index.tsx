import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

import Button from "@components/Button";
import CircleButton from "@components/CircleButton";
import EmojiList from "@components/EmojiList";
import EmojiPicker from "@components/EmojiPicker";
import EmojiSticker from "@components/EmojiSticker";
import IconButton from "@components/IconButton";
import ImageViewer from "@components/ImageViewer";

const PlaceholderImage = require("../assets/images/background-image.png");

export default function App() {
	const imageRef = useRef();
	const [status, requestPermission] = MediaLibrary.usePermissions();
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showAppOptions, setShowAppOptions] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pickedEmoji, setPickedEmoji] = useState(null);

	const pickImageAsync = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
			setShowAppOptions(true);
		} else {
			alert("You did not select any image.");
		}
	};

	const onReset = () => {
		setShowAppOptions(false);
	};

	const onAddSticker = () => {
		setIsModalVisible(true);
	};

	const onModalClose = () => {
		setIsModalVisible(false);
	};

	const onSaveImageAsync = async () => {
		if (Platform.OS !== "web") {
			try {
				const localUri = await captureRef(imageRef, {
					height: 440,
					quality: 1,
				});
				await MediaLibrary.saveToLibraryAsync(localUri);
				if (localUri) {
					alert("Saved!");
				}
			} catch (e) {
				console.log(e);
			}
		} else {
			try {
				if (!imageRef.current) return;
				const dataUrl = await domtoimage.toJpeg(imageRef.current, {
					quality: 0.95,
					width: 320,
					height: 440,
				});

				const link = document.createElement("a");
				link.download = "sticker-smash.jpeg";
				link.href = dataUrl;
				link.click();
			} catch (e) {
				console.log(e);
			}
		}
	};

	if (status === null) {
		requestPermission();
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.imageContainer}>
				<View ref={imageRef} collapsable={false}>
					<ImageViewer
						placeholderImageSource={PlaceholderImage}
						selectedImage={selectedImage}
					/>
					{pickedEmoji !== null ? (
						<EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
					) : null}
				</View>
			</View>
			{showAppOptions ? (
				<View style={styles.optionsContainer}>
					<View style={styles.optionsRow}>
						<IconButton icon="refresh" label="Reset" onPress={onReset} />
						<CircleButton onPress={onAddSticker} />
						<IconButton
							icon="save-alt"
							label="Save"
							onPress={onSaveImageAsync}
						/>
					</View>
				</View>
			) : (
				<View style={styles.footerContainer}>
					<Button
						theme={"primary"}
						label="Choose a photo"
						onPress={pickImageAsync}
					/>
					<Button
						label="Use this photo"
						onPress={() => setShowAppOptions(true)}
					/>
				</View>
			)}
			<EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
				<EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
			</EmojiPicker>
			<StatusBar style="auto" />
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#7FCFF7",
		alignItems: "center",
	},
	imageContainer: {
		flex: 1,
		paddingTop: 58,
	},
	image: {
		width: 320,
		height: 440,
		borderRadius: 18,
	},
	footerContainer: {
		flex: 1 / 3,
		alignItems: "center",
	},
	optionsContainer: {
		position: "absolute",
		bottom: 80,
	},
	optionsRow: {
		alignItems: "center",
		flexDirection: "row",
	},
});
