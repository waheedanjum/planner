import { Quotes } from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTheme } from '@/theme';

const Stack = createStackNavigator<RootStackParamList>();

function QuotesStack() {
	const { variant } = useTheme();
	return (
		<Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Quotes" component={Quotes} />
		</Stack.Navigator>
	);
}

export default QuotesStack;
