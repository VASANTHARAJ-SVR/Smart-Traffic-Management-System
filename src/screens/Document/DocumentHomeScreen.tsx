import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  TextInput,
  Modal
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DocumentStackParamList } from '../../navigation/types';
import { 
  Card, 
  Button, 
  Divider, 
  List, 
  Surface, 
  IconButton, 
  Searchbar,
  Chip,
  Avatar,
  Portal
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import { mockDocuments } from '../../utils/mockData';

type Props = NativeStackScreenProps<DocumentStackParamList, 'DocumentHome'>;
const { width } = Dimensions.get('window');

// Mock data
const recentDocuments = [
  { 
    id: '1', 
    type: 'License', 
    name: 'Driver License', 
    owner: 'Akhil', 
    date: '15 May 2023', 
    status: 'Valid',
    numberPlate: 'AA 01 AA 1234'
  },
  { 
    id: '2', 
    type: 'Registration', 
    name: 'Vehicle Registration', 
    owner: 'Sarah Smith', 
    date: '10 Apr 2023', 
    status: 'Expired',
    numberPlate: 'AA 02 BB 5678' 
  },
  { 
    id: '3', 
    type: 'Insurance', 
    name: 'Vehicle Insurance', 
    owner: 'Mike Johnson', 
    date: '22 Jun 2023', 
    status: 'Valid',
    numberPlate: 'AA 03 CC 9101' 
  },
  { 
    id: '4', 
    type: 'Permit', 
    name: 'Commercial Permit', 
    owner: 'David Wilson', 
    date: '05 Mar 2023', 
    status: 'Pending',
    numberPlate: 'AA 04 DD 1121' 
  },
];

const documentCategories = [
  { id: '1', name: 'Driver License', icon: 'card-account-details', type: 'license' },
  { id: '2', name: 'Vehicle Registration', icon: 'car', type: 'registration' },
  { id: '3', name: 'Insurance', icon: 'shield-check', type: 'insurance' },
  { id: '4', name: 'Pollution Control', icon: 'smog', type: 'pollution' },
  { id: '5', name: 'Road Tax', icon: 'cash-multiple', type: 'tax' },
  { id: '6', name: 'Vehicle Permit', icon: 'certificate', type: 'permit' },
  { id: '7', name: 'Fitness Certificate', icon: 'clipboard-check', type: 'fitness' },
  { id: '8', name: 'Vehicle History', icon: 'history', type: 'history' },
];

const DocumentHomeScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
  const [plateInputs, setPlateInputs] = useState(['', '', '', '']);
  const inputRefs = [
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
  ];

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...plateInputs];
    newInputs[index] = text.toUpperCase();
    setPlateInputs(newInputs);

    // Auto-focus next input
    if (text.length === 2 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !plateInputs[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Search function for the number plate
  const searchByPlateNumber = () => {
    const plateNumber = `${plateInputs[0]} ${plateInputs[1]} ${plateInputs[2]} ${plateInputs[3]}`.trim();
    if (plateNumber.length > 2) { // Basic validation to ensure some input is present
      console.log('Searching for plate number:', plateNumber);
      // Navigate to results or fetch document data
      if (plateInputs[3].length > 0) {
        // Navigate to document search results
        // navigation.navigate('DocumentSearchResults', { plateNumber });
        
        // For now, just show a message
        alert(`Searching for documents with plate number: ${plateNumber}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return theme.success;
      case 'expired':
        return theme.error;
      case 'pending':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category.type);
    // Filter documents based on category type
    const filtered = mockDocuments.filter(doc => doc.type === category.type);
    setFilteredDocuments(filtered);
    setModalVisible(true);
  };

  return (
    <ScreenWithSidebar
      title="Document Management"
      navigation={navigation}
      notificationCount={2}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View animation="fadeIn" duration={600}>
          <GlassmorphicCard
            style={styles.searchCard}
            intensity="medium"
            animation="fadeIn"
            delay={100}
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
                <Text style={[styles.searchButtonText, { color: 'white' }]}>Search Documents</Text>
              </GlassmorphicCard>
            </View>
          </GlassmorphicCard>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={600} delay={100}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Document Categories</Text>
          </View>
          
          <View style={styles.categoriesGrid}>
            {documentCategories.map((category, index) => (
              <Animatable.View 
                key={category.id} 
                animation="fadeInUp" 
                duration={500} 
                delay={index * 100}
                style={styles.categoryItem}
              >
                <GlassmorphicCard 
                  onPress={() => handleCategoryPress(category)}
                  style={styles.categoryPill}
                  intensity="medium"
                  duration={400}
                  decorativeDots={false}
                  gradientColors={[`${theme.primary}30`, `${theme.primary}15`]}
                  animation="fadeIn"
                >
                  <View style={styles.categoryContent}>
                    <IconButton 
                      icon={category.icon} 
                      size={24} 
                      iconColor={theme.primary}
                      style={styles.categoryIcon}
                    />
                    <Text style={[styles.categoryName, { 
                      color: theme.primary,
                      fontWeight: '600'
                    }]}>{category.name}</Text>
                  </View>
                </GlassmorphicCard>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={600} delay={200}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={[styles.pillButton, { backgroundColor: theme.primary + '15' }]}
              onPress={() => {}}
            >
              <IconButton 
                icon="file-search" 
                size={20} 
                iconColor={theme.primary}
                style={styles.pillIcon}
              />
              <Text style={[styles.pillText, { color: theme.primary }]}>Verify Document</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.pillButton, { backgroundColor: theme.primary + '15' }]}
              onPress={() => {}}
            >
              <IconButton 
                icon="history" 
                size={20} 
                iconColor={theme.primary}
                style={styles.pillIcon}
              />
              <Text style={[styles.pillText, { color: theme.primary }]}>History</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={600} delay={300}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Documents</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <GlassmorphicCard
            style={styles.recentDocumentsCard}
            intensity="high"
            animation="fadeInUp"
            delay={300}
            gradientColors={isDarkMode 
              ? ['rgba(67, 97, 238, 0.2)', 'rgba(26, 32, 44, 0.6)']
              : ['rgba(235, 244, 255, 0.4)', 'rgba(230, 255, 250, 0.4)']}
          >
            {recentDocuments.map((document, index) => (
              <React.Fragment key={document.id}>
                {index > 0 && <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />}
                <TouchableOpacity 
                  style={styles.documentItem}
                  onPress={() => navigation.navigate('DocumentDetails', { documentId: document.id })}
                >
                  <View style={styles.documentLeft}>
                    <View style={[styles.documentIconContainer, { 
                      backgroundColor: getStatusColor(document.status) + '15',
                      borderColor: getStatusColor(document.status) + '40'
                    }]}>
                      <Avatar.Icon 
                        size={38} 
                        icon={document.type === 'License' ? 'card-account-details' : 
                              document.type === 'Registration' ? 'car' : 
                              document.type === 'Insurance' ? 'shield-check' : 'certificate'} 
                        style={{ backgroundColor: 'transparent' }}
                        color={getStatusColor(document.status)}
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <View style={styles.documentHeader}>
                        <Text style={[styles.documentName, { color: theme.text }]}>{document.name}</Text>
                        <View style={[styles.statusPill, { 
                          backgroundColor: getStatusColor(document.status) + '15',
                          borderColor: getStatusColor(document.status),
                          borderLeftWidth: 3,
                        }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
                            {document.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.plateNumberContainer}>
                        <IconButton 
                          icon="license" 
                          size={14} 
                          iconColor={theme.primary} 
                          style={styles.plateIcon} 
                        />
                        <Text style={[styles.plateNumber, { color: theme.primary }]}>
                          {document.numberPlate}
                        </Text>
                      </View>
                      <Text style={[styles.documentOwner, { color: theme.textSecondary }]}>
                        {document.owner} • {document.date}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </GlassmorphicCard>
        </Animatable.View>
        
        <View style={styles.bottomPadding} />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            style={styles.modalContainer}
          >
            <View style={styles.modalWrapper}>
              <GlassmorphicCard
                style={styles.modalContent}
                intensity="medium"
                gradientColors={isDarkMode 
                  ? ['rgba(67, 97, 238, 0.2)', 'rgba(26, 32, 44, 0.6)']
                  : ['rgba(235, 244, 255, 0.4)', 'rgba(230, 255, 250, 0.4)']}
              >
                <View style={styles.modalInnerContainer}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleContainer}>
                      <IconButton
                        icon={documentCategories.find(cat => cat.type === selectedCategory)?.icon || 'file'}
                        size={28}
                        iconColor={theme.primary}
                      />
                      <Text style={[styles.modalTitle, { color: theme.text }]} numberOfLines={1}>
                        {documentCategories.find(cat => cat.type === selectedCategory)?.name || 'Documents'}
                      </Text>
                    </View>
                    <IconButton
                      icon="close"
                      size={24}
                      onPress={() => setModalVisible(false)}
                      iconColor={theme.text}
                    />
                  </View>
                  <Divider style={[styles.modalDivider, { backgroundColor: theme.divider }]} />
                  <ScrollView 
                    style={styles.modalScrollContent}
                    contentContainerStyle={styles.modalScrollContainer}
                    showsVerticalScrollIndicator={false}
                  >
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc, index) => (
                        <TouchableOpacity
                          key={doc.id}
                          onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('DocumentDetails', { documentId: doc.id });
                          }}
                          style={index > 0 ? styles.documentCardContainer : undefined}
                        >
                          <GlassmorphicCard
                            style={styles.documentCard}
                            intensity="low"
                            gradientColors={[`${theme.primary}10`, `${theme.primary}05`]}
                          >
                            <View style={styles.documentItemContent}>
                              <View style={styles.documentItemMain}>
                                <View style={styles.documentItemLeft}>
                                  <View style={[styles.documentIconContainer, {
                                    backgroundColor: getStatusColor(doc.status) + '15',
                                    borderColor: getStatusColor(doc.status) + '40'
                                  }]}>
                                    <Avatar.Icon
                                      size={40}
                                      icon={documentCategories.find(cat => cat.type === doc.type)?.icon || 'file'}
                                      style={{ backgroundColor: 'transparent' }}
                                      color={getStatusColor(doc.status)}
                                    />
                                  </View>
                                  <View style={styles.documentItemInfo}>
                                    <Text 
                                      style={[styles.documentItemNumber, { color: theme.text }]}
                                      numberOfLines={1}
                                    >
                                      {doc.number}
                                    </Text>
                                    <View style={styles.documentMetaInfo}>
                                      <IconButton
                                        icon="calendar"
                                        size={16}
                                        iconColor={theme.textSecondary}
                                        style={styles.metaIcon}
                                      />
                                      <Text 
                                        style={[styles.documentItemDate, { color: theme.textSecondary }]}
                                        numberOfLines={1}
                                      >
                                        Valid until: {new Date(doc.expiryDate).toLocaleDateString()}
                                      </Text>
                                    </View>
                                    <View style={styles.documentMetaInfo}>
                                      <IconButton
                                        icon="office-building"
                                        size={16}
                                        iconColor={theme.textSecondary}
                                        style={styles.metaIcon}
                                      />
                                      <Text 
                                        style={[styles.documentItemIssuer, { color: theme.textSecondary }]}
                                        numberOfLines={1}
                                      >
                                        Issued by: {doc.issuedBy}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.documentItemRight}>
                                  <Chip
                                    style={[
                                      styles.statusChip,
                                      {
                                        backgroundColor: getStatusColor(doc.status) + '20',
                                        borderColor: getStatusColor(doc.status)
                                      }
                                    ]}
                                  >
                                    <Text style={[styles.chipText, { color: getStatusColor(doc.status) }]}>
                                      {doc.status}
                                    </Text>
                                  </Chip>
                                  <IconButton
                                    icon="chevron-right"
                                    size={24}
                                    iconColor={theme.textSecondary}
                                  />
                                </View>
                              </View>
                            </View>
                          </GlassmorphicCard>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.noDocuments}>
                        <IconButton
                          icon="file-search"
                          size={48}
                          iconColor={theme.textSecondary}
                        />
                        <Text style={[styles.noDocumentsText, { color: theme.textSecondary }]}>
                          No documents found in this category
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </GlassmorphicCard>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  searchCard: {
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryItem: {
    width: (width - 44) / 2,
  },
  categoryPill: {
    borderRadius: 30,
    padding: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryIcon: {
    margin: 0,
    marginRight: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillIcon: {
    margin: 0,
    marginRight: 4,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentDocumentsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 2,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  documentInfo: {
    marginLeft: 0,
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  plateNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plateNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  plateIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
  documentOwner: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  bottomPadding: {
    height: 20,
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
  documentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12,
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
  modalContainer: {
    position: 'relative',
    margin: 0,
    flex: 1,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
    minHeight: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalInnerContainer: {
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalScrollContent: {
    flex: 1,
    height: '100%',
  },
  modalScrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 8,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  modalDivider: {
    marginBottom: 20,
  },
  documentCardContainer: {
    marginTop: 12,
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 2,
  },
  documentItemContent: {
    width: '100%',
  },
  documentItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  documentItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  documentItemRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 100,
  },
  documentItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'nowrap',
  },
  metaIcon: {
    margin: 0,
    marginRight: 4,
    width: 20,
    height: 20,
  },
  documentItemNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentItemDate: {
    fontSize: 14,
    flex: 1,
  },
  documentItemIssuer: {
    fontSize: 14,
    flex: 1,
  },
  statusChip: {
    borderWidth: 1,
    borderRadius: 16,
    height: 28,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  noDocuments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    opacity: 0.8,
  },
  noDocumentsText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default DocumentHomeScreen; 