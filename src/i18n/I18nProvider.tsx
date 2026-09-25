import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import uk from './locales/uk.json';
import en from './locales/en.json';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

export type Language = 'uk' | 'en';

const translations = { uk, en };

type TranslationObject = typeof uk;

interface I18nContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const getValue = (object: TranslationObject, path: string): string => {
    const value = path.split('.').reduce<unknown>((result, part) => {
        if (typeof result !== 'object' || result === null) {
            return undefined;
        }

        return (result as Record<string, unknown>)[part];
    }, object);

    return typeof value === 'string' ? value : path;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = loadFromStorage<string | null>('devpulse-language', null);
        return stored === 'uk' || stored === 'en' ? stored : 'uk';
    });

    const setLanguage = (nextLanguage: Language) => {
        setLanguageState(nextLanguage);
        saveToStorage('devpulse-language', nextLanguage);
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t: (key: string) => getValue(translations[language], key),
        }),
        [language],
    );

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useTranslation must be used inside I18nProvider');
    }

    return context;
};