import { isEqual, upperFirst } from 'lodash';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from './Text';
import { CheckIcon } from '../icons/CheckIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { COLORS } from '../theme';
import { alpha } from '../utils/helpers';
import { useBoolean } from '../utils/useBoolean';

import {
  TransactionPeriodFilter,
  TransactionPeriodFilterType,
} from '@/shared/types/transactionTypes';

type TransactionsPeriodFilterSelectProps = {
  value: TransactionPeriodFilterType;
  handleChangeValue: (newFilter: TransactionPeriodFilterType) => void;
};

const AnimatedChevronDownIcon =
  Animated.createAnimatedComponent(ChevronDownIcon);

export const TransactionsPeriodFilterSelect = ({
  value,
  handleChangeValue,
}: TransactionsPeriodFilterSelectProps) => {
  const { value: isMenuOpen, toggle: handleToggleMenu } = useBoolean(false);

  // const isMenuOpen = false;
  // const handleToggleMenu = () => {};

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isMenuOpen ? 1 : 0, {
      duration: 150,
      easing: Easing.linear,
    });
  }, [isMenuOpen, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View
      style={{
        position: 'relative',
      }}
    >
      <Pressable
        onPress={handleToggleMenu}
        style={({ pressed }) => [
          pressed && {
            opacity: 0.8,
          },
          {
            backgroundColor: COLORS.main.blue,
            borderRadius: 9999,
            minWidth: 110,
            paddingHorizontal: 16,
            paddingVertical: 6,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
          }}
        >
          {upperFirst(value)}
        </Text>

        <AnimatedChevronDownIcon
          style={animatedStyle}
          width={20}
          height={20}
          color="#fff"
        />
      </Pressable>

      {isMenuOpen && (
        <View
          style={{
            position: 'absolute',
            zIndex: 9999,
            marginTop: 4,
            maxHeight: 224,
            width: '100%',
            overflow: 'visible',
            borderRadius: 6,
            backgroundColor: '#fff',
            paddingVertical: 8,
            top: '100%',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
          }}
        >
          {Object.values(TransactionPeriodFilter).map((period) => (
            <Pressable
              onPress={() => {
                handleChangeValue(period);
                handleToggleMenu();
              }}
              key={period}
              style={({ pressed }) => [
                pressed && { backgroundColor: alpha(COLORS.main.blue, 0.1) },
                {
                  position: 'relative',
                  paddingLeft: 12,
                  paddingRight: 36,
                  paddingVertical: 8,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  ...(isEqual(period, value) && {
                    backgroundColor: COLORS.main.blue,
                  }),
                },
              ]}
            >
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 12,
                      width: '100%',
                      ...(isEqual(period, value) && {
                        color: '#fff',
                      }),
                    }}
                    numberOfLines={1}
                  >
                    {upperFirst(period)}
                  </Text>
                </View>

                {isEqual(period, value) ? (
                  <CheckIcon width={20} height={20} color="#fff" />
                ) : null}
              </>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
