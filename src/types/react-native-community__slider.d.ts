declare module '@react-native-community/slider' {
  import { ViewProps } from 'react-native';

  interface SliderProps extends ViewProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    onValueChange?: (value: number) => void;
    onSlidingStart?: () => void;
    onSlidingComplete?: (value: number) => void;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    style?: any;
  }

  const Slider: React.FC<SliderProps>;
  export default Slider;
} 