import { I18nContext } from 'nestjs-i18n';

export function t(key: string) {
  const i18n = I18nContext.current();
  return i18n ? i18n.t(key) : key;
}
