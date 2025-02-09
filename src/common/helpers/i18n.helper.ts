import { I18nContext } from 'nestjs-i18n';

export function t(key: string) {
  return I18nContext.current().t(key);
}
