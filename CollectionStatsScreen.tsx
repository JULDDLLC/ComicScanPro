import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionStats'>;

export default function CollectionStatsScreen({ navigation }: Props) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    averageValue: 0,
    publishers: {} as { [key: string]: number },
    conditions: {} as { [key: string]: number },
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const collection = await AsyncStorage.getItem('collection');
      if (collection) {
        const items = JSON.parse(collection);
        calculateStats(items);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateStats = (items: any[]) => {
    const totalValue = items.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
    const publishers: { [key: string]: number } = {};
    const conditions: { [key: string]: number } = {};

    items.forEach((item) => {
      publishers[item.publisher] = (publishers[item.publisher] || 0) + 1;
      conditions[item.conditionGrade] = (conditions[item.conditionGrade] || 0) + 1;
    });

    setStats({
      totalItems: items.length,
      totalValue,
      averageValue: items.length > 0 ? totalValue / items.length : 0,
      publishers,
      conditions,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Stats */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsHeader}
        >
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Comics</Text>
            <Text style={styles.statValue}>{stats.totalItems}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Collection Value</Text>
            <Text style={styles.statValue}>${stats.totalValue.toFixed(0)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Value</Text>
            <Text style={styles.statValue}>${stats.averageValue.toFixed(2)}</Text>
          </View>
        </LinearGradient>

        {/* Publishers */}
        {Object.keys(stats.publishers).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Publisher</Text>
            {Object.entries(stats.publishers).map(([publisher, count]) => (
              <View key={publisher} style={styles.statRow}>
                <Text style={styles.statRowLabel}>{publisher}</Text>
                <Text style={styles.statRowValue}>{count} comics</Text>
              </View>
            ))}
          </View>
        )}

        {/* Conditions */}
        {Object.keys(stats.conditions).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Condition</Text>
            {Object.entries(stats.conditions).map(([condition, count]) => (
              <View key={condition} style={styles.statRow}>
                <Text style={styles.statRowLabel}>{condition}</Text>
                <Text style={styles.statRowValue}>{count} comics</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {stats.totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No collection data yet</Text>
            <Text style={styles.emptySubtext}>Start scanning comics to build your collection</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statsHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statRowLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  statRowValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
