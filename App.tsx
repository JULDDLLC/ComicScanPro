import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from './src/constants/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DealerDashboard from './src/screens/DealerDashboard';
import ListingScreen from './src/screens/ListingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WantListScreen from './src/screens/WantListScreen';
import CollectionStatsScreen from './src/screens/CollectionStatsScreen';

export type RootStackParamList = {
  Home: undefined;
  Scanner: { mode: 'collector' | 'dealer' };
  Results: {
    comicData: any;
    conditionGrade: string;
    pricing: any;
    image: string;
    mode: 'collector' | 'dealer';
  };
  DealerDashboard: undefined;
  Listing: { comicData: any; conditionGrade: string; pricing: any };
  Settings: undefined;
  WantList: undefined;
  CollectionStats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userMode, setUserMode] = useState<'collector' | 'dealer' | null>(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setUserMode(savedMode as 'collector' | 'dealer');
      }
    } catch (e) {
      console.error('Failed to restore session', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            title: 'Scan Comic',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Comic Details',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="DealerDashboard"
          component={DealerDashboard}
          options={{
            title: 'Dealer Dashboard',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Listing"
          component={ListingScreen}
          options={{
            title: 'Create Listing',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="WantList"
          component={WantListScreen}
          options={{
            title: 'Want List',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="CollectionStats"
          component={CollectionStatsScreen}
          options={{
            title: 'Collection Stats',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
