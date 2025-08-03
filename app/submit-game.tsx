import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';

export default function SubmitGame() {
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    subtitle: '',
    gifUrl: '',
    gameUrl: ''
  });

  // Prefill form if remixing
  useEffect(() => {
    if (params.remix === 'true' && params.name) {
      setFormData(prev => ({
        ...prev,
        name: `${params.name} Remix`,
        gifUrl: params.gif?.toString() || '',
        gameUrl: params.url?.toString() || ''
      }));
    }
  }, [params.remix, params.name, params.gif, params.url]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.author || !formData.gifUrl || !formData.gameUrl) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/games/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.name,
          author: formData.author,
          description: formData.subtitle || `Created by ${formData.author}`,
          previewGif: formData.gifUrl,
          gameUrl: formData.gameUrl
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          'Success!',
          'Your game has been submitted for review.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to submit game');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit game. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>submit a game</Text>
          <Text style={styles.subtitle}>share your creation with the world</Text>

          <TextInput
            style={styles.input}
            placeholder="game name *"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="your name *"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.author}
            onChangeText={(text) => setFormData(prev => ({ ...prev, author: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="subtitle (optional)"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.subtitle}
            onChangeText={(text) => setFormData(prev => ({ ...prev, subtitle: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="gif preview url *"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.gifUrl}
            onChangeText={(text) => setFormData(prev => ({ ...prev, gifUrl: text }))}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="game url *"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.gameUrl}
            onChangeText={(text) => setFormData(prev => ({ ...prev, gameUrl: text }))}
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>submit game</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  }
});