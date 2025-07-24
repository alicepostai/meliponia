import { logger } from '@/utils/logger';

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
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      const type = urlObj.searchParams.get('type');
      const redirectTo = urlObj.searchParams.get('redirect_to');

      return { token, type, redirectTo };
    } catch (error) {
      logger.error('DeepLinkingUtils.extractToken: Formato de URL inválido:', error);
      return { token: null, type: null, redirectTo: null };
    }
  }

  static isAppDeepLink(url: string): boolean {
    return url.startsWith('meliponia://');
  }

  static isHiveQRCode(url: string): boolean {
    return url.includes('/hive/') || url.includes('"action":"view_hive"');
  }

  static isTransferQRCode(url: string): boolean {
    return url.includes('/transfer') || url.includes('"action":"transfer_hive"');
  }

  static extractHiveIdFromUrl(url: string): string | null {
    try {
      if (url.includes('/hive/')) {
        const parts = url.split('/hive/');
        return parts[1]?.split('?')[0] || null;
      }

      if (url.includes('"action":"view_hive"')) {
        const parsed = JSON.parse(url);
        return parsed.hiveId || null;
      }

      return null;
    } catch (error) {
      logger.error('DeepLinkingUtils.extractHiveId: Formato de URL ou JSON inválido:', error);
      return null;
    }
  }

  static generateHiveQRData(hiveId: string, hiveCode?: string, speciesName?: string): string {
    const baseUrl = `meliponia://hive/${hiveId}`;

    if (hiveCode || speciesName) {
      const params = new URLSearchParams();
      if (hiveCode) params.append('code', hiveCode);
      if (speciesName) params.append('species', speciesName);
      return `${baseUrl}?${params.toString()}`;
    }

    return baseUrl;
  }

  static generateTransferQRData(
    hiveId: string,
    sourceUserId: string,
    transferType: 'doacao' | 'venda',
    expiresAt?: Date,
  ): string {
    const data = {
      action: 'transfer_hive',
      hiveId,
      sourceUserId,
      transferType,
      expiresAt: expiresAt?.toISOString(),
      createdAt: new Date().toISOString(),
    };

    return JSON.stringify(data);
  }

  static async processPasswordRecoveryLink(
    url: string,
    supabase: any,
    router: any,
  ): Promise<boolean> {
    if (!this.isSupabaseRecoveryLink(url)) {
      return false;
    }

    const { token, type } = this.extractTokenFromSupabaseUrl(url);

    if (!token || type !== 'recovery') {
      logger.error('DeepLinkingUtils.processRecovery: Invalid token or type');
      router.push('/(auth)/reset-password?error=invalid_token');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (error) {
        const errorMsg = error.message.toLowerCase();
        if (
          errorMsg.includes('expired') ||
          errorMsg.includes('invalid') ||
          errorMsg.includes('token')
        ) {
          router.push('/(auth)/reset-password?error=token_expired');
          return false;
        }

        try {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(token);

          if (exchangeError) {
            logger.error('DeepLinkingUtils.processRecovery: Falha na verificação do token:', exchangeError.message);
            router.push('/(auth)/reset-password?error=exchange_failed');
            return false;
          }

          if (exchangeData.session) {
            router.push('/(auth)/reset-password?token_verified=true');
            return true;
          }
        } catch (exchangeErr) {
          logger.error('DeepLinkingUtils.processRecovery: Falha na troca do token:', exchangeErr);
        }

        router.push('/(auth)/reset-password?error=all_methods_failed');
        return false;
      }

      if (data.session) {
        router.push('/(auth)/reset-password?token_verified=true');
        return true;
      } else {
        logger.warn('DeepLinkingUtils.processRecovery: Token verificado mas nenhuma sessão criada');
        router.push('/(auth)/reset-password?error=no_session');
        return false;
      }
    } catch (error) {
      logger.error('DeepLinkingUtils.processRecovery: Erro inesperado:', error);
      router.push('/(auth)/reset-password?error=unexpected_error');
      return false;
    }
  }
}
