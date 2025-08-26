// ProfileShimmer.js
import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

const ProfileShimmer = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: 120, height: 20, borderRadius: 6 }}
        />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfoSection}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: 120, height: 16, borderRadius: 8, marginBottom: 20 }}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: "90%", height: 40, borderRadius: 20 }}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={styles.menuItem}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: "40%", height: 16, borderRadius: 6 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: 20, height: 16, borderRadius: 6 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileShimmer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  profileInfoSection: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    alignItems: "center",
    marginBottom: 10,
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
