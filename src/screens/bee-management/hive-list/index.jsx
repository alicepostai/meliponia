import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../../services/supabase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModal from '../../../components/filter-modal';
import styles from './styles';
import {species} from '../../../constants/lists/BeeSpeciesList';

const HiveList = () => {
  const navigation = useNavigation();
  const [hives, setHives] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState('Ativas');

  const getBeeNameById = id => {
    const bee = species.find(s => s.id === id);
    return bee ? bee.name : 'Espécie não encontrada';
  };

  const getBeeImageById = id => {
    const bee = species.find(s => s.id === id);
    return bee ? bee.imageUrl : 'Espécie não encontrada';
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.error('Usuário não autenticado');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchHives = async () => {
      let query = supabase.from('hive').select('*').eq('user_id', userId);

      if (filter === 'Ativas') {
        query = query.eq('status', 'Ativo');
      } else if (filter === 'Vendidas') {
        query = query.eq('status', 'Vendido');
      } else if (filter === 'Doadas') {
        query = query.eq('status', 'Doado');
      }

      const {data, error} = await query;

      if (!error) {
        setHives(data);
      }
    };

    fetchHives();

    const subscription = supabase
      .channel('public:hive')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'hive'},
        payload => {
          if (payload.eventType === 'INSERT') {
            setHives(prevHives => {
              const exists = prevHives.some(hive => hive.id === payload.new.id);
              return exists ? prevHives : [payload.new, ...prevHives];
            });
          } else if (payload.eventType === 'UPDATE') {
            setHives(prevHives =>
              prevHives.map(hive =>
                hive.id === payload.new.id ? payload.new : hive,
              ),
            );
          } else if (payload.eventType === 'DELETE') {
            setHives(prevHives =>
              prevHives.filter(hive => hive.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, filter]);

  const handleSearch = text => {
    setSearchText(text);
  };

  const filteredHives = hives.filter(hive => {
    const speciesName = getBeeNameById(hive.bee_species_id).toLowerCase();
    const scientificName = hive.bee_species_scientific_name
      ? hive.bee_species_scientific_name.toLowerCase()
      : '';

    return (
      speciesName.includes(searchText.toLowerCase()) ||
      scientificName.includes(searchText.toLowerCase())
    );
  });

  const renderHiveItem = ({item}) => (
    <View style={styles.swarmCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('mainApp', {
            screen: 'hive',
            params: {id: item.id},
          })
        }
        style={styles.swarmCard}>
        <Image
          source={{uri: getBeeImageById(item.bee_species_id)}}
          style={styles.swarmImage}
        />
        <View style={styles.swarmInfo}>
          <Text style={styles.swarmName}>
            {getBeeNameById(item.bee_species_id)}
          </Text>
          <Text style={styles.swarmDetails}>
            Espécie: {item.bee_species_scientific_name}
          </Text>
          <Text style={styles.swarmDetails}>
            {item.hive_origin} em {item.acquisition_date}
          </Text>
          <Text style={styles.swarmCode}>#{item.hive_code}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleAddHive = () => {
    navigation.navigate('mainApp', {screen: 'hiveRegistration'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Colmeias"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}>
          <MaterialCommunityIcons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FilterModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onSelectFilter={selectedFilter => setFilter(selectedFilter)}
        selectedFilter={filter}
      />

      <FlatList
        data={filteredHives}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderHiveItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddHive}>
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HiveList;
