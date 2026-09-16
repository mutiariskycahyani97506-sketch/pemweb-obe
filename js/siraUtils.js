export function getKamarTersedia(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data kamar harus berupa array');
  }

  return data.filter(kamar => kamar.status === 'Tersedia');
}

export function getNamaKamar(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data kamar harus berupa array');
  }

  return data.map(({ nama }) => nama);
}

export function getTotalHarga(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data kamar harus berupa array');
  }

  return data.reduce((total, kamar) => total + kamar.harga, 0);
}

export function cariKamarById(data, id) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data kamar harus berupa array');
  }

  return data.find(kamar => kamar.id === id);
}

export function buatRingkasanKamar(kamar) {
  if (!kamar || typeof kamar !== 'object') {
    throw new TypeError('Data kamar tidak valid');
  }

  const { nama, tipe, harga, status } = kamar;

  return `${nama} - ${tipe} - Rp${harga.toLocaleString('id-ID')} - ${status}`;
}