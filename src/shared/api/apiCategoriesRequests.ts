import { QueryFunctionContext } from '@tanstack/react-query';
import { axiosInstance } from './apiBase';
import { Category } from '../types/categoryTypes';
import { FinancialOperationTypeValue } from '../types/globalTypes';
import { createUrlWithSearchParams } from 'hihhhello-utils';

const getAll = (
  input?: {
    searchParams?: {
      type: FinancialOperationTypeValue;
    };
  } & Partial<QueryFunctionContext>,
) =>
  axiosInstance
    .get<Category[]>(
      createUrlWithSearchParams({
        url: '/categories',
        searchParams: input?.searchParams,
      }),
    )
    .then(({ data }) => data);

const createOne = ({
  body,
}: {
  body: { name: string; type: FinancialOperationTypeValue };
}) =>
  axiosInstance.post<Category>('/categories', body).then(({ data }) => data);

const deleteOne = ({ params }: { params: { categoryId: number } }) =>
  axiosInstance
    .delete(`/categories/${params.categoryId}`)
    .then(({ data }) => data);

export const apiCategoriesRequests = {
  getAll,
  createOne,
  deleteOne,
};
