import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/config';
import { POWER_UPS } from '../data/gameData';
import { usePurchases, PRODUCT_IDS } from '../context/PurchasesContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Shop items with RevenueCat product IDs
const COIN_PACKAGES = [
  {
    id: PRODUCT_IDS.COINS_100,
    name: '100 Coins',
    coins: 100,
    fallbackPrice: '$0.99',
    popular: false,
  },
  {
    id: PRODUCT_IDS.COINS_500,
    name: '500 Coins',
    coins: 500,
    bonus: '+50 Bonus',
    fallbackPrice: '$3.99',
    popular: true,
  },
  {
    id: PRODUCT_IDS.COINS_1000,
    name: '1000 Coins',
    coins: 1000,
    bonus: '+200 Bonus',
    fallbackPrice: '$6.99',
    popular: false,
  },
];

const REMOVE_ADS_ITEM = {
  id: PRODUCT_IDS.REMOVE_ADS,
  name: 'Remove Ads',
  description: 'Play without interruptions',
  fallbackPrice: '$2.99',
};

const ShopModal = ({ 
  visible, 
  onClose, 
  coins, 
  onPurchaseCoins, 
  onBuyPowerUp,
  onRemoveAds,
  adsRemoved,
}) => {
  const [activeTab, setActiveTab] = useState('coins');
  const [message, setMessage] = useState(null);
  
  const {
    isInitialized,
    isPurchasing,
    purchaseProduct,
    restorePurchases,
    getProductPrice,
    hasRemovedAds,
    getAvailablePackages,
  } = usePurchases();

  // Update adsRemoved state from RevenueCat
  useEffect(() => {
    if (hasRemovedAds() && !adsRemoved) {
      onRemoveAds();
    }
  }, [hasRemovedAds, adsRemoved, onRemoveAds]);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePurchaseCoinPackage = async (item) => {
    if (isPurchasing) return;

    const result = await purchaseProduct(item.id);
    
    if (result.success) {
      // Grant coins
      const bonusCoins = item.bonus ? parseInt(item.bonus.replace(/[^0-9]/g, '')) : 0;
      onPurchaseCoins(item.coins + bonusCoins);
      showMessage(`🎉 Purchased ${item.name}!`);
    } else if (result.cancelled) {
      // User cancelled - do nothing
    } else {
      showMessage(result.error || 'Purchase failed', true);
    }
  };

  const handleRemoveAds = async () => {
    if (isPurchasing || adsRemoved) return;

    const result = await purchaseProduct(PRODUCT_IDS.REMOVE_ADS);
    
    if (result.success) {
      onRemoveAds();
      showMessage('🎉 Ads removed! Enjoy ad-free gameplay!');
    } else if (!result.cancelled) {
      showMessage(result.error || 'Purchase failed', true);
    }
  };

  const handleRestorePurchases = async () => {
    const result = await restorePurchases();
    
    if (result.success) {
      if (result.hasEntitlements) {
        showMessage('✅ Purchases restored successfully!');
        if (hasRemovedAds()) {
          onRemoveAds();
        }
      } else {
        showMessage('No previous purchases found', true);
      }
    } else {
      showMessage(result.error || 'Restore failed', true);
    }
  };

  const handleBuyPowerUp = (powerUp) => {
    if (coins >= powerUp.cost) {
      onBuyPowerUp(powerUp);
      showMessage(`⚡ ${powerUp.name} ready to use!`);
    } else {
      showMessage('Not enough coins!', true);
    }
  };

  // Get price from RevenueCat or use fallback
  const getPrice = (productId, fallback) => {
    const price = getProductPrice(productId);
    return price || fallback;
  };

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
            <Text style={styles.headerTitle}>👑 SHOP</Text>
            <View style={styles.headerRight}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.coinText}>{coins}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'coins' && styles.activeTab]}
              onPress={() => setActiveTab('coins')}
            >
              <Text style={[styles.tabText, activeTab === 'coins' && styles.activeTabText]}>
                🪙 Coins
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'powerups' && styles.activeTabPurple]}
              onPress={() => setActiveTab('powerups')}
            >
              <Text style={[styles.tabText, activeTab === 'powerups' && styles.activeTabText]}>
                ⚡ Power-ups
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading indicator */}
          {isPurchasing && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.GOLD} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}

          {/* Message */}
          {message && (
            <View style={[styles.message, message.isError && styles.messageError]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          )}

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'coins' && (
              <View style={styles.itemList}>
                {/* Coin Packages */}
                {COIN_PACKAGES.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.item, item.popular && styles.itemPopular]}
                  >
                    {item.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.bonus && (
                        <Text style={styles.itemBonus}>{item.bonus}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handlePurchaseCoinPackage(item)}
                      disabled={isPurchasing}
                    >
                      <Text style={styles.buyButtonText}>
                        {getPrice(item.id, item.fallbackPrice)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Remove Ads */}
                <View style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{REMOVE_ADS_ITEM.name}</Text>
                    <Text style={styles.itemDesc}>{REMOVE_ADS_ITEM.description}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      (adsRemoved || hasRemovedAds()) && styles.buyButtonDisabled,
                    ]}
                    onPress={handleRemoveAds}
                    disabled={isPurchasing || adsRemoved || hasRemovedAds()}
                  >
                    <Text style={styles.buyButtonText}>
                      {adsRemoved || hasRemovedAds() 
                        ? '✓ Owned' 
                        : getPrice(REMOVE_ADS_ITEM.id, REMOVE_ADS_ITEM.fallbackPrice)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Restore Purchases */}
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={handleRestorePurchases}
                  disabled={isPurchasing}
                >
                  <Text style={styles.restoreText}>Restore Purchases</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'powerups' && (
              <View style={styles.itemList}>
                {POWER_UPS.map((powerUp) => (
                  <View key={powerUp.id} style={styles.item}>
                    <View style={styles.powerUpIcon}>
                      <Text style={styles.powerUpEmoji}>{powerUp.icon}</Text>
                    </View>
                    <View style={styles.itemInfoFlex}>
                      <Text style={styles.itemName}>{powerUp.name}</Text>
                      <Text style={styles.itemDesc}>{powerUp.description}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.buyButtonPurple,
                        coins < powerUp.cost && styles.buyButtonDisabled,
                      ]}
                      onPress={() => handleBuyPowerUp(powerUp)}
                      disabled={coins < powerUp.cost}
                    >
                      <Text style={styles.buyButtonText}>🪙 {powerUp.cost}</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <Text style={styles.hintText}>
                  💡 Power-ups are purchased with in-game coins
                </Text>
              </View>
            )}
          </ScrollView>
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
    maxHeight: '80%',
    backgroundColor: '#0c4a6e',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  coinText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 16,
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
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.GOLD,
  },
  activeTabPurple: {
    borderBottomWidth: 3,
    borderBottomColor: '#a855f7',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 15,
  },
  activeTabText: {
    color: COLORS.WHITE,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    color: COLORS.WHITE,
    marginTop: 10,
    fontWeight: '600',
  },
  message: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  messageError: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: 'rgba(239,68,68,0.5)',
  },
  messageText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  itemList: {
    gap: 12,
  },
  item: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemPopular: {
    borderWidth: 2,
    borderColor: COLORS.GOLD,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: COLORS.GOLD,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    color: '#78350f',
    fontSize: 10,
    fontWeight: '800',
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoFlex: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 17,
  },
  itemBonus: {
    color: '#4ade80',
    fontSize: 13,
    marginTop: 2,
  },
  itemDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 2,
  },
  powerUpIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(168,85,247,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerUpEmoji: {
    fontSize: 24,
  },
  buyButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buyButtonPurple: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buyButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  buyButtonText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 15,
  },
  restoreButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  hintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default ShopModal;
