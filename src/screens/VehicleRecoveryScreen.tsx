import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWithSidebar from '../components/ScreenWithSidebar';
import { IconButton } from 'react-native-paper';
import { navigateToAIChatbot } from '../utils/navigation';

const { width } = Dimensions.get('window');

type VehicleRecoveryScreenNavigationProp = NativeStackNavigationProp<DashboardStackParamList, 'VehicleRecovery'>;

interface RecoveryCase {
  id: string;
  vehicleNumber: string;
  location: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  description: string;
}

const VehicleRecoveryScreen = () => {
  const navigation = useNavigation<VehicleRecoveryScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCase, setNewCase] = useState({
    vehicleNumber: '',
    location: '',
    description: '',
  });
  const [recoveryCases, setRecoveryCases] = useState<RecoveryCase[]>([
    {
      id: '1',
      vehicleNumber: 'ABC-123',
      location: 'Main Street, City Center',
      status: 'pending',
      date: '2024-03-14',
      description: 'Vehicle found abandoned',
    },
    {
      id: '2',
      vehicleNumber: 'XYZ-789',
      location: 'Park Avenue, Downtown',
      status: 'in-progress',
      date: '2024-03-13',
      description: 'Recovery in progress',
    },
  ]);

  const getStatusColor = (status: RecoveryCase['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'in-progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const handleAddCase = () => {
    if (newCase.vehicleNumber && newCase.location && newCase.description) {
      const case_: RecoveryCase = {
        id: Date.now().toString(),
        ...newCase,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      setRecoveryCases([case_, ...recoveryCases]);
      setNewCase({ vehicleNumber: '', location: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleChatbotPress = () => {
    navigateToAIChatbot(navigation);
  };

  const renderRecoveryCard = (case_: RecoveryCase, index: number) => (
    <Animatable.View
      key={case_.id}
      animation="fadeInUp"
      delay={index * 100}
      style={styles.cardWrapper}
    >
      <GlassmorphicCard
        intensity="medium"
        style={styles.card}
        gradientColors={isDarkMode 
          ? [
              `rgba(${parseInt(getStatusColor(case_.status).slice(1, 3), 16)}, ${parseInt(getStatusColor(case_.status).slice(3, 5), 16)}, ${parseInt(getStatusColor(case_.status).slice(5, 7), 16)}, 0.2)`,
              'rgba(26, 32, 44, 0.6)'
            ]
          : [
              `rgba(${parseInt(getStatusColor(case_.status).slice(1, 3), 16)}, ${parseInt(getStatusColor(case_.status).slice(3, 5), 16)}, ${parseInt(getStatusColor(case_.status).slice(5, 7), 16)}, 0.1)`,
              'rgba(255, 255, 255, 0.4)'
            ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.vehicleInfo}>
            <MaterialIcons name="directions-car" size={24} color={getStatusColor(case_.status)} />
            <Text style={[styles.vehicleNumber, { color: theme.text }]}>{case_.vehicleNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(case_.status) }]}>
            <Text style={styles.statusText}>{case_.status}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color={theme.textSecondary} />
            <Text style={[styles.locationText, { color: theme.textSecondary }]}>{case_.location}</Text>
          </View>
          
          <View style={styles.dateContainer}>
            <MaterialIcons name="calendar-today" size={16} color={theme.textSecondary} />
            <Text style={[styles.dateText, { color: theme.textSecondary }]}>{case_.date}</Text>
          </View>
          
          <Text style={[styles.description, { color: theme.textSecondary }]}>{case_.description}</Text>
        </View>
      </GlassmorphicCard>
    </Animatable.View>
  );

  return (
    <ScreenWithSidebar 
      title="Vehicle Recovery"
      navigation={navigation}
      notificationCount={0}
      onChatbotPress={handleChatbotPress}
    >
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <GlassmorphicCard
            intensity="medium"
            style={[styles.searchContainer, { flex: 1 }]}
            gradientColors={isDarkMode 
              ? ['rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.6)']
              : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
          >
            <MaterialIcons name="search" size={24} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search by vehicle number or location..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </GlassmorphicCard>

          <TouchableOpacity
            style={[styles.addPill, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <MaterialIcons name={showAddForm ? "close" : "add"} size={24} color="#fff" />
            <Text style={styles.addPillText}>Add Case</Text>
          </TouchableOpacity>
        </View>

        {showAddForm && (
          <Animatable.View
            animation="fadeInDown"
            style={styles.addFormContainer}
          >
            <GlassmorphicCard
              intensity="medium"
              style={styles.addForm}
              gradientColors={isDarkMode 
                ? ['rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.6)']
                : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
            >
              <TextInput
                style={[styles.formInput, { color: theme.text }]}
                placeholder="Vehicle Number"
                placeholderTextColor={theme.textSecondary}
                value={newCase.vehicleNumber}
                onChangeText={(text) => setNewCase({ ...newCase, vehicleNumber: text })}
              />
              <TextInput
                style={[styles.formInput, { color: theme.text }]}
                placeholder="Location"
                placeholderTextColor={theme.textSecondary}
                value={newCase.location}
                onChangeText={(text) => setNewCase({ ...newCase, location: text })}
              />
              <TextInput
                style={[styles.formInput, styles.formTextArea, { color: theme.text }]}
                placeholder="Description"
                placeholderTextColor={theme.textSecondary}
                value={newCase.description}
                onChangeText={(text) => setNewCase({ ...newCase, description: text })}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primary }]}
                onPress={handleAddCase}
              >
                <Text style={styles.submitButtonText}>Submit Case</Text>
              </TouchableOpacity>
            </GlassmorphicCard>
          </Animatable.View>
        )}

        <View style={styles.statsContainer}>
          {[
            { title: 'Total Cases', value: recoveryCases.length, color: '#4361EE' },
            { title: 'Pending', value: recoveryCases.filter(c => c.status === 'pending').length, color: '#FFA500' },
            { title: 'Completed', value: recoveryCases.filter(c => c.status === 'completed').length, color: '#34C759' },
          ].map((stat, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.statCardWrapper}
            >
              <GlassmorphicCard
                intensity="medium"
                style={styles.statCard}
                gradientColors={isDarkMode 
                  ? [
                      `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.2)`,
                      'rgba(26, 32, 44, 0.6)'
                    ]
                  : [
                      `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`,
                      'rgba(255, 255, 255, 0.4)'
                    ]}
              >
                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.title}</Text>
              </GlassmorphicCard>
            </Animatable.View>
          ))}
        </View>

        <View style={styles.casesContainer}>
          {recoveryCases.map((case_, index) => renderRecoveryCard(case_, index))}
        </View>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
  },
  addPillText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addFormContainer: {
    padding: 15,
  },
  addForm: {
    padding: 20,
    borderRadius: 15,
    gap: 15,
  },
  formInput: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  statCard: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  casesContainer: {
    padding: 15,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    padding: 15,
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateText: {
    marginLeft: 5,
  },
  description: {
    marginTop: 5,
  },
});

export default VehicleRecoveryScreen; 