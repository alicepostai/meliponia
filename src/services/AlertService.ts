import { AlertProviderRef } from '@/components/modals/alert-provider';

interface ShowErrorOptions {
  title?: string;
  actionText?: string;
  onAction?: () => void;
}

interface ShowSuccessOptions {
  title?: string;
  actionText?: string;
  onAction?: () => void;
}

const translateSupabaseError = (message: string): string => {
  const translations: Record<string, string> = {
    // Autenticação
    'Invalid login credentials': 'E-mail ou senha incorretos',
    'Email not confirmed': 'Confirme seu e-mail antes de fazer login',
    'User already registered': 'Este e-mail já está cadastrado',
    'Email already exists': 'Este e-mail já está cadastrado',
    'Email already taken': 'Este e-mail já está cadastrado',
    'Email already registered': 'Este e-mail já está cadastrado',
    'User with this email already exists': 'Este e-mail já está cadastrado',
    'Email rate limit exceeded': 'Este e-mail já está cadastrado',
    'Rate limit exceeded': 'Este e-mail já está cadastrado',
    'too many requests': 'Este e-mail já está cadastrado',
    'Invalid email': 'E-mail inválido',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'User not found': 'Usuário não encontrado',
    'Token has expired or is invalid':
      'Link de recuperação expirado. Solicite um novo link de recuperação.',
    'Email address not confirmed': 'Confirme seu e-mail para continuar',
    'Invalid refresh token': 'Sessão inválida. Faça login novamente',
    'Too many requests': 'Muitas tentativas. Aguarde um momento antes de tentar novamente',
    'Signup requires valid email': 'É necessário um e-mail válido para cadastro',
    weak_password: 'Senha muito fraca. Use pelo menos 8 caracteres com letras e números',
    'Email link is invalid or has expired':
      'Link do e-mail inválido ou expirado. Solicite um novo link de recuperação.',
    'Token expired': 'Link de recuperação expirado. Solicite um novo link de recuperação.',
    'Invalid token hash': 'Link de recuperação inválido. Solicite um novo link de recuperação.',
    'Token not found': 'Link de recuperação inválido. Solicite um novo link de recuperação.',

    // Banco de dados
    'violates foreign key constraint': 'Este item está sendo usado e não pode ser excluído',
    'duplicate key value': 'Este valor já existe no sistema',
    'permission denied': 'Você não tem permissão para realizar esta ação',
    'row-level security policy': 'Acesso negado. Verifique suas permissões',
    'relation does not exist': 'Tabela não encontrada. Entre em contato com o suporte',
    'column does not exist': 'Campo não encontrado. Entre em contato com o suporte',
    'value too long': 'Valor muito longo para este campo',
    'invalid input syntax': 'Formato de dados inválido',
    'not-null constraint': 'Este campo é obrigatório',
    'check constraint': 'Valor inválido para este campo',
    'violates unique constraint': 'Este valor já existe no sistema',
    'violates check constraint': 'Valor não permitido para este campo',

    // Storage
    'Bucket not found': 'Sistema de arquivos não configurado. Entre em contato com o suporte',
    'Object not found': 'Arquivo não encontrado',
    'The resource already exists': 'Este arquivo já existe',
    'Invalid file type': 'Tipo de arquivo não permitido',
    'File too large': 'Arquivo muito grande',
    'Bucket already exists': 'Sistema de arquivos já configurado',
    AccessDenied: 'Acesso negado ao sistema de arquivos',
    SignatureDoesNotMatch: 'Erro de autenticação no upload',
    'The specified bucket does not exist':
      'Sistema de arquivos não configurado. Entre em contato com o suporte',

    // Rede
    fetch: 'Erro de conexão. Verifique sua internet',
    network: 'Erro de rede. Verifique sua conexão',
    timeout: 'Conexão expirou. Tente novamente',
    'Failed to fetch': 'Erro de conexão. Verifique sua internet',
    NetworkError: 'Erro de rede. Verifique sua conexão',
    'Network request failed': 'Erro de rede. Verifique sua conexão',
    NETWORK_ERROR: 'Erro de rede. Verifique sua conexão',

    // Genéricos
    'Internal server error': 'Erro interno do servidor. Tente novamente',
    'Bad request': 'Requisição inválida. Verifique os dados enviados',
    Unauthorized: 'Não autorizado. Faça login novamente',
    Forbidden: 'Acesso negado',
    'Not found': 'Não encontrado',
    Conflict: 'Conflito de dados. Verifique as informações',
    'Unprocessable entity': 'Dados inválidos. Verifique as informações',
    'Service unavailable': 'Serviço temporariamente indisponível',
    'Gateway timeout': 'Tempo limite excedido. Tente novamente',
    'Connection timeout': 'Tempo limite de conexão. Tente novamente',

    // Erros específicos do app
    'Usuário não autenticado': 'Você precisa fazer login para continuar',
    'Não foi possível obter a localização atual':
      'Erro ao obter localização. Verifique suas permissões',
    'Dados essenciais estão faltando': 'Alguns campos obrigatórios não foram preenchidos',
    'Ocorreu um erro desconhecido': 'Algo deu errado. Tente novamente em alguns instantes',
  };

  const cleanMessage = message.trim();

  if (translations[cleanMessage]) {
    return translations[cleanMessage];
  }

  const lowerMessage = cleanMessage.toLowerCase();
  for (const [english, portuguese] of Object.entries(translations)) {
    if (lowerMessage.includes(english.toLowerCase())) {
      return portuguese;
    }
  }

  if (lowerMessage.includes('email') || lowerMessage.includes('e-mail')) {
    return 'Erro relacionado ao e-mail. Verifique o endereço informado';
  }

  if (lowerMessage.includes('password') || lowerMessage.includes('senha')) {
    return 'Erro relacionado à senha. Verifique se está correta';
  }

  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('internet') ||
    lowerMessage.includes('conexão') ||
    lowerMessage.includes('rede')
  ) {
    return 'Erro de conexão. Verifique sua internet e tente novamente';
  }

  if (
    lowerMessage.includes('permission') ||
    lowerMessage.includes('access') ||
    lowerMessage.includes('denied') ||
    lowerMessage.includes('acesso') ||
    lowerMessage.includes('permissão')
  ) {
    return 'Você não tem permissão para realizar esta ação';
  }

  if (
    lowerMessage.includes('expired') ||
    lowerMessage.includes('expirado') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('limite')
  ) {
    return 'Sessão expirada. Faça login novamente';
  }

  if (
    lowerMessage.includes('bucket') ||
    lowerMessage.includes('storage') ||
    lowerMessage.includes('upload') ||
    lowerMessage.includes('file')
  ) {
    return 'Erro no sistema de arquivos. Entre em contato com o suporte';
  }

  if (
    cleanMessage.length > 100 ||
    (/^[a-zA-Z\s\-_\.,!?()]+$/.test(cleanMessage) &&
      !cleanMessage.includes('ç') &&
      !cleanMessage.includes('ã') &&
      !cleanMessage.includes('õ'))
  ) {
    return 'Ocorreu um erro inesperado. Tente novamente em alguns instantes';
  }

  return cleanMessage || 'Ocorreu um erro inesperado. Tente novamente';
};

