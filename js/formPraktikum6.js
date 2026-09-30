function validateForm(formData) {
  const errors = {};

  const nama = String(formData.get('nama') ?? '').trim();
  const kategori = String(formData.get('kategori') ?? '').trim();
  const jumlahInput = String(formData.get('jumlah') ?? '').trim();
  const kondisi = String(formData.get('kondisi') ?? '').trim();
  const tanggal = String(formData.get('tanggal') ?? '').trim();

  if (nama.length === 0) {
    errors.nama = 'Nama alat wajib diisi.';
  } else if (nama.length < 3) {
    errors.nama = 'Nama alat minimal 3 karakter.';
  }

  const kategoriTersedia = ['Elektronika', 'Jaringan', 'Peralatan'];
  if (kategori.length === 0) {
    errors.kategori = 'Kategori wajib dipilih.';
  } else if (!kategoriTersedia.includes(kategori)) {
    errors.kategori = 'Pilih kategori yang tersedia.';
  }

  const jumlah = Number(jumlahInput);
  if (jumlahInput.length === 0) {
    errors.jumlah = 'Jumlah wajib diisi.';
  } else if (!Number.isInteger(jumlah) || jumlah < 0) {
    errors.jumlah = 'Jumlah harus bilangan bulat 0 atau lebih.';
  }

  if (kondisi.length === 0) {
    errors.kondisi = 'Kondisi wajib dipilih.';
  }

  if (tanggal.length === 0) {
    errors.tanggal = 'Tanggal perolehan wajib diisi.';
  } else {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (tanggal > today) {
      errors.tanggal = 'Tanggal perolehan tidak boleh melebihi hari ini.';
    }
  }

  return errors;
}

const formAlat = document.querySelector('#form-alat');
const formStatus = document.querySelector('#form-status');
const previewAlat = document.querySelector('#preview-alat');
const previewAlatContent = document.querySelector('#preview-alat-content');

if (formAlat) {
  formAlat.addEventListener('submit', (event) => {
    event.preventDefault();

    previewAlat.hidden = true;
    previewAlatContent.replaceChildren();

    const formData = new FormData(formAlat);
    const errors = validateForm(formData);

    formAlat.querySelectorAll('.error').forEach((errorElement) => {
      errorElement.textContent = '';
    });
    formAlat.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.removeAttribute('aria-invalid');
    });

    const errorEntries = Object.entries(errors);
    for (const [fieldName, message] of errorEntries) {
      const errorElement = document.querySelector(`#error-${fieldName}`);
      const field = formAlat.elements[fieldName];

      if (errorElement) errorElement.textContent = message;
      if (field) field.setAttribute('aria-invalid', 'true');
    }

    if (errorEntries.length > 0) {
      formStatus.textContent = 'Periksa kembali data yang belum valid.';
      formAlat.elements[errorEntries[0][0]]?.focus();
      return;
    }

    const dataValid = Object.fromEntries(formData.entries());
    const labels = {
      nama: 'Nama alat',
      kategori: 'Kategori',
      jumlah: 'Jumlah',
      kondisi: 'Kondisi',
      tanggal: 'Tanggal perolehan'
    };

    for (const [fieldName, label] of Object.entries(labels)) {
      const term = document.createElement('dt');
      term.textContent = label;

      const description = document.createElement('dd');
      description.textContent = dataValid[fieldName];

      previewAlatContent.append(term, description);
    }

    previewAlat.hidden = false;
    formStatus.textContent = 'Data valid. Berikut preview data sebelum diproses.';
  });
}
