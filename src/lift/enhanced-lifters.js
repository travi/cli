import {lift} from '@form8ion/lift-javascript';

export async function javascript(options) {
  await lift({...options, configs: {eslint: {scope: '@travi'}}});
}
