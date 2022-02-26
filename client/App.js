import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginView } from './views/LoginView';
import { LinksView } from './views/LinksView';
import { AuthProvider } from './providers/AuthProvider';
import { LinksProvider } from './providers/LinksProvider';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens();
const Stack = createStackNavigator();

export default function App () {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            gestureEnabled: true,
            animationEnabled: false
          }}>
            <Stack.Screen
              name='Login View'
              component={LoginView}
              options={{ title: 'Read it Later - Maybe' }}
            />
            <Stack.Screen name='Links'>
              {() => {
                return (
                  <LinksProvider>
                    <LinksView />
                  </LinksProvider>
                );
              }}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
