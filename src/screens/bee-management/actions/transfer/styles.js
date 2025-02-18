import {StyleSheet} from 'react-native';
import {colors} from '../../../../utils/Colors';
import {fonts} from '../../../../utils/Fonts';

export default StyleSheet.create({
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
  headingText: {
    fontSize: 28,
    color: colors.honey,
    fontFamily: fonts.SemiBold,
    marginBottom: 20,
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
    color: colors.black,
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
  modalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  itemText: {
    fontSize: 16,
    fontFamily: fonts.Light,
    color: colors.black,
  },
});
