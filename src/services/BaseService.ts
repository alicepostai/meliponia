import { supabase } from './supabase';
import {
  createErrorHandler,
  createDataErrorHandler,
  checkOfflineAndHandle,
} from '@/utils/error-handler';
import { offlineSyncService, OfflineAction } from './OfflineSyncService';
import { PostgrestError } from '@/types/supabase';

export abstract class BaseService {
  protected serviceName: string;
  protected handleError: ReturnType<typeof createErrorHandler>;
  protected handleDataError: ReturnType<typeof createDataErrorHandler>;
  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.handleError = createErrorHandler(serviceName);
    this.handleDataError = createDataErrorHandler(serviceName);
  }

  protected async getAuthenticatedUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado.');
    return user;
  }

  protected async handleOfflineAction<T>(
    actionType: OfflineAction['type'],
    payload: any,
    forceOnline: boolean,
    onlineAction: () => Promise<T>,
  ): Promise<T | { success: true; pendingActionId: string }> {
    const offlineResult = await checkOfflineAndHandle(forceOnline, async () => {
      const offlineAction = await offlineSyncService.queueAction(actionType, payload);
      return { success: true, pendingActionId: offlineAction.id };
    });
    if (offlineResult) return offlineResult;
    return await onlineAction();
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    context?: string,
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      const { data, error } = await queryFn();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      const { error: handledError } = this.handleDataError(error, context);
      return { data: null, error: handledError };
    }
  }

  protected async executeMutation<T>(
    mutationFn: () => Promise<{ data?: T; error?: any }>,
    context?: string,
  ): Promise<{ success: boolean; data?: T; error?: PostgrestError }> {
    try {
      const result = await mutationFn();
      if (result.error) throw result.error;
      return { success: true, data: result.data };
    } catch (error) {
      const { error: handledError } = this.handleError(error, context);
      return { success: false, error: handledError };
    }
  }

  protected async insertWithSelect<T>(
    table: string,
    data: any,
    context?: string,
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    return this.executeQuery(
      async () => await supabase.from(table).insert([data]).select().single(),
      context,
    );
  }

  protected async updateWithSelect<T>(
    table: string,
    data: any,
    condition: Record<string, any>,
    context?: string,
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    return this.executeQuery(async () => {
      let query = supabase.from(table).update(data);
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      return await query.select().single();
    }, context);
  }

  protected async deleteRecord(
    table: string,
    condition: Record<string, any>,
    context?: string,
  ): Promise<{ success: boolean; error?: PostgrestError }> {
    return this.executeMutation(async () => {
      let query = supabase.from(table).delete();
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      return await query;
    }, context);
  }

  protected async fetchRecords<T>(
    table: string,
    selectColumns: string = '*',
    filters: Record<string, any> = {},
    orderBy?: { column: string; ascending?: boolean },
    context?: string,
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> {
    return this.executeQuery(async () => {
      let query = supabase.from(table).select(selectColumns);
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }
      return await query;
    }, context);
  }

  protected async fetchSingleRecord<T>(
    table: string,
    selectColumns: string = '*',
    condition: Record<string, any>,
    context?: string,
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    return this.executeQuery(async () => {
      let query = supabase.from(table).select(selectColumns);
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      return await query.single();
    }, context);
  }
}
