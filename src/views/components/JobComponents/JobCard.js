import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
  useWindowDimensions,
} from 'react-native';
import colors from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StatusBox from './StatusBox';
import { useSelector } from 'react-redux';

const isAndroid = Platform.OS === 'android';

function JobCard({ item, onPress, onInterestedPress, onRejectedPress,status }) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();



  const { user: profileUser } = useSelector(state => state.profile);

  // Dynamic sizes based on screen width
  const cardHeight = height * 0.23; // 23% of screen height
  const titleFont = width * 0.06; // ~6% of width
  const textFont = width * 0.04; // ~4% of width
  const iconSize = width * 0.045; // icon size relative to width
  const checkBtnSize = width * 0.1; // 10% of width

  return (
    <TouchableOpacity
      style={[styles.container, { height: cardHeight }]}
      onPress={() => onPress(item.id,status,item)}
    >
      <View style={[styles.contentContainer, { width: '75%' }]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.title, { fontSize: titleFont }]}
        >
          {item.title}
        </Text>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Ionicons
            name="document-text-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.description, { fontSize: textFont }]}
          >
            {item.description}
          </Text>
        </View>

        {/* Duration and Rate */}
        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <Text style={[styles.infoText, { fontSize: textFont }]}>
            {item.no_of_hours}
          </Text>

          <Ionicons
            name="cash-outline"
            size={iconSize}
            color={colors.gray}
            style={[styles.icon, { marginLeft: 20 }]}
          />
          <Text style={[styles.infoText, { fontSize: textFont }]}>
            {Number(item.rate) % 1 === 0
              ? Number(item.rate).toFixed(0)
              : Number(item.rate).toString()}{' '}
            {item.price_type === 'fixed' ? '' : '/hr'}
          </Text>
        </View>

        {/* Payment Type */}
        <View style={styles.infoRow}>
          <Ionicons
            name="card-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <Text style={[styles.infoText, { fontSize: textFont }]}>
            {item.payment_type || 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="briefcase-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <Text style={[styles.infoText, { fontSize: textFont }]}>
            {item.service.name || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <View>
          <StatusBox
            color={colors.statusColors(item.status)}
            text={item.status}
          />

          {/* Action Buttons */}
          {profileUser.role === 'provider' && item.my_offer===null && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.checkCircle,
                  {
                    borderColor: colors.checkGreen,
                    marginRight: 5,
                    width: checkBtnSize,
                    height: checkBtnSize,
                    borderRadius: checkBtnSize / 2,
                  },
                ]}
                onPress={() => {
                  onInterestedPress(item.id,item.price_type);
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={iconSize}
                  color={colors.checkGreen}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.checkCircle,
                  {
                    borderColor: colors.checkRed,
                    width: checkBtnSize,
                    height: checkBtnSize,
                    borderRadius: checkBtnSize / 2,
                  },
                ]}
                onPress={() => {
                  onRejectedPress(item.id, 'rejected');
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={iconSize}
                  color={colors.checkRed}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    marginVertical: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    width: '25%',
  },
  contentContainer: {
    width: '75%',
  },
  title: {
    fontWeight: '700',
    color: colors.primary,
    flexShrink: 1,
    marginRight: 8,
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  description: {
    color: colors.dark,
    flex: 1,
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    color: colors.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  checkCircle: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobCard;
