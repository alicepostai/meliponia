import { BeeSpecies } from '@/types/ConstantsTypes';
import { species as beeSpeciesData } from '@/constants/BeeSpeciesList';
import { logger } from '@/utils/logger';
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    logger.error('helpers.formatDate: Falha ao formatar data:', error);
    return '';
  }
};
export const getBeeNameByScientificName = (
  scientificName: string | null | undefined,
): string | null => {
  if (!scientificName) return null;
  const bee = beeSpeciesData.find(
    (s: BeeSpecies) => s.scientificName.toLowerCase() === scientificName.toLowerCase(),
  );
  return bee ? bee.name : null;
};
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    logger.error('helpers.formatDateTime: Falha ao formatar data e hora:', error);
    return '';
  }
};
export const formatDateWithWeekdayAndTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' });
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
    const formattedDateTime = formatDateTime(dateObj);
    return `${capitalizedWeekday} - ${formattedDateTime}`;
  } catch (error) {
    logger.error('helpers.formatDateWithWeekdayAndTime: Falha ao formatar data com dia da semana:', error);
    return '';
  }
};
export const getBeeNameById = (id: number | null | undefined): string => {
  if (id === null || id === undefined) return 'ID inválido';
  const bee = beeSpeciesData.find((s: BeeSpecies) => s.id === id);
  return bee ? bee.name : 'Espécie Desconhecida';
};
export const getBeeImageUrlById = (id: number | null | undefined): string => {
  const placeholderUrl =
    'https://abelha.org.br/wp-content/uploads/2023/09/imagem-nao-disponivel.png';
  if (id === null || id === undefined) return placeholderUrl;
  const bee = beeSpeciesData.find((s: BeeSpecies) => s.id === id);
  return bee?.imageUrl || placeholderUrl;
};
export const getReserveLevelText = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Não informado';
  switch (value) {
    case 1:
      return 'Baixa';
    case 2:
      return 'Média';
    case 3:
      return 'Boa';
    case 4:
      return 'Ótima';
    default:
      return 'Desconhecido';
  }
};
export const getTimelineIconName = (type: string | undefined | null): string => {
  if (!type) return 'help-circle-outline';
  const icons: { [key: string]: string } = {
    Alimentação: 'bee-flower',
    Colheita: 'beehive-outline',
    Revisão: 'check-circle-outline',
    Manejo: 'beekeeper',
    Transferência: 'transfer',
    'Divisão de Colmeia': 'call-split',
    'Divisão Origem': 'source-branch',
    Venda: 'currency-usd',
    Doação: 'gift-outline',
    Perda: 'alert-circle-outline',
  };
  return icons[type] || 'alert-circle-outline';
};
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};
export const formatWeightKg = (valueGrams: number | null | undefined): string => {
  if (valueGrams === null || valueGrams === undefined || isNaN(valueGrams)) {
    return '0.00 kg';
  }
  const kg = valueGrams / 1000;
  return `${kg.toFixed(2).replace('.', ',')} kg`;
};
export const formatWeightGrams = (valueGrams: number | null | undefined): string => {
  if (valueGrams === null || valueGrams === undefined || isNaN(valueGrams)) {
    return '0g';
  }
  return `${valueGrams.toFixed(0)}g`;
};
export const capitalizeFirstLetter = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getEndOfToday = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};
