import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontFamily: fonts.Light,
    fontSize: 16,
    color: colors.black,
  },
  trackColorFalse: colors.gray,
  trackColorTrue: colors.honey,
  thumbColor: colors.white,
});

export default styles;
