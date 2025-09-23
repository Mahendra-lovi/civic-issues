// app/worker/dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/services/supabaseclient";

const { width } = Dimensions.get("window");

interface WorkItem {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  status: 'assigned' | 'in_progress' | 'completed' | 'resolved';
  assigned_date: string;
  due_date: string;
  worker_id?: string;
}

export default function WorkerDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'assigned' | 'completed'>('assigned');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  // Sample data - Replace with actual Supabase queries
  const sampleWorkItems: WorkItem[] = [
    {
      id: '1',
      title: 'Fix Network Connectivity Issue',
      description: 'Network connection problems in Building A, Floor 3. Multiple users reporting intermittent connectivity.',
      department: 'IT Department',
      priority: 'high',
      status: 'assigned',
      assigned_date: '2024-01-15',
      due_date: '2024-01-17',
    },
    {
      id: '2',
      title: 'Replace Broken Light Fixtures',
      description: 'Several light fixtures in the main hallway need replacement. Safety concern for employees.',
      department: 'Maintenance',
      priority: 'medium',
      status: 'in_progress',
      assigned_date: '2024-01-14',
      due_date: '2024-01-20',
    },
    {
      id: '3',
      title: 'Update Security System',
      description: 'Upgrade security cameras and access control system in the east wing.',
      department: 'Security',
      priority: 'high',
      status: 'assigned',
      assigned_date: '2024-01-16',
      due_date: '2024-01-25',
    },
    {
      id: '4',
      title: 'HVAC System Maintenance',
      description: 'Completed routine maintenance and cleaning of HVAC system. All units working properly.',
      department: 'Maintenance',
      priority: 'medium',
      status: 'completed',
      assigned_date: '2024-01-10',
      due_date: '2024-01-15',
    },
    {
      id: '5',
      title: 'Database Backup Issue',
      description: 'Resolved automatic backup failure. Implemented new backup schedule and monitoring.',
      department: 'IT Department',
      priority: 'high',
      status: 'resolved',
      assigned_date: '2024-01-08',
      due_date: '2024-01-12',
    },
  ];

  useEffect(() => {
    fetchUserAndWork();
  }, []);

  const fetchUserAndWork = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        Alert.alert("Error", "Please login to access worker dashboard");
        router.replace("/auth/signin");
        return;
      }
      
      setUser(user);
      // In real implementation, fetch work items assigned to this user
      setWorkItems(sampleWorkItems);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserAndWork();
    setRefreshing(false);
  };

  const handleWorkAction = (work: WorkItem, action: string) => {
    setSelectedWork(work);
    if (action === 'complete' || action === 'resolve') {
      setModalVisible(true);
    } else if (action === 'start') {
      updateWorkStatus(work.id, 'in_progress');
    }
  };

  const updateWorkStatus = async (workId: string, status: string) => {
    try {
      // In real implementation, update in Supabase
      setWorkItems(prev => 
        prev.map(item => 
          item.id === workId 
            ? { ...item, status: status as WorkItem['status'] }
            : item
        )
      );
      Alert.alert("Success", `Work status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update work status");
    }
  };

  const submitResolution = async () => {
    if (!selectedWork || !resolutionNote.trim()) {
      Alert.alert("Error", "Please enter resolution details");
      return;
    }

    try {
      // In real implementation, save to Supabase with resolution note
      updateWorkStatus(selectedWork.id, selectedWork.status === 'in_progress' ? 'completed' : 'resolved');
      setModalVisible(false);
      setResolutionNote('');
      setSelectedWork(null);
    } catch (error) {
      Alert.alert("Error", "Failed to submit resolution");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#3498db';
      case 'in_progress': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'resolved': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getFilteredWorkItems = () => {
    if (selectedTab === 'assigned') {
      return workItems.filter(item => ['assigned', 'in_progress'].includes(item.status));
    } else {
      return workItems.filter(item => ['completed', 'resolved'].includes(item.status));
    }
  };

  const renderWorkItem = (item: WorkItem) => (
    <View key={item.id} style={styles.workCard}>
      <View style={styles.workHeader}>
        <View style={styles.workTitleContainer}>
          <Text style={styles.workTitle}>{item.title}</Text>
          <View style={styles.tagsContainer}>
            <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(item.priority) }]}>
              <Text style={styles.tagText}>{item.priority.toUpperCase()}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.tagText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.workDescription}>{item.description}</Text>
      
      <View style={styles.workMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="business-outline" size={16} color="#74b9ff" />
          <Text style={styles.metaText}>{item.department}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color="#fd79a8" />
          <Text style={styles.metaText}>Due: {new Date(item.due_date).toLocaleDateString()}</Text>
        </View>
      </View>

      {selectedTab === 'assigned' && (
        <View style={styles.actionButtons}>
          {item.status === 'assigned' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleWorkAction(item, 'start')}
            >
              <Ionicons name="play-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Start Work</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleWorkAction(item, 'complete')}
            >
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
          {(item.status === 'completed' || item.status === 'in_progress') && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.resolveButton]}
              onPress={() => handleWorkAction(item, 'resolve')}
            >
              <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Submit Resolution</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="briefcase-outline" size={48} color="#74b9ff" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  const filteredItems = getFilteredWorkItems();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Worker Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your work assignments</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="briefcase-outline" size={24} color="#74b9ff" />
          <Text style={styles.statNumber}>{workItems.filter(item => ['assigned', 'in_progress'].includes(item.status)).length}</Text>
          <Text style={styles.statLabel}>Active Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#00b894" />
          <Text style={styles.statNumber}>{workItems.filter(item => item.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#fdcb6e" />
          <Text style={styles.statNumber}>{workItems.filter(item => item.status === 'resolved').length}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'assigned' && styles.activeTab]}
          onPress={() => setSelectedTab('assigned')}
        >
          <Text style={[styles.tabText, selectedTab === 'assigned' && styles.activeTabText]}>
            Active Work ({workItems.filter(item => ['assigned', 'in_progress'].includes(item.status)).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
            Completed ({workItems.filter(item => ['completed', 'resolved'].includes(item.status)).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Work Items List */}
      <ScrollView 
        style={styles.workList}
        contentContainerStyle={styles.workListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map(renderWorkItem)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#a4b0be" />
            <Text style={styles.emptyStateText}>
              {selectedTab === 'assigned' ? 'No active work assignments' : 'No completed work yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedTab === 'assigned' ? 'New assignments will appear here' : 'Completed work will be shown here'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Resolution Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Work Resolution</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2d3436" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>{selectedWork?.title}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Resolution Details</Text>
              <TextInput
                style={styles.textArea}
                value={resolutionNote}
                onChangeText={setResolutionNote}
                placeholder="Describe how you resolved this issue..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={submitResolution}
              >
                <Text style={styles.submitButtonText}>Submit Resolution</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 18,
    color: "#74b9ff",
    fontWeight: "600",
    marginTop: 16,
  },
  header: {
    backgroundColor: "#2d3436",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#b2bec3",
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#636e72",
    fontWeight: "500",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
  },
  activeTabText: {
    color: "#2d3436",
  },
  workList: {
    flex: 1,
  },
  workListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  workCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  workHeader: {
    marginBottom: 12,
  },
  workTitleContainer: {
    marginBottom: 8,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  workDescription: {
    fontSize: 15,
    color: "#636e72",
    lineHeight: 22,
    marginBottom: 16,
  },
  workMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#636e72",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  startButton: {
    backgroundColor: "#74b9ff",
  },
  completeButton: {
    backgroundColor: "#00b894",
  },
  resolveButton: {
    backgroundColor: "#6c5ce7",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#636e72",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#a4b0be",
    marginTop: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2d3436",
    textAlignVertical: "top",
    minHeight: 120,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#e9ecef",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#636e72",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#00b894",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});