import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Layout from '../components/Layout';
import FloatingActionButton from '../components/FloatingActionButton';
import SupplyItem from '../components/SupplyItem';
import SubTabs from '../components/SubTabs';

export default function SuppliesScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'low_stock', label: 'Low Stock' },
    { id: 'history', label: 'History' },
  ];

  return (
    <Layout>
      <SubTabs 
        tabs={tabs} 
        activeTabId={activeTab} 
        onTabPress={setActiveTab} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SupplyItem 
          title="Premium Puppy Food" 
          category="Food" 
          status="In 3 days" 
          statusVariant="error" 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDQngR7iBTWfN8h-0vz34AlWfv1h-cleScZfne4pEM_pdGvyA4T4am7CBdbyx1b9kn_6zVQE0_JQ_BbnkYhNZRNqvYe4vv342gZdkpSzOzY_VHwJTeUIkf45wwV-O9vHZayYbGUYQXrfqp1PWbFakO6REPrdCizv1iqaeyG-C5UCcpA09nuJHe-vixH7ftyjayhVJNsh3EVExmZPLGhjhU14-4371Xp3ZmpdJI3OGcGdcjI80EVXdk7Zql25uOT40Ef0BEZCAHQ8ko"
        />
        <SupplyItem 
          title="Hygienic Pads" 
          category="Hygiene" 
          status="In 12 days" 
          statusVariant="warning" 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDnB44Nhvj4H02Wo4ZS72w9ekAz3y6KjryST4Y535suUIXVNASEqLSrCEkrVPslIVoRciP1mbo6sHLeqqWGuWlq07pXs8UAsmFaz3E_xjr_hW8iw6ylyz0J7XgRBnML4Ui89FacStfo4pWXLnNsfkTAoikQgUraUNf4qHDI1i9PhAgtAEOn9gCS7D-q_DhrPQkiiT34JHigV4MqEAQHBXIHwRjIAqn-LZWNlp5xLH6zNWJOw4b7h1i8oGZw5cm8Rd-KAjqK8LxjHGI"
        />
        <SupplyItem 
          title="Dental Chews" 
          category="Treats" 
          status="Stock OK" 
          statusVariant="success" 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCSw-YVsazmsAxslAoER0np_8AHYGHowWtt1e7VFcv0KfVJsfiSITuNJhBnLqgd1_T8mnrg9kjihGwPyFGhBEDtKI-JLO5y-h5_D_UPRp0ahtJLo0xYJ3BRW1raiiT1K5rGEDfLHUWrwHSd-3t8g69ng1y2QX9Ys2585re9yh91D0keMybigFR382clgRBPkvUTqvJMIv2oCnON1x7zn6krEebjlUTG4vn6oHAuZ9jUYA9k9SB8WS-AsSVyaOBekT6t_aVxSznaYSE"
        />
        <View style={styles.spacer} />
      </ScrollView>

      <FloatingActionButton onPress={() => navigation.navigate('AddSupply')} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  spacer: {
    height: 128,
  },
});
