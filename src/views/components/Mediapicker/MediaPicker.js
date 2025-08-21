import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ActionSheet from "react-native-actionsheet";

const MediaPicker = ({ onChange }) => {
  const [mediaList, setMediaList] = useState([]);
  const actionSheetRef = useRef(null);

  const openPickerOptions = () => {
    actionSheetRef.current?.show();
  };

  const handleCameraPick = () => {
    const options = { mediaType: "mixed" };
    launchCamera(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        addMedia(response.assets || []);
      }
    });
  };

  const handleGalleryPick = () => {
    const options = { mediaType: "mixed", selectionLimit: 0 };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        addMedia(response.assets || []);
      }
    });
  };

  const addMedia = (newItems) => {
    const updatedList = [...mediaList, ...newItems];
    setMediaList(updatedList);
    onChange && onChange(updatedList);
  };

  const handleRemove = (index) => {
    const updatedList = mediaList.filter((_, i) => i !== index);
    setMediaList(updatedList);
    onChange && onChange(updatedList);
  };

  return (
    <View>
      {mediaList.length === 0 ? (
        <TouchableOpacity style={styles.addBox} onPress={openPickerOptions}>
          <View style={styles.addCircle}>
            <Icon name="image-outline" size={20} color="#444" />
          </View>
          <Text style={styles.addText}>Add Photos / Videos</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewWrapper}>
          <View style={styles.mainPreview}>
            {mediaList[mediaList.length - 1].type?.includes("video") ? (
              <View style={styles.videoBox}>
                <Icon name="videocam-outline" size={40} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 12 }}>Video</Text>
              </View>
            ) : (
              <Image
                source={{ uri: mediaList[mediaList.length - 1].uri }}
                style={styles.mainImage}
              />
            )}

            <TouchableOpacity
              style={styles.addMoreBtn}
              onPress={openPickerOptions}
            >
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {mediaList.map((item, index) => (
              <View key={index} style={styles.previewContainer}>
                {item.type?.includes("video") ? (
                  <View style={styles.videoBoxSmall}>
                    <Icon name="videocam-outline" size={24} color="#fff" />
                  </View>
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.previewImage} />
                )}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(index)}
                >
                  <Icon name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ActionSheet */}
      <ActionSheet
        ref={actionSheetRef}
        title={"Select Media"}
        options={["Camera", "Gallery"]}
        cancelButtonIndex={0}
        onPress={(index) => {
          if (index === 0) handleCameraPick();
          if (index === 1) handleGalleryPick();
        }}
      />
    </View>
  );
};

export default MediaPicker;

const styles = StyleSheet.create({
  addBox: {
    height: 160,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderStyle: "dotted",
  },
  addCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  addText: { fontSize: 14, color: "#444" },

  previewWrapper: { marginVertical: 10 },

  mainPreview: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dotted",
  },
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  videoBox: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  addMoreBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 6,
  },

  previewContainer: {
    marginRight: 10,
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    borderStyle: "dotted",
    overflow: "hidden",
  },
  previewImage: {
    width: 80,
    height: 80,
  },
  videoBoxSmall: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  removeBtn: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 2,
  },
});
