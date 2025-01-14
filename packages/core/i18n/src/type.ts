declare global {
  interface AlwatrSignals {
    'locale-change': Locale;
    'l10n-resource-change': L10Resource;
  }

  interface AlwatrRequestSignals {
    'l10n-resource-change': Locale;
  }
}

export type L10Resource = {
  [key: string]: string;
  _localeCode: `${string}-${string}`;
};

export type Locale = {
  /**
   * fa-IR, en-US, ...
   */
  code: `${string}-${string}`;

  /**
   * fa, en, ...
   */
  language: string;

  /**
   * ltr, rtl
   */
  direction: 'rtl' | 'ltr';
};

export type I18nConfig = {
  /**
   * Automatically fetch the localization resource from `resourcePath/localCode.json`.
   *
   * @default true
   */
  autoFetchResources: boolean;

  /**
   * Localization resource storage path (json files directory).
   *
   * @default '/l10n'
   */
  resourcePath: string;

  /**
   * Default language code.
   *
   * @default
   * {code: 'en-US', language: 'en', direction: 'ltr'}
   */
  defaultLocale: Locale;

  /**
   * Use this loadingStr before l10nResource loaded.
   *
   * @default '…'
   */
  loadingStr: string;
};
