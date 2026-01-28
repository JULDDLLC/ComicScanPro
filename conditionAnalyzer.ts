import * as FileSystem from 'expo-file-system';

export type ConditionGrade =
  | 'Gem Mint (9.8-10)'
  | 'Near Mint+ (9.6)'
  | 'Near Mint (9.0-9.2)'
  | 'Very Fine+ (8.5)'
  | 'Very Fine (8.0)'
  | 'Fine+ (7.5)'
  | 'Fine (6.0-7.0)'
  | 'Very Good+ (5.5)'
  | 'Very Good (4.0-5.0)'
  | 'Good+ (3.5)'
  | 'Good (2.0-3.0)'
  | 'Fair (1.5)'
  | 'Poor (0.5-1.0)';

export interface ConditionAnalysis {
  grade: ConditionGrade;
  score: number;
  details: {
    coverGloss: string;
    spineCondition: string;
    cornerCondition: string;
    pageQuality: string;
    bindingCondition: string;
    overallAppearance: string;
  };
  recommendations: string[];
}

export async function analyzeCondition(imageUri: string): Promise<ConditionGrade> {
  try {
    // In a real implementation, you would use Google Cloud Vision API
    // to analyze the image and determine condition based on:
    // - Cover gloss/shine
    // - Spine condition
    // - Corner wear
    // - Page quality
    // - Binding integrity
    // - Overall appearance

    // For now, return a mock analysis
    const analysis = getMockConditionAnalysis();
    return analysis.grade;
  } catch (error) {
    console.error('Error analyzing condition:', error);
    return 'Very Good (4.0-5.0)';
  }
}

export async function getDetailedConditionAnalysis(
  imageUri: string
): Promise<ConditionAnalysis> {
  try {
    // Read image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call Google Cloud Vision API for detailed analysis
    // This would analyze specific aspects of the comic condition

    return getMockConditionAnalysis();
  } catch (error) {
    console.error('Error getting detailed condition analysis:', error);
    return getMockConditionAnalysis();
  }
}

function getMockConditionAnalysis(): ConditionAnalysis {
  const grades: ConditionGrade[] = [
    'Gem Mint (9.8-10)',
    'Near Mint+ (9.6)',
    'Near Mint (9.0-9.2)',
    'Very Fine+ (8.5)',
    'Very Fine (8.0)',
    'Fine+ (7.5)',
    'Fine (6.0-7.0)',
    'Very Good+ (5.5)',
    'Very Good (4.0-5.0)',
    'Good+ (3.5)',
    'Good (2.0-3.0)',
    'Fair (1.5)',
    'Poor (0.5-1.0)',
  ];

  const randomGrade = grades[Math.floor(Math.random() * grades.length)];
  const gradeScores: { [key in ConditionGrade]: number } = {
    'Gem Mint (9.8-10)': 9.9,
    'Near Mint+ (9.6)': 9.6,
    'Near Mint (9.0-9.2)': 9.1,
    'Very Fine+ (8.5)': 8.5,
    'Very Fine (8.0)': 8.0,
    'Fine+ (7.5)': 7.5,
    'Fine (6.0-7.0)': 6.5,
    'Very Good+ (5.5)': 5.5,
    'Very Good (4.0-5.0)': 4.5,
    'Good+ (3.5)': 3.5,
    'Good (2.0-3.0)': 2.5,
    'Fair (1.5)': 1.5,
    'Poor (0.5-1.0)': 0.75,
  };

  return {
    grade: randomGrade,
    score: gradeScores[randomGrade],
    details: {
      coverGloss: 'Bright and glossy with minimal wear',
      spineCondition: 'Tight with minimal stress marks',
      cornerCondition: 'Sharp with minimal rounding',
      pageQuality: 'White pages with minimal aging',
      bindingCondition: 'Secure and tight',
      overallAppearance: 'Excellent condition with minimal defects',
    },
    recommendations: [
      'Consider professional grading for high-value comics',
      'Store in acid-free bags and boards',
      'Keep away from direct sunlight',
      'Maintain stable temperature and humidity',
    ],
  };
}

export function getGradeColor(grade: ConditionGrade): string {
  const gradeColors: { [key in ConditionGrade]: string } = {
    'Gem Mint (9.8-10)': '#FFD700',
    'Near Mint+ (9.6)': '#FFC700',
    'Near Mint (9.0-9.2)': '#FFB700',
    'Very Fine+ (8.5)': '#FFA700',
    'Very Fine (8.0)': '#FF9700',
    'Fine+ (7.5)': '#FF8700',
    'Fine (6.0-7.0)': '#FF7700',
    'Very Good+ (5.5)': '#FF6700',
    'Very Good (4.0-5.0)': '#FF5700',
    'Good+ (3.5)': '#FF4700',
    'Good (2.0-3.0)': '#FF3700',
    'Fair (1.5)': '#FF2700',
    'Poor (0.5-1.0)': '#FF0000',
  };

  return gradeColors[grade] || '#999999';
}

export function getGradeDescription(grade: ConditionGrade): string {
  const descriptions: { [key in ConditionGrade]: string } = {
    'Gem Mint (9.8-10)': 'Perfect or near-perfect condition. Rarely seen.',
    'Near Mint+ (9.6)': 'Nearly perfect with only the slightest imperfections.',
    'Near Mint (9.0-9.2)': 'Nearly perfect with minor wear.',
    'Very Fine+ (8.5)': 'Very fine condition with minimal wear.',
    'Very Fine (8.0)': 'Fine condition with light wear.',
    'Fine+ (7.5)': 'Fine condition with some wear.',
    'Fine (6.0-7.0)': 'Fine condition with moderate wear.',
    'Very Good+ (5.5)': 'Very good condition with noticeable wear.',
    'Very Good (4.0-5.0)': 'Good condition with significant wear.',
    'Good+ (3.5)': 'Good condition with heavy wear.',
    'Good (2.0-3.0)': 'Fair condition with heavy wear.',
    'Fair (1.5)': 'Poor condition with very heavy wear.',
    'Poor (0.5-1.0)': 'Very poor condition, barely readable.',
  };

  return descriptions[grade] || 'Unknown condition';
}
