
import "./style.css";

// ============================================
// 1. ENVIRONMENT VARIABLES
// ============================================

const APP_NAME = import.meta.env.VITE_APP_NAME || "Daftar Tugas Kuliah";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

const infoAplikasi = document.querySelector<HTMLParagraphElement>(
  "#info-aplikasi"
)!;

infoAplikasi.textContent = `${APP_NAME} v${APP_VERSION}`;

// ============================================
// 2. INTERFACE & TYPE
// ============================================

interface Tugas {
  id: number;
  judul: string;
  matkul: string;
  deadline: string;
  deskripsi: string;
  link: string;
  selesai: boolean;
}

type Filter = "semua" | "belum" | "selesai";

type Pengurutan = "judul" | "deadline";

// ============================================
// 3. DATA & STATE
// ============================================

const STORAGE_KEY = "daftar-tugas-mahasiswa";

function ambilData(): Tugas[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) as Tugas[] : [];
  } catch {
    return [];
  }
}

let daftarTugas: Tugas[] = ambilData();

let filterAktif: Filter = "semua";
let kategoriAktif = "semua";
let pencarian = "";
let pengurutan: Pengurutan = "judul";

let idBerikutnya =
  daftarTugas.length > 0
    ? Math.max(...daftarTugas.map((t) => t.id)) + 1
    : 1;

function simpanData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarTugas));
}

// ============================================
// 4. GENERIC FUNCTION
// ============================================

function cariBerdasarkanId<T extends { id: number }>(
  daftar: T[],
  id: number
): T | undefined {
  return daftar.find((item) => item.id === id);
}

// ============================================
// 5. AMBIL ELEMEN HTML
// ============================================

// Tombol dan modal
const tombolTambah = document.querySelector<HTMLButtonElement>("#btn-tambah")!;
const modalTugas = document.querySelector<HTMLDivElement>("#modal-tugas")!;
const modalDetail = document.querySelector<HTMLDivElement>("#modal-detail")!;

const formTugas = document.querySelector<HTMLFormElement>("#form-tugas")!;
const judulModal = document.querySelector<HTMLHeadingElement>("#judul-modal")!;

// Input form
const inputId = document.querySelector<HTMLInputElement>("#tugas-id")!;
const inputJudul = document.querySelector<HTMLInputElement>("#input-judul")!;
const inputMatkul = document.querySelector<HTMLInputElement>("#input-matkul")!;
const inputDeadline = document.querySelector<HTMLInputElement>("#input-deadline")!;
const inputDeskripsi = document.querySelector<HTMLTextAreaElement>(
  "#input-deskripsi"
)!;
const inputLink = document.querySelector<HTMLInputElement>("#input-link")!;
const inputStatus = document.querySelector<HTMLSelectElement>("#input-status")!;

const pesanError = document.querySelector<HTMLParagraphElement>(
  "#pesan-error"
)!;

// Filter dan pencarian
const inputSearch = document.querySelector<HTMLInputElement>("#input-search")!;
const filterMatkul = document.querySelector<HTMLSelectElement>(
  "#filter-matkul"
)!;
const daftarMatkul = document.querySelector<HTMLDataListElement>(
  "#daftar-matkul"
)!;
const tombolFilter = document.querySelectorAll<HTMLButtonElement>(
  ".filter-btn"
);
const sortTugas = document.querySelector<HTMLSelectElement>("#sort-tugas")!;

// Daftar tugas dan ringkasan
const ulTugas = document.querySelector<HTMLUListElement>("#daftar-tugas")!;
const teksKosong = document.querySelector<HTMLDivElement>("#kosong")!;
const jumlahTugas = document.querySelector<HTMLSpanElement>("#jumlah-tugas")!;

const totalSemua = document.querySelector<HTMLSpanElement>("#total-semua")!;
const totalBelum = document.querySelector<HTMLSpanElement>("#total-belum")!;
const totalSelesai = document.querySelector<HTMLSpanElement>("#total-selesai")!;

// Modal detail
const isiDetail = document.querySelector<HTMLDivElement>("#isi-detail")!;
const tombolEdit = document.querySelector<HTMLButtonElement>("#btn-edit")!;
const tombolHapus = document.querySelector<HTMLButtonElement>("#btn-hapus")!;

