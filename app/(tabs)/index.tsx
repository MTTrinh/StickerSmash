import { Text, View, StyleSheet} from "react-native";
import { Image } from "expo-image";

const PlaceholderImage = require('../../assets/images/background-image.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} contentFit="cover" transition={1000} />
      </View>
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
});
