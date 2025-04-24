import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_LANGUAGE_KEY = '@MyApp:language';

// Define translation resources
const resources = {
  en: {
    translation: {
      // Tab Names
      music: 'Music',
      alarms: 'Alarms',
      memos: 'Memos',
      // Music Screen
      importMusic: 'Import Music File',
      selectedFile: 'Selected File:',
      musicSelectedAndSet: 'Music Selected & Set as Alarm Tone',
      errorLoadingAudio: 'Could not load the audio file.',
      errorSavingMusicUri: 'Could not save the selected music as alarm tone.',
      play: 'Play',
      pause: 'Pause',
      playbackError: 'An error occurred during playback.',
      // Alarms Screen
      setNewAlarm: 'Set New Alarm',
      selected: 'Selected:',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      setThisAlarm: 'Set This Alarm',
      scheduledAlarms: 'Scheduled Alarms',
      noAlarmsScheduled: 'No alarms scheduled.',
      invalidTime: 'Invalid Time',
      invalidTimeMessage: 'Please select a future date and time for the alarm.',
      alarmSet: 'Alarm Set',
      alarmSetMessage: 'Alarm scheduled for {{date}} with {{count}} repeats.',
      alarmCancelled: 'Alarm Cancelled',
      alarmCancelledMessage: 'Alarm {{id}}... cancelled.',
      alarmGroupCancelled: 'Alarm Group Cancelled',
      alarmGroupCancelledMessage: 'All alarms for group {{group}} cancelled.',
      errorSchedulingAlarm: 'Failed to schedule alarm.',
      errorCancellingAlarm: 'Failed to cancel alarm.',
      errorCancellingGroup: 'Failed to cancel all related alarms.',
      errorFetchingAlarms: 'Could not fetch scheduled alarms.',
      permissionRequired: 'Permission Required',
      permissionMessage: 'Failed to get push token for push notification! Please enable notifications in your settings.',
      trigger: 'Trigger:',
      body: 'Body:',
      group: 'Group:',
      cancelGroup: 'Cancel Group',
      // Memos Screen
      enterMemo: 'Enter your memo here',
      addMemo: 'Add Memo',
      memosTitle: 'Memos',
      delete: 'Delete',
      // Language Switcher (Example)
      switchToEnglish: 'Switch to English',
      switchToChinese: 'Switch to Chinese',
      currentLanguage: 'Current Language: {{lng}}',
    },
  },
  zh: { // Assuming Simplified Chinese (zh-CN or zh-Hans)
    translation: {
      // Tab Names
      music: '音乐',
      alarms: '闹钟',
      memos: '备忘录',
      // Music Screen
      importMusic: '导入音乐文件',
      selectedFile: '已选文件:',
      musicSelectedAndSet: '音乐已选择并设为闹钟铃声',
      errorLoadingAudio: '无法加载音频文件。',
      errorSavingMusicUri: '无法将所选音乐保存为闹钟铃声。',
      play: '播放',
      pause: '暂停',
      playbackError: '播放时发生错误。',
      // Alarms Screen
      setNewAlarm: '设置新闹钟',
      selected: '已选:',
      selectDate: '选择日期',
      selectTime: '选择时间',
      setThisAlarm: '设置此闹钟',
      scheduledAlarms: '已设闹钟',
      noAlarmsScheduled: '没有已设闹钟。',
      invalidTime: '时间无效',
      invalidTimeMessage: '请选择未来的日期和时间作为闹钟。',
      alarmSet: '闹钟已设置',
      alarmSetMessage: '闹钟已为 {{date}} 设置，重复 {{count}} 次。',
      alarmCancelled: '闹钟已取消',
      alarmCancelledMessage: '闹钟 {{id}}... 已取消。',
      alarmGroupCancelled: '闹钟组已取消',
      alarmGroupCancelledMessage: '组 {{group}} 的所有闹钟已取消。',
      errorSchedulingAlarm: '设置闹钟失败。',
      errorCancellingAlarm: '取消闹钟失败。',
      errorCancellingGroup: '取消所有相关闹钟失败。',
      errorFetchingAlarms: '无法获取已设闹钟。',
      permissionRequired: '需要权限',
      permissionMessage: '获取推送通知令牌失败！请在设置中启用通知。',
      trigger: '触发器:',
      body: '内容:',
      group: '分组:',
      cancelGroup: '取消分组',
      // Memos Screen
      enterMemo: '在此输入你的备忘录',
      addMemo: '添加备忘录',
      memosTitle: '备忘录',
      delete: '删除',
      // Language Switcher (Example)
      switchToEnglish: '切换到英文',
      switchToChinese: '切换到中文',
      currentLanguage: '当前语言: {{lng}}',
    },
  },
};

// Language detector using AsyncStorage and Expo Localization
const languageDetector = {
  type: 'languageDetector' as const, // Add 'as const' for type safety
  async: true, // We need to read from AsyncStorage
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (storedLanguage) {
        console.log('[i18n] Found stored language:', storedLanguage);
        return callback(storedLanguage);
      } else {
        // If no language stored, use device locale
        const deviceLocale = Localization.getLocales()[0]?.languageTag ?? 'en'; // Default to 'en' if detection fails
        console.log('[i18n] No stored language, using device locale:', deviceLocale);
        // Simplify locale (e.g., 'zh-CN' -> 'zh')
        const simplifiedLocale = deviceLocale.split('-')[0];
        return callback(simplifiedLocale);
      }
    } catch (error) {
      console.error('[i18n] Error detecting language:', error);
      // Fallback to English on error
      return callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      console.log('[i18n] Caching user language:', language);
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.error('[i18n] Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetector) // Use custom language detector
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    // compatibilityJSON: 'v3', // Removed based on TS error, likely not needed in newer versions
    resources,
    fallbackLng: 'en', // Fallback language if detection fails or translation missing
    // lng: 'zh', // Or explicitly set language, but detector is preferred
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: false, // Recommended for React Native
    },
  });

export default i18n;
