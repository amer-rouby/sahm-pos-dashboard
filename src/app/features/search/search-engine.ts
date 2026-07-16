import { Product, ProductCategory, SearchResult } from '../../core/models/models';

const arabicSearchAliases: Record<string, string[]> = {
  'Classic Beef Burger': ['برجر لحم كلاسيك', 'برجر', 'لحم', 'كلاسيك'],
  'Smoked Mushroom Burger': ['برجر مشروم مدخن', 'برجر', 'مشروم', 'مدخن', 'نباتي'],
  'Chicken Ranch Wrap': ['راب دجاج رانش', 'دجاج', 'رانش', 'راب'],
  'Breakfast Egg Muffin': ['مافن بيض للإفطار', 'مافن', 'بيض', 'إفطار', 'افطار'],
  'Falafel Slider Box': ['بوكس سلايدر فلافل', 'فلافل', 'سلايدر'],
  'Loaded Fries': ['بطاطس محملة', 'بطاطس', 'إضافات', 'اضافات'],
  'Crispy Onion Rings': ['حلقات بصل مقرمشة', 'بصل', 'مقرمشة', 'إضافات', 'اضافات'],
  'Iced Lemon Mint': ['ليمون نعناع مثلج', 'ليمون', 'نعناع', 'مشروبات'],
  'Chocolate Pudding': ['بودينج شوكولاتة', 'شوكولاتة', 'حلويات'],
  'Caramel Date Sundae': ['صنداي تمر بالكراميل', 'تمر', 'كراميل', 'حلويات']
};

const arabicCategoryAliases: Record<ProductCategory, string[]> = {
  Burgers: ['برجر', 'ساندوتشات'],
  Sides: ['إضافات', 'اضافات', 'جانبي'],
  Drinks: ['مشروبات', 'مشروب'],
  Desserts: ['حلويات', 'حلوى'],
  Breakfast: ['إفطار', 'افطار', 'فطار']
};

export function searchProducts(
  products: Product[],
  query: string,
  category: ProductCategory | 'All',
  limit = 8
): SearchResult[] {
  const normalizedQuery = normalizeSearch(query);
  return products
    .filter((product) => category === 'All' || product.category === category)
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }
      return productSearchText(product).includes(normalizedQuery);
    })
    .sort((a, b) => scoreProduct(b, normalizedQuery) - scoreProduct(a, normalizedQuery))
    .slice(0, limit)
    .map((product) => ({ product, highlightedName: highlightMatch(product.name, normalizedQuery) }));
}

function productSearchText(product: Product): string {
  return normalizeSearch([
    product.name,
    product.category,
    ...product.tags,
    ...product.allergens,
    ...(arabicSearchAliases[product.name] ?? []),
    ...(arabicCategoryAliases[product.category] ?? [])
  ].join(' '));
}

function scoreProduct(product: Product, query: string): number {
  if (!query) {
    return 0;
  }

  const name = normalizeSearch(product.name);
  const aliases = (arabicSearchAliases[product.name] ?? []).map(normalizeSearch);

  if (name.startsWith(query) || aliases.some((alias) => alias.startsWith(query))) {
    return 3;
  }
  if (name.includes(query) || aliases.some((alias) => alias.includes(query))) {
    return 2;
  }
  return product.tags.some((tag) => normalizeSearch(tag).includes(query)) ? 1 : 0;
}

function highlightMatch(value: string, query: string): string {
  if (!query) {
    return value;
  }
  const index = normalizeSearch(value).indexOf(query);
  if (index < 0) {
    return value;
  }
  return `${value.slice(0, index)}<mark>${value.slice(index, index + query.length)}</mark>${value.slice(index + query.length)}`;
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ');
}
