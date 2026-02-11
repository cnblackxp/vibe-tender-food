// Deep link utility for delivery apps

export const deliveryApps = {
  careem: {
    name: 'Careem',
    color: '#00D9FF',
    icon: '🚗',
    webUrl: 'https://www.careem.com/sa-en',
    appUrl: 'careem://',
    deepLink: (restaurantName, orderName) => {
      // Careem deep link format (example)
      return `careem://restaurant/${encodeURIComponent(restaurantName)}?item=${encodeURIComponent(orderName)}`;
    }
  },
  talabat: {
    name: 'Talabat',
    color: '#FF6600',
    icon: '🍽️',
    webUrl: 'https://www.talabat.com/sa',
    appUrl: 'talabat://',
    deepLink: (restaurantName, orderName) => {
      // Talabat deep link format (example)
      return `talabat://restaurant/${encodeURIComponent(restaurantName)}?item=${encodeURIComponent(orderName)}`;
    }
  },
  ubereats: {
    name: 'Uber Eats',
    color: '#06C167',
    icon: '🚕',
    webUrl: 'https://www.ubereats.com/sa',
    appUrl: 'ubereats://',
    deepLink: (restaurantName, orderName) => {
      // Uber Eats deep link format (example)
      return `ubereats://restaurant/${encodeURIComponent(restaurantName)}?item=${encodeURIComponent(orderName)}`;
    }
  }
};

export function openDeepLink(app, restaurantName, orderName) {
  const appConfig = deliveryApps[app];
  if (!appConfig) return;

  const deepLinkUrl = appConfig.deepLink(restaurantName, orderName);
  
  // Try to open app, fallback to web
  const link = document.createElement('a');
  link.href = deepLinkUrl;
  link.target = '_blank';
  link.click();

  // Fallback to web after a delay if app doesn't open
  setTimeout(() => {
    window.open(appConfig.webUrl, '_blank');
  }, 500);
}

export function getDeliveryAppBadges(appsList) {
  if (!appsList || appsList.length === 0) return [];
  
  return appsList.map(app => deliveryApps[app.toLowerCase()]).filter(Boolean);
}