let idDetailAktif: number | null = null;

// ============================================
// 6. FUNGSI BANTUAN
// ============================================

function escapeHTML(teks: string): string {
  return teks.replace(/[&<>"']/g, (karakter) => {
    const karakterHTML: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return karakterHTML[karakter];
  });
}

function formatTanggal(tanggal: string): string {
  if (!tanggal) return "-";

  const [tahun, bulan, hari] = tanggal.split("-").map(Number);

  return new Date(tahun, bulan - 1, hari).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusDeadline(deadline: string, selesai: boolean): string {
  if (selesai) return "Selesai";

  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);

  const [tahun, bulan, hari] = deadline.split("-").map(Number);
  const tanggalDeadline = new Date(tahun, bulan - 1, hari);
  const selisih = tanggalDeadline.getTime() - sekarang.getTime();

  if (selisih < 0) return "Terlambat";
  if (selisih === 0) return "Hari ini";

  return "Belum Selesai";
}

// ============================================
// 7. MODAL TAMBAH & EDIT
// ============================================

function bukaModalTambah(): void {
  formTugas.reset();
  inputId.value = "";
  inputStatus.value = "belum";

  judulModal.textContent = "Tambah Tugas Baru";

  pesanError.hidden = true;
  pesanError.textContent = "";

  modalTugas.classList.add("terbuka");
  modalTugas.setAttribute("aria-hidden", "false");

  inputJudul.focus();
}

function bukaModalEdit(id: number): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);

  if (!tugas) return;

  formTugas.reset();

  inputId.value = String(tugas.id);
  inputJudul.value = tugas.judul;
  inputMatkul.value = tugas.matkul;
  inputDeadline.value = tugas.deadline;
  inputDeskripsi.value = tugas.deskripsi;
  inputLink.value = tugas.link;
  inputStatus.value = tugas.selesai ? "selesai" : "belum";

  judulModal.textContent = "Edit Tugas";

  pesanError.hidden = true;
  pesanError.textContent = "";

  modalDetail.classList.remove("terbuka");
  modalDetail.setAttribute("aria-hidden", "true");

  modalTugas.classList.add("terbuka");
  modalTugas.setAttribute("aria-hidden", "false");

  inputJudul.focus();
}

function tutupModalTugas(): void {
  modalTugas.classList.remove("terbuka");
  modalTugas.setAttribute("aria-hidden", "true");
}

function tutupModalDetail(): void {
  modalDetail.classList.remove("terbuka");
  modalDetail.setAttribute("aria-hidden", "true");

  idDetailAktif = null;
}

// ============================================
// 8. OPERASI DATA TUGAS
// ============================================

function tambahTugas(data: Omit<Tugas, "id">): void {
  const tugasBaru: Tugas = {
    id: idBerikutnya,
    ...data,
  };

  daftarTugas.push(tugasBaru);
  idBerikutnya++;

  simpanData();
  render();
}

function editTugas(id: number, data: Omit<Tugas, "id">): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);

  if (!tugas) return;

  tugas.judul = data.judul;
  tugas.matkul = data.matkul;
  tugas.deadline = data.deadline;
  tugas.deskripsi = data.deskripsi;
  tugas.link = data.link;
  tugas.selesai = data.selesai;

  simpanData();
  render();
}

function hapusTugas(id: number): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);

  if (!tugas) return;

  const konfirmasi = confirm(
    `Yakin ingin menghapus tugas "${tugas.judul}"?`
  );

  if (!konfirmasi) return;

  daftarTugas = daftarTugas.filter((t) => t.id !== id);

  simpanData();
  tutupModalDetail();
  render();
}

function ubahStatus(id: number): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);

  if (!tugas) return;

  tugas.selesai = !tugas.selesai;

  simpanData();
  render();
}

// ============================================
// 9. FORM SUBMIT
// ============================================

