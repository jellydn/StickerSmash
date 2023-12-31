import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { Image, Platform, Pressable } from "react-native";

export default function EmojiList({ onSelect, onCloseModal }) {
	const [emoji] = useState([
		require("../assets/images/emoji1.png"),
		require("../assets/images/emoji2.png"),
		require("../assets/images/emoji3.png"),
		require("../assets/images/emoji4.png"),
		require("../assets/images/emoji5.png"),
		require("../assets/images/emoji6.png"),
	]);

	return (
		<FlashList
			horizontal
			estimatedItemSize={112}
			showsHorizontalScrollIndicator={Platform.OS === "web"}
			data={emoji}
			renderItem={({ item, index }) => {
				return (
					<Pressable
						onPress={() => {
							onSelect(item);
							onCloseModal();
						}}
					>
						<Image source={item} key={index} className="mr-5 w-28 h-28" />
					</Pressable>
				);
			}}
		/>
	);
}
