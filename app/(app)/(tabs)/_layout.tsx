import { Tabs, useRouter } from 'expo-router';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '@/components/ui';
import { colors } from '@/styles/tokens';

const TAB_CONFIG: Record<string, { label: string; icon: IconName; iconFocused: IconName }> = {
  index: { label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  activities: { label: 'Stats', icon: 'stats-outline', iconFocused: 'stats' },
  goals: { label: 'Goals', icon: 'trophy-outline', iconFocused: 'trophy' },
  profile: { label: 'Profile', icon: 'person', iconFocused: 'person-filled' },
};

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const config = TAB_CONFIG[name];
  if (!config) return null;

  return (
    <Icon
      name={focused ? config.iconFocused : config.icon}
      size={24}
      color={focused ? colors.primary[500] : colors.text.muted}
    />
  );
}

function CenterFAB() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/(app)/log-activity')}
      className="w-14 h-14 -mt-5 rounded-full bg-primary-500 items-center justify-center shadow-lg active:scale-95"
      style={{
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Icon name="add" size={28} color="#000000" />
    </Pressable>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.subtle,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => <TabBarIcon name="activities" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fab"
        options={{
          title: '',
          tabBarButton: () => (
            <View className="flex-1 items-center justify-center">
              <CenterFAB />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => <TabBarIcon name="goals" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
