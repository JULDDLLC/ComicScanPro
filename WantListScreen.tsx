import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WantList'>;

export default function WantListScreen({ navigation }: Props) {
  const [wantList, setWantList] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadWantList();
  }, []);

  const loadWantList = async () => {
    try {
      const list = await AsyncStorage.getItem('wantList');
      if (list) {
        setWantList(JSON.parse(list));
      }
    } catch (error) {
      console.error('Error loading want list:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter a comic title');
      return;
    }

    try {
      const item = {
        id: Date.now().toString(),
        title: newItem,
        addedDate: new Date().toISOString(),
        found: false,
      };

      const updated = [...wantList, item];
      setWantList(updated);
      await AsyncStorage.setItem('wantList', JSON.stringify(updated));
      setNewItem('');
      setShowAddForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const updated = wantList.filter((item) => item.id !== id);
      setWantList(updated);
      await AsyncStorage.setItem('wantList', JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const handleToggleFound = async (id: string) => {
    try {
      const updated = wantList.map((item) =>
        item.id === id ? { ...item, found: !item.found } : item
      );
      setWantList(updated);
      await AsyncStorage.setItem('wantList', JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Want List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Add Form */}
      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter comic title and issue #"
            placeholderTextColor={COLORS.textSecondary}
            value={newItem}
            onChangeText={setNewItem}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.addFormButton]}
              onPress={handleAddItem}
            >
              <Text style={styles.formButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setShowAddForm(false);
                setNewItem('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Want List Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {wantList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No items on your want list yet</Text>
            <Text style={styles.emptySubtext}>Add comics you're looking for</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {wantList.map((item) => (
              <View
                key={item.id}
                style={[styles.listItem, item.found && styles.foundItem]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleToggleFound(item.id)}
                >
                  <Text style={styles.checkboxText}>
                    {item.found ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemTitle,
                      item.found && styles.foundText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.itemDate}>
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Stats */}
      {wantList.length > 0 && (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{wantList.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Found</Text>
            <Text style={styles.statValue}>
              {wantList.filter((i) => i.found).length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Still Looking</Text>
            <Text style={styles.statValue}>
              {wantList.filter((i) => !i.found).length}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addForm: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addFormButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: '600',
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
  listContainer: {
    padding: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foundItem: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  foundText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  itemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#FF5252',
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
