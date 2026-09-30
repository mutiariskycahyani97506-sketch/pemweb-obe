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

// Form pengajuan minat sewa kamar (Pertemuan 6)
const bookingForm = document.querySelector('#booking-form');

if (bookingForm) {
  const roomSelect = bookingForm.elements.kamar;
  const startDateInput = bookingForm.elements.tanggalMulai;
  const errorSummary = document.querySelector('#booking-error-summary');
  const errorList = document.querySelector('#booking-error-list');
  const bookingStatus = document.querySelector('#booking-status');
  const preview = document.querySelector('#booking-preview');
  const previewContent = document.querySelector('#booking-preview-content');

  const getLocalDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  startDateInput.min = getLocalDate();

  for (const kamar of dataKontrakan.filter(item => item.status === 'Tersedia')) {
    const option = document.createElement('option');
    option.value = String(kamar.id);
    option.textContent = `${kamar.nama} - ${kamar.tipe} - Rp${kamar.harga.toLocaleString('id-ID')} per bulan`;
    roomSelect.append(option);
  }

  function validateBooking(data) {
    const errors = {};
    const nama = data.nama.trim();
    const email = data.email.trim();
    const kamarValid = dataKontrakan.some(item =>
      String(item.id) === data.kamar && item.status === 'Tersedia'
    );
    const tanggalHariIni = getLocalDate();
    const durasi = Number(data.durasi);

    if (nama.length === 0) {
      errors.nama = 'Nama calon penyewa wajib diisi.';
    } else if (nama.length < 3) {
      errors.nama = 'Nama calon penyewa minimal 3 karakter.';
    }

    if (email.length === 0) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Masukkan email dengan format yang benar.';
    }

    if (data.kamar.length === 0) {
      errors.kamar = 'Pilih kamar yang ingin diajukan.';
    } else if (!kamarValid) {
      errors.kamar = 'Pilih kamar yang tersedia dari daftar.';
    }

    if (data.tanggalMulai.length === 0) {
      errors.tanggalMulai = 'Tanggal mulai sewa wajib diisi.';
    } else if (data.tanggalMulai < tanggalHariIni) {
      errors.tanggalMulai = 'Tanggal mulai sewa tidak boleh sebelum hari ini.';
    }

    if (data.durasi.length === 0) {
      errors.durasi = 'Durasi sewa wajib diisi.';
    } else if (!Number.isInteger(durasi) || durasi < 1 || durasi > 12) {
      errors.durasi = 'Durasi sewa harus bilangan bulat antara 1 sampai 12 bulan.';
    }

    if (data.catatan.length > 200) {
      errors.catatan = 'Catatan maksimal 200 karakter.';
    }

    if (!data.persetujuan) {
      errors.persetujuan = 'Persetujuan wajib dicentang.';
    }

    return errors;
  }

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();

    preview.hidden = true;
    previewContent.replaceChildren();
    bookingStatus.textContent = '';
    errorSummary.hidden = true;
    errorList.replaceChildren();
    bookingForm.querySelectorAll('.field-error').forEach(element => {
      element.textContent = '';
    });
    bookingForm.querySelectorAll('[aria-invalid="true"]').forEach(field => {
      field.removeAttribute('aria-invalid');
    });

    const data = {
      nama: bookingForm.elements.nama.value.trim(),
      email: bookingForm.elements.email.value.trim().toLowerCase(),
      kamar: roomSelect.value,
      tanggalMulai: startDateInput.value,
      durasi: bookingForm.elements.durasi.value.trim(),
      catatan: bookingForm.elements.catatan.value.trim(),
      persetujuan: bookingForm.elements.persetujuan.checked
    };
    const errors = validateBooking(data);
    const errorEntries = Object.entries(errors);
    const labels = {
      nama: 'Nama calon penyewa',
      email: 'Email',
      kamar: 'Kamar yang diminati',
      tanggalMulai: 'Rencana mulai sewa',
      durasi: 'Durasi sewa',
      catatan: 'Catatan',
      persetujuan: 'Persetujuan'
    };
    const errorIds = {
      nama: 'error-booking-name',
      email: 'error-booking-email',
      kamar: 'error-booking-room',
      tanggalMulai: 'error-booking-date',
      durasi: 'error-booking-duration',
      catatan: 'error-booking-note',
      persetujuan: 'error-booking-consent'
    };
    const fieldIds = {
      nama: 'booking-name',
      email: 'booking-email',
      kamar: 'booking-room',
      tanggalMulai: 'booking-date',
      durasi: 'booking-duration',
      catatan: 'booking-note',
      persetujuan: 'booking-consent'
    };

    for (const [fieldName, message] of errorEntries) {
      const errorElement = document.getElementById(errorIds[fieldName]);
      const field = bookingForm.elements[fieldName];
      const summaryItem = document.createElement('li');
      const summaryLink = document.createElement('a');
      summaryLink.href = `#${fieldIds[fieldName]}`;
      summaryLink.textContent = `${labels[fieldName]}: ${message}`;
      summaryLink.addEventListener('click', event => {
        event.preventDefault();
        field?.focus();
      });
      summaryItem.append(summaryLink);
      errorList.append(summaryItem);
      if (errorElement) errorElement.textContent = message;
      if (field) field.setAttribute('aria-invalid', 'true');
    }

    if (errorEntries.length > 0) {
      errorSummary.hidden = false;
      bookingStatus.textContent = 'Periksa kembali isian yang belum valid.';
      bookingForm.elements[errorEntries[0][0]]?.focus();
      return;
    }

    const kamarDipilih = dataKontrakan.find(item => String(item.id) === data.kamar);
    const previewRows = [
      ['Nama calon penyewa', data.nama],
      ['Email', data.email],
      ['Kamar yang diminati', kamarDipilih.nama],
      ['Rencana mulai sewa', data.tanggalMulai],
      ['Durasi sewa', `${data.durasi} bulan`],
      ['Catatan', data.catatan || '-'],
      ['Persetujuan', 'Disetujui']
    ];

    for (const [label, value] of previewRows) {
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = value;
      previewContent.append(term, description);
    }

    preview.hidden = false;
    bookingStatus.textContent = 'Data valid. Periksa pratinjau pengajuan di bawah ini.';
  });
}

updateTampilan();