formTugas.addEventListener("submit", (event) => {
  event.preventDefault();

  const judul = inputJudul.value.trim();
  const matkul = inputMatkul.value.trim();
  const deadline = inputDeadline.value;
  const deskripsi = inputDeskripsi.value.trim();
  const link = inputLink.value.trim();
  const selesai = inputStatus.value === "selesai";

  if (judul.length < 3) {
    pesanError.textContent = "Nama tugas minimal 3 karakter.";
    pesanError.hidden = false;
    inputJudul.focus();
    return;
  }

  if (!matkul) {
    pesanError.textContent = "Nama mata kuliah wajib diisi.";
    pesanError.hidden = false;
    inputMatkul.focus();
    return;
  }

  if (!deadline) {
    pesanError.textContent = "Deadline tugas wajib diisi.";
    pesanError.hidden = false;
    inputDeadline.focus();
    return;
  }

  if (link && !/^https?:\/\/\S+$/i.test(link)) {
    pesanError.textContent = "Link harus menggunakan alamat http atau https.";
    pesanError.hidden = false;
    inputLink.focus();
    return;
  }

  const dataTugas: Omit<Tugas, "id"> = {
    judul,
    matkul,
    deadline,
    deskripsi,
    link,
    selesai,
  };

  const id = Number(inputId.value);

  if (inputId.value) {
    editTugas(id, dataTugas);
  } else {
    tambahTugas(dataTugas);
  }

  tutupModalTugas();
});

// ============================================
// 10. EVENT MODAL
// ============================================

tombolTambah.addEventListener("click", bukaModalTambah);

document.querySelectorAll<HTMLElement>("[data-tutup='true']").forEach(
  (elemen) => {
    elemen.addEventListener("click", tutupModalTugas);
  }
);

document.querySelectorAll<HTMLElement>("[data-tutup-detail='true']").forEach(
  (elemen) => {
    elemen.addEventListener("click", tutupModalDetail);
  }
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    tutupModalTugas();
    tutupModalDetail();
  }
});

// ============================================
// 11. FILTER MATA KULIAH
// ============================================

function renderKategori(): void {
  const kategoriUnik = [...new Set(
    daftarTugas.map((t) => t.matkul.trim())
  )].sort((a, b) => a.localeCompare(b, "id"));

  if (
    kategoriAktif !== "semua" &&
    !kategoriUnik.includes(kategoriAktif)
  ) {
    kategoriAktif = "semua";
  }

  filterMatkul.innerHTML = `
    <option value="semua">Semua Mata Kuliah</option>
    ${kategoriUnik.map((matkul) => `
      <option value="${escapeHTML(matkul)}">
        ${escapeHTML(matkul)}
      </option>
    `).join("")}
  `;

  filterMatkul.value = kategoriAktif;

  daftarMatkul.innerHTML = kategoriUnik.map((matkul) => `
    <option value="${escapeHTML(matkul)}"></option>
  `).join("");
}

filterMatkul.addEventListener("change", () => {
  kategoriAktif = filterMatkul.value;
  render();
});

// ============================================
// 12. PENCARIAN TUGAS
// ============================================

inputSearch.addEventListener("input", () => {
  pencarian = inputSearch.value.trim().toLowerCase();
  render();
});

// ============================================
// 13. FILTER STATUS
// ============================================

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    filterAktif = tombol.dataset.filter as Filter;

    tombolFilter.forEach((t) => t.classList.remove("aktif"));
    tombol.classList.add("aktif");

    render();
  });
});

// ============================================
// 14. PENGURUTAN
// ============================================

sortTugas.addEventListener("change", () => {
  pengurutan = sortTugas.value as Pengurutan;
  render();
});

// ============================================
// 15. DETAIL TUGAS
// ============================================

function bukaDetail(id: number): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);

  if (!tugas) return;

  idDetailAktif = id;

  const status = statusDeadline(tugas.deadline, tugas.selesai);

  isiDetail.innerHTML = `
    <div class="detail-item">
      <small>Nama Tugas</small>
      <h3>${escapeHTML(tugas.judul)}</h3>
    </div>

    <div class="detail-item">
      <small>Mata Kuliah</small>
      <p>${escapeHTML(tugas.matkul)}</p>
    </div>

    <div class="detail-item">
      <small>Deadline</small>
      <p>${formatTanggal(tugas.deadline)}</p>
    </div>

    <div class="detail-item">
      <small>Deskripsi</small>
      <p>${tugas.deskripsi ? escapeHTML(tugas.deskripsi).replace(/\n/g, "<br>") : "Tidak ada deskripsi."}</p>
    </div>

    <div class="detail-item">
      <small>Status</small>
      <p class="status-detail">${status}</p>
    </div>

    <div class="detail-item">
      <small>Link Pengumpulan</small>
      ${
        tugas.link
          ? `<a href="${escapeHTML(tugas.link)}" target="_blank" rel="noopener noreferrer">Buka link pengumpulan ↗</a>`
          : "<p>Belum ada link pengumpulan.</p>"
      }
    </div>
  `;

  modalDetail.classList.add("terbuka");
  modalDetail.setAttribute("aria-hidden", "false");
}

