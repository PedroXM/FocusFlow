
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Importação dos contextos
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { TimerProvider } from './contexts/TimerContext';
import { SubjectProvider, useSubject } from './contexts/SubjectContext';

// Telas e navegação
import SplashScreen from './screens/splash/SplashScreen';
import AppNavigator from './navigation/AppNavigator';

// Componente intermediário para conectar os contextos
const AppWithContexts = () => {
  const { theme, isDarkMode } = useTheme();
  const { getSelectedSubject, addSession } = useSubject();
  const [isLoading, setIsLoading] = useState(true);
  
  // Configurações para o TimerProvider
  const timerSettings = {
    subjectActions: {
      getSelectedSubject,
      addSession
    }
  };

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <TimerProvider subjectActions={timerSettings.subjectActions}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TimerProvider>
    </View>
  );
};

// Componente principal com todos os providers aninhados
export default function App() {
  return (
    <ThemeProvider>
      <SubjectProvider>
        <AppWithContexts />
      </SubjectProvider>
    </ThemeProvider>
  );
}