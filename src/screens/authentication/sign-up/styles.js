import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginTop: -8,
  },
});

export default styles;
