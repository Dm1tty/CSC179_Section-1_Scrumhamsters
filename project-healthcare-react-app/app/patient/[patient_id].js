import { useLocalSearchParams, useGlobalSearchParams, usePathname } from 'expo-router';
import { Text } from 'react-native';

export default function Page({ route }) {
  const { localParams } = useLocalSearchParams();
  const { globalParams } = useGlobalSearchParams();
  const { pathName } = usePathname();

  console.log(route)
  console.log(localParams);
  console.log(globalParams);
  console.log(pathName);
  return <Text>Viewing patient w/ id: {globalParams}</Text>;
}
