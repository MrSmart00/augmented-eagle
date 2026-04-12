jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve(true)),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (comp) => comp },
    useSharedValue: jest.fn((init) => ({ value: init })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    interpolate: jest.fn((value, inputRange, outputRange) => {
      const [inMin, inMax] = inputRange;
      const [outMin, outMax] = outputRange;
      const ratio = (value - inMin) / (inMax - inMin);
      return outMin + ratio * (outMax - outMin);
    }),
    withTiming: jest.fn((toValue, _config, callback) => {
      if (callback) callback(true);
      return toValue;
    }),
    withDelay: jest.fn((_delay, animation) => animation),
    withSequence: jest.fn((...animations) => animations[animations.length - 1]),
    runOnJS: jest.fn((fn) => fn),
    Easing: { out: jest.fn((e) => e), ease: "ease" },
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "ja", changeLanguage: jest.fn() },
  }),
  I18nextProvider: ({ children }) => children,
  initReactI18next: { type: "3rdParty", init: jest.fn() },
}));

jest.mock("lottie-react-native", () => {
  const { View } = require("react-native");
  const React = require("react");
  const LottieView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      play: jest.fn(),
      reset: jest.fn(),
      pause: jest.fn(),
    }));
    return React.createElement(View, { ...props, testID: props.testID });
  });
  LottieView.displayName = "LottieView";
  return { __esModule: true, default: LottieView };
});

jest.mock("@react-native-async-storage/async-storage", () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
      multiGet: jest.fn((keys) =>
        Promise.resolve(keys.map((key) => [key, store[key] ?? null])),
      ),
      multiSet: jest.fn((pairs) => {
        pairs.forEach(([key, value]) => {
          store[key] = value;
        });
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys) => {
        keys.forEach((key) => {
          delete store[key];
        });
        return Promise.resolve();
      }),
    },
  };
});
