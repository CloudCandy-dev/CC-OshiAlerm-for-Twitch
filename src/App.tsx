import { ConfigProvider, LanguageProvider, ThemeProvider, useLanguage, useTheme } from './contexts';
import MainWindow from './components/MainWindow/index.tsx';
import { useAlarm } from './hooks';

function AppContent() {
  const { isLoading: langLoading } = useLanguage();
  const { isLoading: themeLoading } = useTheme();

  // アラームイベントの待受を開始
  useAlarm();

  if (langLoading || themeLoading) {
    return (
      <div className="app-loader">
        <div className="loader-content">
          Loading...
        </div>
      </div>
    );
  }

  return <MainWindow />;
}

function App() {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
