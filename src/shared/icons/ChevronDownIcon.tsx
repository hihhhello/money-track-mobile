import { forwardRef } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ChevronDownIcon = forwardRef<Svg, SvgProps>(
  ({ ...iconProps }, ref) => {
    return (
      <Svg
        ref={ref}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width="24"
        height="24"
        {...iconProps}
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </Svg>
    );
  },
);
