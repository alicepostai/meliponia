import { StyleSheet } from 'react-native';
import { colors } from '../../../utils/Colors';
import { fonts } from '../../../utils/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.black,
    paddingVertical: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  actionDate: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.secondary,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontFamily: fonts.Light,
    color: colors.black,
    marginBottom: 5,
  },
  actionLabel: {
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: fonts.Light,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
