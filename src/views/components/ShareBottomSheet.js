// components/ShareBottomSheet.js
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Clipboard, Share, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import ShareLib from 'react-native-share';

const ShareBottomSheet = ({ url, onClose }) => {
  const viewShotRef = useRef();

  const handleCopy = () => {
    Clipboard.setString(url);
    onClose?.();
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: url });
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareQRCode = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const base64Data = await RNFS.readFile(uri, 'base64');
      const shareOptions = {
        title: 'QR Code',
        url: `data:image/png;base64,${base64Data}`,
        type: 'image/png',
      };
      await ShareLib.open(shareOptions);
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.sheet}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <QRCode value={url} size={150} />
      </ViewShot>

      <Text selectable style={styles.urlText}>{url}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleCopy} style={styles.button}>
          <Text style={styles.buttonText}>Copy Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.button}>
          <Text style={styles.buttonText}>Share Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShareQRCode} style={styles.button}>
          <Text style={styles.buttonText}>Share QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShareBottomSheet;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  urlText: {
    marginTop: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  button: {
    marginHorizontal: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
  },
})
