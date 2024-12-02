// lib/fetcher.ts
import { DEV_BASE_URL } from '@/lib/api';
import { Card, CardDetail } from './Card';

export const fetchCards = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{
  cards: Card[];
  totalCount: number;
}> => {
  const url = new URL(`${DEV_BASE_URL}/v2/cards`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('pageSize', pageSize.toString());

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
      return { cards: [], totalCount: 0 };
    }

    const data = JSON.parse(text);
    if (!data || !data.data) {
      return { cards: [], totalCount: 0 };
    }

    // No transformation needed as the API response matches the Card interface
    const cards: Card[] = data.data;

    return {
      cards,
      totalCount: data.totalCount || data.count || cards.length,
    };
  } catch (error) {
    console.error('Error fetching cards:', error);
    return { cards: [], totalCount: 0 };
  }
};

export const fetchCardDetailById = async (
  id: string
): Promise<CardDetail | null> => {
  const url = new URL(`${DEV_BASE_URL}/v2/cards/${id}`);
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    const data = JSON.parse(text);
    if (!data || !data.data) {
      return null;
    }

    // No transformation needed as the API response matches the CardDetail interface
    return data.data as CardDetail;
  } catch (error) {
    console.error('Error fetching card detail:', error);
    return null;
  }
};
