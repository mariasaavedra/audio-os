export const encodeUri = (uri: string): string =>
  btoa(uri).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const decodeUri = (encoded: string): string =>
  atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
