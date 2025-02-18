import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppSettings from '../../screens/user/app-settings';
import QRCodes from '../../screens/bee-management/qr-codes';
import HiveRegistration from '../../screens/bee-management/hive-registration';
import Hive from '../../screens/bee-management/hive';
import HiveMaintenance from '../../screens/bee-management/actions/maintenance';
import HiveHasvest from '../../screens/bee-management/actions/harvest';
import HiveTransfer from '../../screens/bee-management/actions/transfer';
import HiveFeeding from '../../screens/bee-management/actions/feeding';
import HiveInspection from '../../screens/bee-management/actions/inspection';
import HiveOutgoing from '../../screens/bee-management/log-outgoing';
import HiveEdit from '../../screens/bee-management/hive-edit';

const MainApp = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="hive" component={Hive} />
      <Stack.Screen name="hiveRegistration" component={HiveRegistration} />
      <Stack.Screen name="qrCodes" component={QRCodes} />
      <Stack.Screen name="appSettings" component={AppSettings} />
      <Stack.Screen name="hiveMaintenance" component={HiveMaintenance} />
      <Stack.Screen name="hiveTransfer" component={HiveTransfer} />
      <Stack.Screen name="hiveHarvest" component={HiveHasvest} />
      <Stack.Screen name="hiveFeeding" component={HiveFeeding} />
      <Stack.Screen name="hiveInspection" component={HiveInspection} />
      <Stack.Screen name="hiveOutgoing" component={HiveOutgoing} />
      <Stack.Screen name="hiveEdit" component={HiveEdit} />
    </Stack.Navigator>
  );
};

export default MainApp;
