// app/(tabs)/past.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { supabase } from '@/services/supabaseclient';  
import useRealtimeMessages from '@/hooks/useRealtimeMessages';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Animated Card Component
const AnimatedCard = ({ item, index }: { item: any; index: number }) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    const delay = index * 150; // Staggered animation
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'Pending':
        return {
          color: '#FF9500',
          backgroundColor: '#FFF4E6',
          borderColor: '#FFD60A',
          icon: 'time-outline',
          gradient: ['#FFD60A', '#FF9500'] as const
        };
      case 'In Progress':
        return {
          color: '#87CEEB',
          backgroundColor: '#E0F6FF',
          borderColor: '#ADD8E6',
          icon: 'refresh-outline',
          gradient: ['#ADD8E6', '#87CEEB'] as const
        };
      case 'Resolved':
        return {
          color: '#34C759',
          backgroundColor: '#E8F5E8',
          borderColor: '#30D158',
          icon: 'checkmark-circle-outline',
          gradient: ['#30D158', '#34C759'] as const
        };
      default:
        return {
          color: '#8E8E93',
          backgroundColor: '#F2F2F7',
          borderColor: '#C7C7CC',
          icon: 'help-circle-outline',
          gradient: ['#C7C7CC', '#8E8E93'] as const
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.95}>
        <View style={styles.card}>
          {/* Gradient Header */}
          <LinearGradient
            colors={['#1e3c72', '#2a5298']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardHeader}
          >
            <View style={styles.headerContent}>
              <View style={styles.categoryContainer}>
                <Ionicons name="folder-outline" size={16} color="#fff" />
                <Text style={styles.categoryText}>{item.category ?? 'Uncategorized'}</Text>
              </View>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={statusConfig.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.statusBadge, { borderColor: statusConfig.borderColor }]}
            >
              <Ionicons name={statusConfig.icon as any} size={16} color="#fff" />
              <Text style={styles.statusText}>{item.status ?? 'Pending'}</Text>
            </LinearGradient>
          </View>

          {/* Image Section */}
          <View style={styles.imageContainer}>
            {item.image_url ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <View style={styles.imageOverlay}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                  >
                    <Ionicons name="image-outline" size={20} color="#fff" />
                  </LinearGradient>
                </View>
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <View style={styles.noImageIcon}>
                  <Ionicons name="image-outline" size={40} color="#C7C7CC" />
                </View>
                <Text style={styles.noImageText}>No image attached</Text>
              </View>
            )}
          </View>

          {/* Description Section */}
          {item.text && (
            <View style={styles.descriptionContainer}>
              <View style={styles.descriptionHeader}>
                <Ionicons name="document-text-outline" size={16} color="#2a5298" />
                <Text style={styles.descriptionLabel}>Issue Description</Text>
              </View>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {item.text}
              </Text>
            </View>
          )}

          {/* Location Section */}
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.locationIcon}
              >
                <Ionicons name="location" size={16} color="#fff" />
              </LinearGradient>
              <Text style={styles.locationLabel}>Location Details</Text>
            </View>
            
            <View style={styles.locationInfo}>
              <Text style={styles.addressText} numberOfLines={2}>
                {item.address ?? 
                 (item.latitude && item.longitude 
                   ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` 
                   : "Location not available")}
              </Text>
              
              {item.latitude != null && item.longitude != null && (
                <View style={styles.coordinatesContainer}>
                  <Ionicons name="navigate-outline" size={12} color="#8E8E93" />
                  <Text style={styles.coordinatesText}>
                    {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={16} color="#007AFF" />
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={16} color="#34C759" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PastIssuesScreen() {
  const [userId, setUserId] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const headerAnimation = new Animated.Value(0);

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
      if (error) console.log('Error fetching user:', error);
    };
    fetchUser();

    // Animate header
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Subscribe to realtime messages for this user
  const allIssues = useRealtimeMessages(userId);
  
  // Filter issues based on active filter
  const issues = activeFilter === 'all' 
    ? allIssues 
    : allIssues.filter(item => {
        const status = item.status || 'Pending';
        return status === activeFilter;
      });

  // Summary statistics
  const getStatistics = () => {
    const pending = allIssues.filter(item => (item.status || 'Pending') === 'Pending').length;
    const inProgress = allIssues.filter(item => item.status === 'In Progress').length;
    const resolved = allIssues.filter(item => item.status === 'Resolved').length;
    return { pending, inProgress, resolved, total: allIssues.length };
  };

  const stats = getStatistics();

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.headerContainer,
        {
          opacity: headerAnimation,
          transform: [{
            translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        }
      ]}
    >
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Report History</Text>
        <Text style={styles.headerSubtitle}>Track your submitted reports</Text>
        
        {/* Statistics Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <TouchableOpacity 
            style={[
              styles.statCard, 
              { backgroundColor: activeFilter === 'all' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }
            ]}
            onPress={() => handleFilterPress('all')}
            activeOpacity={0.7}
          >
            <Ionicons name="apps-outline" size={18} color="#fff" />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>All Reports</Text>
            {activeFilter === 'all' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.statCard, 
              { backgroundColor: activeFilter === 'Pending' ? 'rgba(255,193,7,0.25)' : 'rgba(255,193,7,0.15)' }
            ]}
            onPress={() => handleFilterPress('Pending')}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={18} color="#FFC107" />
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
            {activeFilter === 'Pending' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: activeFilter === 'In Progress' ? 'rgba(173,216,230,0.4)' : 'rgba(173,216,230,0.25)' }
            ]}
            onPress={() => handleFilterPress('In Progress')}
            activeOpacity={0.7}
          >
            <Ionicons name="sync-outline" size={18} color="#ADD8E6" />
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
            {activeFilter === 'In Progress' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );

  const EmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: headerAnimation,
          transform: [{
            scale: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
        }
      ]}
    >
      <LinearGradient
        colors={['#ffecd2', '#fcb69f']}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name="document-outline" size={60} color="#FF6B35" />
        </View>
        <Text style={styles.emptyTitle}>
          {activeFilter === 'all' ? 'No Reports Yet' : `No ${activeFilter} Reports`}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeFilter === 'all' 
            ? 'Start by submitting your first incident report'
            : `No reports with ${activeFilter} status found. Try a different filter.`
          }
        </Text>
        {activeFilter !== 'all' && (
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => setActiveFilter('all')}
          >
            <LinearGradient
              colors={['#1e3c72', '#2a5298']}
              style={styles.emptyButtonGradient}
            >
              <Ionicons name="eye-outline" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>View All Reports</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {activeFilter === 'all' && (
          <TouchableOpacity style={styles.emptyButton}>
            <LinearGradient
              colors={['#1e3c72', '#2a5298']}
              style={styles.emptyButtonGradient}
            >
              <Ionicons name="add-outline" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Create Report</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={issues}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <AnimatedCard item={item} index={index} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={issues.length === 0 ? <EmptyState /> : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        bouncesZoom={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  statCard: {
    padding: 12,
    borderRadius: 12,
    marginRight: 20,
    alignItems: 'center',
    minWidth: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusContainer: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  imageContainer: {
    margin: 20,
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    padding: 12,
    alignItems: 'flex-end',
  },
  noImageContainer: {
    height: 150,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  noImageIcon: {
    marginBottom: 12,
  },
  noImageText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  locationContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: '#FEF7F0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f5576c',
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
    fontFamily: 'monospace',
  },
  cardFooter: {
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  emptyContainer: {
    margin: 20,
    marginTop: 40,
  },
  emptyGradient: {
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});