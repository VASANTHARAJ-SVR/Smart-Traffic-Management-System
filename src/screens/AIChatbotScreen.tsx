import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWithSidebar from '../components/ScreenWithSidebar';
import GlassmorphicCard from '../components/GlassmorphicCard';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { getGeminiResponse } from '../services/geminiService';
import { isGeminiConfigured } from '../config/api';

const { width, height } = Dimensions.get('window');

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  hasLinks?: boolean;
  links?: Array<{ text: string, action: string }>;
};

const suggestedQuestions = [
  "How can I report a stolen vehicle?",
  "What's the process for recovering a vehicle?",
  "How do I pay an e-challan?",
  "What documents do I need for vehicle verification?",
  "How do I check a vehicle's status?",
  "Where can I file a traffic incident report?",
];

// Demo conversation for testing
const demoConversation: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! I\'m your AI assistant. How can I help you today with traffic policing matters?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '2',
    text: 'I want to report a stolen vehicle',
    sender: 'user',
    timestamp: new Date(Date.now() - 100000),
  },
  {
    id: '3',
    text: 'I\'m sorry to hear about your stolen vehicle. To report it, please follow these steps:\n\n1. Navigate to the Vehicle Recovery section\n2. Tap on "Add Case" button\n3. Fill in your vehicle details, location of theft, and a detailed description\n4. Submit the report\n\nOnce submitted, an alert will be created and officers will begin the search process. Would you like me to navigate you to the Vehicle Recovery section now?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 90000),
    hasLinks: true,
    links: [
      { text: 'Go to Vehicle Recovery', action: 'VehicleRecovery' }
    ],
  },
  {
    id: '4',
    text: 'What kind of details do I need to provide?',
    sender: 'user',
    timestamp: new Date(Date.now() - 80000),
  },
  {
    id: '5',
    text: 'For a complete stolen vehicle report, you should provide:\n\n- Vehicle registration number\n- Make and model of the vehicle\n- Vehicle color\n- Location where it was last seen\n- Date and time when you last saw it\n- Any distinguishing features (e.g., dents, stickers)\n- FIR number if you\'ve already filed a police report\n\nThe more details you provide, the easier it will be for officers to identify and recover your vehicle.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 70000),
  },
  {
    id: '6',
    text: 'Thanks for the information',
    sender: 'user',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '7',
    text: 'You\'re welcome! Is there anything else you\'d like to know about the vehicle recovery process or any other traffic police services?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 50000),
  },
];

const AIChatbotScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today with traffic policing matters?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const handleModeToggle = () => {
    if (!isOnlineMode && !isGeminiConfigured()) {
      setApiError('Gemini API key not configured. Please add your API key in the .env file.');
      return;
    }
    setIsOnlineMode(!isOnlineMode);
    setApiError(null);
  };

  const getGeminiResponseFromService = async (userMessage: string) => {
    try {
      const response = await getGeminiResponse(userMessage);
      return response;
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      let aiResponse: string;
      
      if (isOnlineMode) {
        console.log('Attempting to get Gemini response...');
        aiResponse = await getGeminiResponseFromService(message);
        console.log('Received Gemini response');
      } else {
        aiResponse = getAIResponse(message);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      // Add links for certain responses
      if (message.toLowerCase().includes('stolen') || 
          message.toLowerCase().includes('theft') || 
          message.toLowerCase().includes('recovery')) {
        aiMessage.hasLinks = true;
        aiMessage.links = [
          { text: 'Go to Vehicle Recovery', action: 'VehicleRecovery' }
        ];
      } else if (message.toLowerCase().includes('challan') || 
                 message.toLowerCase().includes('fine') || 
                 message.toLowerCase().includes('ticket')) {
        aiMessage.hasLinks = true;
        aiMessage.links = [
          { text: 'Go to E-Challan', action: 'EChallan' }
        ];
      }
      
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or switch to offline mode.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const getAIResponse = (userMessage: string) => {
    // Simulate AI response based on user message
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('stolen') || lowerCaseMessage.includes('theft') || lowerCaseMessage.includes('missing')) {
      return 'To report a stolen vehicle, please go to the Vehicle Recovery section. You\'ll need to provide your vehicle number, location of theft, and a description of the incident. Our officers will create an alert and begin the search process.\n\nWould you like me to navigate you to the Vehicle Recovery section now?';
    } else if (lowerCaseMessage.includes('challan') || lowerCaseMessage.includes('fine') || lowerCaseMessage.includes('ticket')) {
      return 'E-challans can be paid through our E-Challan section. You can search for your challan by vehicle number or challan ID, and pay using various payment methods including credit/debit cards, UPI, or net banking.\n\nWould you like me to show you the E-Challan section?';
    } else if (lowerCaseMessage.includes('document') || lowerCaseMessage.includes('license') || lowerCaseMessage.includes('registration')) {
      return 'For document verification, please visit the Documents section. You will need to provide:\n\n- Vehicle registration certificate\n- Driver license\n- Insurance documents\n- Pollution certificate\n\nThe app can scan and verify these documents to ensure they are valid and up-to-date.';
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi ') || lowerCaseMessage === 'hi') {
      return 'Hello! How can I assist you with traffic police services today? I can help with vehicle recovery, e-challans, document verification, and more.';
    } else if (lowerCaseMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else you\'d like to know about our traffic police services?';
    } else if (lowerCaseMessage.includes('demo') || lowerCaseMessage.includes('test')) {
      return 'I can demonstrate my capabilities with a sample conversation. Just tap the "View Demo" button below to see a demonstration of how I can assist with reporting a stolen vehicle.';
    } else {
      return 'I understand you\'re asking about ' + userMessage + '. Please provide more details so I can assist you better, or navigate to the specific section in the app for detailed information.';
    }
  };

  const handleQuestionSelect = (question: string) => {
    setMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLinkAction = (action: string) => {
    // Handle navigation based on action
    switch (action) {
      case 'VehicleRecovery':
        navigation.navigate('VehicleRecovery' as never);
        break;
      case 'EChallan':
        navigation.navigate('EChallan' as never);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const toggleDemoMode = () => {
    if (isDemoMode) {
      // Reset to initial state
      setMessages([
        {
          id: '1',
          text: 'Hello! I\'m your AI assistant. How can I help you today with traffic policing matters?',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setIsDemoMode(false);
    } else {
      // Load demo conversation
      setMessages(demoConversation);
      setIsDemoMode(true);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  // Function to parse text with line breaks
  const renderFormattedText = (text: string) => {
    // Split text by new lines
    const lines = text.split('\n');
    
    return (
      <View style={{ width: '100%' }}>
        {lines.map((line, index) => (
          <Text 
            key={index} 
            style={[styles.messageText, { color: theme.text }]}
            selectable={true}
          >
            {line}
            {index < lines.length - 1 && '\n'}
          </Text>
        ))}
      </View>
    );
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isAI = message.sender === 'ai';
    
    return (
      <Animatable.View
        key={message.id}
        animation={isAI ? "fadeInLeft" : "fadeInRight"}
        duration={500}
        delay={index * 50}
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer
        ]}
      >
        <GlassmorphicCard
          intensity="medium"
          style={[
            styles.messageCard,
            isAI ? styles.aiMessage : styles.userMessage,
          ]}
          gradientColors={
            isAI
              ? isDarkMode
                ? ['rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.6)']
                : ['rgba(255, 255, 255, 0.8)', 'rgba(230, 255, 250, 0.6)']
              : isDarkMode
                ? ['rgba(67, 97, 238, 0.3)', 'rgba(67, 97, 238, 0.1)']
                : ['rgba(67, 97, 238, 0.2)', 'rgba(67, 97, 238, 0.05)']
          }
        >
          {isAI && (
            <View style={styles.aiIconContainer}>
              <MaterialIcons name="smart-toy" size={20} color={theme.primary} />
            </View>
          )}
          <View style={styles.messageContent}>
            {renderFormattedText(message.text)}
            
            {/* Action links if message has them */}
            {isAI && message.hasLinks && message.links && (
              <View style={styles.linkContainer}>
                {message.links.map((link, linkIndex) => (
                  <TouchableOpacity
                    key={linkIndex}
                    style={[styles.linkButton, { backgroundColor: theme.primary }]}
                    onPress={() => handleLinkAction(link.action)}
                  >
                    <Text style={styles.linkButtonText}>{link.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </GlassmorphicCard>
      </Animatable.View>
    );
  };

  return (
    <ScreenWithSidebar
      title="AI Assistant"
      navigation={navigation}
      notificationCount={0}
    >
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <GlassmorphicCard
            intensity="medium"
            style={styles.chatContainer}
            gradientColors={isDarkMode 
              ? ['rgba(26, 32, 44, 0.6)', 'rgba(26, 32, 44, 0.4)']
              : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
          >
            <View style={styles.headerContainer}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Traffic Police Assistant
              </Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    { backgroundColor: isOnlineMode ? theme.primary : 'transparent' }
                  ]}
                  onPress={handleModeToggle}
                >
                  <Text style={[
                    styles.modeButtonText,
                    { color: isOnlineMode ? '#fff' : theme.text }
                  ]}>
                    {isOnlineMode ? 'Online' : 'Offline'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.demoButton,
                    { backgroundColor: isDemoMode ? theme.error : theme.primary }
                  ]}
                  onPress={toggleDemoMode}
                >
                  <Text style={styles.demoButtonText}>
                    {isDemoMode ? "Exit Demo" : "View Demo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {apiError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{apiError}</Text>
              </View>
            )}

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              
              {isTyping && (
                <Animatable.View 
                  animation="fadeIn"
                  style={[styles.messageContainer, styles.aiMessageContainer]}
                >
                  <GlassmorphicCard
                    intensity="medium"
                    style={[styles.messageCard, styles.aiMessage, styles.typingIndicator]}
                    gradientColors={isDarkMode 
                      ? ['rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.6)']
                      : ['rgba(255, 255, 255, 0.8)', 'rgba(230, 255, 250, 0.6)']}
                  >
                    <View style={styles.aiIconContainer}>
                      <MaterialIcons name="smart-toy" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.typingDotsContainer}>
                      <Animatable.View 
                        animation="fadeIn"
                        iterationCount="infinite"
                        duration={1000}
                        style={[styles.typingDot, { backgroundColor: theme.text }]}
                      />
                      <Animatable.View 
                        animation="fadeIn"
                        iterationCount="infinite"
                        duration={1000}
                        delay={300}
                        style={[styles.typingDot, { backgroundColor: theme.text }]}
                      />
                      <Animatable.View 
                        animation="fadeIn"
                        iterationCount="infinite"
                        duration={1000}
                        delay={600}
                        style={[styles.typingDot, { backgroundColor: theme.text }]}
                      />
                    </View>
                  </GlassmorphicCard>
                </Animatable.View>
              )}
            </ScrollView>

            {messages.length === 1 && !isDemoMode && (
              <Animatable.View 
                animation="fadeIn" 
                duration={1000} 
                style={styles.suggestedQuestionsContainer}
              >
                <Text style={[styles.suggestedQuestionsTitle, { color: theme.text }]}>
                  You might want to ask:
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestedQuestionsContent}
                >
                  {suggestedQuestions.map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestedQuestionButton,
                        { backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.2)' : 'rgba(67, 97, 238, 0.1)' }
                      ]}
                      onPress={() => handleQuestionSelect(question)}
                    >
                      <Text style={[styles.suggestedQuestionText, { color: theme.text }]}>
                        {question}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animatable.View>
            )}

            <View style={styles.inputContainer}>
              <GlassmorphicCard
                intensity="low"
                style={styles.inputCard}
                gradientColors={isDarkMode 
                  ? ['rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.6)']
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
              >
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Type your message..."
                  placeholderTextColor={theme.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  editable={!isTyping && !isDemoMode}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton, 
                    { 
                      backgroundColor: theme.primary,
                      opacity: (message.trim() === '' || isTyping || isDemoMode) ? 0.5 : 1
                    }
                  ]}
                  onPress={handleSendMessage}
                  disabled={message.trim() === '' || isTyping || isDemoMode}
                >
                  <MaterialIcons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </GlassmorphicCard>
            </View>
          </GlassmorphicCard>
        </KeyboardAvoidingView>
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  chatContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4361EE',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  demoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 15,
  },
  messageContainer: {
    marginVertical: 8,
    marginHorizontal: 5,
    width: '85%',
    maxWidth: width * 0.85,
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageCard: {
    padding: 12,
    paddingRight: 15,
    borderRadius: 15,
    flexDirection: 'row',
    minHeight: 45,
    width: '100%',
  },
  aiMessage: {
    borderTopLeftRadius: 5,
  },
  userMessage: {
    borderTopRightRadius: 5,
  },
  aiIconContainer: {
    marginRight: 10,
    alignSelf: 'flex-start',
    padding: 2,
    width: 24,
  },
  messageContent: {
    flex: 1,
    width: '95%',
  },
  textContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  linkContainer: {
    marginTop: 12,
    marginBottom: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  typingIndicator: {
    minWidth: 80,
    padding: 10,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  suggestedQuestionsContainer: {
    padding: 15,
  },
  suggestedQuestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestedQuestionsContent: {
    paddingBottom: 10,
  },
  suggestedQuestionButton: {
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  suggestedQuestionText: {
    fontSize: 14,
  },
  inputContainer: {
    padding: 15,
    paddingTop: 0,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AIChatbotScreen; 