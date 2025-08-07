import React from "react";
import { SvgXml } from "react-native-svg";
import { Text, View } from "react-native";

export default function SvgComponent({ svgMarkup, setWidth, setHeight }) {
  // Ensure svgMarkup is defined and non-empty
  if (!svgMarkup || typeof svgMarkup !== "string") {
    console.error("Invalid or missing SVG markup");
    return (
      <View>
        <Text>Invalid SVG</Text>
      </View>
    ); // Optionally render a fallback or error message
  }

  const SvgImage = () => (
    <SvgXml xml={svgMarkup} width={setWidth} height={setHeight} />  );

  return <SvgImage />;
}
