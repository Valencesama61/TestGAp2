import { createStackNavigator } from '@react-navigation/stack';
import CardsListScreen from '../features/cards/screens/CardsListScreen';
import CardDetailScreen from '../features/cards/screens/CardDetailScreen';

const Stack = createStackNavigator();

function CardsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CardsList" 
        component={CardsListScreen}
        options={{ title: 'Cartes' }}
      />
      <Stack.Screen 
        name="CardDetail" 
        component={CardDetailScreen}
        options={({ route }) => ({ title: route.params.cardName })}
      />
    </Stack.Navigator>
  );
}