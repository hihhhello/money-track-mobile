import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import { api } from '@/shared/api/api';
import { Text } from '@/shared/ui/Text';

export default function CategoriesScreen() {
  const categoriesQuery = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  return (
    <View>
      <Text>Categories</Text>
    </View>
  );
}
