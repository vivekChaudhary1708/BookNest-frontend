import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Edit3, Trash2, BookPlus, Package } from 'lucide-react';
import { fetchProducts, deleteProduct, updateProduct, selectBooks, selectBooksLoading } from '../../redux/slices/bookSlice';
import { PageLoader } from '../../components/Loader';
import { formatPrice, stockLabel } from '../../utils/helpers';
import { BOOK_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ManageBooksPage = () => {
  const dispatch  = useDispatch();
  const books     = useSelector(selectBooks);
  const isLoading = useSelector(selectBooksLoading);
  const [search, setSearch]   = useState('');
  const [editing, setEditing] = useState(null); // book being edited
  const [stockEdit, setStockEdit] = useState({});

  useEffect(() => { dispatch(fetchProducts({})); }, [dispatch]);

  const filtered = books.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const r = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(r)) toast.success('Book deleted');
  };

  const handleStockUpdate = async (book) => {
    const qty = stockEdit[book.id];
    if (qty === undefined) return;
    await dispatch(updateProduct({ id: book.id, data: { ...book, stockQuantity: parseInt(qty) } }));
    toast.success('Stock updated');
    setStockEdit((p) => { const n = { ...p }; delete n[book.id]; return n; });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-header">Manage Books</h1>
          <p className="page-sub">{books.length} books in catalog</p>
        </div>
        <Link to="/admin/add-book" className="btn-primary btn-sm flex items-center gap-2">
          <BookPlus className="w-4 h-4" /> Add Book
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..." className="input pl-10" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                {['Book','Author','Category','Price','Stock','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-dark-muted">No books found</td></tr>
              ) : filtered.map((book) => {
                const stock = stockLabel(book.stockQuantity);
                return (
                  <tr key={book.id} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.imageUrl || `https://placehold.co/36x48/1E293B/F59E0B?text=B`}
                          alt={book.title} onError={(e) => { e.target.src = `https://placehold.co/36x48/1E293B/F59E0B?text=B`; }}
                          className="w-9 h-12 object-cover rounded-lg flex-shrink-0" />
                        <div>
                          <p className="font-medium text-dark-text line-clamp-1 max-w-[160px]">{book.title}</p>
                          <p className="text-xs text-dark-muted">ID: {book.id?.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-muted">{book.author}</td>
                    <td className="px-4 py-3"><span className="badge-blue badge text-[10px]">{book.category}</span></td>
                    <td className="px-4 py-3">
                      <p className="text-primary-400 font-semibold">{formatPrice(book.discountPrice || book.price)}</p>
                      {book.discountPrice && <p className="text-xs text-dark-muted line-through">{formatPrice(book.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input type="number" min={0}
                          value={stockEdit[book.id] !== undefined ? stockEdit[book.id] : book.stockQuantity}
                          onChange={(e) => setStockEdit((p) => ({ ...p, [book.id]: e.target.value }))}
                          className="input py-1 px-2 text-xs w-16 text-center" />
                        {stockEdit[book.id] !== undefined && (
                          <button onClick={() => handleStockUpdate(book)}
                            className="btn-primary btn-sm py-1 text-xs">Save</button>
                        )}
                        <span className={`badge text-[10px] ${stock.cls}`}>{stock.text}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/edit-book/${book.id}`}
                          className="p-1.5 rounded-lg text-dark-muted hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(book.id, book.title)}
                          className="p-1.5 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooksPage;
