import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../App';
import { COLORS, FONTS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [userMode, setUserMode] = useState<'collector' | 'dealer' | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    loadUserMode();
    loadRecentScans();
  }, []);

  const loadUserMode = async () => {
    try {
      const mode = await AsyncStorage.getItem('userMode');
      setUserMode(mode as 'collector' | 'dealer' | null);
    } catch (e) {
      console.error('Failed to load user mode', e);
    }
  };

  const loadRecentScans = async () => {
    try {
      const scans = await AsyncStorage.getItem('recentScans');
      if (scans) {
        setRecentScans(JSON.parse(scans).slice(0, 3));
      }
    } catch (e) {
      console.error('Failed to load recent scans', e);
    }
  };

  const handleModeSelect = async (mode: 'collector' | 'dealer') => {
    try {
      await AsyncStorage.setItem('userMode', mode);
      setUserMode(mode);
      if (mode === 'dealer') {
        navigation.navigate('DealerDashboard');
      } else {
        navigation.navigate('Scanner', { mode: 'collector' });
      }
    } catch (e) {
      console.error('Failed to save user mode', e);
    }
  };

  const handleQuickScan = () => {
    if (userMode) {
      navigation.navigate('Scanner', { mode: userMode });
    } else {
      // Show mode selection
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.title}>ComicScan Pro</Text>
          <Text style={styles.subtitle}>Your Comic Book Companion</Text>
        </LinearGradient>

        {/* Mode Selection */}
        {!userMode && (
          <View style={styles.modeSection}>
            <Text style={styles.sectionTitle}>Choose Your Mode</Text>
            <TouchableOpacity
              style={[styles.modeCard, styles.collectorCard]}
              onPress={() => handleModeSelect('collector')}
            >
              <Text style={styles.modeIcon}>📚</Text>
              <Text style={styles.modeName}>Collector</Text>
              <Text style={styles.modeDescription}>
                Track your collection, want lists, and insurance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, styles.dealerCard]}
              onPress={() => handleModeSelect('dealer')}
            >
              <Text style={styles.modeIcon}>🏪</Text>
              <Text style={styles.modeName}>Dealer</Text>
              <Text style={styles.modeDescription}>
                Manage inventory, bulk scanning, and quick listings
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        {userMode && (
          <View style={styles.quickActionsSection}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleQuickScan}
            >
              <Text style={styles.quickActionIcon}>📸</Text>
              <Text style={styles.quickActionText}>Quick Scan</Text>
            </TouchableOpacity>

            {userMode === 'collector' && (
              <>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate('WantList')}
                >
                  <Text style={styles.quickActionIcon}>❤️</Text>
                  <Text style={styles.quickActionText}>Want List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate('CollectionStats')}
                >
                  <Text style={styles.quickActionIcon}>📊</Text>
                  <Text style={styles.quickActionText}>Stats</Text>
                </TouchableOpacity>
              </>
            )}

            {userMode === 'dealer' && (
              <>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate('DealerDashboard')}
                >
                  <Text style={styles.quickActionIcon}>📈</Text>
                  <Text style={styles.quickActionText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => {
                    // Bulk scan mode
                    navigation.navigate('Scanner', { mode: 'dealer' });
                  }}
                >
                  <Text style={styles.quickActionIcon}>📦</Text>
                  <Text style={styles.quickActionText}>Bulk Scan</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.quickActionIcon}>⚙️</Text>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            {recentScans.map((scan, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() =>
                  navigation.navigate('Results', {
                    comicData: scan.comicData,
                    conditionGrade: scan.conditionGrade,
                    pricing: scan.pricing,
                    image: scan.image,
                    mode: userMode || 'collector',
                  })
                }
              >
                <Image
                  source={{ uri: scan.image }}
                  style={styles.recentImage}
                />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{scan.comicData.title}</Text>
                  <Text style={styles.recentIssue}>
                    Issue #{scan.comicData.issueNumber}
                  </Text>
                  <Text style={styles.recentGrade}>
                    Grade: {scan.conditionGrade}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureName}>AI Recognition</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureName}>Live Pricing</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📋</Text>
              <Text style={styles.featureName}>Condition Grading</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureName}>Auto Listings</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎭</Text>
              <Text style={styles.featureName}>Fun Facts</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureName}>Analytics</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  modeSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  modeCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  collectorCard: {
    backgroundColor: '#E3F2FD',
  },
  dealerCard: {
    backgroundColor: '#FFF3E0',
  },
  modeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quickActionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '31%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  recentSection: {
    padding: 20,
  },
  recentItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recentImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  recentIssue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  recentGrade: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '31%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
