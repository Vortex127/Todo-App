import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import ProfileScreen from './screens/Profile';
import NotesScreen from './screens/Notes';
import APIScreen from './screens/API';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen options = {{headerShown: false}} name="Signup" component={SignupScreen} />
        <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options = {{headerShown: false}} name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
        <Stack.Screen options = {{headerShown: false}}  name="Notes" component={NotesScreen} />
         <Stack.Screen name="API" component={APIScreen} /> 
      </Stack.Navigator>
    </NavigationContainer> 
  );
}