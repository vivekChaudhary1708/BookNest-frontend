import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../redux/slices/bookSlice';
import { BOOK_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AddBookPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isLoading = useSelector((s) => s.books.isLoading);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const imageUrl = watch('imageUrl');

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price:         parseFloat(data.price),
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
      stockQuantity: parseInt(data.stockQuantity),
    };
    const result = await dispatch(createProduct(payload));
    if (createProduct.fulfilled.match(result)) {
      toast.success('Book added successfully! 🎉');
      reset();
      navigate('/admin/books');
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, rules, as: As = 'input', children, ...rest }) => (
    <div>
      <label className="input-label">{label}</label>
      {As === 'select' ? (
        <select className={`input ${errors[name] ? 'input-error' : ''}`} {...register(name, rules)} {...rest}>
          <option value="">Select category</option>
          {BOOK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : As === 'textarea' ? (
        <textarea rows={4} className={`input resize-none ${errors[name] ? 'input-error' : ''}`}
          placeholder={placeholder} {...register(name, rules)} {...rest} />
      ) : (
        <input type={type} className={`input ${errors[name] ? 'input-error' : ''}`}
          placeholder={placeholder} {...register(name, rules)} {...rest} />
      )}
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="page-header mb-2">Add New Book</h1>
      <p className="page-sub mb-8">Fill in the details to add a book to the catalog</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image preview */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4">Book Cover</h3>
          <div className="flex gap-5 items-start">
            <div className="w-28 h-40 rounded-xl bg-dark-border/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <span className="text-dark-muted text-xs text-center px-2">Cover Preview</span>
              )}
            </div>
            <div className="flex-1">
              <Field label="Image URL" name="imageUrl" placeholder="https://example.com/book-cover.jpg"
                rules={{ required: 'Image URL is required', pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL' } }} />
              <p className="text-xs text-dark-muted mt-2">Enter the direct URL to the book cover image. Preview updates automatically.</p>
            </div>
          </div>
        </div>

        {/* Book details */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4">Book Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Book Title" name="title" placeholder="e.g. The Art of Clean Code"
                rules={{ required: 'Title is required' }} />
            </div>
            <Field label="Author Name" name="author" placeholder="e.g. Robert C. Martin"
              rules={{ required: 'Author is required' }} />
            <Field label="ISBN" name="isbn" placeholder="978-0-13-110362-7" />
            <Field label="Category" name="category" as="select" rules={{ required: 'Category is required' }} />
            <div className="sm:col-span-2">
              <Field label="Description" name="description" as="textarea" placeholder="Enter book description..."
                rules={{ required: 'Description is required', minLength: { value: 20, message: 'Min 20 characters' } }} />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-text mb-4">Pricing & Stock</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Original Price (₹)" name="price" type="number" placeholder="499"
              rules={{ required: 'Price is required', min: { value: 1, message: 'Must be > 0' } }} />
            <Field label="Discount Price (₹)" name="discountPrice" type="number" placeholder="399" />
            <Field label="Stock Quantity" name="stockQuantity" type="number" placeholder="100"
              rules={{ required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } }} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading} className="btn-primary px-8 py-3">
            {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-navy-700/40 border-t-navy-700 rounded-full animate-spin" />Saving...</span> : 'Save Book'}
          </button>
          <button type="button" onClick={() => navigate('/admin/books')} className="btn-ghost py-3">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddBookPage;
