function formatPrettyDate(dateStr, language = 'uz') {
  const date = new Date(dateStr);

  const localeMap = {
    en: 'en-US',
    ru: 'ru-RU',
    uz: 'uz-UZ',
  };

  const locale = localeMap[language];

  const options = {
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString(locale, options).replace(',', '');
}

module.exports = formatPrettyDate;
