import React from 'react';
import { View, } from 'react-native';
import { WebView } from 'react-native-webview';

const TermsandconditionScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://www.apple.com/legal/privacy/' }} />
    </View>
  );
};

export default TermsandconditionScreen;
