import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {supabase} from '../../../services/supabase';
import {species} from '../../../constants/lists/BeeSpeciesList';
import styles from './styles';
import {Divider, IconButton} from 'react-native-paper';
import {colors} from '../../../utils/Colors';

const Hive = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params;
  const [hiveData, setHiveData] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [manejos, setManejos] = useState([]);
  const [isOptionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const fetchHiveData = async () => {
    const {data, error} = await supabase
      .from('hive')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar dados da colmeia:', error.message);
    } else {
      setHiveData(data);
    }
  };

  const fetchManejos = async () => {
    const {data: hiveActions, error: hiveActionsError} = await supabase
      .from('hive_action')
      .select('*')
      .eq('hive_id', id)
      .order('action_date', {ascending: false})
      .order('created_at', {ascending: false});

    if (hiveActionsError) {
      console.error('Erro ao buscar hive_actions:', hiveActionsError.message);
      return;
    }

    const {data: hiveTransactions, error: hiveTransactionsError} =
      await supabase
        .from('hive_transaction')
        .select('*')
        .eq('hive_id', id)
        .order('transaction_date', {ascending: false})
        .order('created_at', {ascending: false});

    if (hiveTransactionsError) {
      console.error(
        'Erro ao buscar hive_transactions:',
        hiveTransactionsError.message,
      );
      return;
    }

    const manejosCompletos = await Promise.all(
      hiveActions.map(async action => {
        let relatedData = {};

        switch (action.action_type) {
          case 'Alimentação':
            const {data: feeding, error: feedingError} = await supabase
              .from('hive_feeding')
              .select('*')
              .eq('id', action.action_id)
              .single();

            if (feedingError) {
              console.error(
                'Erro ao buscar hive_feeding:',
                feedingError.message,
              );
            } else {
              relatedData = {hive_feeding: feeding};
            }
            break;

          case 'Colheita':
            const {data: harvest, error: harvestError} = await supabase
              .from('hive_harvest')
              .select('*')
              .eq('id', action.action_id)
              .single();

            if (harvestError) {
              console.error(
                'Erro ao buscar hive_harvest:',
                harvestError.message,
              );
            } else {
              relatedData = {hive_harvest: harvest};
            }
            break;

          case 'Revisão':
            const {data: inspection, error: inspectionError} = await supabase
              .from('hive_inspection')
              .select('*')
              .eq('id', action.action_id)
              .single();

            if (inspectionError) {
              console.error(
                'Erro ao buscar hive_inspection:',
                inspectionError.message,
              );
            } else {
              relatedData = {hive_inspection: inspection};
            }
            break;

          case 'Manejo':
            const {data: maintenance, error: maintenanceError} = await supabase
              .from('hive_maintenance')
              .select('*')
              .eq('id', action.action_id)
              .single();

            if (maintenanceError) {
              console.error(
                'Erro ao buscar hive_maintenance:',
                maintenanceError.message,
              );
            } else {
              relatedData = {hive_maintenance: maintenance};
            }
            break;

          case 'Transferência':
            const {data: hive, error: hiveError} = await supabase
              .from('hive')
              .select('box_type')
              .eq('id', action.hive_id)
              .single();

            if (hiveError) {
              console.error('Erro ao buscar hive:', hiveError.message);
            } else {
              relatedData = {hive: hive};
            }
            break;

          default:
            relatedData = {};
        }

        return {
          ...action,
          ...relatedData,
          type: 'action',
        };
      }),
    );

    const transacoesCompletas = hiveTransactions.map(transaction => ({
      ...transaction,
      type: 'transaction',
    }));

    const allManejos = [...manejosCompletos, ...transacoesCompletas].sort(
      (a, b) => {
        const dateA = a.action_date || a.transaction_date;
        const dateB = b.action_date || b.transaction_date;
        return new Date(dateB) - new Date(dateA);
      },
    );

    setManejos(allManejos);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHiveData();
      fetchManejos();
    }, [id]),
  );

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão de Câmera',
            message: 'Este aplicativo precisa de acesso à câmera.',
            buttonNeutral: 'Pergunte-me depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert('Permissão de câmera negada!');
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a câmera');
      } else if (response.error) {
        console.log('Erro na câmera: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.error) {
        console.log('Erro na galeria: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Escolha uma opção',
      'Deseja tirar uma foto ou selecionar da galeria?',
      [
        {text: 'Tirar Foto', onPress: takePhoto},
        {text: 'Escolher da Galeria', onPress: selectImage},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const getBeeNameById = id => {
    const bee = species.find(s => s.id === id);
    return bee ? bee.name : 'Espécie não encontrada';
  };

  const getBeeImageById = id => {
    const bee = species.find(s => s.id === id);
    return bee ? bee.imageUrl : 'Espécie não encontrada';
  };

  const handleOptionSelect = option => {
    navigation.navigate('mainApp', {screen: option, params: {hiveId: id}});
    setMenuVisible(false);
  };

  const deleteHive = async () => {
    try {
      Alert.alert(
        'Excluir Colmeia',
        'Tem certeza de que deseja excluir a colmeia? Esta ação não pode ser desfeita.',
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: async () => {
              await supabase.from('hive_action').delete().eq('hive_id', id);
              await supabase.from('hive_feeding').delete().eq('hive_id', id);
              await supabase.from('hive_harvest').delete().eq('hive_id', id);
              await supabase.from('hive_inspection').delete().eq('hive_id', id);
              await supabase
                .from('hive_maintenance')
                .delete()
                .eq('hive_id', id);
              await supabase
                .from('hive_transaction')
                .delete()
                .eq('hive_id', id);

              const {error} = await supabase.from('hive').delete().eq('id', id);

              if (error) {
                console.error('Erro ao excluir colmeia:', error.message);
                alert('Erro ao excluir a colmeia.');
              } else {
                alert('Colmeia excluída com sucesso!');
                navigation.goBack();
              }
            },
          },
        ],
        {cancelable: true},
      );
    } catch (error) {
      console.error('Erro ao excluir colmeia:', error.message);
      alert('Erro ao excluir a colmeia.');
    }
  };

  const deleteAction = async actionId => {
    try {
      Alert.alert(
        'Excluir Registro',
        'Tem certeza de que deseja excluir o registro?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Excluir',
            onPress: async () => {
              const {error} = await supabase
                .from('hive_action')
                .delete()
                .eq('id', actionId);

              if (error) {
                console.error('Erro ao excluir ação:', error.message);
                alert('Erro ao excluir a ação.');
              } else {
                alert('Ação excluída com sucesso!');
                fetchManejos();
              }
            },
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    } catch (error) {
      console.error('Erro ao excluir ação:', error.message);
      alert('Erro ao excluir a ação.');
    }
  };

  const renderManejoDetails = manejo => {
    if (manejo.type === 'action') {
      switch (manejo.action_type) {
        case 'Manejo':
          return manejo.hive_maintenance?.action ? (
            <Text style={styles.manejoObservation}>
              Ação: {manejo.hive_maintenance.action}
            </Text>
          ) : (
            <Text style={styles.manejoObservation}>
              Nenhuma ação registrada.
            </Text>
          );
        case 'Transferência':
          return manejo.hive?.box_type ? (
            <Text style={styles.manejoObservation}>
              Transferido para: {manejo.hive.box_type}
            </Text>
          ) : (
            <Text style={styles.manejoObservation}>
              Nenhum tipo de caixa registrado.
            </Text>
          );
        case 'Colheita':
          return (
            <>
              {manejo.hive_harvest?.qt_honey && (
                <Text style={styles.manejoObservation}>
                  Mel: {manejo.hive_harvest.qt_honey} gramas
                </Text>
              )}
              {manejo.hive_harvest?.qt_pollen && (
                <Text style={styles.manejoObservation}>
                  Pólen: {manejo.hive_harvest.qt_pollen} gramas
                </Text>
              )}
              {manejo.hive_harvest?.qt_propolis && (
                <Text style={styles.manejoObservation}>
                  Própolis: {manejo.hive_harvest.qt_propolis} gramas
                </Text>
              )}
              {!manejo.hive_harvest?.qt_honey &&
                !manejo.hive_harvest?.qt_pollen &&
                !manejo.hive_harvest?.qt_propolis && (
                  <Text style={styles.manejoObservation}>
                    Nenhuma colheita registrada.
                  </Text>
                )}
            </>
          );
        case 'Alimentação':
          return manejo.hive_feeding?.food_type ? (
            <Text style={styles.manejoObservation}>
              Alimento: {manejo.hive_feeding.food_type}
            </Text>
          ) : (
            <Text style={styles.manejoObservation}>
              Nenhum alimento registrado.
            </Text>
          );
        case 'Revisão':
          return (
            <>
              {manejo.hive_inspection?.queen_located !== undefined && (
                <Text style={styles.manejoObservation}>
                  Rainha localizada:{' '}
                  {manejo.hive_inspection.queen_located ? 'Sim' : 'Não'}
                </Text>
              )}
              {manejo.hive_inspection?.queen_laying !== undefined && (
                <Text style={styles.manejoObservation}>
                  Postura: {manejo.hive_inspection.queen_laying ? 'Sim' : 'Não'}
                </Text>
              )}
              {manejo.hive_inspection?.pests_or_diseases && (
                <Text style={styles.manejoObservation}>
                  Pragas ou doenças:{' '}
                  {manejo.hive_inspection.pests_or_diseases ? 'Sim' : 'Não'}
                </Text>
              )}
              {manejo.hive_inspection?.honey_reserve && (
                <Text style={styles.manejoObservation}>
                  Reserva de mel: {manejo.hive_inspection.honey_reserve}
                </Text>
              )}
              {manejo.hive_inspection?.pollen_reserve && (
                <Text style={styles.manejoObservation}>
                  Reserva de pólen: {manejo.hive_inspection.pollen_reserve}
                </Text>
              )}
              {!manejo.hive_inspection?.queen_located &&
                !manejo.hive_inspection?.queen_laying &&
                !manejo.hive_inspection?.pests_or_diseases &&
                !manejo.hive_inspection?.honey_reserve &&
                !manejo.hive_inspection?.pollen_reserve && (
                  <Text style={styles.manejoObservation}>
                    Nenhum detalhe de revisão registrado.
                  </Text>
                )}
            </>
          );
        default:
          return (
            <Text style={styles.manejoObservation}>
              Tipo de ação desconhecido.
            </Text>
          );
      }
    } else if (manejo.type === 'transaction') {
      return (
        <>
          <Text style={styles.manejoObservation}>
            Tipo de transação: {manejo.transaction_type}
          </Text>
          {manejo.value && (
            <Text style={styles.manejoObservation}>
              Valor: {manejo.value} Reais
            </Text>
          )}
          {manejo.reason && (
            <Text style={styles.manejoObservation}>
              Motivo: {manejo.reason}
            </Text>
          )}
          {manejo.donated_or_sold_to && (
            <Text style={styles.manejoObservation}>
              Doado/Vendido para: {manejo.donated_or_sold_to}
            </Text>
          )}
          {manejo.new_owner_contact && (
            <Text style={styles.manejoObservation}>
              Contato do novo proprietário: {manejo.new_owner_contact}
            </Text>
          )}
        </>
      );
    }
  };

  if (!hiveData) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.optionsMenuButton}
            onPress={() => setOptionsMenuVisible(!isOptionsMenuVisible)}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>

          {isOptionsMenuVisible && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => handleOptionSelect('hiveOutgoing')}>
                <MaterialCommunityIcons
                  name="home-export-outline"
                  size={20}
                  color="#333"
                />
                <Text style={styles.menuText}>Registrar saída</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => handleOptionSelect('hiveEdit')}>
                <MaterialCommunityIcons
                  name="square-edit-outline"
                  size={20}
                  color="#333"
                />
                <Text style={styles.menuText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuOption} onPress={deleteHive}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={20}
                  color="#333"
                />
                <Text style={styles.menuText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{uri: image}} style={styles.image} />
          ) : (
            <Image
              source={{uri: getBeeImageById(hiveData.bee_species_id)}}
              style={styles.image}
            />
          )}

          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={showImagePickerOptions}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>
            #{hiveData.hive_code} - {getBeeNameById(hiveData.bee_species_id)}
          </Text>
          <Text style={styles.subtitle}>
            {hiveData.bee_species_scientific_name}
          </Text>
          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Origem: </Text>
              <Text style={styles.infoBold}>{hiveData.hive_origin}</Text>
              <Text style={styles.infoLabel}> em </Text>
              <Text style={styles.infoBold}>
                {new Date(hiveData.acquisition_date).toLocaleDateString(
                  'pt-BR',
                )}
              </Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Estado de origem: </Text>
              <Text style={styles.infoBold}>{hiveData.origin_state_loc}</Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Caixa: </Text>
              <Text style={styles.infoBold}>{hiveData.box_type}</Text>
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.manejosContainer}>
          {manejos.map((manejo, index) => (
            <View key={manejo.id}>
              <View style={styles.manejoItem}>
                <Text style={styles.manejoDate}>
                  {`${new Date(
                    manejo.action_date || manejo.transaction_date,
                  ).toLocaleDateString('pt-BR', {
                    weekday: 'short',
                  })} - ${new Date(
                    manejo.action_date || manejo.transaction_date,
                  ).toLocaleDateString('pt-BR')}`}
                </Text>
                <IconButton
                  icon="delete"
                  size={20}
                  color={colors.honey}
                  onPress={() => deleteAction(manejo.id)}
                  style={styles.deleteButton}
                />
                <View style={styles.manejoContent}>
                  <MaterialCommunityIcons
                    name={getIconByType(manejo.action_type)}
                    size={24}
                    color="#000"
                  />
                  <View style={styles.manejoTextContainer}>
                    <Text style={styles.manejoType}>{manejo.action_type}</Text>
                    {renderManejoDetails(manejo)}
                  </View>
                </View>
              </View>
              {index < manejos.length - 1 && (
                <Divider style={styles.manejoDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setMenuVisible(!isMenuVisible)}>
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={styles.menuOptions}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleOptionSelect('hiveMaintenance')}>
              <MaterialCommunityIcons name="beekeeper" size={20} color="#333" />
              <Text style={styles.menuText}>Manejo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleOptionSelect('hiveHarvest')}>
              <MaterialCommunityIcons
                name="beehive-outline"
                size={20}
                color="#333"
              />
              <Text style={styles.menuText}>Colheita</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleOptionSelect('hiveTransfer')}>
              <MaterialCommunityIcons name="transfer" size={20} color="#333" />
              <Text style={styles.menuText}>Transferência</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleOptionSelect('hiveFeeding')}>
              <MaterialCommunityIcons
                name="bee-flower"
                size={20}
                color="#333"
              />
              <Text style={styles.menuText}>Alimentação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleOptionSelect('hiveInspection')}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="#333"
              />
              <Text style={styles.menuText}>Revisão</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

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

export default Hive;
