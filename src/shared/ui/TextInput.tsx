import {
  TextInput as BaseTextInput,
  TextInputProps as BaseTextInputProps,
  Platform,
} from 'react-native';

import { COLORS } from '../theme';

export const TextInput = ({ style, ...props }: BaseTextInputProps) => (
  <BaseTextInput
    {...props}
    style={[
      {
        fontFamily: Platform.select({
          ios: 'Kanit_400Regular',
        }),
        backgroundColor: COLORS.main.paper,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 12,
      },
      style,
    ]}
  />
);
