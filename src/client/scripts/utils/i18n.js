import en from '../../lang/en';
import es from '../../lang/es';

let supportedLanguages = {
  en: en,
  es: es
};

let cc = 'es';

function setLanguage(language) {
  if (!language || !language.value) {
    return false;
  }
  cc = language.value.split('-')[0].toLowerCase().trim();
}

function t(s) {
  try {
    let matchedString = supportedLanguages[cc];
    s.split('.').forEach(section => {
      matchedString = matchedString[section];
    });
    // arguments
    let args = Array.apply(null, arguments);
    let argIndex = 1;
    return matchedString.replace(/%s/g, function () { return args[argIndex++]; });
  } catch(e) {
    return s;
  }
}

export {setLanguage, t};
