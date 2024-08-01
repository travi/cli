import {lift} from '@form8ion/javascript';

export function javascript(options) {
  return lift({...options, configs: {eslint: {scope: '@travi'}}});
}
