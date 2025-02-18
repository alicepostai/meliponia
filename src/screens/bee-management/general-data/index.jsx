import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {supabase} from '../../../services/supabase';
import styles from './styles';

const GeneralData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

  const fetchData = async () => {
    try {
      const {count: enxames} = await supabase
        .from('hive')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId);

      const {data: especiesData} = await supabase
        .from('hive')
        .select('bee_species_id')
        .eq('user_id', userId);
      const especies = new Set(especiesData?.map(item => item.bee_species_id))
        .size;

      const {data: producaoData} = await supabase
        .from('hive_harvest')
        .select('qt_honey, qt_propolis, qt_pollen')
        .eq('user_id', userId);
      const producao = (producaoData || []).reduce(
        (acc, item) => {
          acc.mel += (item.qt_honey || 0) / 1000;
          acc.propolis += (item.qt_propolis || 0) / 1000;
          acc.polen += (item.qt_pollen || 0) / 1000;
          return acc;
        },
        {mel: 0, propolis: 0, polen: 0},
      );

      const {count: comprados} = await supabase
        .from('hive')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('hive_origin', 'Compra');

      const {data: valorComprasData} = await supabase
        .from('hive')
        .select('purchase_value')
        .eq('user_id', userId)
        .eq('hive_origin', 'Compra');
      const valorCompras = (valorComprasData || []).reduce(
        (acc, item) => acc + (item.purchase_value || 0),
        0,
      );

      const {count: vendidos} = await supabase
        .from('hive')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('status', 'Vendido');

      const {data: valorVendasData} = await supabase
        .from('hive_transaction')
        .select('value')
        .eq('user_id', userId)
        .eq('transaction_type', 'Venda');
      const valorVendas = (valorVendasData || []).reduce(
        (acc, item) => acc + (item.value || 0),
        0,
      );

      const {count: totalManejos} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId);

      const {count: revisoes} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('action_type', 'Revisão');

      const {count: transferencias} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('action_type', 'Transferência');

      const {count: divisoes} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('action_type', 'Divisão');

      const {count: alimentacoes} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('action_type', 'Alimentação');

      const {count: colheitas} = await supabase
        .from('hive_action')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('action_type', 'Colheita');

      const {count: doados} = await supabase
        .from('hive')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('status', 'Doado');

      const {count: perdidos} = await supabase
        .from('hive')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId)
        .eq('status', 'Perdido');

      setData({
        enxames,
        especies,
        producao,
        compraVenda: {
          comprados,
          valorCompras,
          vendidos,
          valorVendas,
        },
        manejos: {
          total: totalManejos,
          revisoes,
          transferencias,
          divisoes,
          alimentacoes,
          colheitas,
        },
        doacoes: {
          doados,
          perdidos,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchData();

    const hiveSubscription = supabase
      .channel('hive_changes')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'hive'},
        () => fetchData(),
      )
      .subscribe();

    const hiveHarvestSubscription = supabase
      .channel('hive_harvest_changes')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'hive_harvest'},
        () => fetchData(),
      )
      .subscribe();

    const hiveTransactionSubscription = supabase
      .channel('hive_transaction_changes')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'hive_transaction'},
        () => fetchData(),
      )
      .subscribe();

    const hiveActionSubscription = supabase
      .channel('hive_action_changes')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'hive_action'},
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(hiveSubscription);
      supabase.removeChannel(hiveHarvestSubscription);
      supabase.removeChannel(hiveTransactionSubscription);
      supabase.removeChannel(hiveActionSubscription);
    };
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F9A825" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados dos Enxames</Text>

      {data && (
        <>
          <Section title="Dados dos enxames atuais">
            <DataRow label="Total de Enxames" value={data.enxames} />
            <DataRow label="Espécies diferentes" value={data.especies} />
          </Section>

          <Section title="Produção">
            <DataRow label="Mel" value={`${data.producao.mel.toFixed(2)} kg`} />
            <DataRow
              label="Própolis"
              value={`${data.producao.propolis.toFixed(2)} kg`}
            />
            <DataRow
              label="Pólen"
              value={`${data.producao.polen.toFixed(2)} kg`}
            />
          </Section>

          <Section title="Compra e Venda">
            <DataRow
              label="Enxames comprados"
              value={data.compraVenda.comprados}
            />
            <DataRow
              label="Valor em compras"
              value={`R$ ${(data?.compraVenda?.valorCompras ?? 0).toFixed(2)}`}
            />
            <DataRow
              label="Enxames vendidos"
              value={data.compraVenda.vendidos}
            />
            <DataRow
              label="Valor em vendas"
              value={`R$ ${(data?.compraVenda?.valorVendas ?? 0).toFixed(2)}`}
            />
          </Section>

          <Section title="Manejos (todos enxames)">
            <DataRow label="Total de manejos" value={data.manejos.total} />
            <DataRow label="Revisões" value={data.manejos.revisoes} />
            <DataRow
              label="Transferências"
              value={data.manejos.transferencias}
            />
            <DataRow label="Divisões" value={data.manejos.divisoes} />
            <DataRow label="Alimentações" value={data.manejos.alimentacoes} />
            <DataRow label="Colheitas" value={data.manejos.colheitas} />
          </Section>

          <Section title="Enxames">
            <DataRow label="Enxames doados" value={data.doacoes.doados} />
            <DataRow label="Enxames perdidos" value={data.doacoes.perdidos} />
          </Section>
        </>
      )}
    </ScrollView>
  );
};

const Section = ({title, children}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DataRow = ({label, value}) => (
  <View style={styles.dataRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default GeneralData;
