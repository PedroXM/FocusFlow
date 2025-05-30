
import { Alert } from 'react-native';

// Função simplificada para simular notificações no Expo Go
export const scheduleTimerNotification = (title, body) => {
  // No Expo Go, apenas mostramos um alerta
  console.log(`[NOTIFICAÇÃO]: ${title} - ${body}`);
  
  // Mostra um alerta ao invés de uma notificação real
  setTimeout(() => {
    Alert.alert(title, body);
  }, 500);
  
  return "notification-id-simulated";
};

export const cancelNotification = (id) => {
  console.log(`[NOTIFICAÇÃO CANCELADA]: ${id}`);
  // Não faz nada no Expo Go
};