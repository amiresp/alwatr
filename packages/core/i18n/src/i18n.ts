import {getJson} from '@alwatr/fetch';
import {alwatrRegisteredList, createLogger} from '@alwatr/logger';
import {SignalInterface} from '@alwatr/signal';

import type {I18nConfig, L10Resource, Locale} from './type';

const logger = createLogger('alwatr/i18n');

alwatrRegisteredList.push({
  name: '@alwatr/i18n',
  version: '{{ALWATR_VERSION}}',
});

export const l10n: {
  /**
   * Internal configuration, Do not change after init.
   */
  config: I18nConfig;

  /**
   * Current active locale.
   */
  locale?: Locale;

  /**
   * Current active l10n resource.
   */
  resource?: L10Resource;

  /**
   * Current active internal number formatter.
   */
  _numberFormatter?: Intl.NumberFormat;

  /**
   * `locale-change` signal interface
   */
  localeChangeSignal: SignalInterface<'locale-change'>;

  /**
   * `l10n-resource-change` signal interface
   */
  resourceChangeSignal: SignalInterface<'l10n-resource-change'>;

  /**
   * Dispatch `locale-change` signal and initial the process.
   */
  setLocal: (locale: Locale) => void;

  localize: typeof localize;

  /**
   * Format number to locale string characters and digital group.
   */
  formatNumber: (number: number) => string;
} = {
  config: {
    autoFetchResources: true,
    resourcePath: '/l10n',
    loadingStr: '…',
    defaultLocale: {code: 'en-US', language: 'en', direction: 'ltr'},
  },

  localeChangeSignal: new SignalInterface('locale-change'),

  resourceChangeSignal: new SignalInterface('l10n-resource-change'),

  setLocal: (locale: Locale = l10n.config.defaultLocale): void => {
    logger.logMethodArgs('setLocal', locale);
    l10n.localeChangeSignal.dispatch(locale);
  },

  localize,

  formatNumber: (number: number): string => {
    if (l10n._numberFormatter == null) return String(number);
    return l10n._numberFormatter.format(number);
  },
};

// On l10n.locale change.
l10n.localeChangeSignal.addListener(
    (locale) => {
      logger.logMethodArgs('localeChange', locale);
      l10n.locale = locale;

      if (l10n.resourceChangeSignal.value?._localCode !== locale.code) {
        l10n.resourceChangeSignal.expire();
        if (l10n.config.autoFetchResources) {
          l10n.resourceChangeSignal.request(locale);
        }
      }

      l10n._numberFormatter = new Intl.NumberFormat(locale.code);

      document.documentElement.setAttribute('lang', locale.code);
      document.documentElement.setAttribute('dir', locale.direction);
    },
    {priority: true},
);

// On l10n.resource change.
l10n.resourceChangeSignal.addListener((l10nResource) => {
  logger.logMethodArgs('resourceChange', {l10nResource});
  l10n.resource = l10nResource;
});

l10n.resourceChangeSignal.setProvider(async (locale) => {
  logger.logMethodArgs('resourceProvider', locale);

  if (l10n.resourceChangeSignal.value?._localCode === locale.code) {
    return;
  }

  return await getJson<L10Resource>({url: `${l10n.config.resourcePath}/${locale.code}.json`});
  // TODO: cache requests using fetch (add feature for fetch)
  // TODO: catch errors and fallback
});

/**
 * Localize a String_Key from the translation resource.
 *
 * @param key The String_Key of the translation resource to localize.
 * @returns The localized string.
 *  return `…` if the translation resource is not yet loaded.
 *  return `(key)` if the key not defined in the translation resource.
 *  return null if the key is null or undefined (for optional input).
 *
 * @example
 * localize('hello_world'); // Hello world!
 */
function localize(key?: null): null;
/**
 * Localize a String_Key from the translation resource.
 *
 * @param key The String_Key of the translation resource to localize.
 * @returns The localized string.
 *  return `…` if the translation resource is not yet loaded.
 *  return `(key)` if the key not defined in the translation resource.
 *  return null if the key is null or undefined (for optional input).
 *
 * @example
 * localize('hello_world'); // Hello world!
 */
function localize(key: string): string;
/**
 * Localize a String_Key from the translation resource.
 *
 * @param key The String_Key of the translation resource to localize.
 * @returns The localized string.
 *  return `…` if the translation resource is not yet loaded.
 *  return `(key)` if the key not defined in the translation resource.
 *  return null if the key is null or undefined (for optional input).
 *
 * @example
 * localize('hello_world'); // Hello world!
 */
function localize(key?: string | null): string | null;

function localize(key?: string | null): string | null {
  if (key == null) return null;

  key = key.trim();
  if (key === '') return '';

  if (l10n.resource == null) return l10n.config.loadingStr;

  const localized = l10n.resource[key];
  if (localized == null) {
    logger.accident('localize', 'l10n_key_not_found', 'Key not defined in the localization resource', {key});
    return `{${key}}`;
  }

  return localized;
}
