import { dataKontrakan } from './siraData.js';

const daftarKamar = document.querySelector('#daftar-kamar');
const tombolFilter = document.querySelectorAll('[data-filter]');
const searchInput = document.querySelector('#search-input');
const limitSelect = document.querySelector('#limit-select');
const themeButton = document.querySelector('#theme-button');

const gambarKamar = {
  'Kamar A01': 'images/kamar-a01.jpeg',
  'Kamar A02': 'images/kamar-a02.jpeg',
  'Kamar B01': 'images/hero-kontrakan.jpeg',
  'Kamar B02': 'images/hero-kontrakan.jpeg'
};

let filterStatus = 'Semua';
let kataKunci = '';
const limitTersimpan = Number(localStorage.getItem('limit'));
let limitTampil = [5, 10, 20].includes(limitTersimpan) ? limitTersimpan : 5;

if (limitSelect) {
  limitSelect.value = String(limitTampil);
}

function renderItems(kamar) {
  if (!daftarKamar) return;

  daftarKamar.replaceChildren();

  const hasilCari = kamar.filter(item =>
    item.nama.toLowerCase().includes(kataKunci.trim().toLowerCase())
  );
  const kamarDitampilkan = hasilCari.slice(0, limitTampil);

  if (kamarDitampilkan.length === 0) {
    const pesanKosong = document.createElement('p');
    pesanKosong.className = 'empty-state';
    pesanKosong.textContent = 'Kamar tidak ditemukan. Coba kata kunci atau filter lain.';
    daftarKamar.append(pesanKosong);
    return;
  }

  for (const item of kamarDitampilkan) {
    const card = document.createElement('article');
    card.className = 'card';

    const areaGambar = document.createElement('div');
    areaGambar.className = 'card-image';

    const gambar = document.createElement('img');
    gambar.src = gambarKamar[item.nama] ?? 'images/hero-kontrakan.jpeg';
    gambar.alt = item.nama + ' di SIRA-KONTRAK';

    const status = document.createElement('span');
    status.className = `status ${item.status === 'Tersedia' ? 'available' : 'occupied'}`;
    status.textContent = item.status;
    areaGambar.append(gambar, status);

    const isiCard = document.createElement('div');
    isiCard.className = 'card-content';

    const nama = document.createElement('h3');
    nama.textContent = item.nama;

    const harga = document.createElement('p');
    harga.className = 'price';
    harga.textContent = `Rp${item.harga.toLocaleString('id-ID')} `;
    const satuan = document.createElement('span');
    satuan.textContent = '/ bulan';
    harga.append(satuan);

    const tipe = document.createElement('p');
    tipe.textContent = `Tipe kamar: ${item.tipe}`;

    const daftarFasilitas = document.createElement('ul');
    for (const fasilitas of item.fasilitas) {
      const barisFasilitas = document.createElement('li');
      barisFasilitas.textContent = `✓ ${fasilitas}`;
      daftarFasilitas.append(barisFasilitas);
    }

    const tombolDetail = document.createElement('button');
    tombolDetail.className = 'card-button room-detail-button';
    tombolDetail.type = 'button';
    tombolDetail.textContent = 'Detail Kamar';
    tombolDetail.dataset.detailId = item.id;

    isiCard.append(nama, harga, tipe, daftarFasilitas, tombolDetail);
    card.append(areaGambar, isiCard);
    daftarKamar.append(card);
  }
}

function updateTampilan() {
  const hasilFilter = filterStatus === 'Semua'
    ? dataKontrakan
    : dataKontrakan.filter(item => item.status === filterStatus);
  renderItems(hasilFilter);
}

tombolFilter.forEach(button => {
  button.addEventListener('click', () => {
    filterStatus = button.dataset.filter;
    tombolFilter.forEach(tombol => {
      tombol.setAttribute('aria-pressed', String(tombol === button));
    });
    updateTampilan();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', event => {
    kataKunci = event.target.value;
    updateTampilan();
  });
}

if (limitSelect) {
  limitSelect.addEventListener('change', event => {
    limitTampil = Number(event.target.value);
    localStorage.setItem('limit', String(limitTampil));
    updateTampilan();
  });
}

if (daftarKamar) {
  daftarKamar.addEventListener('click', event => {
    const tombol = event.target.closest('[data-detail-id]');
    if (!tombol) return;

    const kamar = dataKontrakan.find(item => item.id === Number(tombol.dataset.detailId));
    if (!kamar) return;

    alert(
      `DETAIL KAMAR\nNama: ${kamar.nama}\nTipe: ${kamar.tipe}\nHarga: Rp${kamar.harga.toLocaleString('id-ID')} per bulan\nStatus: ${kamar.status}\nFasilitas: ${kamar.fasilitas.join(', ')}`
    );
  });
}

const temaTersimpan = localStorage.getItem('theme');
document.documentElement.dataset.theme = temaTersimpan === 'dark' ? 'dark' : 'light';

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const temaBerikutnya = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = temaBerikutnya;
    localStorage.setItem('theme', temaBerikutnya);
  });
}

updateTampilan();
