import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// URLs for legal pages
const LEGAL_URLS = {
  PRIVACY_POLICY: 'https://flappyfish746.com/privacy-policy.html',
  TERMS_OF_SERVICE: 'https://flappyfish746.com/terms-of-service.html',
  DATA_DELETION: 'https://fish-arcade-beta.preview.emergentagent.com/api/user/delete-request',
};

const LegalModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'privacy', 'terms'

  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('[Legal] Error opening URL:', error);
    }
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Legal & Privacy</Text>
      <Text style={styles.menuSubtitle}>
        Your privacy matters to us. Learn how we protect your data.
      </Text>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => setActiveTab('privacy')}
        activeOpacity={0.7}
      >
        <Text style={styles.menuItemIcon}>🔒</Text>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>Privacy Policy</Text>
          <Text style={styles.menuItemDesc}>How we collect and use your data</Text>
        </View>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => setActiveTab('terms')}
        activeOpacity={0.7}
      >
        <Text style={styles.menuItemIcon}>📜</Text>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>Terms of Service</Text>
          <Text style={styles.menuItemDesc}>Rules for using Flappy Fish</Text>
        </View>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => openExternalLink(LEGAL_URLS.DATA_DELETION)}
        activeOpacity={0.7}
      >
        <Text style={styles.menuItemIcon}>🗑️</Text>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>Delete My Data</Text>
          <Text style={styles.menuItemDesc}>Request removal of your data</Text>
        </View>
        <Text style={styles.menuItemArrow}>↗</Text>
      </TouchableOpacity>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Questions?</Text>
        <Text style={styles.contactText}>
          Email us at flappyfishgame@gmail.com
        </Text>
      </View>
    </View>
  );

  const renderPrivacyPolicy = () => (
    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => setActiveTab('menu')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageTitle}>🔒 Privacy Policy</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Collect</Text>
        <Text style={styles.sectionText}>
          • <Text style={styles.bold}>Game Progress:</Text> Your scores, coins, unlocked items{'\n'}
          • <Text style={styles.bold}>Device ID:</Text> Anonymous identifier for cloud saves{'\n'}
          • <Text style={styles.bold}>Username:</Text> Only if you choose to set one
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How We Use It</Text>
        <Text style={styles.sectionText}>
          • Save your progress across sessions{'\n'}
          • Show your name on leaderboards{'\n'}
          • Track achievements and rewards{'\n'}
          • Improve the game experience
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advertisements</Text>
        <Text style={styles.sectionText}>
          We show ads through Google AdMob to keep the game free. Google may collect:{'\n\n'}
          • Device identifiers{'\n'}
          • Ad interaction data{'\n\n'}
          You can opt out of personalized ads in your device settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Choices</Text>
        <Text style={styles.sectionText}>
          • <Text style={styles.bold}>Delete local data:</Text> Uninstall the app{'\n'}
          • <Text style={styles.bold}>Delete cloud data:</Text> Use our data deletion page{'\n'}
          • <Text style={styles.bold}>Opt out of ads:</Text> Device settings → Google → Ads
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kids Privacy</Text>
        <Text style={styles.sectionText}>
          Flappy Fish is safe for all ages. We don't collect personal information from children. No real names or personal info required to play!
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.fullPolicyButton}
        onPress={() => openExternalLink(LEGAL_URLS.PRIVACY_POLICY)}
      >
        <Text style={styles.fullPolicyText}>View Full Privacy Policy ↗</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTermsOfService = () => (
    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => setActiveTab('menu')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageTitle}>📜 Terms of Service</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Basics</Text>
        <Text style={styles.sectionText}>
          • Flappy Fish is free to play{'\n'}
          • Contains ads to keep it free{'\n'}
          • Earn coins by playing (no real money){'\n'}
          • Your progress saves automatically
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Play Fair</Text>
        <Text style={styles.sectionText}>
          <Text style={styles.bold}>Do:</Text>{'\n'}
          • Have fun!{'\n'}
          • Use appropriate usernames{'\n'}
          • Report bugs to help us improve{'\n\n'}
          <Text style={styles.bold}>Don't:</Text>{'\n'}
          • Use cheats or hacks{'\n'}
          • Use offensive usernames{'\n'}
          • Try to manipulate leaderboards
        </Text>
      </View>

      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          ⚠️ We may remove players from leaderboards if we detect cheating.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Ads</Text>
        <Text style={styles.sectionText}>
          • Ads keep the game free for everyone{'\n'}
          • Watching rewarded ads is always optional{'\n'}
          • You can opt out of personalized ads
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Data</Text>
        <Text style={styles.sectionText}>
          • Uninstall anytime to remove local data{'\n'}
          • Request cloud data deletion if needed{'\n'}
          • We won't sell your information
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.fullPolicyButton}
        onPress={() => openExternalLink(LEGAL_URLS.TERMS_OF_SERVICE)}
      >
        <Text style={styles.fullPolicyText}>View Full Terms of Service ↗</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚖️ Legal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'menu' && renderMenu()}
            {activeTab === 'privacy' && renderPrivacyPolicy()}
            {activeTab === 'terms' && renderTermsOfService()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '85%',
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#2c5282',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    maxHeight: 500,
  },
  menuContainer: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  menuItemArrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.4)',
  },
  contactSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  contentScroll: {
    padding: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.GOLD,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.GOLD,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#fff',
  },
  highlightBox: {
    backgroundColor: 'rgba(255,193,7,0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  highlightText: {
    fontSize: 13,
    color: '#ffc107',
  },
  fullPolicyButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  fullPolicyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GOLD,
  },
});

export default LegalModal;
