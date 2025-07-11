import * as Yup from 'yup';
import { getEndOfToday } from './helpers';

export const CommonValidations = {
  required: (message = 'Campo obrigatório') => Yup.string().required(message),
  email: () => Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: (minLength = 8) =>
    Yup.string()
      .min(minLength, `Senha deve ter pelo menos ${minLength} caracteres`)
      .max(128, 'Senha deve ter no máximo 128 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número',
      )
      .matches(
        /^[a-zA-Z0-9@$!%*?&._#+-]+$/,
        'Senha pode conter apenas letras, números e os símbolos: @$!%*?&._#+-',
      )
      .test(
        'no-weak-patterns',
        'Evite sequências simples como "123" ou "abc" e repetições excessivas',
        value => {
          if (!value) return false;

          const numSequences =
            /0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210/;
          if (numSequences.test(value)) return false;

          const alphaSequences =
            /abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kjih|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba/;
          if (alphaSequences.test(value.toLowerCase())) return false;

          const repeatedChars = /(.)\1{4,}/;
          if (repeatedChars.test(value)) return false;

          const keyboardPatterns = /qwerty|asdfgh|zxcvbn|qwertz|azerty|123456|654321/;
          if (keyboardPatterns.test(value.toLowerCase())) return false;

          return true;
        },
      )
      .test('no-common-passwords', 'Senha muito comum. Tente uma combinação mais única', value => {
        if (!value) return false;

        const commonPasswords = [
          'password',
          'senha123',
          '12345678',
          'qwerty123',
          'abc12345',
          'admin123',
          'meliponia123',
          'password123',
          'senha@123',
        ];

        return !commonPasswords.some(common => value.toLowerCase() === common.toLowerCase());
      })
      .test(
        'character-variety',
        'Para maior segurança, use pelo menos 3 tipos diferentes de caracteres',
        value => {
          if (!value) return false;

          let characterTypes = 0;
          if (/[a-z]/.test(value)) characterTypes++;
          if (/[A-Z]/.test(value)) characterTypes++;
          if (/[0-9]/.test(value)) characterTypes++;
          if (/[@$!%*?&._#+-]/.test(value)) characterTypes++;

          return characterTypes >= 3;
        },
      )
      .required('Senha é obrigatória'),
  confirmPassword: () =>
    Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
      .required('Confirmação de senha é obrigatória'),
  hiveCode: () =>
    Yup.string()
      .max(20, 'Código deve ter no máximo 20 caracteres')
      .required('Código da colmeia é obrigatório'),
  currency: () => Yup.string().matches(/^[0-9]+([,.][0-9]{1,2})?$/, 'Valor inválido'),
  weight: () => Yup.string().matches(/^[0-9]+([,.][0-9]{1,3})?$/, 'Peso inválido'),
  coordinates: () => ({
    latitude: Yup.number().min(-90, 'Latitude inválida').max(90, 'Latitude inválida').nullable(),
    longitude: Yup.number()
      .min(-180, 'Longitude inválida')
      .max(180, 'Longitude inválida')
      .nullable(),
  }),
  date: () =>
    Yup.date().max(getEndOfToday(), 'Data não pode ser futura').required('Data é obrigatória'),
  dateOptional: () => Yup.date().max(getEndOfToday(), 'Data não pode ser futura').nullable(),
  text: (maxLength = 500) =>
    Yup.string().max(maxLength, `Texto deve ter no máximo ${maxLength} caracteres`).nullable(),
  textRequired: (maxLength = 500) =>
    Yup.string()
      .max(maxLength, `Texto deve ter no máximo ${maxLength} caracteres`)
      .required('Campo obrigatório'),
  conditionalCurrency: (condition: string, conditionValue: any) =>
    Yup.string().when(condition, {
      is: conditionValue,
      then: schema =>
        schema
          .required('Valor é obrigatório')
          .matches(/^[0-9]+([,.][0-9]{1,2})?$/, 'Valor inválido'),
      otherwise: schema => schema.nullable(),
    }),
  atLeastOne: (fields: string[], message = 'Selecione pelo menos uma opção') =>
    Yup.mixed().test('at-least-one', message, function () {
      const values = this.parent;
      return fields.some(field => values[field]);
    }),
};

export const CommonSchemas = {
  coordinates: Yup.object(CommonValidations.coordinates()),
  hiveBase: Yup.object({
    species: Yup.object().required('Espécie é obrigatória'),
    state: Yup.object().required('Estado é obrigatório'),
    boxType: Yup.object().required('Tipo de caixa é obrigatório'),
    hiveOrigin: Yup.object().required('Forma de aquisição é obrigatória'),
    acquisitionDate: CommonValidations.date(),
    code: CommonValidations.hiveCode(),
    description: CommonValidations.text(),
    purchaseValue: CommonValidations.conditionalCurrency('hiveOrigin.name', 'Compra'),
    latitude: Yup.number().min(-90).max(90).nullable(),
    longitude: Yup.number().min(-180).max(180).nullable(),
  }),
  actionBase: Yup.object({
    actionDate: CommonValidations.date(),
    observation: CommonValidations.text(),
  }),
  harvestValidation: Yup.object({
    harvestHoney: Yup.boolean(),
    harvestPollen: Yup.boolean(),
    harvestPropolis: Yup.boolean(),
    honeyQuantity: Yup.string().when('harvestHoney', {
      is: true,
      then: schema => schema.required('Quantidade é obrigatória'),
      otherwise: schema => schema.nullable(),
    }),
    pollenQuantity: Yup.string().when('harvestPollen', {
      is: true,
      then: schema => schema.required('Quantidade é obrigatória'),
      otherwise: schema => schema.nullable(),
    }),
    propolisQuantity: Yup.string().when('harvestPropolis', {
      is: true,
      then: schema => schema.required('Quantidade é obrigatória'),
      otherwise: schema => schema.nullable(),
    }),
  }).test(
    'at-least-one-harvest',
    'Selecione pelo menos um item para colher.',
    values => !!(values.harvestHoney || values.harvestPollen || values.harvestPropolis),
  ),
};

export const ActionValidationSchemas = {
  feeding: Yup.object().shape({
    actionDate: CommonValidations.date(),
    foodType: Yup.string().required('Tipo de alimento é obrigatório'),
    otherFoodType: Yup.string().when('foodType', {
      is: 'Outro',
      then: schema => schema.required('Especifique o alimento').trim(),
      otherwise: schema => schema.nullable(),
    }),
    observation: CommonValidations.text(),
  }),
  harvest: Yup.object()
    .shape({
      actionDate: CommonValidations.date(),
      harvestHoney: Yup.boolean(),
      harvestPollen: Yup.boolean(),
      harvestPropolis: Yup.boolean(),
      honeyQuantity: Yup.string().when('harvestHoney', {
        is: true,
        then: schema => schema.required('Quantidade é obrigatória'),
        otherwise: schema => schema.nullable(),
      }),
      pollenQuantity: Yup.string().when('harvestPollen', {
        is: true,
        then: schema => schema.required('Quantidade é obrigatória'),
        otherwise: schema => schema.nullable(),
      }),
      propolisQuantity: Yup.string().when('harvestPropolis', {
        is: true,
        then: schema => schema.required('Quantidade é obrigatória'),
        otherwise: schema => schema.nullable(),
      }),
      observation: CommonValidations.text(),
    })
    .test(
      'at-least-one-harvest',
      'Selecione pelo menos um item para colher.',
      values => !!(values.harvestHoney || values.harvestPollen || values.harvestPropolis),
    ),
  inspection: Yup.object().shape({
    actionDate: CommonValidations.date(),
    queenLocated: Yup.boolean().required('Este campo é obrigatório.'),
    queenLaying: Yup.boolean().required('Este campo é obrigatório.'),
    pestsOrDiseases: Yup.boolean().required('Este campo é obrigatório.'),
    honeyReserve: Yup.number().min(1).max(4).required('Reserva de mel é obrigatória.'),
    pollenReserve: Yup.number().min(1).max(4).required('Reserva de pólen é obrigatória.'),
    observation: CommonValidations.text(),
  }),
  maintenance: Yup.object().shape({
    actionDate: CommonValidations.date(),
    action: Yup.string().required('A ação realizada é obrigatória').trim(),
    observation: CommonValidations.text(),
  }),
  transfer: Yup.object().shape({
    actionDate: CommonValidations.date(),
    boxType: Yup.object().nullable().required('Modelo de caixa de destino é obrigatório'),
    observation: CommonValidations.text(),
  }),
  outgoing: Yup.object().shape({
    outgoingType: Yup.string()
      .oneOf(['Doação', 'Venda', 'Perda'])
      .required('Tipo é obrigatório')
      .nullable(),
    transactionDate: CommonValidations.date(),
    reason: Yup.string().when('outgoingType', {
      is: 'Perda',
      then: schema => schema.required('Motivo é obrigatório').trim(),
      otherwise: schema => schema.trim().nullable(),
    }),
    donatedOrSoldTo: Yup.string().when('outgoingType', {
      is: (type: string | null) => type === 'Doação' || type === 'Venda',
      then: schema => schema.required('"Para Quem" é obrigatório').trim(),
      otherwise: schema => schema.trim().nullable(),
    }),
    amount: Yup.string().when('outgoingType', {
      is: 'Venda',
      then: schema =>
        schema
          .required('Valor é obrigatório')
          .matches(/^[0-9]+([,.][0-9]{1,2})?$/, 'Valor inválido'),
      otherwise: schema => schema.nullable(),
    }),
    observation: CommonValidations.text(),
    contact: CommonValidations.text(),
  }),
};