class AlertService {
  private static alertProviderRef: AlertProviderRef | null = null;

  static setAlertProviderRef(ref: AlertProviderRef | null) {
    this.alertProviderRef = ref;
  }

  static showError(message: string, options: ShowErrorOptions = {}) {
    const translatedMessage = translateSupabaseError(message);

    let defaultTitle = 'Ops! Algo deu errado';
    const lowerMessage = translatedMessage.toLowerCase();

    if (lowerMessage.includes('e-mail') || lowerMessage.includes('email')) {
      defaultTitle = 'Erro de E-mail';
    } else if (lowerMessage.includes('senha') || lowerMessage.includes('password')) {
      defaultTitle = 'Erro de Senha';
    } else if (
      lowerMessage.includes('conexão') ||
      lowerMessage.includes('internet') ||
      lowerMessage.includes('rede')
    ) {
      defaultTitle = 'Sem Conexão';
    } else if (lowerMessage.includes('permissão') || lowerMessage.includes('acesso')) {
      defaultTitle = 'Acesso Negado';
    } else if (lowerMessage.includes('sessão') || lowerMessage.includes('login')) {
      defaultTitle = 'Sessão Expirada';
    } else if (
      lowerMessage.includes('arquivo') ||
      lowerMessage.includes('upload') ||
      lowerMessage.includes('storage')
    ) {
      defaultTitle = 'Erro de Arquivo';
    } else if (lowerMessage.includes('dados') || lowerMessage.includes('campo')) {
      defaultTitle = 'Dados Inválidos';
    }

    if (this.alertProviderRef) {
      this.alertProviderRef.showError({
        title: options.title || defaultTitle,
        message: translatedMessage,
        actionText: options.actionText || 'Entendi',
        onAction: options.onAction,
      });
    } else {
      console.warn('AlertProvider ref não disponível');
    }
  }

  static showSuccess(message: string, options: ShowSuccessOptions = {}) {
    if (this.alertProviderRef) {
      this.alertProviderRef.showSuccess({
        title: options.title || 'Tudo Certo!',
        message,
        actionText: options.actionText || 'Entendi',
        onAction: options.onAction,
      });
    } else {
      console.warn('AlertProvider ref não disponível');
    }
  }

  static showNetworkError() {
    this.showError('Erro de conexão. Verifique sua internet e tente novamente', {
      title: 'Sem Conexão',
    });
  }

  static showValidationError(message?: string) {
    this.showError(message || 'Preencha todos os campos obrigatórios', {
      title: 'Dados Inválidos',
    });
  }

  static showPermissionError() {
    this.showError('Você não tem permissão para realizar esta ação', {
      title: 'Acesso Negado',
    });
  }

  static showAuthError() {
    this.showError('Sua sessão expirou. Faça login novamente', {
      title: 'Sessão Expirada',
    });
  }
}

export { AlertService, translateSupabaseError };
