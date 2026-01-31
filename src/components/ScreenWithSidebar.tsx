import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useSidebar } from '../hooks/useSidebar';
import { navigateToNotifications, navigateToAIChatbot } from '../utils/navigation';
import { IconButton } from 'react-native-paper';

type ScreenWithSidebarProps = {
  children: ReactNode;
  title: string;
  navigation: any;
  notificationCount?: number;
  onChatbotPress?: () => void;
};

/**
 * A wrapper component that provides consistent TopBar and Sidebar functionality
 * for any screen in the application.
 */
const ScreenWithSidebar = ({ 
  children, 
  title, 
  navigation,
  notificationCount = 0,
  onChatbotPress,
}: ScreenWithSidebarProps) => {
  const { theme, isDarkMode } = useTheme();
  const { sidebarVisible, openSidebar, closeSidebar } = useSidebar();

  const handleNotificationPress = () => {
    navigateToNotifications(navigation);
  };

  const handleChatbotPress = () => {
    if (onChatbotPress) {
      onChatbotPress();
    } else {
      // If no custom handler is provided, navigate to AI Chatbot screen
      navigateToAIChatbot(navigation);
    }
  };

  // Render the AI chatbot button for the top bar
  const chatbotButton = (
    <IconButton
      icon="robot"
      iconColor={isDarkMode ? theme.text : theme.text}
      size={24}
      onPress={handleChatbotPress}
      style={{
        backgroundColor: isDarkMode 
          ? 'rgba(67, 97, 238, 0.15)' 
          : 'rgba(30, 136, 229, 0.1)',
        margin: 0,
        borderRadius: 12,
        marginRight: 8,
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F7FA' }]}>
      <TopBar 
        title={title}
        onMenuPress={openSidebar}
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
        extraActions={chatbotButton}
      />
      
      {children}

      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ScreenWithSidebar; 