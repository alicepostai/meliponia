import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  minimumTrackTintColor: colors.honey,
  maximumTrackTintColor: colors.gray,
  thumbTintColor: colors.honey,
});

export default styles;
