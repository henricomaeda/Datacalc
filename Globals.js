// Importando bibliotecas.
import { Dimensions } from 'react-native';

// Definindo variáveis globais.
global.name = 'Datacalc';
global.textColor = '#000000';
global.defaultColor = '#ffffff';
global.highlightColor = '#6200EE';
global.placeholderColor = '#c69ffc';
global.screenWidth = Dimensions.get('screen').width;
global.screenHeight = Dimensions.get('screen').height;

// Definindo normalização.
const normalizeNumber = (n) => {
  return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
};

// Definindo desnormalização.
const denormalizeNumber = (n) => {
  const denormalizedNumber = n.toString().replace(/\./g, '');
  const parsedNumber = Number.parseInt(denormalizedNumber, 10);

  if (isNaN(parsedNumber)) {
    if (n.length == 0) return n;
    else return 0;
  } else return parsedNumber;
};

// Exportando funções.
export { normalizeNumber, denormalizeNumber };
