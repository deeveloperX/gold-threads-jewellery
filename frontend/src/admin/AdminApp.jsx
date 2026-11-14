import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiArchive,
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
  FiShield,
  FiTag,
  FiTrash2,
  FiX,
  FiLogOut,
  FiUpload,
} from 'react-icons/fi';
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import ProtectedAdminRoute from './auth/ProtectedAdminRoute';
import useAdminAuth from './auth/useAdminAuth';
import AdminLogin from './pages/AdminLogin';
import { categoryService } from '../services/categoryService';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { formatPrice } from './adminData';
import './admin.css';

const pageDetails = {
  '/admin': {
    eyebrow: 'YOUR STORE AT A GLANCE',
    title: 'Store overview',
    description: 'A snapshot of your jewellery catalogue.',
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
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}

function AdminRoutes() {
  const { pathname } = useLocation();
  if (pathname === '/admin/login') {
    return <AdminLogin />;
  }
  if (!pageDetails[pathname]) {
    return <Navigate to="/admin" replace />;
  }
  return (
    <ProtectedAdminRoute>
      <AdminWorkspace />
    </ProtectedAdminRoute>
  );
}

function AdminWorkspace() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const token = authService.getToken();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [reloadCatalog, setReloadCatalog] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([
      productService.getAdminProducts(token),
      categoryService.getCategories(),
    ])
      .then(([adminProducts, activeCategories]) => {
        if (!active) return;
        setProducts(adminProducts);
        setCategories(activeCategories);
        setCatalogError('');
      })
      .catch((error) => {
        if (!active) return;
        setCatalogError(error.message);
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadCatalog, token]);

  const page = pageDetails[pathname] ? pathname : '/admin';
  const activeProducts = products.filter((product) => product.isActive).length;
  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      setLogoutError(error.message);
    }
  };

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
              <small>Admin workspace</small>
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
            <span className="admin-live-indicator"><i /> Signed in</span>
            <span className="admin-account-name">{admin?.name || admin?.email}</span>
            <span className="admin-avatar" aria-label={`Signed in as ${admin?.name || 'admin'}`}>
              {(admin?.name || admin?.email || 'A').charAt(0).toUpperCase()}
            </span>
            <button type="button" className="admin-logout-button" onClick={handleLogout}>
              <FiLogOut aria-hidden="true" /> Sign out
            </button>
          </div>
        </header>

        {logoutError && <div className="admin-logout-error" role="alert">{logoutError}</div>}

        <main className="admin-content">
          <div className="admin-preview-notice" role="status">
            <FiAlertCircle aria-hidden="true" />
            <span>
              <strong>Connected catalogue</strong>
              <span className="admin-preview-notice-copy">
                Catalogue data loads from your backend; image uploads are stored in Cloudinary.
              </span>
            </span>
            <span className="admin-preview-badge">LIVE DATA</span>
          </div>
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">{pageDetails[page].eyebrow}</span>
              <h1>{pageDetails[page].title}</h1>
              <p>{pageDetails[page].description}</p>
            </div>
          </div>

          {catalogLoading ? (
            <div className="admin-auth-state admin-catalog-state" aria-live="polite">
              <span className="admin-auth-spinner" aria-hidden="true">◌</span>
              <p>Loading your catalogue…</p>
            </div>
          ) : catalogError ? (
            <div className="admin-catalog-error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              <span><strong>Couldn’t load your catalogue</strong>{catalogError}</span>
              <button type="button" className="admin-secondary-button" onClick={() => {
                setCatalogLoading(true);
                setReloadCatalog((current) => current + 1);
              }}>Try again</button>
            </div>
          ) : page === '/admin' ? (
            <Dashboard
              products={products}
              categories={categories}
              activeProducts={activeProducts}
              onNavigate={navigate}
            />
          ) : page === '/admin/products' ? (
            <ProductsPage
              products={products}
              categories={categories}
              onProductsChange={setProducts}
              token={token}
            />
          ) : (
            <CategoriesPage
              categories={categories}
              products={products}
              onCategoriesChange={setCategories}
              token={token}
            />
          )}
        </main>
        <footer className="admin-footer">
          <span>Gold Threads Jewellery</span>
          <span>Admin access secured · Catalogue integration pending</span>
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
          meta="Visible in the storefront"
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
                <div className="admin-collection-row" key={category._id || category.id}>
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
          <small>Manage catalogue details and upload images directly from your device.</small>
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

