import {
  Image,
  StyleSheet,
  View,
  Button,
  type GestureResponderEvent,
  Platform,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

export default function HomeScreen() {
  const downloadFromURL = async (event: GestureResponderEvent) => {
    const fileName = "meme.jpg";
    try {
      const result = await FileSystem.downloadAsync(
        "https://i.imgur.com/ojvhqv8.jpeg",
        FileSystem.documentDirectory + fileName
      );
      await save(result.uri, fileName, result.headers["content-type"]);
    } catch (error) {
      // TODO: error handling
    }
  };

  const save = async (uri: string, fileName: string, mimeType: string) => {
    if (Platform.OS === "ios") {
      await shareAsync(uri);
    } else if (Platform.OS === "android") {
      saveOnAndroid(uri, fileName, mimeType);
    }
  };

  const saveOnAndroid = async (
    fileUri: string,
    fileName: string,
    mimeType: string
  ) => {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      // TODO error handling
      return;
    }
    try {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const createdFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          mimeType
        );
      await FileSystem.writeAsStringAsync(createdFileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (e) {
      // TODO: error handling
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View>
        <Button title="Download from URL" onPress={downloadFromURL} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
