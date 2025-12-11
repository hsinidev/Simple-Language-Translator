
import React from 'react';
import ThemeLayout from './components/ThemeLayout';
import TranslatorTool from './components/TranslatorTool';
import SeoArticle from './utils/SeoArticle';

const App: React.FC = () => {
  return (
    <ThemeLayout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <TranslatorTool />
        <div className="mt-16 md:mt-24">
          <SeoArticle />
        </div>
      </div>
    </ThemeLayout>
  );
};

export default App;
