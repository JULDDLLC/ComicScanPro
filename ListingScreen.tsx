import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';
import { generateSellerListing } from '../services/listingGenerator';

type Props = NativeStackScreenProps<RootStackParamList, 'Listing'>;

export default function ListingScreen({ navigation, route }: Props) {
  const { comicData, conditionGrade, pricing } = route.params;
  const [listing, setListing] = useState('');
  const [customPrice, setCustomPrice] = useState(pricing.averagePrice.toString());
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    generateListing();
  }, []);

  const generateListing = async () => {
    setIsGenerating(true);
    try {
      const generatedListing = await generateSellerListing(
        comicData,
        conditionGrade,
        parseFloat(customPrice)
      );
      setListing(generatedListing);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate listing');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(listing);
      Alert.alert('Success', 'Listing copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy listing');
    }
  };

  const handleShareToEbay = () => {
    Alert.alert('eBay', 'Open eBay app and paste the listing details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Comic Info */}
        <View style={styles.comicInfo}>
          <Text style={styles.title}>{comicData.title}</Text>
          <Text style={styles.issue}>Issue #{comicData.issueNumber}</Text>
          <Text style={styles.grade}>Condition: {conditionGrade}</Text>
        </View>

        {/* Price Input */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Listing Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={customPrice}
              onChangeText={setCustomPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
          </View>
          <Text style={styles.priceHint}>
            Market average: ${pricing.averagePrice.toFixed(2)}
          </Text>
        </View>

        {/* Listing Preview */}
        <View style={styles.listingSection}>
          <Text style={styles.sectionTitle}>Seller-Ready Listing</Text>
          <View style={styles.listingBox}>
            <Text style={styles.listingText}>{listing || 'Generating listing...'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleCopyToClipboard}
          >
            <Text style={styles.buttonText}>📋 Copy Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => generateListing()}
          >
            <Text style={styles.secondaryButtonText}>🔄 Regenerate</Text>
          </TouchableOpacity>
        </View>

        {/* Platform Options */}
        <View style={styles.platformSection}>
          <Text style={styles.sectionTitle}>Share To Platform</Text>
          <TouchableOpacity style={styles.platformButton}>
            <Text style={styles.platformIcon}>🛒</Text>
            <Text style={styles.platformName}>eBay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.platformButton}>
            <Text style={styles.platformIcon}>📱</Text>
            <Text style={styles.platformName}>Mercari</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.platformButton}>
            <Text style={styles.platformIcon}>👥</Text>
            <Text style={styles.platformName}>Facebook</Text>
          </TouchableOpacity>
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
  comicInfo: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  issue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  grade: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  listingSection: {
    padding: 16,
  },
  listingBox: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 200,
  },
  listingText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  platformSection: {
    padding: 16,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
