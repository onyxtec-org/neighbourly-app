import { View } from "react-native";
import AppText from "./AppText";
import colors from "../../config/colors";

const TruncatedText = ({ text, post, navigation, maxLength = 120 }) => {
  if (!text) return null;

  const truncated =
    text.length > maxLength ? text.substring(0, maxLength).trimEnd() + "..." : text;

  return (
    <View>
      <AppText style={styles.description}numberOfLines={2}ellipsizeMode="tail">{truncated}</AppText>

      {text.length > maxLength && (
        <AppText
          style={styles.seeMoreInline}
          onPress={() => navigation.navigate("PostDetails", { post })}
        >
          View more
        </AppText>
      )}
    </View>
  );
};

const styles = {
  description: {
    fontSize: 14,
    color: "#333",
  },
  seeMoreInline: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline", 
    marginTop: 4, 
  },
};

export default TruncatedText;
