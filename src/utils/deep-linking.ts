export class DeepLinkingUtils {
  static isSupabaseRecoveryLink(url: string): boolean {
    return url.includes('supabase.co/auth/v1/verify') && url.includes('type=recovery');
  }

  static extractTokenFromSupabaseUrl(url: string): {
    token: string | null;
    type: string | null;
    redirectTo: string | null;
  } {
    try {
      console.log('DeepLinkingUtils: Extraindo dados da URL:', url);

      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      const type = urlObj.searchParams.get('type');
      const redirectTo = urlObj.searchParams.get('redirect_to');

      console.log('DeepLinkingUtils: Dados extraídos:', {
        hasToken: !!token,
        tokenLength: token?.length,
        type,
        redirectTo,
      });

      return {
        token,
        type,
        redirectTo,
      };
    } catch (error) {
      console.error('Erro ao extrair token da URL:', error);
      return { token: null, type: null, redirectTo: null };
    }
  }

  static isAppDeepLink(url: string): boolean {
    return url.startsWith('meliponia://');
  }

  static async processPasswordRecoveryLink(
    url: string,
    supabase: any,
    router: any,
  ): Promise<boolean> {
    console.log('DeepLinkingUtils: Processando link de recuperação:', url);

    if (!this.isSupabaseRecoveryLink(url)) {
      console.log('DeepLinkingUtils: Não é um link de recuperação válido');
      return false;
    }

    const { token, type } = this.extractTokenFromSupabaseUrl(url);

    if (!token || type !== 'recovery') {
      console.error('DeepLinkingUtils: Token ou tipo inválido');
      router.push('/(auth)/reset-password?error=invalid_token');
      return false;
    }

    try {
      console.log('DeepLinkingUtils: Primeira tentativa - verifyOtp com token_hash');

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (error) {
        console.warn('DeepLinkingUtils: Erro na primeira tentativa:', error.message);

        const errorMsg = error.message.toLowerCase();
        if (
          errorMsg.includes('expired') ||
          errorMsg.includes('invalid') ||
          errorMsg.includes('token')
        ) {
          router.push('/(auth)/reset-password?error=token_expired');
          return false;
        }

        console.log('DeepLinkingUtils: Segunda tentativa - exchangeCodeForSession');
        try {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(token);

          if (exchangeError) {
            console.error('DeepLinkingUtils: Erro na segunda tentativa:', exchangeError.message);
            router.push('/(auth)/reset-password?error=exchange_failed');
            return false;
          }

          if (exchangeData.session) {
            console.log('DeepLinkingUtils: Sucesso na segunda tentativa');
            router.push('/(auth)/reset-password?token_verified=true');
            return true;
          }
        } catch (exchangeErr) {
          console.error('DeepLinkingUtils: Erro na troca de código:', exchangeErr);
        }

        router.push('/(auth)/reset-password?error=all_methods_failed');
        return false;
      }

      if (data.session) {
        console.log('DeepLinkingUtils: Sucesso na primeira tentativa');
        router.push('/(auth)/reset-password?token_verified=true');
        return true;
      } else {
        console.log('DeepLinkingUtils: Verificação bem-sucedida mas sem sessão');
        router.push('/(auth)/reset-password?error=no_session');
        return false;
      }
    } catch (error) {
      console.error('DeepLinkingUtils: Erro inesperado:', error);
      router.push('/(auth)/reset-password?error=unexpected_error');
      return false;
    }
  }
}
