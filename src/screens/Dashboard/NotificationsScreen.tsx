import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/types';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { 
  Surface, 
  Divider, 
  Button, 
  IconButton, 
  Chip,
  Searchbar,
  Menu,
  SegmentedButtons,
  Avatar,
  Badge,
  Snackbar
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for notifications
const mockNotifications = [
  { 
    id: 'N001', 
    type: 'alert', 
    title: 'High Traffic Alert', 
    message: 'Unusually high traffic detected at MG Road Junction. Consider dispatching additional officers.', 
    time: '10 minutes ago',
    read: false,
    actionable: true,
    priority: 'high'
  },
  { 
    id: 'N002', 
    type: 'info', 
    title: 'System Update', 
    message: 'The traffic management system has been updated to version 2.4.0. Check out the new features!', 
    time: '2 hours ago',
    read: true,
    actionable: false,
    priority: 'medium'
  },
  { 
    id: 'N003', 
    type: 'task', 
    title: 'Monthly Report Due', 
    message: 'Your monthly traffic violation report is due in 2 days. Please complete it on time.', 
    time: '5 hours ago',
    read: false,
    actionable: true,
    priority: 'medium'
  },
  { 
    id: 'N004', 
    type: 'alert', 
    title: 'Accident Reported', 
    message: 'A traffic accident has been reported at Silk Board Junction. Emergency services have been notified.', 
    time: '1 day ago',
    read: true,
    actionable: false,
    priority: 'high'
  },
  { 
    id: 'N005', 
    type: 'message', 
    title: 'Message from HQ', 
    message: 'All officers are requested to attend the briefing tomorrow at 9:00 AM regarding the new traffic regulations.', 
    time: '1 day ago',
    read: false,
    actionable: false,
    priority: 'medium'
  },
  { 
    id: 'N006', 
    type: 'task', 
    title: 'Equipment Check Required', 
    message: 'Please verify and update the status of your assigned equipment by end of day.', 
    time: '2 days ago',
    read: true,
    actionable: true,
    priority: 'low'
  },
  { 
    id: 'N007', 
    type: 'info', 
    title: 'New E-Challan Feature', 
    message: 'A new feature has been added to the E-Challan system allowing for faster processing of violations.', 
    time: '3 days ago',
    read: true,
    actionable: false,
    priority: 'low'
  },
  { 
    id: 'N008', 
    type: 'alert', 
    title: 'Weather Warning', 
    message: 'Heavy rainfall expected today. Be prepared for increased traffic congestion and potential road hazards.', 
    time: '3 days ago',
    read: false,
    actionable: false,
    priority: 'high'
  },
];

type Props = NativeStackScreenProps<DashboardStackParamList, 'Notifications'>;
const { width } = Dimensions.get('window');

const NotificationsScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const filteredNotifications = notifications.filter(notification => {
    // Apply type filter
    if (filterType !== 'all' && notification.type !== filterType) {
      return false;
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setSnackbarMessage('Notification marked as read');
    setSnackbarVisible(true);
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setSnackbarMessage('All notifications marked as read');
    setSnackbarVisible(true);
  };
  
  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setSnackbarMessage('Notification deleted');
    setSnackbarVisible(true);
  };
  
  const handleClearAll = () => {
    setNotifications([]);
    setSnackbarMessage('All notifications cleared');
    setSnackbarVisible(true);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return 'alert-circle';
      case 'info': return 'information';
      case 'task': return 'clipboard-check';
      case 'message': return 'message-text';
      default: return 'bell';
    }
  };
  
  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'alert') {
      return priority === 'high' ? theme.error : theme.warning;
    } else if (type === 'task') {
      return theme.primary;
    } else if (type === 'info') {
      return theme.info;
    } else {
      return theme.success;
    }
  };
  
  const renderNotificationItem = (notification: typeof mockNotifications[0]) => {
    const notificationColor = getNotificationColor(notification.type, notification.priority);
    
    return (
      <Animatable.View 
        key={notification.id}
        animation="fadeIn"
        duration={500}
      >
        <Surface 
          style={[
            styles.notificationCard, 
            { 
              backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
              borderLeftColor: notificationColor,
              borderLeftWidth: 4,
              opacity: notification.read ? 0.8 : 1
            }
          ]} 
          elevation={notification.read ? 1 : 3}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationTitleContainer}>
                <View style={[styles.notificationIconContainer, { backgroundColor: notificationColor + '20' }]}>
                  <IconButton 
                    icon={getNotificationIcon(notification.type)} 
                    size={20}
                    iconColor={notificationColor}
                    style={styles.notificationIcon}
                  />
                </View>
                <View style={styles.notificationTitleContent}>
                  <Text style={[styles.notificationTitle, { color: theme.text }]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
                    {notification.time}
                  </Text>
                </View>
              </View>
              
              {!notification.read && (
                <Badge 
                  size={8} 
                  style={[styles.unreadBadge, { backgroundColor: notificationColor }]} 
                />
              )}
            </View>
            
            <Text style={[styles.notificationMessage, { color: theme.text }]}>
              {notification.message}
            </Text>
            
            <View style={styles.notificationActions}>
              {notification.actionable && (
                <Button 
                  mode="text" 
                  compact
                  onPress={() => {
                    // Handle action based on notification type
                    setSnackbarMessage(`Action taken on: ${notification.title}`);
                    setSnackbarVisible(true);
                    handleMarkAsRead(notification.id);
                  }}
                  style={styles.actionButton}
                  labelStyle={{ color: notificationColor }}
                >
                  {notification.type === 'task' ? 'Complete Task' : 'Take Action'}
                </Button>
              )}
              
              <View style={styles.notificationControls}>
                {!notification.read && (
                  <IconButton 
                    icon="check" 
                    size={18}
                    iconColor={theme.success}
                    onPress={() => handleMarkAsRead(notification.id)}
                  />
                )}
                <IconButton 
                  icon="delete" 
                  size={18}
                  iconColor={theme.error}
                  onPress={() => handleDeleteNotification(notification.id)}
                />
              </View>
            </View>
          </View>
        </Surface>
      </Animatable.View>
    );
  };

  return (
    <ScreenWithSidebar
      title="Notifications"
      navigation={navigation}
      notificationCount={unreadCount}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.filterContainer}>
            <SegmentedButtons
              value={filterType}
              onValueChange={setFilterType}
              buttons={[
                {
                  value: 'all',
                  label: 'All',
                  style: { 
                    backgroundColor: filterType === 'all' ? 
                      (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                      'transparent' 
                  }
                },
                {
                  value: 'alert',
                  label: 'Alerts',
                  style: { 
                    backgroundColor: filterType === 'alert' ? 
                      (isDarkMode ? '#2C2C2C' : theme.error + '20') : 
                      'transparent' 
                  }
                },
                {
                  value: 'task',
                  label: 'Tasks',
                  style: { 
                    backgroundColor: filterType === 'task' ? 
                      (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                      'transparent' 
                  }
                },
                {
                  value: 'info',
                  label: 'Info',
                  style: { 
                    backgroundColor: filterType === 'info' ? 
                      (isDarkMode ? '#2C2C2C' : theme.info + '20') : 
                      'transparent' 
                  }
                },
              ]}
              style={styles.segmentedButtons}
            />
          </View>
          
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search notifications..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.searchBar, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
              iconColor={theme.primary}
              inputStyle={{ color: theme.text }}
              placeholderTextColor={theme.textSecondary}
            />
            
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
              style={[styles.menuButton, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
            />
            
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<View />}
              style={[styles.menu, { backgroundColor: isDarkMode ? '#2C2C2C' : theme.white }]}
            >
              <Menu.Item 
                onPress={() => {
                  handleMarkAllAsRead();
                  setMenuVisible(false);
                }} 
                title="Mark all as read"
                leadingIcon="check-all"
              />
              <Menu.Item 
                onPress={() => {
                  handleClearAll();
                  setMenuVisible(false);
                }} 
                title="Clear all notifications"
                leadingIcon="delete-sweep"
              />
              <Menu.Item 
                onPress={() => {
                  setSnackbarMessage('Notification settings opened');
                  setSnackbarVisible(true);
                  setMenuVisible(false);
                }} 
                title="Notification settings"
                leadingIcon="cog"
              />
            </Menu>
          </View>
        </View>
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + 20 }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {unreadCount > 0 && (
            <View style={styles.unreadHeader}>
              <Text style={[styles.unreadText, { color: theme.text }]}>
                {unreadCount} Unread Notification{unreadCount !== 1 ? 's' : ''}
              </Text>
              <Button 
                mode="text" 
                onPress={handleMarkAllAsRead}
                labelStyle={{ color: theme.primary }}
                compact
              >
                Mark All as Read
              </Button>
            </View>
          )}
          
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(renderNotificationItem)
          ) : (
            <Surface style={[styles.emptyState, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <IconButton
                icon="bell-off"
                size={48}
                iconColor={theme.primary}
              />
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Notifications</Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
                {searchQuery ? 'No notifications match your search criteria' : 'You\'re all caught up!'}
              </Text>
            </Surface>
          )}
        </ScrollView>
        
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: isDarkMode ? '#2C2C2C' : '#323232' }]}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  filterContainer: {
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  menuButton: {
    borderRadius: 8,
  },
  menu: {
    marginTop: 50,
    marginLeft: width - 200,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  unreadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unreadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationIcon: {
    margin: 0,
  },
  notificationTitleContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    marginTop: 2,
  },
  unreadBadge: {
    marginTop: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: -8,
  },
  notificationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  snackbar: {
    bottom: 16,
  },
});

export default NotificationsScreen; 