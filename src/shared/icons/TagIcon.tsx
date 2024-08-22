import Svg, { Path, SvgProps } from 'react-native-svg';

export const TagIcon = ({ ...iconProps }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    fill="none"
    {...iconProps}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6h.008v.008H6V6Z"
    />
  </Svg>
);