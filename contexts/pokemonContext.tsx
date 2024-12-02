// context/ProductContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { storeCards, getCards } from '@/utils/storage';
import { fetchCards } from '@/lib/fetcher';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@/lib/Card';

interface PokemonCardsContextType {
  cards: Array<Card>;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  currentPage: number;
}

const PokemonCardsContext = createContext<PokemonCardsContextType | undefined>(
  undefined
);

export const PokemonCardsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [cards, setCards] = useState<Array<Card>>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const loadCards = async (page: number = 1) => {
    const { cards: fetchedCards, totalCount } = await fetchCards(
      page,
      PAGE_SIZE
    );

    // Calculate if there are more pages
    const hasMorePages = page * PAGE_SIZE < totalCount;
    setHasMore(hasMorePages);

    const imagesToPrefetch = fetchedCards.map((card) => card.images.small);
    try {
      const prefetchTasks = imagesToPrefetch.map((imageUrl) =>
        Image.prefetch(imageUrl)
      );
      await Promise.all(prefetchTasks);
    } catch (error) {
      console.error('Error prefetching images:', error);
    }

    return { cards: fetchedCards, totalCount };
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log('Loading page:', currentPage + 1);

    try {
      const nextPage = currentPage + 1;
      const { cards: newCards } = await loadCards(nextPage);

      if (newCards.length > 0) {
        setCards((prev) => [...prev, ...newCards]);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more cards:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const storedProducts = await getCards();
        if (storedProducts.cards.length > 0) {
          setCards(storedProducts.cards);
        } else {
          const { cards: freshCards } = await loadCards(1);
          setCards(freshCards);
          await storeCards(freshCards);
        }
      } catch (error) {
        console.error('Error in initial load:', error);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  return (
    <PokemonCardsContext.Provider
      value={{
        cards,
        loading,
        hasMore,
        loadMore,
        currentPage,
      }}
    >
      {children}
    </PokemonCardsContext.Provider>
  );
};

export const usePokemonCards = (): PokemonCardsContextType => {
  const context = useContext(PokemonCardsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
