import { useState } from 'react';
import Layout from '@/components/Layout';
import DailyLog from '@/components/DailyLog';
import WeeklySummary from '@/components/WeeklySummary';
import Settings from '@/components/Settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyLog />;
      case 'summary':
        return <WeeklySummary />;
      case 'settings':
        return <Settings />;
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
