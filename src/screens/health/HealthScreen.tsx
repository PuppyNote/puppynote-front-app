import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Layout, 
  SubTabs, 
  Calendar, 
  HealthItem, 
  FloatingActionButton 
} from '../../components';

export default function HealthScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'records', label: 'Records' },
    { id: 'clinics', label: 'Clinics' },
  ];

  return (
    <Layout>
      <SubTabs 
        tabs={tabs} 
        activeTabId={activeTab} 
        onTabPress={setActiveTab} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 컴포넌트로 분리된 Calendar 사용 */}
        <Calendar 
          onDateSelect={(date) => console.log('Selected date:', date)}
          events={[5, 15, 24]}
        />

        <HealthItem 
          title="광견병 예방접종" 
          location="시티 펫 클리닉" 
          time="내일, 10:30 AM" 
          status="D-1" 
          statusVariant="error"
          icon="💉"
        />
        <HealthItem 
          title="심장사상충 약" 
          location="월간 치료" 
          time="5일 후, 08:00 AM" 
          status="D-5" 
          statusVariant="warning"
          icon="💊"
        />
        <HealthItem 
          title="체중 측정" 
          location="현재: 12.4 lbs" 
          time="완료: 2월 2일" 
          status="완료" 
          statusVariant="neutral"
          icon="⚖️"
        />
        <View style={styles.spacer} />
      </ScrollView>

      <FloatingActionButton onPress={() => console.log('Add Health Record')} />
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
