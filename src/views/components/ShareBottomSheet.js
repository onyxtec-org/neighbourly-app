import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import ShareLib from 'react-native-share';
import colors from '../../config/colors';
import Clipboard from '@react-native-clipboard/clipboard';

const ShareBottomSheet = ({ url, onClose, visible }) => {
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
      // Capture QR as PNG file
      const uri = await viewShotRef.current.capture();
  
      // Convert to base64
      const base64Data = await RNFS.readFile(uri, 'base64');
  
      // Save as temp file
      const filePath = `${RNFS.CachesDirectoryPath}/qrcode.png`;
      await RNFS.writeFile(filePath, base64Data, 'base64');
  
      // Share local file
      const shareOptions = {
        title: 'QR Code',
        url: `file://${filePath}`,   // 👈 local file, not base64
        type: 'image/png',
      };
  
      await ShareLib.open(shareOptions);
      onClose?.();
    } catch (err) {
      console.error('Error sharing QR code:', err);
    }
  };
  

  if (!visible) return null;

  return (
    <>
      {/* Close when tapping outside */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* QR Code inside dotted box */}
        <View style={styles.qrContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 0.9 }}
          >
            <QRCode value={url || 'https://neighbourly.app'} size={150} />
          </ViewShot>
        </View>

        <Text selectable style={styles.urlText}>
          {url || 'https://neighbourly.app'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleCopy} style={styles.button}>
            <Text style={styles.buttonText}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.button}>
            <Text style={styles.buttonText}>Share Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShareQRCode}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Share QR</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
  );
};

export default ShareBottomSheet;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'rgba(0,0,0,0.0.1)',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  qrContainer: {
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  urlText: {
    marginTop: 8,
    color: colors.primary,
    textAlign: 'center',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    marginHorizontal: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
