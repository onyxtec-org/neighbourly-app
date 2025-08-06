import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../redux/slices/categoriesSlice';
import colors from '../../../config/colors';
import storage from '../../../app/storage';

const ProviderHomeScreen = ({ navigation }) => {
   
  const dispatch = useDispatch();


 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity style={styles.locationContainer}>
            <Ionicons name="location-outline" size={24} color={colors.primary} />
            <Text style={styles.locationText}>Your Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.helpText}>My services</Text>
         
        </View>


      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
 
});

export default ProviderHomeScreen;
