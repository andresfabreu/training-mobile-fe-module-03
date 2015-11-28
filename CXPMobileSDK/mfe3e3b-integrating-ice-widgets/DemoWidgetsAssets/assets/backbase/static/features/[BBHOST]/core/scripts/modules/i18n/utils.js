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

    /**
     * NOTE: Doesn't work with angular Dependecy Injection
     * @memberof core.i18n
     * @ngConstant
     */
    exports.lpCoreI18nUtils = {
        WIDGET_TRANSLATION_PREFERENCE: 'i18nEndPoint',
        /**
         * Hash containing currency symbols for every currency code
         * @example:
         * ```
         * lpCoreI18nUtils.CURRENCY_MAP.USD // "$"
         * ```
         */
        CURRENCY_MAP: CURRENCY_MAP,
        DEFAULT_TRANSLATIONS_PATH: '/locale/',

        /**
         * Name of the event triggered when locale data is loaded
         */
        COMMON_I18N_LOAD_EVENT: 'lpi18n:data:load',

        /**
         * Name of the event triggered when locale string changes
         *
         * @example
         * ```
         * lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function(locale) {
         *   alert(locale); // alerts current locale
         * });
         * lpCoreBus.publish(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, 'nl-NL'); // changes the language of all launchpad widgets
         * ```
         */
        LOCALE_CHANGE_EVENT: 'lpi18n:locale:change',
        ALL_LOCALES_FILE: 'all.json',

        /**
         * Normalizes locale string, returning object containing normalized string and external flag.
         * @memberof core.i18n.lpCoreI18nUtils
         * @param   {String} locale to normalize, e.g. 'en-us' or 'en_US' or 'EN-US' becomes 'en-US'
         * @returns {Object} locale object with the external flag
         */
        parseLocale: function (locale) {
            // hardcode for 'en' -> 'en-US'
            if (locale === 'en') { return 'en-US'; }

            if (typeof locale === 'string') {
                var parts = locale.split(/[-_]/);
                if (!parts[1]) {
                    parts.push(parts[0]); // nl -> nl-NL, ru -> ru-RU etc.
                }
                parts[0] = parts[0].toLowerCase();
                parts[1] = parts[1].toUpperCase();

                return parts.join('-');
            }
            return '';
        }
    };
});
