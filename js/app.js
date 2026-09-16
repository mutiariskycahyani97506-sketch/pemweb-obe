import { ringkasInventaris } from './utils.js';

import { dataKontrakan } from './siraData.js';
import {
  getKamarTersedia,
  getNamaKamar,
  getTotalHarga,
  cariKamarById,
  buatRingkasanKamar
} from './siraUtils.js';

const inventaris = [
  { id: 1, nama: 'Router', kategori: 'Jaringan', jumlah: 4, kondisi: 'Baik', lokasi: 'Lab Jaringan' },
  { id: 2, nama: 'Multimeter', kategori: 'Elektronika', jumlah: 6, kondisi: 'Baik', lokasi: 'Lab Elektronika' },
  { id: 3, nama: 'Kabel UTP', kategori: 'Jaringan', jumlah: 20, kondisi: 'Perlu Cek', lokasi: 'Lab Jaringan' }
];

const alatBaik = inventaris.filter(item => item.kondisi === 'Baik');

const alatLabJaringan = inventaris.filter(item => item.lokasi === 'Lab Jaringan');

const namaAlat = inventaris.map(({ nama }) => nama);

const totalUnit = inventaris.reduce((total, item) => total + item.jumlah, 0);

console.table(alatBaik);

console.log(namaAlat);

console.log(ringkasInventaris(inventaris));
console.log(alatLabJaringan);

function cariAlatById(data, id) {
  return data.find(item => item.id === id);
}
console.log(cariAlatById(inventaris, 2));


const ringkasanAlat = inventaris.map(({ nama, kategori, jumlah, lokasi }) =>
  `${nama} - ${kategori} - ${jumlah} unit - ${lokasi}`
);

console.log(ringkasanAlat);

console.log('=== SIRA-KONTRAK ===');

try {
  const kamarTersedia = getKamarTersedia(dataKontrakan);
  const namaKamar = getNamaKamar(dataKontrakan);
  const totalHarga = getTotalHarga(dataKontrakan);
  const kamarDitemukan = cariKamarById(dataKontrakan, 3);

  console.table(kamarTersedia);
  console.log('Nama kamar:', namaKamar);
  console.log('Total harga kamar:', totalHarga);
  console.log('Kamar dengan ID 3:', kamarDitemukan);

  console.log(
    'Ringkasan:',
    dataKontrakan.map(kamar => buatRingkasanKamar(kamar))
  );
} catch (error) {
  console.error('Gagal mengolah data SIRA-KONTRAK:', error.message);
}