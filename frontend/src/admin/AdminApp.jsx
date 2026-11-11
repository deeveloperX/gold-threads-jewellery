import { useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiArchive,
  FiArrowDownRight,
  FiArrowUpRight,
  FiBox,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiGrid,
  FiLayers,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShield,
  FiTag,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { formatPrice, initialCategories, initialProducts } from './adminData';
import './admin.css';

const pageDetails = {
  '/admin': {
    eyebrow: 'YOUR STORE AT A GLANCE',
    title: 'Store overview',
    description: 'A snapshot of your catalogue in this preview.',
  },
  '/admin/products': {
    eyebrow: 'CATALOGUE',
    title: 'Products',
    description: 'Manage the pieces in your collection.',
  },
  '/admin/categories': {
    eyebrow: 'ORGANIZATION',
    title: 'Categories',
    description: 'Keep your collections beautifully organized.',
  },
};

const navigation = [
  { label: 'Overview', path: '/admin', icon: FiGrid, end: true },
  { label: 'Products', path: '/admin/products', icon: FiBox },
  { label: 'Categories', path: '/admin/categories', icon: FiLayers },
];

export default function AdminApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <AdminPreviewLogin onContinue={() => navigate('/admin')} />;
  }

  const page = pageDetails[pathname] ? pathname : '/admin';
  const activeProducts = products.filter((product) => product.isActive).length;
  const previewNotice = (
    <div className="admin-preview-notice" role="status">
      <FiAlertCircle aria-hidden="true" />
      <span>
        <strong>Preview only</strong>
        <span className="admin-preview-notice-copy">
          Sample data only. Changes stay in this browser session; login and backend are not connected.
        </span>
      </span>
      <span className="admin-preview-badge">NOT SECURED</span>
    </div>
  );

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <Link to="/admin" className="admin-brand" aria-label="Gold Threads admin overview">
          <span className="admin-brand-mark">GT</span>
          <span className="admin-brand-copy">
            <strong>GOLD THREADS</strong>
            <small>JEWELLERY · ADMIN</small>
          </span>
        </Link>

        <div className="admin-side-label">WORKSPACE</div>
        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {label === 'Products' && <span className="admin-nav-count">{products.length}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-store-card">
            <span className="admin-store-avatar">G</span>
            <span className="admin-store-copy">
              <strong>Gold Threads</strong>
              <small>Store preview</small>
            </span>
            <FiChevronDown aria-hidden="true" />
          </div>
          <Link className="admin-back-link" to="/">
            <FiEye aria-hidden="true" />
            <span>View storefront</span>
            <FiChevronRight className="admin-back-arrow" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-mobile-menu"
            aria-label="Open admin navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu aria-hidden="true" />
          </button>
          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <FiChevronRight aria-hidden="true" />
            <strong>{page === '/admin' ? 'Overview' : page.slice('/admin/'.length)}</strong>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-live-indicator"><i /> Preview mode</span>
            <span className="admin-avatar" aria-label="Admin profile">A</span>
          </div>
        </header>

        <main className="admin-content">
          {previewNotice}
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">{pageDetails[page].eyebrow}</span>
              <h1>{pageDetails[page].title}</h1>
              <p>{pageDetails[page].description}</p>
            </div>
          </div>

          {page === '/admin' && (
            <Dashboard
              products={products}
              categories={categories}
              activeProducts={activeProducts}
              onNavigate={navigate}
            />
          )}
          {page === '/admin/products' && (
            <ProductsPage
              products={products}
              categories={categories}
              onProductsChange={setProducts}
            />
          )}
          {page === '/admin/categories' && (
            <CategoriesPage
              categories={categories}
              products={products}
              onCategoriesChange={setCategories}
            />
          )}
        </main>
        <footer className="admin-footer">
          <span>Gold Threads Jewellery</span>
          <span>Admin UI preview · Not connected to live store</span>
        </footer>
      </div>
    </div>
  );
}

