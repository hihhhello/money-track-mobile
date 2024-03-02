import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/shared/api/api';
import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';
import { TextInput } from '@/shared/ui/TextInput';

export default function AddCategoryModal() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    categoryType: FinancialOperationTypeValue;
  }>();
  const insets = useSafeAreaInsets();
  const [categoryName, setCategoryName] = useState('');

  const { mutate: apiCreateCategory, ...createCategoryMutation } = useMutation({
    mutationFn: api.categories.createOne,
    mutationKey: ['api.categories.createOne'],
    onSuccess: () => {
      router.back();
    },
  });

  const handleAddCategory = () => {
    if (!searchParams.categoryType) {
      return;
    }

    apiCreateCategory({
      body: {
        name: categoryName,
        type: searchParams.categoryType,
      },
    });
  };

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: insets.top,
      }}
    >
      <TextInput
        placeholder="Category name"
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <Button
        title={
          createCategoryMutation.isPending ? 'Loading...' : 'Add new category'
        }
        onPress={handleAddCategory}
      />

      <StatusBar style="light" />
    </View>
  );
}
