
import React, { useState } from 'react';

const languages = [
    { code: 'auto', name: 'Auto-Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'hi', name: 'Hindi' },
];

const TranslatorTool: React.FC = () => {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('es');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            setError('Please enter text to translate.');
            return;
        }
        setIsLoading(true);
        setError('');
        setTranslatedText('');

        try {
            // Using a public LibreTranslate instance API
            const res = await fetch("https://libretranslate.de/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: sourceText,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                    api_key: apiKey
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data.translatedText) {
                setTranslatedText(data.translatedText);
            } else {
                 throw new Error('No translated text in response.');
            }

        } catch (err: any) {
            console.error("Translation Error:", err);
            setError(`Failed to translate: ${err.message}. Please check your connection or API key.`);
            // Mock response for demonstration in restricted environments
            if (err.message.includes('Failed to fetch')) {
                 setTranslatedText(`This is a mocked translation for "${sourceText}" to ${targetLang}.`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwapLanguages = () => {
        if (sourceLang === 'auto') return;
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    return (
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-md p-6 md:p-8 rounded-xl border border-gray-700 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Text Area */}
                <div className="flex flex-col">
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="mb-2 bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                    <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="Source Text"
                        className="w-full h-48 md:h-64 p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {/* Translated Text Area */}
                <div className="flex flex-col">
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="mb-2 bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        {languages.filter(l => l.code !== 'auto').map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                    <textarea
                        value={translatedText}
                        readOnly
                        placeholder="Translated Text"
                        className="w-full h-48 md:h-64 p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 resize-none cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                 <button 
                    onClick={handleSwapLanguages}
                    disabled={sourceLang === 'auto'}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Swap languages"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </button>
                <button
                    onClick={handleTranslate}
                    disabled={isLoading}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:cursor-wait"
                >
                    {isLoading ? 'Translating...' : 'Translate'}
                </button>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Optional: Custom API Key"
                    className="w-full md:w-auto bg-gray-800 border border-gray-600 rounded-md p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default TranslatorTool;