function Dashboard({ products, categories, activeProducts, onNavigate }) {
  const recentProducts = products.slice(0, 4);

  return (
    <div className="admin-dashboard">
      <section className="admin-stat-grid" aria-label="Store overview">
        <StatCard
          icon={FiBox}
          label="Total products"
          value={products.length}
          meta="In your catalogue"
          tone="gold"
        />
        <StatCard
          icon={FiCheck}
          label="Active products"
          value={activeProducts}
          meta="Visible in the preview"
          tone="green"
        />
        <StatCard
          icon={FiLayers}
          label="Categories"
          value={categories.length}
          meta="Collection groups"
          tone="rose"
        />
        <div className="admin-stat-card admin-stat-orders">
          <div className="admin-stat-top">
            <span className="admin-stat-icon tone-slate"><FiArchive aria-hidden="true" /></span>
            <span className="admin-stat-label">Orders</span>
          </div>
          <div className="admin-stat-value">—</div>
          <div className="admin-stat-meta">Order management not set up</div>
        </div>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">YOUR CATALOGUE</span>
              <h2>Products in your catalogue</h2>
            </div>
            <button type="button" className="admin-text-button" onClick={() => onNavigate('/admin/products')}>
              View all <FiArrowUpRight aria-hidden="true" />
            </button>
          </div>
          <ProductTable products={recentProducts} compact />
        </div>

        <div className="admin-panel admin-collection-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">COLLECTIONS</span>
              <h2>Categories</h2>
            </div>
            <button type="button" className="admin-icon-button" aria-label="View categories" onClick={() => onNavigate('/admin/categories')}>
              <FiArrowUpRight aria-hidden="true" />
            </button>
          </div>
          <div className="admin-collection-list">
            {categories.slice(0, 5).map((category) => {
              const count = products.filter((product) => product.category === category.name).length;
              return (
                <div className="admin-collection-row" key={category.id}>
                  <img src={category.imagePath} alt="" />
                  <span className="admin-collection-name">{category.name}</span>
                  <span className="admin-collection-count">{count} products</span>
                  <FiChevronRight aria-hidden="true" />
                </div>
              );
            })}
          </div>
          <div className="admin-info-note">
            <FiShield aria-hidden="true" />
            <span>Sales and order metrics will appear when order integrations are added.</span>
          </div>
        </div>
      </section>

      <div className="admin-bottom-note">
        <span className="admin-bottom-note-icon"><FiTag aria-hidden="true" /></span>
        <span>
          <strong>A lovely place to start</strong>
          <small>Your storefront catalogue is ready to organize. Product edits here are preview-only.</small>
        </span>
        <button type="button" className="admin-text-button" onClick={() => onNavigate('/admin/products')}>
          Manage products <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, meta, tone }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <span className={`admin-stat-icon tone-${tone}`}><Icon aria-hidden="true" /></span>
        <span className="admin-stat-label">{label}</span>
      </div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-meta">{meta}</div>
    </div>
  );
}

