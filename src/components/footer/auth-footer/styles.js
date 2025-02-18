import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 5,
  },
  footerText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  footerActionText: {
    color: colors.honey,
    fontFamily: fonts.Bold,
  },
});

export default styles;
