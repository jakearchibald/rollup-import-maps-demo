import txtURL from 'asset-url:./some-asset.txt';
import { logCaps } from './utils.js';
logCaps('This is the profile page');
fetch(txtURL).then(async response => {
  console.log(await response.text());
});
