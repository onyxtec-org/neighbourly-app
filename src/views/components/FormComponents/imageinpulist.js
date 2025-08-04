// export default ImageInputList;
import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import ImageInput from "../../components/FormComponents/ImageInput";

function ImageInputList({ imageUris = [], onRemoveImage, onAddImage }) {
  const scrollView = useRef();

  const handleDelete = (item) => {
    Alert.alert("Delete Media", "Are you sure you want to delete this file?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onRemoveImage(item) },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      {/* Top Divider */}
      <View style={styles.divider} />
      <Text style={styles.countText}>
        Uploaded: {imageUris.length} {imageUris.length !== 1 ? "items" : "item"}
      </Text>

      <ScrollView
        ref={scrollView}
        horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Upload Button */}
          <View style={[styles.image, styles.dottedBox]}>
            <ImageInput onChangeImage={(file) => onAddImage(file)} />
          </View>

          {/* Uploaded Media */}
          {imageUris.map((item, index) => (
            <View key={item.uri || index} style={[styles.image, styles.dottedBox]}>
              <View style={styles.imageWrapper}>
                {item.type === "video" ? (
                  <Video
                    source={{ uri: item.uri }}
                    style={styles.media}
                    paused={true}
                    resizeMode="cover"
                  />
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.media} />
                )}

                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(item)}
                >
                  <Ionicons name="close-circle" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Divider */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  countText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 6,
  },
  container: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  image: {
    marginRight: 10,
  },
  dottedBox: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#aaa",
    borderRadius: 10,
    padding: 2,
  },
  imageWrapper: {
    position: "relative",
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});

export default ImageInputList;
