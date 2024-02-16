import Svg, { Path, SvgProps } from 'react-native-svg';

export const MinusIcon = ({ ...iconProps }: SvgProps) => {
  return (
    <Svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...iconProps}
    >
      <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </Svg>
  );
};
