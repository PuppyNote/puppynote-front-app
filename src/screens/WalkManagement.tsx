import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout } from '../components';

// Mock data for walks
const walks = [
  {
    id: '1',
    title: 'Morning Walk',
    location: 'Central Park',
    time: 'Today, 08:30 AM',
    status: 'Now',
    statusColor: '#ff6b6b',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQngR7iBTWfN8h-0vz34AlWfv1h-cleScZfne4pEM_pdGvyA4T4am7CBdbyx1b9kn_6zVQE0_JQ_BbnkYhNZRNqvYe4vv342gZdkpSzOzY_VHwJTeUIkf45wwV-O9vHZayYbGUYQXrfqp1PWbFakO6REPrdCizv1iqaeyG-C5UCcpA09nuJHe-vixH7ftyjayhVJNsh3EVExmZPLGhjhU14-4371Xp3ZmpdJI3OGcGdcjI80EVXdk7Zql25uOT40Ef0BEZCAHQ8ko',
    buttonText: 'Start Walk',
    buttonIcon: 'play_arrow',
  },
  {
    id: '2',
    title: 'Evening Stroll',
    location: 'Riverside Path',
    time: 'Today, 06:00 PM',
    status: 'In 4h',
    statusColor: '#f59e0b',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnB44Nhvj4H02Wo4ZS72w9ekAz3y6KjryST4Y535suUIXVNASEqLSrCEkrVPslIVoRciP1mbo6sHLeqqWGuWlq07pXs8UAsmFaz3E_xjr_hW8iw6ylyz0J7XgRBnML4Ui89FacStfo4pWXLnNsfkTAoikQgUraUNf4qHDI1i9PhAgtAEOn9gCS7D-q_DhrPQkiiT34JHigV4MqEAQHBXIHwRjIAqn-LZWNlp5xLH6zNWJOw4b7h1i8oGZw5cm8Rd-KAjqK8LxjHGI',
    buttonText: 'Set Reminder',
    buttonIcon: 'notifications',
  },
  {
    id: '3',
    title: 'Afternoon Run',
    location: 'Dog Park',
    time: 'Yesterday, 02:15 PM',
    status: 'Done',
    statusColor: '#6b7280',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSw-YVsazmsAxslAoER0np_8AHYGHowWtt1e7VFcv0KfVJsfiSITuNJhBnLqgd1_T8mnrg9kjihGwPyFGhBEDtKI-JLO5y-h5_D_UPRp0ahtJLo0xYJ3BRW1raiiT1K5rGEDfLHUWrwHSd-3t8g69ng1y2QX9Ys2585re9yh91D0keMybigFR382clgRBPkvUTqvJMIv2oCnON1x7zn6krEebjlUTG4vn6oHAuZ9jUYA9k9SB8WS-AsSVyaOBekT6t_aVxSznaYSE',
    buttonText: 'View Details',
    buttonIcon: 'history',
  },
];

const WalkCard = ({ walk }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderInfo}>
        <Image source={{ uri: walk.image }} style={styles.walkImage} />
        <View>
          <Text style={styles.walkTitle}>{walk.title}</Text>
          <Text style={styles.walkLocation}>{walk.location}</Text>
          <Text style={styles.walkTime}>{walk.time}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${walk.statusColor}1A`, borderColor: `${walk.statusColor}33` }]}>
        <Text style={[styles.statusText, { color: walk.statusColor }]}>{walk.status}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionButtonText}>{walk.buttonText}</Text>
    </TouchableOpacity>
  </View>
);

const WalkManagementScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <Layout edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🐾</Text>
            </View>
            <Text style={styles.headerTitle}>Walks</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.goBack()}>
            <Text style={styles.addButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={[styles.tabText, styles.activeTabText]}>All Walks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Scheduled</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.mainContent}>
        {walks.map(walk => <WalkCard key={walk.id} walk={walk} />)}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: '#fcfaf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    fontSize: 18,
    color: '#eebd2b',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
  },
  addButtonText: {
    color: '#64748b',
    fontSize: 24,
    fontWeight: '300',
  },
  tabs: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#eebd2b',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  walkImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  walkTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  walkLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  walkTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#eebd2b',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#111827',
    fontWeight: 'bold',
  },
});

export default WalkManagementScreen;
