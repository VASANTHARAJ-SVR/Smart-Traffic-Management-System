import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import GlassmorphicCard from './GlassmorphicCard';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: string;
  status?: 'normal' | 'warning' | 'danger' | 'success';
  style?: StyleProp<ViewStyle>;
  animation?: string;
  delay?: number;
  showTrend?: boolean;
  trendValue?: number;
  trendLabel?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  status = 'normal',
  style,
  animation = 'fadeInUp',
  delay = 0,
  showTrend = false,
  trendValue = 0,
  trendLabel,
}) => {
  const { theme } = useTheme();
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return theme.primary;
      case 'warning':
        return theme.warning;
      case 'danger':
        return theme.error;
      case 'success':
        return theme.success;
      default:
        return theme.primary;
    }
  };
  
  // Get trend icon and color
  const getTrendIcon = () => {
    if (trendValue > 0) {
      return {
        icon: 'arrow-up',
        color: theme.success,
      };
    } else if (trendValue < 0) {
      return {
        icon: 'arrow-down',
        color: theme.error,
      };
    } else {
      return {
        icon: 'remove',
        color: theme.textSecondary,
      };
    }
  };
  
  const statusColor = getStatusColor();
  const trend = getTrendIcon();
  
  return (
    <GlassmorphicCard
      style={[styles.container, style]}
      animation={animation}
      delay={delay}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>
          {title}
        </Text>
        {icon && (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            <Ionicons
              name={icon as any}
              size={20}
              color={statusColor}
            />
          </Animatable.View>
        )}
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: theme.text }]}>
          {value}
        </Text>
        
        {showTrend && (
          <View style={styles.trendContainer}>
            <Ionicons
              name={trend.icon as any}
              size={16}
              color={trend.color}
              style={styles.trendIcon}
            />
            <Text style={[styles.trendValue, { color: trend.color }]}>
              {Math.abs(trendValue)}%
            </Text>
            {trendLabel && (
              <Text style={[styles.trendLabel, { color: theme.textSecondary }]}>
                {trendLabel}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {/* Status indicator */}
      <View 
        style={[
          styles.statusIndicator, 
          { backgroundColor: statusColor }
        ]} 
      />
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
});

export default StatusCard; 