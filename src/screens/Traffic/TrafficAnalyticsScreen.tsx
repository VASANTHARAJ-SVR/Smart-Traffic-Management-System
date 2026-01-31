import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  Button,
  SegmentedButtons,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';

type Props = NativeStackScreenProps<TrafficStackParamList, 'TrafficAnalytics'>;
const { width } = Dimensions.get('window');

// Mock data for traffic statistics
const trafficData = {
  congestion: {
    hourly: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [{
        data: [30, 85, 65, 70, 90, 45],
        color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
      }],
      legend: ['Congestion %']
    },
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [65, 75, 80, 70, 85, 55, 45],
        color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
      }],
      legend: ['Congestion %']
    },
    weekly: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{
        data: [70, 75, 68, 82],
        color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
      }],
      legend: ['Congestion %']
    }
  },
  speed: {
    hourly: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [{
        data: [45, 25, 35, 30, 20, 40],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      }],
      legend: ['Avg Speed (km/h)']
    },
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [35, 30, 25, 32, 28, 40, 45],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      }],
      legend: ['Avg Speed (km/h)']
    },
    weekly: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{
        data: [32, 35, 38, 30],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      }],
      legend: ['Avg Speed (km/h)']
    }
  },
  incidents: {
    hourly: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [{
        data: [2, 5, 3, 4, 6, 2],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
      }],
      legend: ['Incidents']
    },
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [8, 12, 10, 9, 15, 7, 5],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
      }],
      legend: ['Incidents']
    },
    weekly: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [{
        data: [35, 42, 38, 45],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
      }],
      legend: ['Incidents']
    }
  }
};

const congestionHotspots = [
  { location: 'MG Road Junction', level: 85, change: '+5%' },
  { location: 'Silk Board', level: 92, change: '+8%' },
  { location: 'Whitefield Main Road', level: 70, change: '-3%' },
  { location: 'Electronic City Flyover', level: 65, change: '-2%' },
];

const TrafficAnalyticsScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('congestion');

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? theme.error : theme.success;
  };

  const getCongestionColor = (level: number) => {
    if (level > 80) return theme.error;
    if (level > 60) return theme.warning;
    return theme.success;
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'speed':
        return theme.success;
      case 'incidents':
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const getMetricData = () => {
    const data = trafficData[selectedMetric as keyof typeof trafficData][timeRange as keyof typeof trafficData.congestion];
    return {
      labels: data.labels,
      datasets: data.datasets,
      legend: data.legend
    };
  };

  const getMetricStats = () => {
    const data = trafficData[selectedMetric as keyof typeof trafficData][timeRange as keyof typeof trafficData.congestion].datasets[0].data;
    const average = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    const max = Math.max(...data);
    const prevPeriodAvg = average - 5; // Mock previous period
    const change = ((average - prevPeriodAvg) / prevPeriodAvg * 100).toFixed(1);
    
    return {
      average: selectedMetric === 'speed' ? `${average}km/h` : `${average}${selectedMetric === 'congestion' ? '%' : ''}`,
      peak: selectedMetric === 'speed' ? `${max}km/h` : `${max}${selectedMetric === 'congestion' ? '%' : ''}`,
      change: `${change}%`
    };
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    color: (opacity = 1) => {
      const color = getMetricColor();
      return color + (opacity * 255).toString(16).padStart(2, '0');
    },
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: true,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      strokeWidth: 1,
    },
  };

  const stats = getMetricStats();

  return (
    <ScreenWithSidebar
      title="Traffic Analytics"
      navigation={navigation}
      notificationCount={2}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          style={[styles.timeRangeContainer, {
            marginLeft: Math.max(insets.left + 20, 20),
            marginRight: Math.max(insets.right + 20, 20),
          }]}
        >
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
            ]}
            style={styles.segmentedButtons}
          />
        </Animatable.View>

        {/* Traffic Overview Card */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={100}
          style={[styles.cardContainer, {
            marginLeft: Math.max(insets.left + 20, 20),
            marginRight: Math.max(insets.right + 20, 20),
          }]}
        >
          <Surface style={[styles.card, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]}>
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            />
            
            <View style={styles.metricButtons}>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  selectedMetric === 'congestion' && styles.selectedMetric,
                  { borderColor: theme.primary }
                ]}
                onPress={() => setSelectedMetric('congestion')}
              >
                <IconButton
                  icon="car-multiple"
                  size={24}
                  iconColor={theme.primary}
                  style={styles.metricIcon}
                />
                <Text style={[styles.metricText, { color: theme.text }]}>
                  Congestion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  selectedMetric === 'speed' && styles.selectedMetric,
                  { borderColor: theme.primary }
                ]}
                onPress={() => setSelectedMetric('speed')}
              >
                <IconButton
                  icon="speedometer"
                  size={24}
                  iconColor={theme.primary}
                  style={styles.metricIcon}
                />
                <Text style={[styles.metricText, { color: theme.text }]}>
                  Avg. Speed
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  selectedMetric === 'incidents' && styles.selectedMetric,
                  { borderColor: theme.primary }
                ]}
                onPress={() => setSelectedMetric('incidents')}
              >
                <IconButton
                  icon="alert-circle"
                  size={24}
                  iconColor={theme.primary}
                  style={styles.metricIcon}
                />
                <Text style={[styles.metricText, { color: theme.text }]}>
                  Incidents
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
              <LineChart
                data={getMetricData()}
                width={width - 80}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={true}
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {stats.average}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Average
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { 
                  color: stats.change.startsWith('-') ? theme.error : theme.success 
                }]}>
                  {stats.change}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Change
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {stats.peak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Peak
                </Text>
              </View>
            </View>
          </Surface>
        </Animatable.View>

        {/* Congestion Hotspots */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          delay={200}
          style={[styles.cardContainer, {
            marginLeft: Math.max(insets.left + 20, 20),
            marginRight: Math.max(insets.right + 20, 20),
          }]}
        >
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            marginBottom: 12,
          }]}>Congestion Hotspots</Text>
          
          <Surface style={[styles.card, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]}>
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            />
            
            {congestionHotspots.map((hotspot, index) => (
              <View key={hotspot.location} style={styles.hotspotItem}>
                <View style={styles.hotspotInfo}>
                  <Text style={[styles.hotspotLocation, { color: theme.text }]}>
                    {hotspot.location}
                  </Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={hotspot.level / 100}
                      color={getCongestionColor(hotspot.level)}
                      style={styles.progressBar}
                    />
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                      {hotspot.level}%
                    </Text>
                  </View>
                </View>
                <Text style={[styles.changeText, { 
                  color: getChangeColor(hotspot.change)
                }]}>
                  {hotspot.change}
                </Text>
              </View>
            ))}
          </Surface>
        </Animatable.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeRangeContainer: {
    marginVertical: 16,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  cardContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  metricButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 1,
  },
  metricButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
  },
  selectedMetric: {
    backgroundColor: 'rgba(67, 97, 238, 0.2)',
  },
  metricIcon: {
    margin: 0,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    zIndex: 1,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    zIndex: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  hotspotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 1,
  },
  hotspotInfo: {
    flex: 1,
    marginRight: 16,
  },
  hotspotLocation: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    width: 40,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80,
  },
});

export default TrafficAnalyticsScreen; 