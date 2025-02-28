import { View, StyleSheet, Platform } from "react-native";
import ImageViewer from "../../components/imageViewer";
import Button from "../../components/button";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef } from "react";
import { captureRef } from 'react-native-view-shot';
import CircleButton from "../../components/circleButton";
import IconButton from "../../components/iconButton";
import EmojiPicker from "../../components/emojiPicker";
import EmojiList from "../../components/emojiList";
import { ImageSource } from "expo-image";
const PlaceholderImage = require('../../assets/images/background-image.png');
import EmojiSticker from "../../components/emojiSticker";
import * as MediaLibrary from 'expo-media-library';
import domtoimage from 'dom-to-image';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const imageRef = useRef<View>(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You need to provide a photo");
    }
  };

  const OnReset = () => {
    setShowAppOptions(false);
  }

  const OnAddSticker = () => {
    setIsModalVisible(true);
  }

  const OnModalClose = () => {
    setIsModalVisible(false);
  }

  const OnSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 400,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (!imageRef.current) return;
        const dataUrl = await domtoimage.toJpeg(imageRef.current as unknown as Node, {
            quality: 0.95,
            width: 320,
            height: 440,
          });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imageSource={selectedImage || PlaceholderImage} />
          {pickedEmoji ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
        </View>
      </View>
      {showAppOptions ?
        (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={OnReset} />
              <CircleButton onPress={OnAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={OnSaveImageAsync} />
            </View>
          </View>
        )
        :
        (
          <View style={styles.footerContainer}>
            <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}

      <EmojiPicker isVisible={isModalVisible} onClose={OnModalClose}>
        <EmojiList
          onSelect={setPickedEmoji}
          onCloseModal={OnModalClose}
        />
      </EmojiPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  }
  ,
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 400,
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
  }
});