function ProductsPage({ products, categories, onProductsChange }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === 'all' || (filter === 'active' ? product.isActive : !product.isActive);
    return matchesSearch && matchesStatus;
  }), [filter, products, search]);

  const saveProduct = (product) => {
    if (editingProduct) {
      onProductsChange((current) => current.map((item) => item.id === editingProduct.id ? { ...product, id: item.id } : item));
    } else {
      onProductsChange((current) => [{ ...product, id: `preview-${Date.now()}` }, ...current]);
    }
    setModalOpen(false);
  };

  const toggleProduct = (product) => {
    onProductsChange((current) => current.map((item) => item.id === product.id ? { ...item, isActive: !item.isActive } : item));
  };

  return (
    <>
      <section className="admin-panel admin-table-panel">
        <div className="admin-list-toolbar">
          <div className="admin-results-copy">
            <strong>All products</strong>
            <span>{filteredProducts.length} of {products.length} products</span>
          </div>
          <div className="admin-list-controls">
            <button type="button" className="admin-primary-button admin-toolbar-add" onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}>
              <FiPlus aria-hidden="true" /> Add product
            </button>
            <label className="admin-search">
              <FiSearch aria-hidden="true" />
              <span className="visually-hidden">Search products</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />
            </label>
            <label className="admin-select-wrap">
              <span className="visually-hidden">Filter products by status</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FiChevronDown aria-hidden="true" />
            </label>
          </div>
        </div>
        <ProductTable
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setModalOpen(true);
          }}
          onToggle={toggleProduct}
          onDelete={setDeleteTarget}
        />
        {filteredProducts.length === 0 && (
          <div className="admin-empty-state">
            <FiSearch aria-hidden="true" />
            <strong>No products found</strong>
            <span>Try changing your search or status filter.</span>
          </div>
        )}
        <div className="admin-table-footer">
          <span>Showing {filteredProducts.length} products</span>
          <div className="admin-pagination" aria-label="Pagination">
            <button type="button" aria-label="Previous page" disabled><FiChevronLeft /></button>
            <span>1</span>
            <button type="button" aria-label="Next page" disabled><FiChevronRight /></button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <ProductDialog
          product={editingProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={saveProduct}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Remove this product?"
          description={`“${deleteTarget.name}” will be removed from this preview.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            onProductsChange((current) => current.filter((product) => product.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
}

function ProductTable({ products, compact = false, onEdit, onToggle, onDelete }) {
  return (
    <div className="admin-table-scroll">
      <table className={`admin-table${compact ? ' is-compact' : ''}`}>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            {!compact && <th scope="col">Status</th>}
            {!compact && <th scope="col" className="admin-actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="admin-product-cell">
                  <img src={product.image} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.badge || 'Jewellery'}</small>
                  </span>
                </div>
              </td>
              <td><span className="admin-category-pill">{product.category}</span></td>
              <td className="admin-price-cell">{formatPrice(product.price)}</td>
              {!compact && (
                <td>
                  <button
                    type="button"
                    className={`admin-status-pill${product.isActive ? ' is-active' : ' is-inactive'}`}
                    onClick={() => onToggle(product)}
                    aria-label={`Set ${product.name} ${product.isActive ? 'inactive' : 'active'} in preview`}
                  >
                    <i /> {product.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              )}
              {!compact && (
                <td>
                  <div className="admin-row-actions">
                    <button type="button" aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)}><FiEdit2 /></button>
                    <button type="button" aria-label={`Delete ${product.name}`} className="is-danger" onClick={() => onDelete(product)}><FiTrash2 /></button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoriesPage({ categories, products, onCategoriesChange }) {
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const visibleCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const saveCategory = (category) => {
    if (editingCategory) {
      onCategoriesChange((current) => current.map((item) => item.id === editingCategory.id ? { ...category, id: item.id } : item));
    } else {
      onCategoriesChange((current) => [...current, { ...category, id: `category-${Date.now()}` }]);
    }
    setModalOpen(false);
  };

  return (
    <>
      <section className="admin-panel admin-category-panel">
        <div className="admin-list-toolbar">
          <div className="admin-results-copy">
            <strong>All categories</strong>
            <span>{categories.length} collections</span>
          </div>
          <div className="admin-list-controls">
            <button type="button" className="admin-primary-button admin-toolbar-add" onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}>
              <FiPlus aria-hidden="true" /> Add category
            </button>
            <label className="admin-search">
              <FiSearch aria-hidden="true" />
              <span className="visually-hidden">Search categories</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." />
            </label>
          </div>
        </div>
        {visibleCategories.length > 0 ? (
          <div className="admin-category-grid">
            {visibleCategories.map((category) => {
              const count = products.filter((product) => product.category === category.name).length;
              return (
                <article className="admin-category-card" key={category.id}>
                  <div className="admin-category-image-wrap">
                    <img src={category.imagePath} alt="" />
                    <span className={`admin-status-pill${category.isActive ? ' is-active' : ' is-inactive'}`}>
                      <i /> {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="admin-category-actions">
                      <button type="button" aria-label={`Edit ${category.name}`} onClick={() => {
                        setEditingCategory(category);
                        setModalOpen(true);
                      }}><FiEdit2 /></button>
                      <button type="button" aria-label={`Delete ${category.name}`} className="is-danger" onClick={() => setDeleteTarget(category)}><FiTrash2 /></button>
                    </div>
                  </div>
                  <div className="admin-category-card-info">
                    <div>
                      <h2>{category.name}</h2>
                      <span>/{category.slug}</span>
                    </div>
                    <span className="admin-category-product-count">{count} items</span>
                  </div>
                  {category.showPopular && <span className="admin-featured-label"><FiCheck aria-hidden="true" /> Featured collection</span>}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <FiSearch aria-hidden="true" />
            <strong>No categories found</strong>
            <span>Try another search term.</span>
          </div>
        )}
      </section>
      <div className="admin-category-tip">
        <FiAlertCircle aria-hidden="true" />
        <span>Changes made here are only kept in this preview and are not sent to your live store.</span>
      </div>
      {modalOpen && (
        <CategoryDialog category={editingCategory} onClose={() => setModalOpen(false)} onSave={saveCategory} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Remove this category?"
          description={`“${deleteTarget.name}” will be removed from this preview. Products in the collection are not changed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            onCategoriesChange((current) => current.filter((category) => category.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
}

function ProductDialog({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: product?.name ?? '',
    category: product?.category ?? categories[0]?.name ?? '',
    price: product?.price ?? '',
    originalPrice: product?.originalPrice ?? '',
    image: product?.image ?? '',
    badge: product?.badge ?? '',
    material: product?.material ?? '',
    description: product?.description ?? '',
    isActive: product?.isActive ?? true,
  }));
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.category || !form.image.trim() || Number(form.price) <= 0) {
      setError('Add a name, category, image URL, and a price greater than zero.');
      return;
    }
    onSave({
      ...product,
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    });
  };

  return (
    <DialogFrame title={product ? 'Edit product' : 'Add a product'} onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <div className="admin-form-field">
          <label htmlFor="product-name">Product name</label>
          <input id="product-name" autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Clover pendant necklace" required />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="product-category">Category</label>
            <select id="product-category" value={form.category} onChange={(event) => update('category', event.target.value)} required>
              {categories.filter((category) => category.isActive).map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </div>
          <div className="admin-form-field">
            <label htmlFor="product-status">Status</label>
            <select id="product-status" value={form.isActive ? 'active' : 'inactive'} onChange={(event) => update('isActive', event.target.value === 'active')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="product-price">Price (PKR)</label>
            <input id="product-price" type="number" min="1" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="1299" required />
          </div>
          <div className="admin-form-field">
            <label htmlFor="product-original-price">Original price (PKR)</label>
            <input id="product-original-price" type="number" min="0" value={form.originalPrice} onChange={(event) => update('originalPrice', event.target.value)} placeholder="Optional" />
          </div>
        </div>
        <div className="admin-form-field">
          <label htmlFor="product-image">Image URL</label>
          <input id="product-image" type="url" value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://..." required />
          <small>Preview only. Image upload will be connected to the backend later.</small>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="product-badge">Badge</label>
            <input id="product-badge" value={form.badge} onChange={(event) => update('badge', event.target.value)} placeholder="New arrival" />
          </div>
          <div className="admin-form-field">
            <label htmlFor="product-material">Material</label>
            <input id="product-material" value={form.material} onChange={(event) => update('material', event.target.value)} placeholder="316L Stainless Steel" />
          </div>
        </div>
        <div className="admin-form-field">
          <label htmlFor="product-description">Description</label>
          <textarea id="product-description" rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="A short product description" />
        </div>
        <DialogActions onCancel={onClose} saveLabel={product ? 'Save changes' : 'Add product'} />
      </form>
    </DialogFrame>
  );
}

function CategoryDialog({ category, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    imagePath: category?.imagePath ?? '',
    showPopular: category?.showPopular ?? false,
    isActive: category?.isActive ?? true,
    displayOrder: category?.displayOrder ?? 0,
  }));
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.imagePath.trim()) {
      setError('Add a category name and image URL to continue.');
      return;
    }
    const slug = (form.slug || form.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    onSave({ ...category, ...form, name: form.name.trim(), slug, displayOrder: Number(form.displayOrder) });
  };

  return (
    <DialogFrame title={category ? 'Edit category' : 'Add a category'} onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <div className="admin-form-field">
          <label htmlFor="category-name">Category name</label>
          <input id="category-name" autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Necklaces" required />
        </div>
        <div className="admin-form-field">
          <label htmlFor="category-slug">URL slug</label>
          <input id="category-slug" value={form.slug} onChange={(event) => update('slug', event.target.value)} placeholder="necklaces (generated from name if blank)" />
        </div>
        <div className="admin-form-field">
          <label htmlFor="category-image">Image URL</label>
          <input id="category-image" type="url" value={form.imagePath} onChange={(event) => update('imagePath', event.target.value)} placeholder="https://..." required />
          <small>Preview only. Image upload will be connected to the backend later.</small>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="category-order">Display order</label>
            <input id="category-order" type="number" min="0" value={form.displayOrder} onChange={(event) => update('displayOrder', event.target.value)} />
          </div>
          <div className="admin-form-field">
            <label htmlFor="category-status">Status</label>
            <select id="category-status" value={form.isActive ? 'active' : 'inactive'} onChange={(event) => update('isActive', event.target.value === 'active')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <label className="admin-checkbox-field">
          <input type="checkbox" checked={form.showPopular} onChange={(event) => update('showPopular', event.target.checked)} />
          <span>
            <strong>Feature this category</strong>
            <small>Show it among popular collections on the storefront.</small>
          </span>
        </label>
        <DialogActions onCancel={onClose} saveLabel={category ? 'Save changes' : 'Add category'} />
      </form>
    </DialogFrame>
  );
}