function ProductsPage({ products, categories, onProductsChange, token }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState('');
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === 'all' || (filter === 'active' ? product.isActive : !product.isActive);
    return matchesSearch && matchesStatus;
  }), [filter, products, search]);

  const saveProduct = async (formData) => {
    if (editingProduct) {
      const saved = await productService.updateProduct(token, editingProduct._id || editingProduct.id, formData);
      onProductsChange((current) => current.map((item) => (
        (item._id || item.id) === (editingProduct._id || editingProduct.id) ? saved : item
      )));
    } else {
      const saved = await productService.createProduct(token, formData);
      onProductsChange((current) => [saved, ...current]);
    }
    setModalOpen(false);
  };

  const toggleProduct = async (product) => {
    setActionError('');
    const formData = new FormData();
    formData.set('isActive', String(!product.isActive));
    try {
      const saved = await productService.updateProduct(token, product._id || product.id, formData);
      onProductsChange((current) => current.map((item) => (
        (item._id || item.id) === (product._id || product.id) ? saved : item
      )));
    } catch (error) {
      setActionError(error.message);
    }
  };

  const deleteProduct = async (product) => {
    setActionError('');
    try {
      await productService.deleteProduct(token, product._id || product.id);
      onProductsChange((current) => current.filter((item) => (
        (item._id || item.id) !== (product._id || product.id)
      )));
      setDeleteTarget(null);
    } catch (error) {
      setActionError(error.message);
    }
  };

  return (
    <>
      <section className="admin-panel admin-table-panel">
        {actionError && <p className="admin-form-error admin-page-error" role="alert">{actionError}</p>}
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
          description={`“${deleteTarget.name}” will be permanently removed from your catalogue.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteProduct(deleteTarget)}
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
            <tr key={product._id || product.id}>
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
                    aria-label={`Set ${product.name} ${product.isActive ? 'inactive' : 'active'}`}
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

function CategoriesPage({ categories, products, onCategoriesChange, token }) {
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState('');
  const visibleCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const saveCategory = async (formData) => {
    if (editingCategory) {
      const saved = await categoryService.updateCategory(
        token,
        editingCategory._id || editingCategory.id,
        formData,
      );
      onCategoriesChange((current) => current.map((item) => (
        (item._id || item.id) === (editingCategory._id || editingCategory.id) ? saved : item
      )));
    } else {
      const saved = await categoryService.createCategory(token, formData);
      onCategoriesChange((current) => [...current, saved]);
    }
    setModalOpen(false);
  };

  const deleteCategory = async (category) => {
    setActionError('');
    try {
      await categoryService.deleteCategory(token, category._id || category.id);
      onCategoriesChange((current) => current.filter((item) => (
        (item._id || item.id) !== (category._id || category.id)
      )));
      setDeleteTarget(null);
    } catch (error) {
      setActionError(error.message);
    }
  };

  return (
    <>
      <section className="admin-panel admin-category-panel">
        {actionError && <p className="admin-form-error admin-page-error" role="alert">{actionError}</p>}
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
                <article className="admin-category-card" key={category._id || category.id}>
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
      {modalOpen && (
        <CategoryDialog category={editingCategory} onClose={() => setModalOpen(false)} onSave={saveCategory} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Remove this category?"
          description={`“${deleteTarget.name}” will be permanently removed from your categories. Products are not changed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteCategory(deleteTarget)}
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
    badge: product?.badge ?? '',
    material: product?.material ?? '',
    waterproof: product?.waterproof ?? true,
    nonTarnish: product?.nonTarnish ?? true,
    description: product?.description ?? '',
    isActive: product?.isActive ?? true,
  }));
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.category || Number(form.price) <= 0 || (!product && !imageFile)) {
      setError('Add a name, category, price greater than zero, and an image.');
      return;
    }
    setError('');
    setIsSaving(true);
    const formData = new FormData();
    formData.set('name', form.name.trim());
    formData.set('category', form.category);
    formData.set('price', String(form.price));
    formData.set('originalPrice', String(form.originalPrice));
    formData.set('badge', form.badge);
    formData.set('material', form.material);
    formData.set('waterproof', String(form.waterproof));
    formData.set('nonTarnish', String(form.nonTarnish));
    formData.set('description', form.description);
    formData.set('isActive', String(form.isActive));
    if (imageFile) formData.set('image', imageFile);
    try {
      await onSave(formData);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
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
            {categories
              .filter((category) => category.isActive || category.name === product?.category)
              .map((category) => (
                <option key={category._id || category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
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
        <ImageUploadField
          id="product-image"
          label="Product image"
          currentImage={product?.image}
          file={imageFile}
          onFileChange={setImageFile}
          required={!product}
        />
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="product-badge">Badge</label>
            <input id="product-badge" value={form.badge} onChange={(event) => update('badge', event.target.value)} placeholder="e.g. Bestseller" />
            <small>Optional label shown with this product in the admin catalogue.</small>
          </div>
          <div className="admin-form-field">
            <label htmlFor="product-material">Material</label>
            <input id="product-material" value={form.material} onChange={(event) => update('material', event.target.value)} placeholder="316L Stainless Steel" />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="product-waterproof">Waterproof</label>
            <select
              id="product-waterproof"
              value={String(form.waterproof)}
              onChange={(event) => update('waterproof', event.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="admin-form-field">
            <label htmlFor="product-non-tarnish">Non-tarnish</label>
            <select
              id="product-non-tarnish"
              value={String(form.nonTarnish)}
              onChange={(event) => update('nonTarnish', event.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="admin-form-field">
          <label htmlFor="product-description">Description</label>
          <textarea id="product-description" rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="A short product description" />
        </div>
        <DialogActions
          onCancel={onClose}
          saveLabel={product ? 'Save changes' : 'Add product'}
          isSaving={isSaving}
        />
      </form>
    </DialogFrame>
  );
}

function CategoryDialog({ category, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    showPopular: category?.showPopular ?? false,
    isActive: category?.isActive ?? true,
    displayOrder: category?.displayOrder ?? 0,
  }));
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || (!category && !imageFile)) {
      setError('Add a category name and choose an image to continue.');
      return;
    }
    setError('');
    setIsSaving(true);
    const slug = (form.slug || form.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const formData = new FormData();
    formData.set('name', form.name.trim());
    formData.set('slug', slug);
    formData.set('showPopular', String(form.showPopular));
    formData.set('isActive', String(form.isActive));
    formData.set('displayOrder', String(form.displayOrder));
    if (imageFile) formData.set('image', imageFile);
    try {
      await onSave(formData);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
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
        <ImageUploadField
          id="category-image"
          label="Category image"
          currentImage={category?.imagePath}
          file={imageFile}
          onFileChange={setImageFile}
          required={!category}
        />
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
        <DialogActions
          onCancel={onClose}
          saveLabel={category ? 'Save changes' : 'Add category'}
          isSaving={isSaving}
        />
      </form>
    </DialogFrame>
  );
}

function ImageUploadField({ id, label, currentImage, file, onFileChange, required }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  useEffect(() => {
    if (!previewUrl.startsWith('blob:')) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : currentImage || '');
  };

  return (
    <div className="admin-form-field">
      <label htmlFor={id}>{label}</label>
      {previewUrl && (
        <img className="admin-image-upload-preview" src={previewUrl} alt={`${label} preview`} />
      )}
      <label className="admin-image-upload-control" htmlFor={id}>
        <FiUpload aria-hidden="true" />
        <span>{file ? file.name : currentImage ? 'Choose a new image' : 'Choose an image'}</span>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={required}
          onChange={handleFileChange}
        />
      </label>
      <small>JPEG, PNG, or WebP. Images upload securely to the store’s Cloudinary account.</small>
    </div>
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
            <span className="admin-panel-kicker">CATALOGUE MANAGEMENT</span>
            <h2 id="admin-dialog-title">{title}</h2>
          </div>
          <button type="button" className="admin-icon-button" aria-label="Close dialog" onClick={onClose}><FiX /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function DialogActions({ onCancel, saveLabel, isSaving = false }) {
  return (
    <div className="admin-dialog-actions">
      <button type="button" className="admin-secondary-button" onClick={onCancel} disabled={isSaving}>Cancel</button>
      <button type="submit" className="admin-primary-button" disabled={isSaving}>
        {isSaving ? <span className="admin-auth-spinner" aria-hidden="true">◌</span> : <FiCheck aria-hidden="true" />}
        {isSaving ? 'Uploading…' : saveLabel}
      </button>
    </div>
  );
}
