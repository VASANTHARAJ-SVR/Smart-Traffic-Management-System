import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import * as Animatable from 'react-native-animatable';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      // In a real app, you would make an API call to reset password
      // For now, we'll simulate a successful reset
      setTimeout(() => {
        setResetSent(true);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      Alert.alert('Reset Failed', 'Could not send reset email. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <TextInput.Icon icon="arrow-left" color={theme.primary} size={28} />
          </TouchableOpacity>

          <Text style={[styles.headerText, { color: theme.text }]}>
            Forgot Password
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter your email address to receive a password reset link
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={300} style={styles.formContainer}>
          {resetSent ? (
            <View style={styles.successContainer}>
              <Avatar.Icon 
                size={64}
                icon="email-check" 
                color={theme.white}
                style={{ backgroundColor: theme.success }}
              />
              <Text style={[styles.successTitle, { color: theme.success }]}>
                Reset Email Sent
              </Text>
              <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={[styles.backToLoginButton, { backgroundColor: theme.primary }]}
                labelStyle={styles.buttonText}
              >
                Back to Login
              </Button>
            </View>
          ) : (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" color={theme.primary} />}
                theme={{
                  colors: {
                    primary: theme.primary,
                    background: theme.background,
                    text: theme.text,
                    placeholder: theme.textSecondary,
                  },
                }}
              />

              <Button
                mode="contained"
                onPress={handleResetPassword}
                style={[styles.resetButton, { backgroundColor: theme.primary }]}
                labelStyle={styles.buttonText}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.white} size="small" />
                ) : (
                  'Reset Password'
                )}
              </Button>

              <View style={styles.loginContainer}>
                <Text style={[styles.rememberText, { color: theme.textSecondary }]}>
                  Remember your password?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.loginText, { color: theme.primary }]}>
                    {' '}
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 24,
  },
  resetButton: {
    paddingVertical: 8,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    paddingVertical: 8,
    width: '100%',
  },
});

export default ForgotPasswordScreen;