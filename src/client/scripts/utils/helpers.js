/**
 * Whether or not we're running inside a Cordova native app wrapper.
 */
export function isCordova() {
  return window.location.protocol === 'file:';
}

export function formatNumberAs4HexBytes(decimal) {

  let hex = decimal.toString(16);

  let hexString = hex + '';

  let array = [];
  let i = 0;

  while( i < hexString.length ) {

    let len = i < hexString.length - 1 ? 2 : 1;

    array.push( parseInt(hexString.substr(i, len), 16) );

    i += 2;

  }

  // Now we pad the array at the front to make it up to length 4 (if not already)
  while( array.length < 4 ) {
    array.unshift(0x00);
  }

  return array;

}

export function parseHexBytesToNumber(bytesArray) {

  let hexString = '0x';

  for( let i = 0; i < bytesArray.length; i++ ) {
    let byteString = bytesArray[i].toString(16);
    if( byteString.length < 2 ) {
      byteString = '0' + byteString;
    }
    hexString += byteString;
  }

  return parseInt(hexString, 16);

}

/**
 * @param data Bluetooth device data object
 * @returns {{}} 'write' and 'notify' characteristics if they exist, each a property of the return object.
 */
export function getCharacteristicsFromDeviceData(data) {

  let characteristics = {};

  if( !data.characteristics ) {
    return characteristics;
  }

  for (let i = 0; i < data.characteristics.length; i++) {

    let c = data.characteristics[i];

    if (c.properties.indexOf('Write') !== -1) {
      characteristics.write = c;
    }

    if (c.properties.indexOf('Notify') !== -1) {
      characteristics.notify = c;
    }

  }

  return characteristics;

}

export function logTimestamp(message, optionalTimestampSince) {

  // Unfortunately can't use performance.now on iOS
  let timestamp = (new Date()).getTime();

  let timeSince = optionalTimestampSince ? timestamp - optionalTimestampSince : null;
  let timeSinceMsg = timeSince ? `- ${Math.round(timeSince)} ms since ${optionalTimestampSince}` : '';

  console.log(`TIME: ${Math.round(timestamp)} ms ${timeSinceMsg} - ${message}`);

  return timestamp;

}

export function copyArray(arr) {
  return arr.slice(0);
}
