import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <Text h4 style={styles.errorText}>{message}</Text>
      <Button
        title="Retry"
        onPress={onRetry}
        buttonStyle={styles.retryButton}
        titleStyle={styles.retryButtonText}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#4c669f',
    fontSize: 16,
  },
});

export default ErrorDisplay;

