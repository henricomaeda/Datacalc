import { StackActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import '../Globals';
import {
  Text,
  View,
  Alert,
  Clipboard,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const Cloud = ({ navigation }) => {
  const [backup, setBackup] = useState(null);
  const [restore, setRestore] = useState(null);

  const fetchData = async () => {
    let data = 'Nenhum dado encontrado.';
    const response = await SecureStore.getItemAsync('products');
    if (response && response.trim().length > 0) data = response;
    setBackup(data);
  };

  const clipboard = async (copyToClipboard = true) => {
    if (copyToClipboard) Clipboard.setString(backup);
    else setRestore(await Clipboard.getString());
  };

  const restoreData = () => {
    if (
      !restore ||
      restore.trim().length <= 0 ||
      restore == 'Nenhum dado encontrado.'
    )
      Alert.alert(global.name, 'Nenhum dado encontrado.');
    else if (restore == backup)
      Alert.alert(global.name, 'Dados encontrados no dispositivo.');
    else {
      try {
        const data = JSON.parse(restore);
        if (data.length <= 0)
          Alert.alert(global.name, 'Nenhum dado encontrado.');
        else {
          Alert.alert(global.name, 'Você deseja substituir os dados?', [
            { text: 'Cancelar' },
            {
              text: 'Substituir',
              onPress: () => {
                SecureStore.setItemAsync('products', JSON.stringify(data));
                Alert.alert(global.name, 'Dados restaurados com sucesso!');

                navigation.popToTop();
                navigation.dispatch(StackActions.replace('Main'));
              },
            },
          ]);
        }
      } catch (e) {
        console.error('ERRO: ' + e);
        Alert.alert(global.name, 'Não foi possível restaurar.');
      }
    }
  };

  const createInterface = (backupInterface = true) => (
    <View
      style={[
        {
          flex: 1,
          elevation: 6,
          padding: global.screenWidth / 32,
          borderRadius: global.screenWidth / 62,
          backgroundColor: global.highlightColor,
        },
        backupInterface && { marginBottom: global.screenWidth / 32 },
      ]}>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          margin: global.screenWidth / 92,
        }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: global.defaultColor,
              fontSize: global.screenWidth / 26,
            }}>
            {backupInterface ? 'JSON de Backup' : 'JSON de Restauração'}
          </Text>
        </View>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          {!backupInterface && (
            <TouchableOpacity onPress={() => restoreData()}>
              <Icon
                name={'backup'}
                color={global.defaultColor}
                size={global.screenWidth / 20}
                style={{ marginRight: global.screenWidth / 42 }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => (backupInterface ? clipboard() : clipboard(false))}>
            <Icon
              color={global.defaultColor}
              size={global.screenWidth / 20}
              name={backupInterface ? 'content-copy' : 'content-paste'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={{
          flex: 1,
          textAlign: 'justify',
          textAlignVertical: 'top',
          color: global.placeholderColor,
          padding: global.screenWidth / 32,
          fontSize: global.screenWidth / 30,
          backgroundColor: global.defaultColor,
          borderRadius: global.screenWidth / 62,
        }}
        editable={false}
        multiline={true}
        value={backupInterface ? backup : restore}
      />
    </View>
  );

  useEffect(() => fetchData(), []);
  return (
    <View
      style={{
        flex: 1,
        padding: global.screenWidth / 22,
        backgroundColor: global.defaultColor,
      }}>
      {createInterface()}
      {createInterface(false)}
    </View>
  );
};

export default Cloud;
