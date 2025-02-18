import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.Regular,
    marginTop: 5,
  },
});

export default styles;
