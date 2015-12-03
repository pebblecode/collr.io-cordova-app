/*global device,Media*/
import {isCordova} from './helpers';

let MediaPlayer = {

  playSound(path) {
    if( !isCordova() ) {
      return;
    }
    let url = this.getMediaUrl(path);
    let media = new Media(url, null, this.onError);
    media.play();
  },

  getMediaUrl(path) {
    let android = typeof device !== 'undefined' && device.platform === 'android';
    return android ? '/android_asset/www/' + path : path;
  },

  onError(e) {
    console.error('Media error: ' + JSON.stringify(e));
  }

};

export default MediaPlayer;
