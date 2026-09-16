const inventaris = [
  { id: 1, nama: 'Router', kategori: 'Jaringan', jumlah: 4, kondisi: 'Baik' },
  { id: 2, nama: 'Multimeter', kategori: 'Elektronika', jumlah: 6, kondisi: 'Baik' },
  { id: 3, nama: 'Kabel UTP', kategori: 'Jaringan', jumlah: 20, kondisi: 'Perlu Cek' }
];

const alatBaik = inventaris.filter(item => item.kondisi === 'Baik');

const namaAlat = inventaris.map(({ nama }) => nama);

const totalUnit = inventaris.reduce((total, item) => total + item.jumlah, 0);

function ringkasInventaris(data) {
  if (!Array.isArray(data)) throw new TypeError('Data harus berupa array');

  return {
    jenisAlat: data.length,
    totalUnit: data.reduce((sum, item) => sum + item.jumlah, 0),
    perluCek: data.filter(item => item.kondisi !== 'Baik').length
  };
}

console.table(alatBaik);
console.log(namaAlat);
console.log(ringkasInventaris(inventaris));

