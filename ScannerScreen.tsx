import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';
import { recognizeComic } from '../services/visionApi';
import { getComicDetails } from '../services/metronApi';
import { getPricing } from '../services/pricingApi';
import { analyzeCondition } from '../utils/conditionAnalyzer';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export default function ScannerScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need camera permission to scan comics
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo) {
        await processImage(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
      setIsProcessing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsProcessing(true);
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      // Recognize comic from image
      const recognition = await recognizeComic(imageUri);

      if (!recognition.success) {
        setShowManualSearch(true);
        setIsProcessing(false);
        return;
      }

      // Get comic details
      const comicDetails = await getComicDetails(
        recognition.title,
        recognition.issueNumber
      );

      // Get pricing
      const pricing = await getPricing(
        recognition.title,
        recognition.issueNumber
      );

      // Analyze condition
      const conditionGrade = await analyzeCondition(imageUri);

      // Navigate to results
      navigation.navigate('Results', {
        comicData: comicDetails,
        conditionGrade,
        pricing,
        image: imageUri,
        mode,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a comic title');
      return;
    }

    setIsProcessing(true);
    try {
      const comicDetails = await getComicDetails(searchQuery, '1');
      const pricing = await getPricing(searchQuery, '1');

      navigation.navigate('Results', {
        comicData: comicDetails,
        conditionGrade: 'Unknown',
        pricing,
        image: '',
        mode,
      });
    } catch (error) {
      Alert.alert('Error', 'Comic not found. Please try another search.');
      setIsProcessing(false);
    }
  };

  if (showManualSearch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.manualSearchContainer}>
          <Text style={styles.manualSearchTitle}>Comic Not Recognized</Text>
          <Text style={styles.manualSearchSubtitle}>
            Search manually or try another photo
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Enter comic title and issue #"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleManualSearch}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setShowManualSearch(false);
              setSearchQuery('');
            }}
          >
            <Text style={styles.backButtonText}>Try Another Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <View style={styles.overlay}>
          <View style={styles.frameGuide} />
        </View>

        <View style={styles.controls}>
          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.processingText}>Analyzing comic...</Text>
            </View>
          )}

          {!isProcessing && (
            <>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <View style={styles.bottomControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handlePickImage}
                >
                  <Text style={styles.controlButtonText}>📷 Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowManualSearch(true)}
                >
                  <Text style={styles.controlButtonText}>🔍 Search</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameGuide: {
    width: 280,
    height: 420,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    opacity: 0.5,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  manualSearchContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  manualSearchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  manualSearchSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
