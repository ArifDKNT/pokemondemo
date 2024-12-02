// app/card/[id].tsx
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { usePokemonCards } from '@/contexts/pokemonContext';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/lib/Card';
import { Ionicons } from '@expo/vector-icons';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { cards } = usePokemonCards();
  const { user, updateAppUser } = useUser();
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    const foundCard = cards.find((c) => c.id === id);
    if (foundCard) {
      setCard(foundCard);
    }
  }, [id, cards]);

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
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: card.name,
          headerRight: () => (
            <Pressable onPress={handleSaveCard} style={styles.saveButton}>
              <Ionicons
                name={isCardSaved ? 'heart' : 'heart-outline'}
                size={24}
                color={isCardSaved ? '#ff3b30' : '#000'}
              />
            </Pressable>
          ),
        }}
      />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: card.images.large }}
          style={styles.cardImage}
          contentFit='contain'
        />
      </View>

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
                <Text style={styles.attackDamage}>Damage: {attack.damage}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  cardImage: {
    width: '100%',
    height: 400,
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 20,
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
  saveButton: {
    marginRight: 15,
  },
});
