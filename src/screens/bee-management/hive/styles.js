import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';
import {fonts} from '../../../utils/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  optionsMenuButton: {
    padding: 10,
  },
  optionsMenu: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 150,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.honey,
    borderRadius: 20,
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.Light,
    color: colors.secondary,
    marginTop: 5,
  },
  infoBlock: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.black,
    marginBottom: 5,
  },
  infoLabel: {
    fontFamily: fonts.SemiBold,
  },
  infoBold: {
    fontFamily: fonts.SemiBold,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: colors.gray,
    height: 1,
    marginBottom: -10,
  },
  manejosContainer: {
    padding: 20,
  },
  manejoItem: {
    paddingVertical: 10,
  },
  manejoDate: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.secondary,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  manejoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manejoTextContainer: {
    marginLeft: 10,
  },
  manejoType: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.black,
  },
  manejoObservation: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.primary,
    marginTop: 5,
  },
  manejoDivider: {
    backgroundColor: colors.gray,
    height: 1,
    marginVertical: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: colors.honey,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptions: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 150,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.black,
    marginLeft: 10,
  },
});
