import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Layout from '@/components/Layout';
import DailyLog from '@/components/DailyLog';
import WeeklySummary from '@/components/WeeklySummary';

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  const handleGetStarted = () => {
    setShowApp(true);
  };

  if (!showApp) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyLog />;
      case 'summary':
        return <WeeklySummary />;
      default:
        return <DailyLog />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
