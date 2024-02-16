import {
  Text as BaseText,
  TextProps as BaseTextProps,
  Platform,
} from 'react-native';

export const Text = ({ style, ...props }: BaseTextProps) => (
  <BaseText
    {...props}
    style={[
      {
        fontFamily: Platform.select({
          ios: 'Kanit_400Regular',
        }),
      },
      style,
    ]}
  />
);
