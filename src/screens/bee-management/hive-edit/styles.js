import {StyleSheet} from 'react-native';
import { colors } from '../../../utils/Colors';
import { fonts } from '../../../utils/Fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
      },
      backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: colors.gray,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      textContainer: {
        marginVertical: 20,
      },
      headingText: {
        fontSize: 28,
        color: colors.honey,
        fontFamily: fonts.SemiBold,
        marginBottom: 20,
        marginTop: 20,
      },
      formContainer: {
        marginTop: 20,
      },
      inputContainer: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 100,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        marginVertical: 10,
      },
      textInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontFamily: fonts.Light,
      },
      errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 20,
        marginTop: -8,
      },
      signUpButtonWrapper: {
        backgroundColor: colors.honey,
        borderRadius: 100,
        marginTop: 20,
      },
      signUpText: {
        color: colors.white,
        fontSize: 20,
        fontFamily: fonts.SemiBold,
        textAlign: 'center',
        padding: 10,
      },
});

export default styles;
