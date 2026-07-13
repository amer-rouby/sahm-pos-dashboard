import { describe, expect, it } from 'vitest';
import { products } from '../../core/mock-data';
import { searchProducts } from './search-engine';

describe('searchProducts', () => {
  it('filters by query and highlights the matching part', () => {
    const [result] = searchProducts(products, 'burger', 'All');

    expect(result.product.name).toContain('Burger');
    expect(result.highlightedName.toLowerCase()).toContain('<mark>burger</mark>');
  });

  it('finds products using Arabic translated names', () => {
    const [result] = searchProducts(products, 'برجر لحم كلاسيك', 'All');

    expect(result.product.name).toBe('Classic Beef Burger');
  });

  it('finds products using normalized Arabic spelling', () => {
    const [result] = searchProducts(products, 'اضافات', 'All');

    expect(result.product.category).toBe('Sides');
  });

  it('combines category filtering with tag matching', () => {
    const results = searchProducts(products, 'dessert', 'Desserts');

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.product.category === 'Desserts')).toBe(true);
  });
});
