import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface Props {
  width: number;
  height: number;
  signalState: {
    north: 'red' | 'yellow' | 'green';
    south: 'red' | 'yellow' | 'green';
    east: 'red' | 'yellow' | 'green';
    west: 'red' | 'yellow' | 'green';
  };
}

const IntersectionLayout: React.FC<Props> = ({ width, height, signalState }) => {
  const { isDarkMode } = useTheme();
  const roadColor = isDarkMode ? '#333333' : '#666666';
  const laneMarkingColor = '#FFFFFF';
  const stopLineColor = '#FFFFFF';
  const bikePathColor = '#4CAF50';

  // Calculate dimensions
  const roadWidth = width * 0.3; // 30% of total width
  const laneWidth = roadWidth / 3; // Each direction has 3 lanes
  const centerX = width / 2;
  const centerY = height / 2;

  // Traffic signal colors
  const signalColors = {
    red: '#FF0000',
    yellow: '#FFEB3B',
    green: '#4CAF50'
  };

  return (
    <Svg width={width} height={height}>
      {/* Background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={isDarkMode ? '#1A1A1A' : '#E0E0E0'}
      />

      {/* Horizontal Road */}
      <Rect
        x={0}
        y={centerY - roadWidth / 2}
        width={width}
        height={roadWidth}
        fill={roadColor}
      />

      {/* Vertical Road */}
      <Rect
        x={centerX - roadWidth / 2}
        y={0}
        width={roadWidth}
        height={height}
        fill={roadColor}
      />

      {/* Lane Markings - Horizontal */}
      <Line
        x1={0}
        y1={centerY - laneWidth}
        x2={width}
        y2={centerY - laneWidth}
        stroke={laneMarkingColor}
        strokeWidth={2}
        strokeDasharray="10,10"
      />
      <Line
        x1={0}
        y1={centerY + laneWidth}
        x2={width}
        y2={centerY + laneWidth}
        stroke={laneMarkingColor}
        strokeWidth={2}
        strokeDasharray="10,10"
      />

      {/* Lane Markings - Vertical */}
      <Line
        x1={centerX - laneWidth}
        y1={0}
        x2={centerX - laneWidth}
        y2={height}
        stroke={laneMarkingColor}
        strokeWidth={2}
        strokeDasharray="10,10"
      />
      <Line
        x1={centerX + laneWidth}
        y1={0}
        x2={centerX + laneWidth}
        y2={height}
        stroke={laneMarkingColor}
        strokeWidth={2}
        strokeDasharray="10,10"
      />

      {/* Bike Lanes */}
      <Rect
        x={0}
        y={centerY - roadWidth / 2}
        width={width}
        height={laneWidth}
        fill={bikePathColor}
        opacity={0.2}
      />
      <Rect
        x={centerX - roadWidth / 2}
        y={0}
        width={laneWidth}
        height={height}
        fill={bikePathColor}
        opacity={0.2}
      />

      {/* Stop Lines */}
      {/* North */}
      <Line
        x1={centerX - roadWidth / 2}
        y1={centerY - roadWidth / 2}
        x2={centerX + roadWidth / 2}
        y2={centerY - roadWidth / 2}
        stroke={stopLineColor}
        strokeWidth={4}
      />
      {/* South */}
      <Line
        x1={centerX - roadWidth / 2}
        y1={centerY + roadWidth / 2}
        x2={centerX + roadWidth / 2}
        y2={centerY + roadWidth / 2}
        stroke={stopLineColor}
        strokeWidth={4}
      />
      {/* East */}
      <Line
        x1={centerX + roadWidth / 2}
        y1={centerY - roadWidth / 2}
        x2={centerX + roadWidth / 2}
        y2={centerY + roadWidth / 2}
        stroke={stopLineColor}
        strokeWidth={4}
      />
      {/* West */}
      <Line
        x1={centerX - roadWidth / 2}
        y1={centerY - roadWidth / 2}
        x2={centerX - roadWidth / 2}
        y2={centerY + roadWidth / 2}
        stroke={stopLineColor}
        strokeWidth={4}
      />

      {/* Traffic Signals */}
      {/* North Signal */}
      <Circle
        cx={centerX - roadWidth / 2 - 20}
        cy={centerY - roadWidth / 2 - 20}
        r={10}
        fill={signalColors[signalState.north]}
      />
      {/* South Signal */}
      <Circle
        cx={centerX + roadWidth / 2 + 20}
        cy={centerY + roadWidth / 2 + 20}
        r={10}
        fill={signalColors[signalState.south]}
      />
      {/* East Signal */}
      <Circle
        cx={centerX + roadWidth / 2 + 20}
        cy={centerY - roadWidth / 2 - 20}
        r={10}
        fill={signalColors[signalState.east]}
      />
      {/* West Signal */}
      <Circle
        cx={centerX - roadWidth / 2 - 20}
        cy={centerY + roadWidth / 2 + 20}
        r={10}
        fill={signalColors[signalState.west]}
      />
    </Svg>
  );
};

export default IntersectionLayout; 