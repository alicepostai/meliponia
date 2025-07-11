import { OfflineAction } from './types';

class ServiceRegistry {
  private hiveService: any = null;
  private actionService: any = null;
  private profileService: any = null;
  private offlineSyncService: any = null;

  getHiveService() {
    if (!this.hiveService) {
      this.hiveService = require('./HiveService').hiveService;
    }
    return this.hiveService;
  }

  getActionService() {
    if (!this.actionService) {
      this.actionService = require('./ActionService').actionService;
    }
    return this.actionService;
  }

  getProfileService() {
    if (!this.profileService) {
      this.profileService = require('./ProfileService').profileService;
    }
    return this.profileService;
  }

  getOfflineSyncService() {
    if (!this.offlineSyncService) {
      this.offlineSyncService = require('./OfflineSyncService').offlineSyncService;
    }
    return this.offlineSyncService;
  }

  async executeOfflineAction(action: OfflineAction): Promise<any> {
    const { type, payload } = action;

    switch (type) {
      case 'createHive':
        const createResult = await this.getHiveService().createHive(payload.hiveData, true);
        return createResult;
      case 'updateHive': {
        const { hiveId, hiveData } = payload;
        const result = await this.getHiveService().updateHive(hiveId, hiveData);
        return result;
      }
      case 'deleteHive': {
        const { hiveId } = payload;
        const result = await this.getHiveService().deleteHiveCascade(hiveId);
        return result;
      }
      case 'updateProfile': {
        const { userId, profileData } = payload;
        const result = await this.getProfileService().updateProfile(userId, profileData);
        return result;
      }
      case 'deleteAccount': {
        const { userId } = payload;
        const result = await this.getProfileService().deleteAccount(userId);
        return result;
      }
      case 'deleteHiveAction': {
        const { actionId } = payload;
        const result = await this.getActionService().deleteHiveAction(actionId);
        return result;
      }
      case 'createFeedingAction': {
        const { hiveId, feedingData, actionDate } = payload;
        const result = await this.getActionService().createFeedingAction(
          hiveId,
          feedingData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      case 'createHarvestAction': {
        const { hiveId, harvestData, actionDate } = payload;
        const result = await this.getActionService().createHarvestAction(
          hiveId,
          harvestData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      case 'createInspectionAction': {
        const { hiveId, inspectionData, actionDate } = payload;
        const result = await this.getActionService().createInspectionAction(
          hiveId,
          inspectionData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      case 'createMaintenanceAction': {
        const { hiveId, maintenanceData, actionDate } = payload;
        const result = await this.getActionService().createMaintenanceAction(
          hiveId,
          maintenanceData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      case 'createTransferAction': {
        const { hiveId, transferData, actionDate } = payload;
        const result = await this.getActionService().createTransferAction(
          hiveId,
          transferData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      case 'createHiveFromDivision': {
        const { divisionData, motherHives } = payload;
        const result = await this.getActionService().createHiveFromDivision(
          divisionData,
          motherHives,
          true,
        );
        return result;
      }
      case 'createOutgoingTransaction': {
        const { hiveId, outgoingType, transactionData, actionDate } = payload;
        const result = await this.getActionService().createOutgoingTransaction(
          hiveId,
          outgoingType,
          transactionData,
          new Date(actionDate),
          true,
        );
        return result;
      }
      default:
        throw new Error(`Tipo de ação offline não suportado: ${type}`);
    }
  }
}

export const serviceRegistry = new ServiceRegistry();
