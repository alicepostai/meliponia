import {StyleSheet} from 'react-native';
import {colors} from './Colors';

const Styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },

  headerContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },

  tabBarIcon: {
    fontSize: 24,
  },

  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.honey,
    marginBottom: 10,
  },

  button: {
    backgroundColor: colors.honey,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Styles;
