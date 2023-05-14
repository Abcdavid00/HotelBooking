import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {setAsyncStorage} from '../../../../functions/asyncStorageFunctions';

import All from './Pages/AllPage';
import Booking from './Pages/BookingPage';
import System from './Pages/SystemPage';
import Other from './Pages/OtherPage';

const Tab = createMaterialTopTabNavigator();
const {width, height} = Dimensions.get('window');

const Mytab = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: {fontSize: 12},
      }}>
      <Tab.Screen
        name="all"
        component={All}
        options={{tabBarLabel: t('all')}}
      />
      <Tab.Screen
        name="booking"
        component={Booking}
        options={{tabBarLabel: t('booking')}}
      />
      <Tab.Screen
        name="system"
        component={System}
        options={{
          tabBarLabel: t('system'),
        }}
      />
      <Tab.Screen
        name="other"
        component={Other}
        options={{tabBarLabel: t('other')}}
      />
    </Tab.Navigator>
  );
};

export default function TopTabNavigator({navigation}) {
  const [showActionDot, setShowActionDot] = useState(false);
  const {colors} = useTheme();
  const {t} = useTranslation();

  const HeaderNotify = () => {
    const navigation = useNavigation();
    return (
      <View style={[styles.header, {backgroundColor: colors.box}]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <Icon
            name="arrow-back-ios"
            size={25}
            color={colors.text}
            onPress={() => navigation.goBack()}
          />
          <Text style={[styles.headerText, {color: colors.text}]}>
            {t('notification')}
          </Text>
          <Icon1
            name="dots-vertical"
            size={25}
            color={colors.text}
            onPress={() => {
              setShowActionDot(!showActionDot);
            }}
          />
          {showActionDot && (
            <Pressable
              onPress={() => {
                setShowActionDot(false);
              }}
              style={{
                position: 'absolute',
                width: width,
                height: height,
                zIndex: 99,
                top: 0,
                left: 0,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 35,
                  right: 30,
                  backgroundColor: 'white',
                  elevation: 5,
                  borderRadius: 10,
                  zIndex: 999,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <Text style={{fontSize: 14, color: colors.text}}>
                    {t('markAllRead')}
                  </Text>
                  <Icon2
                    name="checkmark-circle-outline"
                    size={23}
                    color={colors.text}
                    style={{marginLeft: 20}}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setAsyncStorage('notify', JSON.stringify([]));
                    setShowActionDot(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopWidth: 1,
                    borderTopColor: '#ccc',
                    padding: 10,
                  }}>
                  <Text style={{fontSize: 14, color: colors.text}}>
                    {t('deleteAll')}
                  </Text>
                  <Icon1
                    name="delete-outline"
                    size={23}
                    color={colors.text}
                    style={{marginLeft: 20}}
                  />
                </Pressable>
              </View>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderNotify />
      <View
        style={{
          flex: 1,
          marginTop: 60,
        }}>
        <Mytab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeCategoryButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: 'orange',
  },
  activeBar: {
    height: 2,
    width: 90,
    backgroundColor: 'orange',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 2,
  },
});
