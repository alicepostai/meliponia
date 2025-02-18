import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.honey,
    borderRadius: 100,
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
});

export default styles;
