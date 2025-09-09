import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Ionicons from '../../../components/ImageComponent/IconComponent';
import Text from '../../../components/AppText';

import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/HeaderComponent/Header';
import colors from '../../../../config/colors';
import HeaderWithContainer from '../../../components/HeaderComponent/HeaderWithContainer';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey', sender: 'me', date: '09 Sep 2025' },
    {
      id: '2',
      text: 'Hey, thank you for getting in touch. This is John.',
      sender: 'other',
      date: '09 Sep 2025',
    },
  ]);

  const [input, setInput] = useState('');

  const renderMessage = ({ item }) => {
    return (
      <View >
        {/* Show date if first message or new day */}
      {item.id === '1' &&  <View style={styles.dateBox}>
         <Text style={styles.dateText}>{item.date}</Text>

        </View>}
        <View
          style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.theirMessage,
          ]}
        >
          <Text style={{color:item.sender === 'me'?colors.white:colors.black}}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
      date: '09 Sep 2025',
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={[colors.linearGradient2, colors.linearGradient1]} // Top to bottom colors
          style={{ flex: 1 }}
        >
          {/* Header */}
          <HeaderWithContainer
            title={'Chat'}
            backButtonBoxColor={colors.white}
          />

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
          />

          {/* Input Box */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              placeholderTextColor="#B0B0B0"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  messagesContainer: {
    padding: 15,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
dateBox: {
  backgroundColor: colors.white,
  alignSelf: 'center',   // ✅ Center it in the screen
  paddingHorizontal: 12, // ✅ Horizontal padding
  paddingVertical: 6,    // ✅ Vertical padding
  borderRadius: 12,      // ✅ Rounded corners
  marginVertical: 10,    // ✅ Some space above and below
  shadowColor: '#000',   // ✅ Optional subtle shadow for better visibility
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  elevation: 2,          // ✅ Shadow for Android
},
dateText: {
  color: '#333',
  fontSize: 13,
  fontWeight: '500',
},

  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: colors.chatSentColor,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
  },

  sendButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1E1E2D',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default ChatScreen;
