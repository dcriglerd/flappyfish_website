import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PurchasesContext = createContext();

// RevenueCat API Key (Google Play)
const REVENUECAT_API_KEY = 'appba12e0d3b9';

// RevenueCat App ID
const REVENUECAT_APP_ID = 'appba12e0d3b9';

// Product identifiers (must match RevenueCat dashboard)
export const PRODUCT_IDS = {
  COINS_100: 'coins_100',
  COINS_500: 'coins_500',
  COINS_1000: 'coins_1000',
  REMOVE_ADS: 'remove_ads',
};

// Entitlement identifiers
export const ENTITLEMENTS = {
  REMOVE_ADS: 'remove_ads',
  PREMIUM: 'premium',
};

export const PurchasesProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize RevenueCat on mount
  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      // Set log level for debugging
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Get or create anonymous user ID
      let appUserId = await AsyncStorage.getItem('rc_app_user_id');
      if (!appUserId) {
        appUserId = `flappyfish_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await AsyncStorage.setItem('rc_app_user_id', appUserId);
      }

      // Configure RevenueCat
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: appUserId,
      });

      console.log('[RevenueCat] Configured with user ID:', appUserId);

      // Add customer info update listener
      Purchases.addCustomerInfoUpdateListener((info) => {
        console.log('[RevenueCat] Customer info updated');
        setCustomerInfo(info);
      });

      // Fetch initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      console.log('[RevenueCat] Initial customer info loaded');

      // Fetch offerings
      await loadOfferings();

      setIsInitialized(true);
    } catch (err) {
      console.error('[RevenueCat] Initialization error:', err);
      setError(err.message);
      // Still mark as initialized so app doesn't hang
      setIsInitialized(true);
    }
  };

  const loadOfferings = async () => {
    try {
      const fetchedOfferings = await Purchases.getOfferings();
      console.log('[RevenueCat] Offerings loaded:', fetchedOfferings);
      setOfferings(fetchedOfferings);
      return fetchedOfferings;
    } catch (err) {
      console.error('[RevenueCat] Error loading offerings:', err);
      setError(err.message);
      return null;
    }
  };

  // Purchase a package
  const purchasePackage = useCallback(async (pkg) => {
    if (isPurchasing) return { success: false, error: 'Purchase in progress' };
    
    try {
      setIsPurchasing(true);
      setError(null);

      console.log('[RevenueCat] Purchasing package:', pkg.identifier);
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      
      setCustomerInfo(newInfo);
      console.log('[RevenueCat] Purchase successful');
      
      return { success: true, customerInfo: newInfo };
    } catch (err) {
      if (err.userCancelled) {
        console.log('[RevenueCat] User cancelled purchase');
        return { success: false, cancelled: true };
      }
      console.error('[RevenueCat] Purchase error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsPurchasing(false);
    }
  }, [isPurchasing]);

  // Purchase by product ID
  const purchaseProduct = useCallback(async (productId) => {
    if (!offerings?.current) {
      await loadOfferings();
    }

    const pkg = offerings?.current?.availablePackages?.find(
      (p) => p.product.identifier === productId || p.identifier === productId
    );

    if (!pkg) {
      console.error('[RevenueCat] Product not found:', productId);
      return { success: false, error: 'Product not found' };
    }

    return purchasePackage(pkg);
  }, [offerings, purchasePackage]);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    try {
      setIsPurchasing(true);
      console.log('[RevenueCat] Restoring purchases...');
      
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      
      const hasEntitlements = Object.keys(info.entitlements.active).length > 0;
      console.log('[RevenueCat] Restore complete, has entitlements:', hasEntitlements);
      
      return { success: true, hasEntitlements, customerInfo: info };
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      return { success: false, error: err.message };
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  // Check if user has specific entitlement
  const hasEntitlement = useCallback((entitlementId) => {
    if (!customerInfo) return false;
    return typeof customerInfo.entitlements.active[entitlementId] !== 'undefined';
  }, [customerInfo]);

  // Check if ads are removed
  const hasRemovedAds = useCallback(() => {
    return hasEntitlement(ENTITLEMENTS.REMOVE_ADS) || hasEntitlement(ENTITLEMENTS.PREMIUM);
  }, [hasEntitlement]);

  // Get available packages for display
  const getAvailablePackages = useCallback(() => {
    if (!offerings?.current) return [];
    return offerings.current.availablePackages || [];
  }, [offerings]);

  // Get product price by ID
  const getProductPrice = useCallback((productId) => {
    const packages = getAvailablePackages();
    const pkg = packages.find(
      (p) => p.product.identifier === productId || p.identifier === productId
    );
    return pkg?.product?.priceString || null;
  }, [getAvailablePackages]);

  const value = {
    isInitialized,
    isPurchasing,
    error,
    offerings,
    customerInfo,
    
    // Actions
    purchasePackage,
    purchaseProduct,
    restorePurchases,
    loadOfferings,
    
    // Helpers
    hasEntitlement,
    hasRemovedAds,
    getAvailablePackages,
    getProductPrice,
    
    // Constants
    PRODUCT_IDS,
    ENTITLEMENTS,
  };

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return context;
};
