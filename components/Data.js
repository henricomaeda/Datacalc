// Importando bibliotecas.
import { StackActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import * as Datacalc from '../Globals.js';
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Definindo componente.
const Data = ({ route, navigation }) => {
  const [id, setId] = useState(-1);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [subTotal, setSubTotal] = useState('');

  const resetData = (index = -1) => {
    if (index == -1) {
      setId(-1);
      setName('');
      setTotal('');
      setSubTotal('');
    } else {
      setId(index);
      setName(data[index].name);
      setTotal(data[index].total);
      setSubTotal(data[index].subTotal);
    }
  };

  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await SecureStore.getItemAsync('products');
    if (response && response.trim().length != 0) setData(JSON.parse(response));
  };

  const doneIt = (saveIt = true) => {
    if (saveIt) SecureStore.setItemAsync('products', JSON.stringify(data));
    resetData();

    navigation.popToTop();
    navigation.dispatch(StackActions.replace('Main'));
    navigation.dispatch(StackActions.push('Data'));
  };

  const updateData = () => {
    if (!name || name.trim().length == 0)
      Alert.alert(global.name, 'Preencha o nome do produto.');
    else {
      try {
        if (!total || isNaN(total)) setTotal(0);
        if (!subTotal || isNaN(subTotal)) setSubTotal(0);
        if (id == -1) {
          data.push({
            amount: 0,
            name: name,
            total: !total ? 0 : Datacalc.denormalizeNumber(total),
            subTotal: !subTotal ? 0 : Datacalc.denormalizeNumber(subTotal),
          });

          Alert.alert(global.name, 'Produto adicionado com sucesso!');
          doneIt();
        } else {
          Alert.alert(global.name, 'Você deseja mesmo atualizar?', [
            { text: 'Voltar' },
            {
              text: 'Atualizar',
              onPress: () => {
                data[id] = {
                  amount: 0,
                  name: name,
                  total: !total ? 0 : Datacalc.denormalizeNumber(total),
                  subTotal: !subTotal
                    ? 0
                    : Datacalc.denormalizeNumber(subTotal),
                };

                Alert.alert(global.name, 'Produto atualizado com sucesso!');
                doneIt();
              },
            },
          ]);
        }
      } catch (e) {
        console.error('ERRO: ' + e);
        Alert.alert(global.name, 'ERRO: ' + e);
      }
    }
  };

  const removeData = (selectedId) => {
    Alert.alert(global.name, 'Você deseja mesmo remover?', [
      { text: 'Voltar' },
      {
        text: 'Remover',
        onPress: () => {
          const _data = data.filter((item, index) => index != selectedId);
          resetData();

          setData(_data);
          if (_data.length <= 0) SecureStore.setItemAsync('products', '');
          else SecureStore.setItemAsync('products', JSON.stringify(_data));
          Alert.alert(global.name, 'Produto removido com sucesso!');
          doneIt(false);
        },
      },
    ]);
  };

  useEffect(() => fetchData(), []); // eslint-disable-line
  return (
    <View
      style={{
        flex: 1,
        padding: global.screenWidth / 22,
        backgroundColor: global.defaultColor,
      }}>
      <View style={{ flex: 0 }}>
        <View style={styles.component}>
          <Icon
            name="view-in-ar"
            color={global.highlightColor}
            size={global.screenWidth / 16}
            style={{ flex: 0, marginRight: global.screenWidth / 36 }}
          />
          <TextInput
            value={name}
            style={styles.input}
            onChangeText={setName}
            placeholder="Nome do produto"
            placeholderTextColor={global.placeholderColor}
          />
        </View>
        <View style={styles.component}>
          <Text style={styles.textInput}>R$</Text>
          <TextInput
            numeric
            placeholder="Reais"
            style={styles.input}
            keyboardType={'numeric'}
            value={Datacalc.normalizeNumber(total)}
            placeholderTextColor={global.placeholderColor}
            onChangeText={(n) => setTotal(Datacalc.denormalizeNumber(n))}
          />
          <Text
            style={[styles.textInput, { marginLeft: global.screenWidth / 32 }]}>
            ,
          </Text>
          <TextInput
            numeric
            maxLength={2}
            placeholder="Centavos"
            keyboardType={'numeric'}
            value={Datacalc.normalizeNumber(subTotal)}
            placeholderTextColor={global.placeholderColor}
            style={[styles.input, { flex: 0.72 }]}
            onChangeText={(n) => setSubTotal(Datacalc.denormalizeNumber(n))}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => resetData()}
            style={[
              styles.button,
              {
                borderWidth: 1.2,
                borderColor: global.highlightColor,
                backgroundColor: global.defaultColor,
              },
            ]}>
            <Icon
              name="clear-all"
              color={global.highlightColor}
              size={global.screenWidth / 16}
              style={{ marginRight: global.screenWidth / 32 }}
            />
            <Text style={[styles.buttonText, { color: global.highlightColor }]}>
              Redefinir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateData()} style={styles.button}>
            <Icon
              name={id != -1 ? 'library-books' : 'library-add'}
              color={global.defaultColor}
              size={global.screenWidth / 16}
              style={{ marginRight: global.screenWidth / 32 }}
            />
            <Text style={styles.buttonText}>
              {id != -1 ? 'Atualizar produto' : 'Adicionar produto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 0,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flex: 1,
            borderColor: global.highlightColor,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text
          style={{
            flex: 0,
            color: global.highlightColor,
            padding: global.screenWidth / 20,
            fontSize: global.screenWidth / 26,
          }}>
          Selecione um produto para alterar
        </Text>
        <View
          style={{
            flex: 1,
            borderColor: global.highlightColor,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => resetData(index)}
              style={[
                styles.button,
                {
                  borderWidth: 1.2,
                  borderColor: global.highlightColor,
                  backgroundColor: global.defaultColor,
                  paddingRight: global.screenWidth / 32,
                  marginTop: index > 0 ? global.screenWidth / 46.2 : 0,
                },
              ]}>
              <Icon
                name="view-in-ar"
                color={global.placeholderColor}
                size={global.screenWidth / 16}
                style={{ flex: 0, marginRight: global.screenWidth / 36 }}
              />
              <Text
                numberOfLines={1}
                style={{
                  flex: 0,
                  color: global.highlightColor,
                  fontSize: global.screenWidth / 22,
                }}>
                {item.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  textAlign: 'right',
                  color: global.placeholderColor,
                  fontSize: global.screenWidth / 22,
                  marginLeft: global.screenWidth / 36,
                }}>
                R$ {Datacalc.normalizeNumber(item.total)},
                {item.subTotal < 10 ? '0' + item.subTotal : item.subTotal}
              </Text>
              <TouchableOpacity
                onPress={() => removeData(index)}
                style={{
                  flex: 0,
                  padding: global.screenWidth / 90,
                  marginLeft: global.screenWidth / 36,
                  borderRadius: global.screenWidth / 102,
                  backgroundColor: global.highlightColor,
                }}>
                <Icon
                  name="delete"
                  color={global.defaultColor}
                  size={global.screenWidth / 16}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

// Exportando componente.
export default Data;
const styles = StyleSheet.create({
  component: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: global.screenWidth / 32,
    borderColor: global.highlightColor,
    backgroundColor: global.defaultColor,
    borderRadius: global.screenWidth / 62,
    marginBottom: global.screenWidth / 36,
  },
  input: {
    flex: 1,
    color: global.highlightColor,
    padding: global.screenWidth / 62,
    fontSize: global.screenWidth / 20,
    borderColor: global.highlightColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 0,
    color: global.highlightColor,
    fontSize: global.screenWidth / 20,
    marginRight: global.screenWidth / 32,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: global.screenWidth / 32,
    paddingRight: global.screenWidth / 22,
    borderRadius: global.screenWidth / 62,
    backgroundColor: global.highlightColor,
  },
  buttonText: {
    color: global.defaultColor,
    fontSize: global.screenWidth / 22.6,
  },
});
