import { Platform, View, Text } from 'react-native';

// On web, provide a placeholder
if (Platform.OS === 'web') {
  module.exports = {
    default: () => View,
    MapView: View,
    Marker: View,
    Heatmap: View,
    Callout: View,
    PROVIDER_GOOGLE: null,
  };
} else {
  // On native, import the real library
  module.exports = require('react-native-maps');
}
