import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts, selectBooks, selectBooksLoading, selectTotalPages, setFilters, selectFilters } from '../../redux/slices/bookSlice';
import BookCard from '../../components/BookCard';
import Pagination from '../../components/Pagination';
import { PageLoader } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { BOOK_CATEGORIES } from '../../utils/constants';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'popular',   label: 'Most Popular' },
];

const BooksPage = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage]           = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const dispatch   = useDispatch();
  const books      = useSelector(selectBooks);
  const isLoading  = useSelector(selectBooksLoading);
  const totalPages = useSelector(selectTotalPages);
  const filters    = useSelector(selectFilters);

  const urlSearch   = searchParams.get('search')   || '';
  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    if (urlSearch)   dispatch(setFilters({ search: urlSearch }));
    if (urlCategory) dispatch(setFilters({ category: urlCategory }));
  }, [urlSearch, urlCategory, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ page, size: 12, ...filters }));
  }, [dispatch, page, filters]);

  const updateFilter = (key, val) => {
    dispatch(setFilters({ [key]: val }));
    setPage(0);
  };

  const clearAll = () => {
    dispatch(setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', rating: '' }));
    setPage(0);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.search;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card/50 border-b border-dark-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="page-header">Browse Books</h1>
          <p className="page-sub">{books.length > 0 ? `${books.length} books found` : 'Explore our collection'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${filterOpen ? 'fixed inset-0 z-50 bg-black/60' : 'hidden'} lg:block lg:relative lg:bg-transparent lg:z-auto lg:inset-auto`}
            onClick={(e) => e.target === e.currentTarget && setFilterOpen(false)}>
            <div className={`${filterOpen ? 'fixed left-0 top-0 h-full w-72 overflow-y-auto' : ''} lg:static lg:w-60 lg:h-auto card p-5 space-y-6`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-dark-text">Filters</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">Clear all</button>}
                  <button onClick={() => setFilterOpen(false)} className="lg:hidden p-1 text-dark-muted hover:text-dark-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-medium text-dark-text mb-3">Category</h4>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {BOOK_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="category" value={cat}
                        checked={filters.category === cat}
                        onChange={() => updateFilter('category', filters.category === cat ? '' : cat)}
                        className="accent-primary-500" />
                      <span className={`text-sm transition-colors ${filters.category === cat ? 'text-primary-400' : 'text-dark-muted group-hover:text-dark-text'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-medium text-dark-text mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="input text-sm py-2" />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="input text-sm py-2" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-medium text-dark-text mb-3">Min Rating</h4>
                <div className="space-y-1.5">
                  {[4, 3, 2, 1].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="rating" checked={filters.rating === String(r)}
                        onChange={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
                        className="accent-primary-500" />
                      <span className={`text-sm flex items-center gap-1 transition-colors ${filters.rating === String(r) ? 'text-primary-400' : 'text-dark-muted group-hover:text-dark-text'}`}>
                        {'★'.repeat(r)}{'☆'.repeat(5 - r)} & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <button onClick={() => setFilterOpen(true)}
                className="lg:hidden btn-ghost btn-sm border border-dark-border flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
                className="input py-2 w-auto text-sm">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.search   && <span className="badge-gold badge gap-1">{filters.search}<button onClick={() => updateFilter('search','')}><X className="w-3 h-3" /></button></span>}
                {filters.category && <span className="badge-gold badge gap-1">{filters.category}<button onClick={() => updateFilter('category','')}><X className="w-3 h-3" /></button></span>}
                {filters.minPrice && <span className="badge-gold badge gap-1">Min ₹{filters.minPrice}<button onClick={() => updateFilter('minPrice','')}><X className="w-3 h-3" /></button></span>}
                {filters.maxPrice && <span className="badge-gold badge gap-1">Max ₹{filters.maxPrice}<button onClick={() => updateFilter('maxPrice','')}><X className="w-3 h-3" /></button></span>}
                {filters.rating   && <span className="badge-gold badge gap-1">{filters.rating}★ & up<button onClick={() => updateFilter('rating','')}><X className="w-3 h-3" /></button></span>}
              </div>
            )}

            {isLoading ? <PageLoader /> : books.length === 0 ? (
              <EmptyState title="No books found" description="Try adjusting your filters or search query." />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
