import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://www.apple.com/legal/privacy/' }} />
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
