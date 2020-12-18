import {lift} from '@form8ion/lift-javascript';

export function javascript(options) {
  return lift({...options, configs: {eslint: {scope: '@travi'}}});
}
