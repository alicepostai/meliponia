import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

export default StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  headingText: {
    fontSize: 28,
    color: colors.honey,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: fonts.Light,
    textAlign: 'center',
    marginTop: 5,
  },
});
