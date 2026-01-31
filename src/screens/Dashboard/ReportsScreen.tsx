import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
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
  DataTable,
  Portal,
  Dialog,
  FAB
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock chart component (in a real app, you'd use a proper charting library like react-native-chart-kit)
const MockChart = ({ type, data, color, style }: { type: string, data: any, color: string, style?: any }) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Surface style={[styles.chartContainer, style, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>{type} Chart</Text>
        <IconButton icon="dots-vertical" size={20} onPress={() => {}} />
      </View>
      <View style={styles.chartPlaceholder}>
        {type === 'Bar' && (
          <View style={styles.barChartMock}>
            {data.map((item: any, index: number) => (
              <View key={index} style={styles.barChartColumn}>
                <View 
                  style={[
                    styles.barChartBar, 
                    { 
                      height: `${(item.value / Math.max(...data.map((d: any) => d.value))) * 80}%`,
                      backgroundColor: color
                    }
                  ]} 
                />
                <Text style={[styles.barChartLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {type === 'Line' && (
          <View style={styles.lineChartMock}>
            <View style={[styles.lineChartLine, { borderColor: color }]} />
            {data.map((item: any, index: number) => (
              <View 
                key={index} 
                style={[
                  styles.lineChartDot, 
                  { 
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: `${(item.value / Math.max(...data.map((d: any) => d.value))) * 80}%`,
                    backgroundColor: color,
                    borderColor: isDarkMode ? '#1E1E1E' : theme.white
                  }
                ]} 
              />
            ))}
            <View style={styles.lineChartXAxis}>
              {data.map((item: any, index: number) => (
                <Text 
                  key={index} 
                  style={[
                    styles.lineChartLabel, 
                    { 
                      left: `${(index / (data.length - 1)) * 100}%`,
                      color: theme.textSecondary 
                    }
                  ]}
                >
                  {item.label}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {type === 'Pie' && (
          <View style={styles.pieChartMock}>
            <View style={styles.pieChartCircle}>
              {data.map((item: any, index: number) => {
                const totalValue = data.reduce((sum: number, d: any) => sum + d.value, 0);
                const startPercent = data.slice(0, index).reduce((sum: number, d: any) => sum + d.value, 0) / totalValue;
                const endPercent = startPercent + (item.value / totalValue);
                
                return (
                  <View 
                    key={index} 
                    style={[
                      styles.pieChartSegment, 
                      {
                        backgroundColor: item.color || color,
                        transform: [
                          { rotate: `${startPercent * 360}deg` },
                        ],
                        opacity: 1 - (index * 0.2)
                      }
                    ]} 
                  />
                );
              })}
            </View>
            <View style={styles.pieChartLegend}>
              {data.map((item: any, index: number) => (
                <View key={index} style={styles.pieChartLegendItem}>
                  <View style={[styles.pieChartLegendColor, { backgroundColor: item.color || color }]} />
                  <Text style={[styles.pieChartLegendText, { color: theme.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Surface>
  );
};

// Mock data for charts
const violationsData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 30 },
  { label: 'Sat', value: 25 },
  { label: 'Sun', value: 14 },
];

const trafficData = [
  { label: '8AM', value: 65 },
  { label: '10AM', value: 80 },
  { label: '12PM', value: 95 },
  { label: '2PM', value: 87 },
  { label: '4PM', value: 92 },
  { label: '6PM', value: 98 },
  { label: '8PM', value: 75 },
];

const violationTypeData = [
  { label: 'Speeding', value: 38, color: '#FF6384' },
  { label: 'Red Light', value: 25, color: '#36A2EB' },
  { label: 'No Helmet', value: 18, color: '#FFCE56' },
  { label: 'Wrong Side', value: 12, color: '#4BC0C0' },
  { label: 'Others', value: 7, color: '#9966FF' },
];

// Mock data for reports
const recentReports = [
  { id: 'R001', name: 'Monthly Traffic Violations', date: '01 Aug 2023', type: 'PDF', size: '2.3 MB' },
  { id: 'R002', name: 'Weekly Challan Collection', date: '25 Jul 2023', type: 'XLSX', size: '1.5 MB' },
  { id: 'R003', name: 'Daily Activity Summary', date: '22 Jul 2023', type: 'PDF', size: '0.8 MB' },
  { id: 'R004', name: 'Vehicle Recovery Status', date: '18 Jul 2023', type: 'DOCX', size: '1.2 MB' },
  { id: 'R005', name: 'Officer Performance Report', date: '15 Jul 2023', type: 'PDF', size: '3.1 MB' },
];

type Props = NativeStackScreenProps<DashboardStackParamList, 'Reports'>;
const { width } = Dimensions.get('window');

const ReportsScreen = ({ navigation, route }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Initialize with route params or default to 'daily'
  const [reportType, setReportType] = useState(route.params?.type || 'daily');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  const [dateRange, setDateRange] = useState('This Week');
  const [generating, setGenerating] = useState(false);
  
  const dateRangeOptions = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'Custom Range',
  ];
  
  const filteredReports = recentReports.filter(report => {
    if (searchQuery.trim() === '') return true;
    
    const query = searchQuery.toLowerCase();
    return (
      report.name.toLowerCase().includes(query) ||
      report.date.toLowerCase().includes(query) ||
      report.type.toLowerCase().includes(query)
    );
  });
  
  const handleGenerateReport = () => {
    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      // Show success message or navigate
    }, 2000);
  };
  
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.dateFilterRow}>
        <Button 
          mode="outlined" 
          icon="calendar" 
          onPress={() => setDateRangeVisible(true)}
          style={[styles.dateFilterButton, { borderColor: theme.primary }]}
        >
          {dateRange}
        </Button>
        <View style={styles.reportTypeChips}>
          <Chip 
            selected={reportType === 'daily'} 
            onPress={() => setReportType('daily')}
            style={styles.reportTypeChip}
            selectedColor={theme.primary}
          >
            Daily
          </Chip>
          <Chip 
            selected={reportType === 'weekly'} 
            onPress={() => setReportType('weekly')}
            style={styles.reportTypeChip}
            selectedColor={theme.primary}
          >
            Weekly
          </Chip>
          <Chip 
            selected={reportType === 'monthly'} 
            onPress={() => setReportType('monthly')}
            style={styles.reportTypeChip}
            selectedColor={theme.primary}
          >
            Monthly
          </Chip>
        </View>
      </View>

      <Animatable.View 
        animation="fadeIn" 
        duration={600}
      >
        <Surface style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '20' }]}>
                <IconButton icon="file-document" size={24} iconColor={theme.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>256</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Reports</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.success + '20' }]}>
                <IconButton icon="car-info" size={24} iconColor={theme.success} />
              </View>
              <Text style={[styles.statValue, { color: theme.success }]}>1,284</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vehicles Scanned</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.error + '20' }]}>
                <IconButton icon="alert-circle" size={24} iconColor={theme.error} />
              </View>
              <Text style={[styles.statValue, { color: theme.error }]}>342</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Violations</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.warning + '20' }]}>
                <IconButton icon="cash" size={24} iconColor={theme.warning} />
              </View>
              <Text style={[styles.statValue, { color: theme.warning }]}>₹86,500</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Revenue</Text>
            </View>
          </View>
        </Surface>
      </Animatable.View>
      
      <View style={styles.chartsContainer}>
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          delay={100}
        >
          <MockChart 
            type="Bar" 
            data={violationsData} 
            color={theme.error}
            style={styles.fullWidthChart}
          />
        </Animatable.View>
        
        <View style={styles.chartRow}>
          <Animatable.View 
            animation="fadeInLeft" 
            duration={600}
            delay={200}
            style={styles.halfChart}
          >
            <MockChart 
              type="Line" 
              data={trafficData} 
              color={theme.primary}
            />
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInRight" 
            duration={600}
            delay={300}
            style={styles.halfChart}
          >
            <MockChart 
              type="Pie" 
              data={violationTypeData} 
              color={theme.warning}
            />
          </Animatable.View>
        </View>
      </View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={600}
        delay={400}
      >
        <View style={styles.actionButtonsContainer}>
          <Button 
            mode="contained" 
            icon="file-download" 
            onPress={handleGenerateReport}
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            loading={generating}
            disabled={generating}
          >
            Generate Report
          </Button>
          
          <Button 
            mode="outlined" 
            icon="share-variant" 
            onPress={() => {}}
            style={[styles.actionButton, { borderColor: theme.primary, marginTop: 12 }]}
            labelStyle={{ color: theme.primary }}
          >
            Share Reports
          </Button>
        </View>
      </Animatable.View>
    </View>
  );
  
  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchFilterRow}>
        <Searchbar
          placeholder="Search reports..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
          iconColor={theme.primary}
          inputStyle={{ color: theme.text }}
          placeholderTextColor={theme.textSecondary}
        />
        
        <IconButton
          icon="filter-variant"
          size={24}
          onPress={() => setMenuVisible(true)}
          style={[styles.filterButton, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
        />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<View />}
          style={[styles.menu, { backgroundColor: isDarkMode ? '#2C2C2C' : theme.white }]}
        >
          <Menu.Item 
            onPress={() => {
              // Apply filter
              setMenuVisible(false);
            }} 
            title="All Reports"
            leadingIcon="file-multiple"
          />
          <Menu.Item 
            onPress={() => {
              // Apply filter
              setMenuVisible(false);
            }} 
            title="PDF Reports"
            leadingIcon="file-pdf-box"
          />
          <Menu.Item 
            onPress={() => {
              // Apply filter
              setMenuVisible(false);
            }} 
            title="Excel Reports"
            leadingIcon="file-excel-box"
          />
          <Menu.Item 
            onPress={() => {
              // Apply filter
              setMenuVisible(false);
            }} 
            title="Recent First"
            leadingIcon="sort-calendar-descending"
          />
        </Menu>
      </View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={600}
      >
        {filteredReports.length > 0 ? (
          <Surface style={[styles.reportsTable, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Report Name</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Format</DataTable.Title>
                <DataTable.Title numeric>Size</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              
              {filteredReports.map((report) => (
                <DataTable.Row key={report.id}>
                  <DataTable.Cell textStyle={{ color: theme.text }}>{report.name}</DataTable.Cell>
                  <DataTable.Cell textStyle={{ color: theme.textSecondary }}>{report.date}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="flat" 
                      style={{ 
                        backgroundColor: 
                          report.type === 'PDF' ? theme.error + '20' : 
                          report.type === 'XLSX' ? theme.success + '20' : 
                          theme.warning + '20',
                      }}
                      textStyle={{ 
                        color: 
                          report.type === 'PDF' ? theme.error : 
                          report.type === 'XLSX' ? theme.success : 
                          theme.warning,
                        fontSize: 12
                      }}
                      compact
                    >
                      {report.type}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ color: theme.textSecondary }}>{report.size}</DataTable.Cell>
                  <DataTable.Cell>
                    <View style={styles.actionIcons}>
                      <IconButton 
                        icon="eye" 
                        size={16} 
                        iconColor={theme.primary}
                        onPress={() => {}}
                      />
                      <IconButton 
                        icon="download" 
                        size={16} 
                        iconColor={theme.success}
                        onPress={() => {}}
                      />
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Surface>
        ) : (
          <Surface style={[styles.emptyState, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <IconButton
              icon="file-search"
              size={48}
              iconColor={theme.primary}
            />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Reports Found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
              Try adjusting your search criteria
            </Text>
          </Surface>
        )}
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={600}
        delay={300}
      >
        <Surface style={[styles.reportTypesCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <Text style={[styles.reportTypesTitle, { color: theme.text }]}>Available Report Types</Text>
          
          <View style={styles.reportTypesList}>
            <TouchableOpacity style={styles.reportTypeItem} onPress={() => {}}>
              <View style={[styles.reportTypeIcon, { backgroundColor: theme.primary + '20' }]}>
                <IconButton icon="file-chart" size={24} iconColor={theme.primary} />
              </View>
              <View style={styles.reportTypeInfo}>
                <Text style={[styles.reportTypeName, { color: theme.text }]}>Traffic Analysis</Text>
                <Text style={[styles.reportTypeDesc, { color: theme.textSecondary }]}>
                  Detailed traffic flow analysis with trends
                </Text>
              </View>
              <IconButton icon="chevron-right" size={24} iconColor={theme.textSecondary} />
            </TouchableOpacity>
            
            <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
            
            <TouchableOpacity style={styles.reportTypeItem} onPress={() => {}}>
              <View style={[styles.reportTypeIcon, { backgroundColor: theme.success + '20' }]}>
                <IconButton icon="cash-multiple" size={24} iconColor={theme.success} />
              </View>
              <View style={styles.reportTypeInfo}>
                <Text style={[styles.reportTypeName, { color: theme.text }]}>Revenue Report</Text>
                <Text style={[styles.reportTypeDesc, { color: theme.textSecondary }]}>
                  Collection statistics and payment methods
                </Text>
              </View>
              <IconButton icon="chevron-right" size={24} iconColor={theme.textSecondary} />
            </TouchableOpacity>
            
            <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
            
            <TouchableOpacity style={styles.reportTypeItem} onPress={() => {}}>
              <View style={[styles.reportTypeIcon, { backgroundColor: theme.error + '20' }]}>
                <IconButton icon="alert-octagon" size={24} iconColor={theme.error} />
              </View>
              <View style={styles.reportTypeInfo}>
                <Text style={[styles.reportTypeName, { color: theme.text }]}>Violation Summary</Text>
                <Text style={[styles.reportTypeDesc, { color: theme.textSecondary }]}>
                  Types and frequency of traffic violations
                </Text>
              </View>
              <IconButton icon="chevron-right" size={24} iconColor={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </Surface>
      </Animatable.View>
    </View>
  );

  return (
    <ScreenWithSidebar
      title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Reports`}
      navigation={navigation}
      notificationCount={5}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'overview',
                label: 'Overview',
                icon: 'chart-box',
                style: { 
                  backgroundColor: activeTab === 'overview' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
              {
                value: 'reports',
                label: 'Reports List',
                icon: 'file-document-multiple',
                style: { 
                  backgroundColor: activeTab === 'reports' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + 20 }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'overview' ? renderOverviewTab() : renderReportsTab()}
        </ScrollView>
        
        <Portal>
          <Dialog
            visible={dateRangeVisible}
            onDismiss={() => setDateRangeVisible(false)}
            style={{ backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }}
          >
            <Dialog.Title style={{ color: theme.text }}>Select Date Range</Dialog.Title>
            <Dialog.Content>
              {dateRangeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dateOption}
                  onPress={() => {
                    setDateRange(option);
                    setDateRangeVisible(false);
                  }}
                >
                  <Text style={[
                    styles.dateOptionText, 
                    { color: dateRange === option ? theme.primary : theme.text }
                  ]}>
                    {option}
                  </Text>
                  {dateRange === option && (
                    <IconButton
                      icon="check"
                      size={20}
                      iconColor={theme.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDateRangeVisible(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
        <FAB
          icon="file-plus"
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => handleGenerateReport()}
          label="New Report"
        />
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    flex: 1,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateFilterButton: {
    borderRadius: 8,
  },
  reportTypeChips: {
    flexDirection: 'row',
    marginLeft: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  reportTypeChip: {
    marginLeft: 8,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartsContainer: {
    marginBottom: 16,
  },
  fullWidthChart: {
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfChart: {
    width: (width - 40) / 2,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barChartMock: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  barChartColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barChartBar: {
    width: '60%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barChartLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  lineChartMock: {
    width: '100%',
    height: '100%',
    position: 'relative',
    paddingVertical: 10,
  },
  lineChartLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    top: '50%',
  },
  lineChartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    transform: [{ translateX: -5 }, { translateY: 5 }],
  },
  lineChartXAxis: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 20,
  },
  lineChartLabel: {
    position: 'absolute',
    fontSize: 10,
    transform: [{ translateX: -10 }],
  },
  pieChartMock: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieChartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  pieChartSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  pieChartLegend: {
    flex: 1,
    paddingLeft: 12,
  },
  pieChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pieChartLegendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  pieChartLegendText: {
    fontSize: 10,
  },
  actionButtonsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 8,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButton: {
    borderRadius: 8,
  },
  menu: {
    marginTop: 50,
    marginLeft: width - 200,
  },
  reportsTable: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  reportTypesCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  reportTypesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
  },
  reportTypesList: {
    paddingBottom: 8,
  },
  reportTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportTypeInfo: {
    flex: 1,
  },
  reportTypeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reportTypeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dateOptionText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ReportsScreen; 