tombolEdit.addEventListener("click", () => {
  if (idDetailAktif !== null) {
    bukaModalEdit(idDetailAktif);
  }
});

tombolHapus.addEventListener("click", () => {
  if (idDetailAktif !== null) {
    hapusTugas(idDetailAktif);
  }
});

// ============================================
// 16. EVENT TOMBOL DI DAFTAR TUGAS
// ============================================

ulTugas.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const tombol = target.closest<HTMLButtonElement>("button");

  if (!tombol) return;

  const id = Number(tombol.dataset.id);
  const aksi = tombol.dataset.aksi;

  if (aksi === "status") ubahStatus(id);
  if (aksi === "detail") bukaDetail(id);
});

// ============================================
// 17. RENDER DAFTAR TUGAS
// ============================================

function render(): void {
  renderKategori();

  let tugasTampil = daftarTugas.filter((t) => {
    const cocokStatus =
      filterAktif === "semua" ||
      (filterAktif === "belum" && !t.selesai) ||
      (filterAktif === "selesai" && t.selesai);

    const cocokKategori =
      kategoriAktif === "semua" || t.matkul === kategoriAktif;

    const cocokPencarian =
      t.judul.toLowerCase().includes(pencarian) ||
      t.matkul.toLowerCase().includes(pencarian);

    return cocokStatus && cocokKategori && cocokPencarian;
  });

  // Pengurutan berdasarkan nama atau deadline
  tugasTampil.sort((a, b) => {
    if (pengurutan === "judul") {
      return a.judul.localeCompare(b.judul, "id");
    }

    return a.deadline.localeCompare(b.deadline);
  });

  ulTugas.innerHTML = tugasTampil.map((t) => {
    const status = statusDeadline(t.deadline, t.selesai);

    let kelasStatus = "status-belum";

    if (t.selesai) kelasStatus = "status-selesai";
    else if (status === "Terlambat") kelasStatus = "status-terlambat";

    return `
      <li class="kartu-tugas ${t.selesai ? "selesai" : ""}">
        <div class="tugas-utama">
          <button
            type="button"
            class="cek"
            data-id="${t.id}"
            data-aksi="status"
            aria-label="Ubah status tugas"
            title="Ubah status"
          >
            ${t.selesai ? "✓" : ""}
          </button>

          <div class="tugas-info">
            <h3 class="judul">${escapeHTML(t.judul)}</h3>

            <div class="tugas-meta">
              <span class="label-matkul">${escapeHTML(t.matkul)}</span>
              <span class="tanggal-tugas">
                <span>◷</span> ${formatTanggal(t.deadline)}
              </span>
            </div>
          </div>
        </div>

        <div class="tugas-bawah">
          <span class="status-tugas ${kelasStatus}">${status}</span>

          <button
            type="button"
            class="btn-detail"
            data-id="${t.id}"
            data-aksi="detail"
          >
            Selengkapnya →
          </button>
        </div>
      </li>
    `;
  }).join("");

  // Pesan ketika tidak ada tugas
  teksKosong.hidden = tugasTampil.length > 0;

  jumlahTugas.textContent =
    `Menampilkan ${tugasTampil.length} dari ${daftarTugas.length} tugas`;

  // Ringkasan jumlah tugas
  totalSemua.textContent = String(daftarTugas.length);

  totalBelum.textContent = String(
    daftarTugas.filter((t) => !t.selesai).length
  );

  totalSelesai.textContent = String(
    daftarTugas.filter((t) => t.selesai).length
  );
}

// ============================================
// 18. JALANKAN APLIKASI
// ============================================

render();