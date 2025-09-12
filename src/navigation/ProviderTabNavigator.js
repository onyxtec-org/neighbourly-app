import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JobsScreen from '../views/screens/Dashboard/jobScreens/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/profileScreens/ProfileScreen';
import { Platform, View } from 'react-native';
import colors from '../config/colors';
import ProviderNavigator from './ProviderNavigator';
import StageScreen from '../views/screens/Dashboard/StageScreens/StageScreen';
import SvgComponent from '../views/components/ImageComponent/SvgComponent';
import { homeIcon, jobIcon, stageIcon, profileIcon } from '../config/icons';
const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ icon }) => (
  <View>
    <SvgComponent svgMarkup={icon} setWidth="24" setHeight="24" />
  </View>
);
const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Stage"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Stage':
              return (
                <CustomTabIcon
                  icon={
                    focused
                      ? stageIcon(colors.primary, colors.white)
                      : stageIcon()
                  }
                  focused={focused}
                  name={route.name}
                />
              );
            case 'Dashboard':
              return (
                <CustomTabIcon
                  icon={
                    focused
                      ? homeIcon(colors.primary, colors.white)
                      : homeIcon()
                  }
                  focused={focused}
                  name={route.name}
                />
              );
            case 'Jobs':
              return (
                <CustomTabIcon
                  icon={
                    focused
                      ? jobIcon(colors.primary, colors.primary)
                      : jobIcon()
                  }
                  focused={focused}
                  name={route.name}
                />
              );
            case 'Profile':
              return (
                <CustomTabIcon
                  icon={
                    focused
                      ? profileIcon(colors.primary, colors.primary)
                      : profileIcon()
                  }
                  focused={focused}
                  name={route.name}
                />
              );
            default:
              return (
                <CustomTabIcon
                  icon={
                    focused
                      ? homeIcon(colors.primary, colors.white)
                      : homeIcon()
                  }
                  focused={focused}
                  name={route.name}
                />
              );
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          paddingBottom: 4,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
      })}
    >
      <Tab.Screen name="Stage" component={StageScreen} />
      <Tab.Screen name="Dashboard" component={ProviderNavigator} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
