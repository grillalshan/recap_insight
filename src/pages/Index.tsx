import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Layout from '@/components/Layout';
import DailyLog from '@/components/DailyLog';
import GenerateSummaries from '@/components/GenerateSummaries';
import ManageEntries from '@/components/ManageEntries';

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
      case 'summaries':
        return <GenerateSummaries />;
      case 'manage':
        return <ManageEntries />;
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
