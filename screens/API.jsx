import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-elements';
import axios from 'axios';
import WeatherListItem from '../components/WeatherListItem';
import ErrorDisplay from '../components/ErrorDisplay';

const API_KEY = '40a9d12082f19efe3becd1b78421606a'; // Replace with your actual API key
const cities = ['London', 'New York', 'Tokyo', 'Karachi', 'Paris', 'Dubai', 'Rio de Janeiro', 'Cape Town', 'Moscow', 'Bangkok'];

export default function APIScreen() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const requests = cities.map(city =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      );
      const responses = await Promise.all(requests);
      const data = responses.map(response => response.data);
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Fetching global weather data...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchWeatherData} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
        <Text h2 style={styles.title}>Global Weather Pulse</Text>
        <ScrollView contentContainerStyle={styles.list}>
          {weatherData.length > 0 ? (
            weatherData.map((item, index) => (
              <WeatherListItem key={item?.id || index} weather={item} />
            ))
          ) : (
            <Text style={styles.emptyText}>No weather data available</Text>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
});
