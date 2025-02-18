import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioButtonLabel: {
    marginLeft: 10,
    fontFamily: fonts.Light,
    fontSize: 16,
    color: colors.black,
  },
  radioButtonColor: colors.honey,
  radioButtonUncheckedColor: colors.secondary,
});

export default styles;
