export default ({ config }) => {
  return {
    ...config,
    name: 'sherlock',
    slug: 'sherlock',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.miriantsirekidze.sherlock',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.RECORD_AUDIO',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to reverse image search.',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/CaudexBold.ttf',
            './assets/fonts/CaudexBoldItalic.ttf',
            './assets/fonts/CaudexRegular.ttf',
            './assets/fonts/CaudexItalic.ttf',
          ],
        },
      ],
    ]
  };
};
