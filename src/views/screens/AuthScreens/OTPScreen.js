import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import storage from '../../../app/storage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/slices/authSlice/profileSlice';

import {
  verifyForgotPasswordOtp,
  resetVerifyForgotOtpState,
} from '../../../redux/slices/authSlice/verifyForgotOtpSlice';
import {
  verifyOtp,
  resetVerifyOtpState,
} from '../../../redux/slices/authSlice/verifyOtpSlice';
import {
  resendOtp,
  resetResendOtpState,
} from '../../../redux/slices/authSlice/resendOtpSlice';
import { setLoginUser } from '../../../redux/slices/authSlice/loginSlice';
import StartupSVG from '../../../assets/icons/startup.svg';
import AppButton from '../../components/ButtonComponents/AppButton';
import BackButton from '../../components/ButtonComponents/BackButton';
import colors from '../../../config/colors';
import CustomToast from '../../components/CustomToast';

const OTPScreen = ({ navigation, route }) => {
  const { email, context = 'auth' } = route.params; // ✅ include context here

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const dispatch = useDispatch();

  const { loading, success, error, data } = useSelector(
    state => state.verifyOtp,
  );
  const {
    loading: forgotLoading,
    success: forgotSuccess,
    error: forgotError,
    data: forgotData,
  } = useSelector(state => state.verifyForgotOtp);

  const {
    loading: resendLoading,
    success: resendSuccess,
    error: resendError,
    message: resendMessage,
  } = useSelector(state => state.resendOtp);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    let interval = null;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft <= 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) inputs.current[index + 1].focus();
      if (index === 5 && text) Keyboard.dismiss();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast('Please enter all 6 digits', 'error');
      return;
    }

    if (context === 'forgotpassword') {
      dispatch(verifyForgotPasswordOtp({ email, otp: otpCode }));
    } else {
      dispatch(verifyOtp({ email, otp: otpCode }));
    }
  };

  const handleResendOtp = () => {
    dispatch(resendOtp(email));
    setSecondsLeft(60);
    setTimerActive(true);
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };
  useEffect(() => {
    if (context === 'forgotpassword') {
      if (forgotSuccess) {
        showToast(
          forgotData?.message || 'OTP verified! Proceeding to reset.',
          'success',
        );
        setTimeout(() => {
          dispatch(resetVerifyForgotOtpState());
          console.log('Forgot Data:', forgotData?.user?.id);
          navigation.navigate('ResetPasswordScreen', {
            email,
            userId: forgotData?.user?.id,
          });
        }, 1500);
      } else if (forgotError) {
        showToast(forgotError, 'error');
        dispatch(resetVerifyForgotOtpState());
      }
    } else {
      if (success && data?.user && data?.token) {
        showToast('OTP verified successfully! You are logged in.', 'success');

        const saveAuthData = async () => {
          try {
            await storage.storeUser(data.user);
            await storage.storeToken(data.token);
            console.log('✅ User and Token saved in AsyncStorage');
            dispatch(fetchUserProfile(data?.user.id));

            // ✅ UPDATE REDUX LOGIN STATE
            dispatch(setLoginUser({ user: data.user, token: data.token }));
          } catch (err) {
            console.log('❌ Failed to save auth data:', err);
          }
        };

        saveAuthData();
        setTimeout(() => {
          dispatch(resetVerifyOtpState());
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'DashboardRouter' }],
            }),
          );
        }, 1500);
      } else if (error) {
        showToast(error, 'error');
        dispatch(resetVerifyOtpState());
      }
    }
  }, [
    context,
    success,
    error,
    data?.user,
    data?.token,
    forgotSuccess,
    forgotError,
    forgotData?.message,
    forgotData?.user?.id,
    dispatch,
    navigation,
    email,
  ]);

  useEffect(() => {
    if (resendSuccess) {
      showToast(resendMessage || 'OTP resent successfully', 'success');
      dispatch(resetResendOtpState());
    } else if (resendError) {
      showToast(resendError.message || 'Failed to resend OTP', 'error');
      dispatch(resetResendOtpState());
    }
  }, [resendSuccess, resendError, resendMessage, dispatch]);

  const formatTime = () => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.headerTitle}>OTP Verification</Text>
        </View>

        <View style={styles.imageContainer}>
          <StartupSVG width={150} height={150} />
          <Text style={styles.instructionText}>
            Please enter the 6-digit OTP sent to your email.
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleBackspace(nativeEvent.key, index)
              }
            />
          ))}
        </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {timerActive ? (
            <Text style={{ color: '#888' }}>
              Resend OTP in{' '}
              <Text style={{ fontWeight: 'bold', color: colors.primary }}>
                {formatTime()}
              </Text>
            </Text>
          ) : (
            <Text
              style={{
                color: colors.primary,
                fontWeight: 'bold',
                fontSize: 16,
              }}
              onPress={handleResendOtp}
            >
              {resendLoading ? 'Resending OTP...' : 'Resend OTP'}
            </Text>
          )}
        </View>

        <AppButton
          title={loading || forgotLoading ? 'Verifying...' : 'Verify'}
          onPress={handleSubmit}
          disabled={loading || forgotLoading}
          btnStyles={styles.submitButton}
          textStyle={styles.buttonText}
        />
      </View>

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default OTPScreen;

// ➕ Your existing styles...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  backWrapper: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 12,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
