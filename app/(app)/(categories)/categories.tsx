import { useQuery } from '@tanstack/react-query';
import { Link, router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
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
import { Category } from '@/shared/types/categoryTypes';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { Text } from '@/shared/ui/Text';

export default function CategoriesScreen() {
  const navigation = useNavigation();

  const categoriesQuery = useQuery({
    queryFn: api.categories.getAll,
    queryKey: ['api.categories.getAll'],
  });

  const refetchCategories = useCallback(() => {
    categoriesQuery.refetch();
  }, [categoriesQuery]);

  useEffect(() => {
    navigation.addListener('focus', refetchCategories);

    return () => {
      navigation.removeListener('focus', refetchCategories);
    };
  }, [categoriesQuery, navigation, refetchCategories]);

  const reducedCategories = useMemo(
    () =>
      categoriesQuery.data?.reduce<{
        deposit: Category[];
        expense: Category[];
      }>(
        (categoriesAccumulator, category) => {
          if (category.type === FinancialOperationType.DEPOSIT) {
            return {
              ...categoriesAccumulator,
              deposit: [...categoriesAccumulator.deposit, category],
            };
          } else
            return {
              ...categoriesAccumulator,
              expense: [...categoriesAccumulator.expense, category],
            };
        },
        {
          deposit: [],
          expense: [],
        },
      ),
    [categoriesQuery.data],
  );

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <View style={{ backgroundColor: COLORS.main.paper, flex: 1 }}>
        <Text>Expenses</Text>

        <FlatList
          data={reducedCategories?.expense}
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
            <Pressable
              onPress={() => {
                router.push({
                  pathname: 'edit-category',
                  params: {
                    categoryId: item.id,
                    categoryType: item.type,
                    categoryName: item.name,
                  },
                });
              }}
            >
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
                      backgroundColor: '#fff',
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

        <Link
          href={{
            pathname: 'add-category',
            params: {
              categoryType: FinancialOperationType.EXPENSE,
            },
          }}
          asChild
        >
          <Button title="Add new category" />
        </Link>
      </View>

      <View style={{ backgroundColor: COLORS.main.paper, flex: 1 }}>
        <Text>Deposits</Text>

        <FlatList
          data={reducedCategories?.deposit}
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
                      backgroundColor: '#fff',
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

        <Link
          href={{
            pathname: 'add-category',
            params: {
              categoryType: FinancialOperationType.DEPOSIT,
            },
          }}
          asChild
        >
          <Button title="Add new category" />
        </Link>
      </View>
    </View>
  );
}
