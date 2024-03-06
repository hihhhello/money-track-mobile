import { forwardRef } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const CheckIcon = forwardRef<Svg, SvgProps>(({ ...iconProps }, ref) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="24"
      height="24"
      ref={ref}
      {...iconProps}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </Svg>
  );
});
