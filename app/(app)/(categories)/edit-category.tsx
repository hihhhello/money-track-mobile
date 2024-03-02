import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/shared/api/api';
import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';
import { TextInput } from '@/shared/ui/TextInput';

export default function EditCategoryModal() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    categoryId: string;
    categoryType: FinancialOperationTypeValue;
    categoryName: string;
  }>();
  const insets = useSafeAreaInsets();
  const [categoryName, setCategoryName] = useState(searchParams.categoryName);

  const { mutate: apiCreateCategory, ...createCategoryMutation } = useMutation({
    mutationFn: api.categories.createOne,
    mutationKey: ['api.categories.createOne'],
    onSuccess: () => {
      router.back();
    },
  });

  const { mutate: apiDeleteCategory, ...deleteCategoryMutation } = useMutation({
    mutationFn: api.categories.deleteOne,
    mutationKey: ['api.categories.deleteOne'],
    onSuccess: () => {
      router.back();
    },
  });

  const handleEditCategory = () => {};

  const handleDeleteCategory = () => {
    if (!searchParams.categoryId) {
      return;
    }

    apiDeleteCategory({
      params: { categoryId: Number(searchParams.categoryId) },
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
        title={createCategoryMutation.isPending ? 'Loading...' : 'Edit'}
        onPress={handleEditCategory}
      />

      <Button
        title={deleteCategoryMutation.isPending ? 'Loading...' : 'Delete'}
        onPress={handleDeleteCategory}
      />

      <StatusBar style="light" />
    </View>
  );
}
