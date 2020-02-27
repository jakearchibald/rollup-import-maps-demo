import { l as logCaps } from './utils.js';

var txtURL = new URL('assets/some-asset-dc862684.txt', import.meta.url).href;

logCaps('This is the profile page');
fetch(txtURL).then(async response => {
  console.log(await response.text());
});
