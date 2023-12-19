import React, { useState } from 'react';
import '../i18n/FlagSelect.css';

const LanguageSelect = ({ onChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('it'); // Default language
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    en: 'EN',
    it: 'IT',
    // ... add more languages and their flags
  };

  const handleSelect = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
    onChange(lang);
  };

  return (
    <div className="flag-select">
      <div className="flag-select-button" onClick={() => setIsOpen(!isOpen)}>
        {languages[selectedLanguage]}
      </div>
      {isOpen && (
        <div className="flag-select-options">
          {Object.entries(languages).map(([lang, flag]) => (
            <div
              key={lang}
              className="flag-option"
              onClick={() => handleSelect(lang)}
            >
              {flag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;