function ConfirmDialog({ title, description, onCancel, onConfirm }) {
  return (
    <DialogFrame title={title} onClose={onCancel} narrow>
      <div className="admin-confirm-content">
        <span className="admin-confirm-icon"><FiTrash2 aria-hidden="true" /></span>
        <p>{description}</p>
        <div className="admin-dialog-actions">
          <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="admin-danger-button" onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </DialogFrame>
  );
}

function DialogFrame({ title, onClose, children, narrow = false }) {
  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className={`admin-modal${narrow ? ' is-narrow' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        <header className="admin-modal-header">
          <div>
            <span className="admin-panel-kicker">PREVIEW ONLY</span>
            <h2 id="admin-dialog-title">{title}</h2>
          </div>
          <button type="button" className="admin-icon-button" aria-label="Close dialog" onClick={onClose}><FiX /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function DialogActions({ onCancel, saveLabel }) {
  return (
    <div className="admin-dialog-actions">
      <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button>
      <button type="submit" className="admin-primary-button"><FiCheck aria-hidden="true" /> {saveLabel}</button>
    </div>
  );
}

function AdminPreviewLogin({ onContinue }) {
  return (
    <main className="admin-login-preview">
      <section className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          <span className="admin-brand-mark">GT</span>
          <span className="admin-brand-copy"><strong>GOLD THREADS</strong><small>JEWELLERY · ADMIN</small></span>
        </Link>
        <span className="admin-login-icon"><FiSettings aria-hidden="true" /></span>
        <span className="admin-eyebrow">ADMIN ACCESS</span>
        <h1>Login is coming next</h1>
        <p>This UI preview does not include authentication. Secure admin login and route protection will be added in a separate implementation phase.</p>
        <div className="admin-login-warning"><FiAlertCircle aria-hidden="true" /> Do not use this preview to manage live store data.</div>
        <button type="button" className="admin-primary-button" onClick={onContinue}>Continue to UI preview <FiArrowDownRight aria-hidden="true" /></button>
        <Link to="/" className="admin-login-back">Return to storefront</Link>
      </section>
    </main>
  );
}
