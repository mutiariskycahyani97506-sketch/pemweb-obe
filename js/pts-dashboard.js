const API_URL = 'https://dummyjson.com/products/category/groceries?limit=0';
const DEBOUNCE_DELAY = 300;
const USD_TO_IDR = 16000;

const productGrid = document.querySelector('#product-grid');
const resultsStatus = document.querySelector('#results-status');
const loadingIndicator = document.querySelector('#loading-indicator');
const errorPanel = document.querySelector('#error-panel');
const errorMessage = document.querySelector('#error-message');
const retryButton = document.querySelector('#retry-button');
const searchInput = document.querySelector('#product-search');
const sortSelect = document.querySelector('#sort-products');
const form = document.querySelector('#interest-form');
const productSelect = document.querySelector('#interest-product');

let products = [];
let searchTerm = '';
let searchTimer;

const formatRupiah = value => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(value * USD_TO_IDR);

function showLoading(isLoading, message = 'Memuat pilihan produk...') {
  loadingIndicator.hidden = !isLoading;
  loadingIndicator.querySelector('span:last-child').textContent = message;
  productGrid.setAttribute('aria-busy', String(isLoading));
}

function showInsights(items) {
  if (items.length === 0) {
    document.querySelector('#average-price').textContent = '—';
    document.querySelector('#category-count').textContent = '0 kategori';
    document.querySelector('#top-price').textContent = '—';
    document.querySelector('#top-product').textContent = '—';
    return;
  }
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const categories = new Set(items.map(item => item.category));
  const mostExpensive = items.reduce((top, item) => item.price > top.price ? item : top);

  document.querySelector('#average-price').textContent = formatRupiah(totalPrice / items.length);
  document.querySelector('#category-count').textContent = `${categories.size} kategori`;
  document.querySelector('#top-price').textContent = formatRupiah(mostExpensive.price);
  document.querySelector('#top-product').textContent = mostExpensive.title;
}

function fillProductOptions(items) {
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Pilih produk';
  productSelect.replaceChildren(placeholder);

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = String(item.id);
    option.textContent = item.title;
    productSelect.append(option);
  });
}

function createProductCard(item) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const visual = document.createElement('div');
  visual.className = 'product-visual';
  const image = document.createElement('img');
  image.src = item.thumbnail;
  image.alt = item.title;
  image.loading = 'lazy';
  visual.append(image);

  const info = document.createElement('div');
  info.className = 'product-info';
  const category = document.createElement('p');
  category.className = 'product-category';
  category.textContent = item.category;
  const title = document.createElement('h3');
  title.textContent = item.title;
  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = item.description;

  const bottom = document.createElement('div');
  bottom.className = 'product-bottom';
  const price = document.createElement('strong');
  price.className = 'product-price';
  price.textContent = formatRupiah(item.price);
  const rating = document.createElement('span');
  rating.className = 'product-rating';
  rating.textContent = `★ ${item.rating.toFixed(1)}`;
  bottom.append(price, rating);
  info.append(category, title, description, bottom);
  card.append(visual, info);
  return card;
}

function getVisibleProducts() {
  const query = searchTerm.trim().toLocaleLowerCase('id');
  const matches = products.filter(item =>
    `${item.title} ${item.description} ${item.category} ${item.brand ?? ''}`
      .toLocaleLowerCase('id').includes(query)
  );
  const sortBy = sortSelect.value;
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating-desc': (a, b) => b.rating - a.rating,
    'title-asc': (a, b) => a.title.localeCompare(b.title, 'id')
  };
  return matches.sort(sorters[sortBy] ?? ((a, b) => a.id - b.id));
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.replaceChildren();

  if (visibleProducts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = products.length === 0
      ? 'Belum ada produk yang tersedia.'
      : 'Produk tidak ditemukan. Coba kata kunci lain.';
    productGrid.append(empty);
  } else {
    const cards = visibleProducts.map(createProductCard);
    productGrid.append(...cards);
  }

  resultsStatus.textContent = `${visibleProducts.length} dari ${products.length} produk ditampilkan`;
}

async function loadProducts() {
  errorPanel.hidden = true;
  retryButton.disabled = true;
  showLoading(true);
  resultsStatus.textContent = 'Menghubungkan ke katalog produk...';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server merespons HTTP ${response.status}.`);

    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error('Format data produk dari server tidak sesuai.');
    products = data.products;
    showInsights(products);
    fillProductOptions(products);
    renderProducts();
  } catch (error) {
    console.error('Gagal memuat katalog:', error);
    errorMessage.textContent = `${error.message} Periksa koneksi internet lalu coba lagi.`;
    errorPanel.hidden = false;
    resultsStatus.textContent = 'Data katalog gagal dimuat.';
  } finally {
    showLoading(false);
    retryButton.disabled = false;
  }
}

searchInput.addEventListener('input', event => {
  searchTerm = event.target.value;
  window.clearTimeout(searchTimer);
  showLoading(true, 'Mencari produk...');
  searchTimer = window.setTimeout(() => {
    renderProducts();
    showLoading(false);
  }, DEBOUNCE_DELAY);
});

sortSelect.addEventListener('change', renderProducts);
retryButton.addEventListener('click', loadProducts);

const noteInput = document.querySelector('#interest-note');
const noteCounter = document.querySelector('#note-counter');
noteInput.addEventListener('input', () => {
  noteCounter.textContent = `${noteInput.value.length}/500`;
  clearFieldError(noteInput, document.querySelector('#note-error'));
});

function clearFieldError(field, messageElement) {
  field.removeAttribute('aria-invalid');
  messageElement.textContent = '';
}

function setFieldError(field, messageElement, message) {
  field.setAttribute('aria-invalid', 'true');
  messageElement.textContent = message;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const nameInput = document.querySelector('#visitor-name');
  const nameError = document.querySelector('#name-error');
  const productError = document.querySelector('#product-error');
  const noteError = document.querySelector('#note-error');
  const formStatus = document.querySelector('#form-status');
  const note = noteInput.value.trim();
  const errors = [];

  [nameInput, productSelect, noteInput].forEach(field => field.removeAttribute('aria-invalid'));
  [nameError, productError, noteError].forEach(message => { message.textContent = ''; });
  formStatus.textContent = '';
  formStatus.classList.remove('is-error');

  if (nameInput.value.trim().length < 2) {
    setFieldError(nameInput, nameError, 'Nama wajib diisi minimal 2 karakter.');
    errors.push(nameInput);
  }
  if (!products.some(item => String(item.id) === productSelect.value)) {
    setFieldError(productSelect, productError, 'Pilih salah satu produk dari katalog.');
    errors.push(productSelect);
  }
  if (note.length < 30) {
    setFieldError(noteInput, noteError, `Catatan masih ${note.length} karakter. Tulis minimal 30 karakter.`);
    errors.push(noteInput);
  }

  if (errors.length > 0) {
    formStatus.textContent = 'Periksa kembali bagian yang ditandai.';
    formStatus.classList.add('is-error');
    errors[0].focus();
    return;
  }

  const selectedProduct = products.find(item => String(item.id) === productSelect.value);
  formStatus.textContent = `Terima kasih, ${nameInput.value.trim()}. Catatan minat untuk “${selectedProduct.title}” berhasil dicatat pada halaman ini.`;
  form.reset();
  noteCounter.textContent = '0/500';
});

loadProducts();

