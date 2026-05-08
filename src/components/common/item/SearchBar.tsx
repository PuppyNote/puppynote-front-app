import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText as Text } from './CustomText';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onClear?: () => void;
  placeholder?: string;
  containerStyle?: object;
  showSearchButton?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onSearch, 
  onClear,
  placeholder = '검색어를 입력하세요.',
  containerStyle,
  showSearchButton = true
}: SearchBarProps) {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            onSearch();
          }}
          returnKeyType="search"
          placeholderTextColor="#94a3b8"
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {showSearchButton && (
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => {
            Keyboard.dismiss();
            onSearch();
          }}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#eebd2b',
    borderRadius: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
