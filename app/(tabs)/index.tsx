import React, { useCallback, useRef } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Dimensions,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { usePokemonCards } from '@/contexts/pokemonContext';
import { Card } from '@/lib/Card';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTabBar } from '@/contexts/TabBarProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const CARD_OVERLAP = CARD_WIDTH / 2;
const ITEM_SIZE = CARD_HEIGHT - CARD_OVERLAP;
const VISIBLE_CARDS = 5;

// Animateds
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFlatList = Animated.createAnimatedComponent<any>(FlatList);

interface CardItemProps {
  card: Card;
  index: number;
}

export default function PokemonCardList(): JSX.Element {
  const { cards, loading, hasMore, loadMore } = usePokemonCards();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { showTabBarAnimated, hideTabBarAnimated } = useTabBar();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const isScrolling = useRef(false);

  // Hide tab bar when scroll starts
  const handleScrollStart = () => {
    if (!isScrolling.current) {
      isScrolling.current = true;
      hideTabBarAnimated(); // Hide the tab bar
    }
  };

  // Show tab bar when scroll ends
  const handleScrollEnd = () => {
    if (isScrolling.current) {
      isScrolling.current = false;
      showTabBarAnimated(); // Show the tab bar
    }
  };
  // animated pokemon card
  const CardItem = React.memo(({ card, index }: CardItemProps) => {
    const pressed = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
      ];

      const translateY = interpolate(
        scrollY.value,
        inputRange,
        [0, 0, -ITEM_SIZE],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [1, 1, 0.95],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        scrollY.value,
        [
          (index - VISIBLE_CARDS) * ITEM_SIZE,
          (index - VISIBLE_CARDS + 1) * ITEM_SIZE,
        ],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateY }, { scale: scale * pressed.value }],
        opacity,
        zIndex: -index,
      };
    });

    return (
      <AnimatedView style={[styles.cardContainer, animatedStyle]}>
        <AnimatedPressable
          style={styles.cardPressable}
          onPressIn={() => {
            pressed.value = withSpring(0.98);
          }}
          onPressOut={() => {
            pressed.value = withSpring(1);
          }}
          onPress={() => {
            router.navigate({
              pathname: `/detail`,
              params: { id: card.id },
            });
          }}
        >
          <Image
            source={{ uri: card.images.large }}
            style={styles.cardImage}
            contentFit='cover'
            transition={200}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{card.name}</Text>
            {card.types && (
              <Text style={styles.cardType}>{card.types.join(' / ')}</Text>
            )}
          </View>
        </AnimatedPressable>
      </AnimatedView>
    );
  });

  const renderItem: ListRenderItem<Card> = useCallback(
    ({ item: card, index }) => <CardItem card={card} index={index} />,
    []
  );

  const keyExtractor = useCallback((item: Card) => item.id, []);

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        {loading && <ActivityIndicator size='large' />}
        {!hasMore && <Text>No more cards to load</Text>}
      </View>
    ),
    [loading, hasMore]
  );

  // on end reached load more pokemon cards
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  if (!cards.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={handleScrollStart}
        onScrollEndDrag={handleScrollEnd}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={ITEM_SIZE}
        decelerationRate='fast'
        snapToAlignment='start'
        initialNumToRender={VISIBLE_CARDS}
        maxToRenderPerBatch={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: SCREEN_HEIGHT * 0.1,
    paddingBottom: SCREEN_HEIGHT * 0.4,
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: CARD_HEIGHT,
    marginBottom: -CARD_OVERLAP,
    justifyContent: 'center',
  },
  cardPressable: {
    borderRadius: 8,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    height: CARD_HEIGHT,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardType: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
