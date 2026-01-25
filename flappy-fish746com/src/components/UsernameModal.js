import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UsernameModal = ({ visible, onClose, onSave }) => {
  const { username, getDisplayName, setUserDisplayName, isGuest } = useAuth();
  const [inputValue, setInputValue] = useState(username || '');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (inputValue.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (inputValue.trim().length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9_]+$/.test(inputValue.trim())) {
      setError('Only letters, numbers, and underscores allowed');
      return;
    }

    setIsSaving(true);
    setError(null);

    const result = await setUserDisplayName(inputValue.trim());
    
    if (result.success) {
      onSave && onSave(inputValue.trim());
      onClose();
    } else {
      setError(result.error || 'Failed to save username');
    }

    setIsSaving(false);
  };

  const handleClose = () => {
    setInputValue(username || '');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>👤</Text>
            <Text style={styles.headerTitle}>Set Your Username</Text>
          </View>

          {/* Current Display */}
          <View style={styles.currentInfo}>
            <Text style={styles.currentLabel}>Currently showing as:</Text>
            <Text style={styles.currentName}>{getDisplayName()}</Text>
            {isGuest && (
              <Text style={styles.guestBadge}>Guest Account</Text>
            )}
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setError(null);
              }}
              placeholder="Enter username..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.charCount}>{inputValue.length}/20</Text>
          </View>

          {error && (
            <Text style={styles.errorText}>⚠️ {error}</Text>
          )}

          <Text style={styles.hint}>
            Your username will be displayed on the leaderboard
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.WHITE,
  },
  currentInfo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  currentLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  currentName: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  guestBadge: {
    backgroundColor: 'rgba(241,196,15,0.2)',
    color: '#f1c40f',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.WHITE,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  charCount: {
    position: 'absolute',
    right: 12,
    top: 16,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 8,
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(39,174,96,0.5)',
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default UsernameModal;
