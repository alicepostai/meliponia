import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {supabase} from '../../../services/supabase';
import {colors} from '../../../utils/Colors';
import styles from './styles';

const ActionHistory = () => {
  const navigation = useNavigation();
  const [allActions, setAllActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllActions = async () => {
    const {data: hiveActions, error: hiveActionsError} = await supabase
      .from('hive_action')
      .select('*')
      .order('action_date', {ascending: false});

    const {data: hiveTransactions, error: hiveTransactionsError} =
      await supabase
        .from('hive_transaction')
        .select('*')
        .order('transaction_date', {ascending: false});

    if (hiveActionsError || hiveTransactionsError) {
      console.error(
        'Erro ao buscar ações:',
        hiveActionsError || hiveTransactionsError,
      );
      return;
    }

    const combinedActions = [...hiveActions, ...hiveTransactions].sort(
      (a, b) => {
        const dateA = a.action_date || a.transaction_date;
        const dateB = b.action_date || b.transaction_date;
        return new Date(dateB) - new Date(dateA);
      },
    );

    setAllActions(combinedActions);
    setFilteredActions(combinedActions);
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredActions(allActions);
      return;
    }

    const filtered = allActions.filter(action => {
      const hiveCodeMatch = action.hive_code?.toString().includes(query);
      const hiveNameMatch = action.hive_name
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const scientificNameMatch = action.bee_species_scientific_name
        ?.toLowerCase()
        .includes(query.toLowerCase());
      return hiveCodeMatch || hiveNameMatch || scientificNameMatch;
    });

    setFilteredActions(filtered);
  };

  const renderActionDetails = action => {
    const getIconByType = type => {
      switch (type) {
        case 'Manejo':
          return 'beekeeper';
        case 'Colheita':
          return 'beehive-outline';
        case 'Transferência':
          return 'transfer';
        case 'Alimentação':
          return 'bee-flower';
        case 'Revisão':
          return 'check-circle-outline';
        case 'transaction':
          return 'swap-horizontal';
        default:
          return 'alert-circle-outline';
      }
    };

    return (
      <View style={styles.actionDetails}>
        <View style={styles.actionHeader}>
          <MaterialCommunityIcons
            name={getIconByType(action.action_type || action.transaction_type)}
            size={24}
            color={colors.primary}
            style={styles.actionIcon}
          />
          <Text style={styles.actionTitle}>
            #{action.hive_code} - {action.bee_species_scientific_name}
          </Text>
        </View>
        <Text style={styles.actionDate}>
          Data:{' '}
          {new Date(
            action.action_date || action.transaction_date,
          ).toLocaleDateString('pt-BR')}
        </Text>
        {action.action_type === 'Manejo' && (
          <Text style={styles.actionText}>
            <Text style={styles.actionLabel}>Ação: </Text>
            {action.hive_maintenance?.action || 'Nenhuma ação registrada.'}
          </Text>
        )}
        {action.action_type === 'Colheita' && (
          <>
            <Text style={styles.actionText}>
              <Text style={styles.actionLabel}>Mel: </Text>
              {action.hive_harvest?.qt_honey || 0}g
            </Text>
            <Text style={styles.actionText}>
              <Text style={styles.actionLabel}>Pólen: </Text>
              {action.hive_harvest?.qt_pollen || 0}g
            </Text>
          </>
        )}
        {action.action_type === 'Revisão' && (
          <Text style={styles.actionText}>
            <Text style={styles.actionLabel}>Rainha localizada: </Text>
            {action.hive_inspection?.queen_located ? 'Sim' : 'Não'}
          </Text>
        )}
        {action.transaction_type === 'transaction' && (
          <>
            <Text style={styles.actionText}>
              <Text style={styles.actionLabel}>Tipo: </Text>
              {action.transaction_type}
            </Text>
            {action.value && (
              <Text style={styles.actionText}>
                <Text style={styles.actionLabel}>Valor: </Text>
                R$ {action.value}
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    fetchAllActions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por código, nome ou nome científico"
          placeholderTextColor={colors.secondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={colors.primary}
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {filteredActions.length > 0 ? (
          filteredActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate('Hive', {id: action.hive_id})}>
              {renderActionDetails(action)}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>Nenhuma ação encontrada.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ActionHistory;
