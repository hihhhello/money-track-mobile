import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import {
  Button,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';

import { api } from '@/shared/api/api';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { COLORS } from '@/shared/theme';
import { Text } from '@/shared/ui/Text';

export default function CategoriesScreen() {
  const categoriesQuery = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categoriesQuery.data}
        refreshControl={
          <RefreshControl
            refreshing={categoriesQuery.isFetching}
            onRefresh={categoriesQuery.refetch}
          />
        }
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                paddingBottom: 16,
              }}
            >
              <View
                style={[
                  {
                    height: 64,
                    width: 64,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: COLORS.main.paper,
                  },
                ]}
              >
                <SquaresPlusIcon width={32} height={32} color="#000" />
              </View>

              <Text
                numberOfLines={1}
                style={{ width: 80, textAlign: 'center' }}
              >
                {item.name}
              </Text>
            </View>
          </Pressable>
        )}
      />

      <Link href="add-category" asChild>
        <Button title="Add new category" />
      </Link>
    </View>
  );
}
