import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { 
  Surface, 
  Title, 
  Paragraph, 
  Searchbar, 
  Avatar, 
  Divider,
  Button,
  Badge,
  IconButton,
} from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EChallanStackParamList } from '../../navigation/types';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<EChallanStackParamList, 'EChallanHome'>;

const { width } = Dimensions.get('window');

const EChallanHomeScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  
  // State for number plate inputs
  const [plateInputs, setPlateInputs] = useState(['', '', '', '']);
  const inputRefs = [
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
  ];

  // Handle input changes for number plate search
  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...plateInputs];
    newInputs[index] = text.toUpperCase();
    setPlateInputs(newInputs);

    // Auto-focus next input
    if (text.length === (index === 3 ? 4 : 2) && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle key press for backspace navigation
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !plateInputs[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Perform search based on plate number inputs
  const searchByPlateNumber = () => {
    // Join with proper spacing to create a standard format (e.g., "AA 01 AA 1234")
    const plateNumber = `${plateInputs[0]} ${plateInputs[1]} ${plateInputs[2]} ${plateInputs[3]}`.trim();
    if (plateNumber.length > 2) { // Basic validation to ensure some input is present
      console.log('Searching for plate number:', plateNumber);
      // Navigate to results or perform search operation
      if (plateInputs[3].length > 0) {
        // Potential navigation to results screen
        // navigation.navigate('PlateResults', { licensePlate: plateNumber });
      }
    }
  };

  // Mock data for recent challans
  const recentChallans = [
    { 
      id: 'CH001', 
      vehicleNo: 'KA-01-AB-1234', 
      offence: 'Speeding', 
      date: '2023-12-15', 
      amount: '₹1,000',
      status: 'pending'
    },
    { 
      id: 'CH002', 
      vehicleNo: 'KA-02-CD-5678', 
      offence: 'No Parking', 
      date: '2023-12-12', 
      amount: '₹500',
      status: 'paid'
    },
    { 
      id: 'CH003', 
      vehicleNo: 'KA-03-EF-9101', 
      offence: 'Signal Jump', 
      date: '2023-12-10', 
      amount: '₹1,500',
      status: 'pending'
    },
  ];

  // Mock data for challan statistics
  const challanStats = [
    { title: 'Total Challans', value: 128, icon: 'receipt', color: '#4361EE' },
    { title: 'Pending Payment', value: 45, icon: 'credit-card-clock-outline', color: '#F72585' },
    { title: 'Revenue Generated', value: '₹34,500', icon: 'cash', color: '#4895EF' },
  ];

  const onCreateChallan = () => {
    navigation.navigate('CreateChallan', {});
  };

  const onChallanDetails = (challanId: string) => {
    navigation.navigate('ChallanDetails', { challanId });
  };

  const onViewHistory = () => {
    navigation.navigate('ChallanHistory');
  };

  return (
    <ScreenWithSidebar 
      title="E-Challan"
      navigation={navigation}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Number Plate Search */}
        <Animatable.View animation="fadeIn" style={[styles.searchContainer, { 
          marginLeft: Math.max(insets.left + 16, 16), 
          marginRight: Math.max(insets.right + 16, 16) 
        }]}>
          <GlassmorphicCard
            style={styles.searchCard}
            intensity="low"
          >
            <View style={styles.searchHeader}>
              <Text style={[styles.searchTitle, { color: theme.text }]}>Search by Number Plate</Text>
              <IconButton
                icon="qrcode-scan"
                size={24}
                onPress={() => {}}
                iconColor={theme.primary}
              />
            </View>
            
            <View style={styles.plateInputContainer}>
              <View style={styles.inputGroup}>
                <TextInput
                  ref={inputRefs[0]}
                  style={[styles.plateInput, { 
                    backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={plateInputs[0]}
                  onChangeText={(text) => handleInputChange(text, 0)}
                  onKeyPress={(e) => handleKeyPress(e, 0)}
                  maxLength={2}
                  placeholder="AA"
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="characters"
                />
                <Text style={[styles.separator, { color: theme.textSecondary }]}>-</Text>
                <TextInput
                  ref={inputRefs[1]}
                  style={[styles.plateInput, { 
                    backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={plateInputs[1]}
                  onChangeText={(text) => handleInputChange(text, 1)}
                  onKeyPress={(e) => handleKeyPress(e, 1)}
                  maxLength={2}
                  placeholder="01"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                />
                <Text style={[styles.separator, { color: theme.textSecondary }]}>-</Text>
                <TextInput
                  ref={inputRefs[2]}
                  style={[styles.plateInput, { 
                    backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={plateInputs[2]}
                  onChangeText={(text) => handleInputChange(text, 2)}
                  onKeyPress={(e) => handleKeyPress(e, 2)}
                  maxLength={2}
                  placeholder="AA"
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="characters"
                />
                <Text style={[styles.separator, { color: theme.textSecondary }]}>-</Text>
                <TextInput
                  ref={inputRefs[3]}
                  style={[styles.plateInput, { 
                    backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={plateInputs[3]}
                  onChangeText={(text) => handleInputChange(text, 3)}
                  onKeyPress={(e) => handleKeyPress(e, 3)}
                  maxLength={4}
                  placeholder="1234"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                />
              </View>
              
              <GlassmorphicCard
                style={styles.searchButtonCard}
                intensity="medium"
                gradientColors={[`${theme.primary}50`, `${theme.primary}30`]}
                onPress={searchByPlateNumber}
              >
                <Text style={[styles.searchButtonText, { color: 'white' }]}>Search Challan</Text>
              </GlassmorphicCard>
            </View>
          </GlassmorphicCard>
        </Animatable.View>

        {/* Action Buttons */}
        <View style={[styles.actionButtonsContainer, { 
          marginLeft: Math.max(insets.left + 16, 16), 
          marginRight: Math.max(insets.right + 16, 16) 
        }]}>
          <Animatable.View animation="fadeInUp" delay={100}>
            <GlassmorphicCard
              style={styles.actionButtonCard}
              intensity="medium"
              onPress={onCreateChallan}
              gradientColors={['#4361EE30', '#4361EE15']}
            >
              <View style={styles.actionButton}>
                <Avatar.Icon 
                  size={40} 
                  icon="file-document-edit-outline" 
                  color="#4361EE"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Text style={[styles.actionButtonText, { color: '#4361EE' }]}>Create Challan</Text>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={150}>
            <GlassmorphicCard
              style={styles.actionButtonCard}
              intensity="medium"
              onPress={onViewHistory}
              gradientColors={['#4895EF30', '#4895EF15']}
            >
              <View style={styles.actionButton}>
                <Avatar.Icon 
                  size={40} 
                  icon="history" 
                  color="#4895EF"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Text style={[styles.actionButtonText, { color: '#4895EF' }]}>Challan History</Text>
              </View>
            </GlassmorphicCard>
          </Animatable.View>
        </View>
        
        {/* Challan Stats */}
        <View style={[styles.sectionHeader, { 
          marginLeft: Math.max(insets.left + 16, 16), 
          marginRight: Math.max(insets.right + 16, 16) 
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Challan Statistics
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.statsScrollContainer, { 
            paddingLeft: Math.max(insets.left + 16, 16), 
            paddingRight: Math.max(insets.right + 16, 16) 
          }]}
        >
          {challanStats.map((stat, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 100}
            >
              <GlassmorphicCard
                style={styles.statCard}
                intensity="medium"
                gradientColors={[`${stat.color}20`, `${stat.color}10`]}
                decorativeDots={false}
              >
                <Avatar.Icon 
                  size={40} 
                  icon={stat.icon} 
                  color={stat.color}
                  style={{ backgroundColor: `${stat.color}15` }}
                />
                <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{stat.title}</Text>
              </GlassmorphicCard>
            </Animatable.View>
          ))}
        </ScrollView>

        {/* Recent Challans */}
        <View style={[styles.sectionHeader, { 
          marginLeft: Math.max(insets.left + 16, 16), 
          marginRight: Math.max(insets.right + 16, 16) 
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Challans
          </Text>
        </View>
        
        <View style={[styles.challansContainer, { 
          marginLeft: Math.max(insets.left + 16, 16), 
          marginRight: Math.max(insets.right + 16, 16) 
        }]}>
          {recentChallans.map((challan, index) => (
            <Animatable.View 
              key={challan.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.challanItemContainer}
            >
              <GlassmorphicCard
                style={styles.challanCard}
                intensity="medium"
                gradientColors={isDarkMode 
                  ? ['rgba(67, 97, 238, 0.1)', 'rgba(26, 32, 44, 0.4)']
                  : ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                onPress={() => onChallanDetails(challan.id)}
              >
                <View style={styles.challanHeader}>
                  <View style={styles.vehicleInfoContainer}>
                    <Title style={[styles.vehicleNo, { color: theme.text }]}>
                      {challan.vehicleNo}
                    </Title>
                    <View style={[
                      styles.statusPill, 
                      { 
                        backgroundColor: challan.status === 'paid' 
                          ? 'rgba(16, 185, 129, 0.15)' 
                          : 'rgba(245, 158, 11, 0.15)',
                        borderColor: challan.status === 'paid' 
                          ? 'rgba(16, 185, 129, 0.4)' 
                          : 'rgba(245, 158, 11, 0.4)',
                        borderLeftWidth: 3,
                      }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        {
                          color: challan.status === 'paid' ? '#10B981' : '#F59E0B'
                        }
                      ]}>
                        {challan.status === 'paid' ? 'PAID' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.challanId, { color: theme.textSecondary }]}>
                    ID: {challan.id}
                  </Text>
                </View>
                
                <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#2D3748' : '#E2E8F0' }]} />
                
                <View style={styles.challanDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Offence</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{challan.offence}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{challan.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Amount</Text>
                    <Text style={[styles.detailValue, { 
                      color: theme.error, 
                      fontWeight: 'bold' 
                    }]}>{challan.amount}</Text>
                  </View>
                </View>
                
                <View style={styles.challanActions}>
                  <TouchableOpacity 
                    onPress={() => onChallanDetails(challan.id)}
                    style={[styles.glassmorphicButton, { backgroundColor: 'rgba(67, 97, 238, 0.15)' }]}
                  >
                    <Text style={[styles.buttonLabel, { color: '#4361EE' }]}>View Details</Text>
                  </TouchableOpacity>
                  
                  {challan.status === 'pending' && (
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('PaymentGateway', { 
                        challanId: challan.id, 
                        amount: parseInt(challan.amount.replace(/[^0-9]/g, '')) 
                      })}
                      style={[styles.glassmorphicButton, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}
                    >
                      <Text style={[styles.buttonLabel, { color: '#10B981' }]}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </GlassmorphicCard>
            </Animatable.View>
          ))}
          
          <Animatable.View animation="fadeIn" delay={300}>
            <GlassmorphicCard
              style={styles.viewAllButtonCard}
              intensity="low"
              onPress={onViewHistory}
              gradientColors={[`${theme.primary}15`, `${theme.primary}05`]}
            >
              <Text style={[styles.viewAllButtonText, { color: theme.primary }]}>
                View All Challans
              </Text>
            </GlassmorphicCard>
          </Animatable.View>
        </View>
        
        {/* Bottom padding to account for bottom inset (notch, home indicator) */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  plateInputContainer: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  plateInput: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 2,
  },
  separator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButtonCard: {
    borderRadius: 12,
    overflow: 'hidden',
    width: (width - 48) / 2.1,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionButtonText: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsScrollContainer: {
    paddingBottom: 8,
    gap: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
    overflow: 'hidden',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  challansContainer: {
    gap: 16,
    marginBottom: 16,
  },
  challanItemContainer: {
    marginBottom: 8,
  },
  challanCard: {
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  challanHeader: {
    padding: 16,
  },
  vehicleInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleNo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  challanId: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  challanDetails: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
  },
  challanActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  glassmorphicButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButtonCard: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchButtonCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default EChallanHomeScreen; 