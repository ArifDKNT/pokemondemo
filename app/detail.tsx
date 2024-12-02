// app/card/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { usePokemonCards } from '@/contexts/pokemonContext';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/lib/Card';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedScrollView = Animated.createAnimatedComponent(
  Animated.ScrollView
);

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { cards } = usePokemonCards();
  const { user, updateAppUser } = useUser();
  const [card, setCard] = useState<Card | null>(null);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const foundCard = cards.find((c) => c.id === id);
    if (foundCard) {
      setCard(foundCard);
    }
  }, [id, cards]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity,
    };
  });

  const isCardSaved = user?.cards.includes(id as string);

  const handleSaveCard = async () => {
    if (!user || !card) return;

    const updatedCards = isCardSaved
      ? user.cards.filter((cardId) => cardId !== id)
      : [...user.cards, id as string];

    const updatedUser = {
      ...user,
      cards: updatedCards,
    };

    await updateAppUser(updatedUser);
  };

  if (!card) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <AnimatedScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { minHeight: SCREEN_HEIGHT + HEADER_SCROLL_DISTANCE },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.type}>Type: {card.supertype}</Text>
          {card.hp && <Text style={styles.hp}>HP: {card.hp}</Text>}

          {card.types && card.types.length > 0 && (
            <Text style={styles.types}>Types: {card.types.join(', ')}</Text>
          )}

          {card.attacks && card.attacks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attacks</Text>
              {card.attacks.map((attack, index) => (
                <View key={index} style={styles.attack}>
                  <Text style={styles.attackName}>{attack.name}</Text>
                  <Text style={styles.attackDamage}>
                    Damage: {attack.damage}
                  </Text>
                  <Text style={styles.attackText}>{attack.text}</Text>
                </View>
              ))}
            </View>
          )}

          {card.weaknesses && card.weaknesses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weaknesses</Text>
              {card.weaknesses.map((weakness, index) => (
                <Text key={index}>
                  {weakness.type}: {weakness.value}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Set Details</Text>
            <Text>Set: {card.set.name}</Text>
            <Text>Series: {card.set.series}</Text>
            <Text>Release Date: {card.set.releaseDate}</Text>
          </View>
        </View>
      </AnimatedScrollView>

      <Animated.View style={[styles.header, headerStyle]}>
        <Image
          source={{ uri: card.images.large }}
          style={styles.cardImage}
          contentFit='contain'
        />
      </Animated.View>

      <Pressable
        style={styles.saveButton}
        onPress={handleSaveCard}
        hitSlop={20}
      >
        <Ionicons
          name={isCardSaved ? 'heart' : 'heart-outline'}
          size={28}
          color={isCardSaved ? '#ff3b30' : '#fff'}
        />
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={20}
      >
        <Ionicons name='close' size={28} color='#fff' />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 40,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardImage: {
    width: '90%',
    height: '90%',
  },
  saveButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    marginBottom: 5,
  },
  hp: {
    fontSize: 18,
    marginBottom: 5,
  },
  types: {
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attack: {
    marginBottom: 15,
  },
  attackName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attackDamage: {
    fontSize: 14,
    marginVertical: 2,
  },
  attackText: {
    fontSize: 14,
  },
});
