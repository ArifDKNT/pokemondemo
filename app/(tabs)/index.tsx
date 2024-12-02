// app/(tabs)/index.tsx
import React from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ListRenderItem,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { usePokemonCards } from '@/contexts/pokemonContext';
import { Card } from '@/lib/Card';

export default function TabOneScreen(): JSX.Element {
  const { cards, loading, hasMore, loadMore } = usePokemonCards();
  const router = useRouter();

  const handleLoadMore = (): void => {
    console.log('Loading more...', { hasMore, loading });
    if (!loading && hasMore) {
      loadMore();
    }
  };

  const renderItem: ListRenderItem<Card> = ({ item: card }) => (
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

  const renderFooter = (): JSX.Element => (
    <View style={styles.footer}>
      {loading && <ActivityIndicator size='large' />}
      {!hasMore && <Text>No more cards to load</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList<Card>
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
