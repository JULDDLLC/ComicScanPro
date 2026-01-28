import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'DealerDashboard'>;

export default function DealerDashboard({ navigation }: Props) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    totalCost: 0,
    profit: 0,
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const inv = await AsyncStorage.getItem('dealerInventory');
      if (inv) {
        const items = JSON.parse(inv);
        setInventory(items);
        calculateStats(items);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const calculateStats = (items: any[]) => {
    const totalValue = items.reduce((sum, item) => sum + (item.currentValue || 0), 0);
    const totalCost = items.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
    const profit = totalValue - totalCost;

    setStats({
      totalItems: items.length,
      totalValue,
      totalCost,
      profit,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsHeader}
        >
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{stats.totalItems}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValue}>${stats.totalValue.toFixed(0)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Profit/Loss</Text>
            <Text style={[styles.statValue, { color: stats.profit >= 0 ? '#4CAF50' : '#FF5252' }]}>
              ${stats.profit.toFixed(0)}
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Scanner', { mode: 'dealer' })}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionTitle}>Quick Scan</Text>
            <Text style={styles.actionDesc}>Add new item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              // Bulk scan mode
              navigation.navigate('Scanner', { mode: 'dealer' });
            }}
          >
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionTitle}>Bulk Scan</Text>
            <Text style={styles.actionDesc}>Scan multiple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              // Create listing
            }}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionTitle}>Create List</Text>
            <Text style={styles.actionDesc}>Generate listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              // Analytics
            }}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDesc}>View reports</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Inventory */}
        {inventory.length > 0 && (
          <View style={styles.inventorySection}>
            <Text style={styles.sectionTitle}>Recent Inventory</Text>
            {inventory.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.inventoryItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemIssue}>Issue #{item.issueNumber}</Text>
                </View>
                <View style={styles.itemValue}>
                  <Text style={styles.itemPrice}>${item.currentValue?.toFixed(2) || '0.00'}</Text>
                  <Text style={styles.itemLocation}>{item.location || 'Unassigned'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Dealer Features</Text>
          <FeatureItem icon="🏷️" title="Location Tracking" desc="Organize by box/location" />
          <FeatureItem icon="💰" title="Profit Calculator" desc="Track ROI on each item" />
          <FeatureItem icon="📈" title="Price Alerts" desc="Get notified of price spikes" />
          <FeatureItem icon="🎯" title="Variant Detection" desc="Identify rare variants" />
          <FeatureItem icon="📊" title="Sales Analytics" desc="Track what's selling" />
          <FeatureItem icon="🖨️" title="Bulk Listing" desc="Generate multiple listings" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
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
  quickActionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  inventorySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemIssue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemValue: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  featuresSection: {
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
