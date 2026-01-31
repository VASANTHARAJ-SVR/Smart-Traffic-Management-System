import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Incident } from '../types/index';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import * as Animatable from 'react-native-animatable';

interface IncidentCardProps {
  incident: Incident;
  onPress?: () => void;
  onResolve?: () => void;
  animation?: string;
  delay?: number;
}

const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onPress,
  onResolve,
  animation = 'fadeInUp',
  delay = 0,
}) => {
  const { theme } = useTheme();
  
  // Get incident icon based on type
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return 'car-crash';
      case 'congestion':
        return 'car';
      case 'roadblock':
        return 'close-circle';
      case 'construction':
        return 'construct';
      case 'event':
        return 'calendar';
      default:
        return 'alert-circle';
    }
  };
  
  // Get incident color based on severity
  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.info;
      default:
        return theme.primary;
    }
  };
  
  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Calculate time elapsed
  const getTimeElapsed = (timestamp: string) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffMs = now.getTime() - incidentTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };
  
  const incidentColor = getIncidentColor(incident.severity);
  const incidentIcon = getIncidentIcon(incident.type);
  const isActive = incident.status === 'active';
  
  return (
    <GlassmorphicCard
      style={styles.container}
      animation={animation}
      delay={delay}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {/* Status Indicator */}
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: isActive ? incidentColor : theme.success }
          ]} 
        />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Animatable.View
              animation={isActive ? "pulse" : undefined}
              iterationCount="infinite"
              duration={2000}
              style={[styles.iconBackground, { backgroundColor: incidentColor }]}
            >
              <Ionicons name={incidentIcon as any} size={20} color="#FFFFFF" />
            </Animatable.View>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
            </Text>
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {incident.location.address}
            </Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: theme.textSecondary }]}>
              {formatTime(incident.timestamp)}
            </Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(incident.timestamp)}
            </Text>
          </View>
        </View>
        
        {/* Description */}
        <Text style={[styles.description, { color: theme.text }]}>
          {incident.description}
        </Text>
        
        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View 
              style={[
                styles.severityBadge, 
                { backgroundColor: incidentColor }
              ]}
            >
              <Text style={styles.severityText}>
                {incident.severity.toUpperCase()}
              </Text>
            </View>
            
            <Text style={[styles.timeElapsed, { color: theme.textSecondary }]}>
              {getTimeElapsed(incident.timestamp)}
            </Text>
          </View>
          
          {isActive && onResolve && (
            <TouchableOpacity
              style={[styles.resolveButton, { backgroundColor: theme.success }]}
              onPress={onResolve}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.resolveButtonText}>Resolve</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 0,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    paddingLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeElapsed: {
    fontSize: 12,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  resolveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default IncidentCard; 