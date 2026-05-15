
import { ProductModel } from '../../../../packages/modules/products/product.model';
import { describe, it, expect } from '@jest/globals';

describe('ProductModel Search (FlexSearch)', () => {
  it('should find products by title', () => {
    const results = ProductModel.fullTextSearch('Obsidian');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Obsidian');
  });

  it('should find products by description', () => {
    const results = ProductModel.fullTextSearch('heavyweight');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].description).toContain('heavyweight');
  });

  it('should support partial matches (FlexSearch feature)', () => {
    // "crew" should match "Crew Neck"
    const results = ProductModel.fullTextSearch('crew');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.title.toLowerCase().includes('crew'))).toBe(true);
  });

  it('should find products by category', () => {
    const results = ProductModel.fullTextSearch('Outerwear');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.category === 'Outerwear')).toBe(true);
  });

  it('should update index when a product is created', () => {
    const newProduct = ProductModel.create({
      title: 'Xyzzy Special',
      description: 'Unique item',
      status: 'published',
      category: 'Test',
      tags: ['special'],
      variants: [],
      images: [],
      thumbnail: ''
    });

    const results = ProductModel.fullTextSearch('Xyzzy');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(newProduct.id);
  });

  it('should return empty array for non-matching query', () => {
    const results = ProductModel.fullTextSearch('nonexistent_product_abc_123');
    expect(results.length).toBe(0);
  });

  it('should return all products for empty query', () => {
    const all = ProductModel.findAll();
    const results = ProductModel.fullTextSearch('');
    expect(results.length).toBe(all.length);
  });
});
