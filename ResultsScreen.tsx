import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';
import { getComicFunFacts } from '../services/metronApi';
import { getGradeColor, getGradeDescription } from '../utils/conditionAnalyzer';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ navigation, route }: Props) {
  const { comicData, conditionGrade, pricing, image, mode } = route.params;
  const [funFacts, setFunFacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFunFacts();
    saveToRecentScans();
  }, []);

  const loadFunFacts = async () => {
    try {
      const facts = await getComicFunFacts(comicData.id);
      setFunFacts(facts);
    } catch (error) {
      console.error('Error loading fun facts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToRecentScans = async () => {
    try {
      const recentScans = await AsyncStorage.getItem('recentScans');
      const scans = recentScans ? JSON.parse(recentScans) : [];

      const newScan = {
        comicData,
        conditionGrade,
        pricing,
        image,
        timestamp: new Date().toISOString(),
      };

      scans.unshift(newScan);
      await AsyncStorage.setItem('recentScans', JSON.stringify(scans.slice(0, 20)));
    } catch (error) {
      console.error('Error saving recent scan:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this comic: ${comicData.title} #${comicData.issueNumber}\nCondition: ${conditionGrade}\nPrice: $${pricing.averagePrice.toFixed(2)}`,
        title: comicData.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCollection = async () => {
    try {
      const collection = await AsyncStorage.getItem('collection');
      const items = collection ? JSON.parse(collection) : [];

      items.push({
        id: `${comicData.id}-${Date.now()}`,
        ...comicData,
        conditionGrade,
        purchasePrice: pricing.averagePrice,
        addedDate: new Date().toISOString(),
      });

      await AsyncStorage.setItem('collection', JSON.stringify(items));
      alert('Added to collection!');
    } catch (error) {
      console.error('Error adding to collection:', error);
    }
  };

  const gradeColor = getGradeColor(conditionGrade as any);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Comic Cover Image */}
        {image && (
          <Image source={{ uri: image }} style={styles.coverImage} />
        )}

        {/* Title and Issue */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{comicData.title}</Text>
          <Text style={styles.issueNumber}>Issue #{comicData.issueNumber}</Text>
          <Text style={styles.publisher}>{comicData.publisher}</Text>
        </View>

        {/* Condition Grade Card */}
        <View style={[styles.card, styles.gradeCard]}>
          <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
            <Text style={styles.gradeText}>{conditionGrade}</Text>
          </View>
          <Text style={styles.gradeDescription}>
            {getGradeDescription(conditionGrade as any)}
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={[styles.card, styles.pricingCard]}>
          <Text style={styles.cardTitle}>Market Pricing</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Average Price:</Text>
            <Text style={styles.priceValue}>
              ${pricing.averagePrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Range:</Text>
            <Text style={styles.priceValue}>
              ${pricing.lowestPrice.toFixed(2)} - ${pricing.highestPrice.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.priceSource}>Source: {pricing.source}</Text>

          {/* Price by Grade */}
          <View style={styles.pricesByGrade}>
            <Text style={styles.subTitle}>Prices by Condition:</Text>
            {pricing.prices.map((p: any, index: number) => (
              <View key={index} style={styles.gradePrice}>
                <Text style={styles.gradeName}>{p.grade}</Text>
                <Text style={styles.gradeValue}>${p.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Comic Details Card */}
        <View style={[styles.card, styles.detailsCard]}>
          <Text style={styles.cardTitle}>Comic Details</Text>

          {comicData.publishDate && (
            <DetailRow label="Published" value={comicData.publishDate} />
          )}

          {comicData.pageCount && (
            <DetailRow label="Pages" value={comicData.pageCount.toString()} />
          )}

          {comicData.writers && comicData.writers.length > 0 && (
            <DetailRow label="Writer(s)" value={comicData.writers.join(', ')} />
          )}

          {comicData.artists && comicData.artists.length > 0 && (
            <DetailRow label="Artist(s)" value={comicData.artists.join(', ')} />
          )}

          {comicData.colorists && comicData.colorists.length > 0 && (
            <DetailRow label="Colorist(s)" value={comicData.colorists.join(', ')} />
          )}

          {comicData.letterers && comicData.letterers.length > 0 && (
            <DetailRow label="Letterer(s)" value={comicData.letterers.join(', ')} />
          )}

          {comicData.editors && comicData.editors.length > 0 && (
            <DetailRow label="Editor(s)" value={comicData.editors.join(', ')} />
          )}
        </View>

        {/* Description */}
        {comicData.description && (
          <View style={[styles.card, styles.descriptionCard]}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>{comicData.description}</Text>
          </View>
        )}

        {/* Fun Facts */}
        {!isLoading && funFacts.length > 0 && (
          <View style={[styles.card, styles.factsCard]}>
            <Text style={styles.cardTitle}>🎭 Fun Facts & Trivia</Text>
            {funFacts.map((fact, index) => (
              <View key={index} style={styles.factItem}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {mode === 'collector' && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleAddToCollection}
            >
              <Text style={styles.buttonText}>Add to Collection</Text>
            </TouchableOpacity>
          )}

          {mode === 'dealer' && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() =>
                navigation.navigate('Listing', {
                  comicData,
                  conditionGrade,
                  pricing,
                })
              }
            >
              <Text style={styles.buttonText}>Create Listing</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleShare}
          >
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  coverImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  headerSection: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  issueNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  publisher: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    margin: 12,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradeCard: {
    alignItems: 'center',
  },
  gradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  gradeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pricingCard: {},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceSource: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  pricesByGrade: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  gradePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  gradeName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  gradeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailsCard: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  descriptionCard: {},
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  factsCard: {},
  factItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  factBullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  factText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
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
  spacer: {
    height: 20,
  },
});
