define(function (require, exports, module) {
    'use strict';


    var CURRENCY_MAP = {
        'ALL': 'Lek',
        'AFN': '؋',
        'ARS': '$',
        'AWG': 'ƒ',
        'AUD': '$',
        'AZN': 'ман',
        'BSD': '$',
        'BBD': '$',
        'BYR': 'p.',
        'BZD': 'BZ$',
        'BMD': '$',
        'BOB': '$b',
        'BAM': 'KM',
        'BWP': 'P',
        'BGN': 'лв',
        'BRL': 'R$',
        'BND': '$',
        'KHR': '៛',
        'CAD': '$',
        'KYD': '$',
        'CLP': '$',
        'CNY': '¥',
        'COP': '$',
        'CRC': '₡',
        'HRK': 'kn',
        'CUP': '₱',
        'CZK': 'Kč',
        'DKK': 'kr',
        'DOP': 'RD$',
        'XCD': '$',
        'EGP': '£',
        'SVC': '$',
        'EEK': 'kr',
        'EUR': '€',
        'FKP': '£',
        'FJD': '$',
        'GHC': '¢',
        'GIP': '£',
        'GTQ': 'Q',
        'GGP': '£',
        'GYD': '',
        'HNL': 'L',
        'HKD': '$',
        'HUF': 'Ft',
        'ISK': 'kr',
        'IDR': 'Rp',
        'IRR': '﷼',
        'IMP': '£',
        'ILS': '₪',
        'JMD': 'J$',
        'JPY': '¥',
        'JEP': '£',
        'KZT': 'лв',
        'KGS': 'лв',
        'LAK': '₭',
        'LVL': 'Ls',
        'LBP': '£',
        'LRD': '$',
        'LTL': 'Lt',
        'MKD': 'ден',
        'MYR': 'RM',
        'MUR': '₨',
        'MXN': '$',
        'MNT': '₮',
        'MZN': 'MT',
        'NAD': '$',
        'NPR': '₨',
        'ANG': 'ƒ',
        'NZD': '$',
        'NIO': 'C$',
        'NGN': '₦',
        'KPW': '₩',
        'NOK': 'kr',
        'OMR': '﷼',
        'PKR': '₨',
        'PAB': 'B/.',
        'PYG': 'Gs',
        'PEN': 'S/.',
        'PHP': '₱',
        'PLN': 'zł',
        'QAR': '﷼',
        'RON': 'lei',
        'RUB': 'руб',
        'SHP': '£',
        'SAR': '﷼',
        'RSD': 'Дин.',
        'SCR': '₨',
        'SGD': '$',
        'SBD': '$',
        'SOS': 'S',
        'ZAR': 'R',
        'KRW': '₩',
        'LKR': '₨',
        'SEK': 'kr',
        'CHF': 'CHF',
        'SRD': '$',
        'SYP': '£',
        'TWD': 'NT$',
        'THB': '฿',
        'TTD': 'TT$',
        'TRL': '₤',
        'TVD': '$',
        'UAH': '₴',
        'GBP': '£',
        'USD': '$',
        'UYU': '$U',
        'UZS': 'лв',
        'VEF': 'Bs',
        'VND': '₫',
        'YER': '﷼',
        'ZWD': 'Z$'
    };

    var EXTERNAL_LOCALE_MARKER = '^';
    /**
     * Doesn't work with angular Dependecy Injection
     */
    exports.lpCoreI18nUtils = (function() {

        return {
            WIDGET_TRANSLATION_PREFERENCE: 'i18nEndPoint',
            CURRENCY_MAP: CURRENCY_MAP,
            DEFAULT_TRANSLATIONS_PATH: '/locale/',
            COMMON_I18N_LOAD_EVENT: 'lpi18n:data:load',
            LOCALE_CHANGE_EVENT: 'lpi18n:locale:change',
            ALL_LOCALES_FILE: 'all.json',

            /**
             * @param {string} locale to normalize, e.g. 'en-us' or 'en_US' or 'EN-US' becomes 'en-US'
             * @returns {object} locale object with the external flag
             */
            parseLocale: function (locale) {
                // the locale is considered external if its first symbol is '^', e.g. '^sk-SK'
                var isLocaleExternal = locale[0] === EXTERNAL_LOCALE_MARKER;
                if (isLocaleExternal) {
                    locale = locale.substr(1);
                }

                var parts = locale.split(/[-_]/);
                if (!parts[1]) {
                    parts.push(parts[0]); // nl -> nl-NL, ru -> ru-RU etc.
                }
                parts[0] = parts[0].toLowerCase();
                parts[1] = parts[1].toUpperCase();

                return {
                    id: parts.join('-'),
                    external: isLocaleExternal
                };
            }
        };

    })();

});
