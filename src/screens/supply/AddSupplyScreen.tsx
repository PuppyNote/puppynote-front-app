import React from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text, AddTopBar } from '../../components';

export default function AddSupplyScreen({ navigation }: any) {
  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <AddTopBar 
        title="용품 등록하기" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.photoUploadSection}>
          <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.7}>
            <Text style={styles.photoEmoji}>📸</Text>
            <Text style={styles.photoLabelText}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabelText}>Item Name</Text>
            <View style={styles.textInputWrapper}>
              <TextInput style={styles.textInput} placeholder="e.g. Organic Puppy Food" placeholderTextColor="#cbd5e1" />
            </View>
          </View>

          <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabelText}>Purchase Link</Text>
            <View style={styles.linkInputWrapper}>
              <Text style={styles.linkIcon}>🔗</Text>
              <TextInput style={styles.textInputFlex} placeholder="https://..." placeholderTextColor="#cbd5e1" />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.inputFieldGroupFlex}>
              <Text style={styles.inputLabelText}>Reminder</Text>
              <View style={styles.reminderInputWrapper}>
                <TextInput style={styles.textInputFlex} placeholder="30" placeholderTextColor="#cbd5e1" keyboardType="numeric" />
                <Text style={styles.reminderUnitText}>days</Text>
              </View>
            </View>
            <View style={styles.inputFieldGroupFlex}>
              <Text style={styles.inputLabelText}>Category</Text>
              <View style={styles.categoryPickerWrapper}>
                <Text style={styles.categoryText}>Food</Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabelText}>Notes</Text>
            <View style={styles.textInputWrapper}>
              <TextInput 
                style={styles.notesInput} 
                placeholder="Add any details about the item..." 
                placeholderTextColor="#cbd5e1"
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.9}
        >
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  photoUploadSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  photoPlaceholder: {
    width: 112,
    height: 112,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  photoLabelText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#94a3b8',
  },
  formContainer: {
    gap: 24,
  },
  inputFieldGroup: {
    gap: 8,
  },
  inputFieldGroupFlex: {
    flex: 1,
    gap: 8,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  linkInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 16,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 16,
  },
  notesInput: {
    fontSize: 16,
    minHeight: 100,
  },
  linkIcon: {
    color: '#94a3b8',
  },
  reminderUnitText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  categoryText: {
    fontSize: 16,
    color: '#0f172a',
  },
  pickerArrow: {
    color: '#94a3b8',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#eebd2b',
    borderRadius: 999,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 64,
  },
  saveButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
