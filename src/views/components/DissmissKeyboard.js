import React from 'react';
import { TouchableOpacity, Keyboard } from 'react-native';

function DismissKeyboard({ children }) {
    return (<TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableOpacity>);

};

export default DismissKeyboard;