import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 10,
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  swarmCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  swarmImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  swarmInfo: {
    flex: 1,
  },
  swarmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  swarmDetails: {
    fontSize: 14,
    color: '#666',
  },
  swarmCode: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: colors.honey,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
  },
});

export default styles;
