// app/(tabs)/profile.tsx
import React from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { usePokemonCards } from '@/contexts/pokemonContext';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/lib/Card';

export default function ProfileScreen() {
  const router = useRouter();
  const { cards } = usePokemonCards();
  const { user } = useUser();

  const savedCards = cards.filter((card) => user?.cards.includes(card.id));

  const renderItem = ({ item: card }: { item: Card }) => (
    <Pressable
      style={styles.card}
      onPress={() => {
        router.navigate({
          pathname: `/detail`,
          params: {
            id: card.id,
          },
        });
      }}
    >
      <Image
        source={{ uri: card.images.small }}
        style={styles.cardImage}
        contentFit='contain'
      />
      <Text style={styles.cardName}>{card.name}</Text>
    </Pressable>
  );

  if (!user?.cards.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No saved cards yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Cards</Text>
      <FlatList
        data={savedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  listContent: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  cardName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});
