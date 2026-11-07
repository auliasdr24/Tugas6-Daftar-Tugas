import "./style.css";

const APP_NAME = import.meta.env.VITE_APP_NAME;
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const infoAplikasi = document.querySelector<HTMLParagraphElement>(
  "#info-aplikasi"
)!;

infoAplikasi.textContent = `${APP_NAME} v${APP_VERSION}`;
// ============================================
// 1. INTERFACE & TYPE — materi TypeScript ✨
// ============================================

// Interface = "bentuk" data satu tugas.
// Di sini ada 3 primitive types: number, string, boolean
interface Tugas {
  id: number;
  judul: string;
  selesai: boolean;
}

// Type alias + union type: nilai filter HANYA boleh 3 ini
type Filter = "semua" | "belum" | "selesai";

// ============================================
// 2. DATA (array) & STATE
// ============================================

// Array berisi objek Tugas
let daftarTugas: Tugas[] = [
  { id: 1, judul: "Kumpulkan tugas PAW pertemuan 6", selesai: false },
  { id: 2, judul: "Baca materi basis data", selesai: true },
];

let filterAktif: Filter = "semua";
let idBerikutnya: number = 3;

// ============================================
// 3. GENERIC FUNCTION — materi TypeScript ✨
// ============================================

// Generic <T> = fungsi yang bisa dipakai untuk array APA PUN,
// asalkan punya properti id: number. Nanti dipakai beneran di bawah.
function cariBerdasarkanId<T extends { id: number }>(
  daftar: T[],
  id: number
): T | undefined {
  return daftar.find((item) => item.id === id);
}

// ============================================
// 4. AMBIL ELEMEN HTML
// ============================================

const form = document.querySelector<HTMLFormElement>("#form-tambah")!;
const inputJudul = document.querySelector<HTMLInputElement>("#input-judul")!;
const pesanError = document.querySelector<HTMLParagraphElement>("#pesan-error")!;
const ulTugas = document.querySelector<HTMLUListElement>("#daftar-tugas")!;
const teksKosong = document.querySelector<HTMLParagraphElement>("#kosong")!;

// ============================================
// 5. OPERASI DATA (tambah / hapus / edit / ubah status)
// ============================================

function tambahTugas(judul: string): void {
  const tugasBaru: Tugas = { id: idBerikutnya, judul, selesai: false };
  daftarTugas.push(tugasBaru);
  idBerikutnya++;
  render();
}

function hapusTugas(id: number): void {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  render();
}

function ubahStatus(id: number): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id); // ← pakai GENERIC
  if (tugas) tugas.selesai = !tugas.selesai;
  render();
}

function editTugas(id: number, judulBaru: string): void {
  const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id); // ← pakai GENERIC
  if (tugas && judulBaru.trim() !== "") tugas.judul = judulBaru.trim();
  render();
}

// ============================================
// 6. EVENT HANDLING (tanggapan aksi pengguna)
// ============================================

// Event: submit form "tambah"
form.addEventListener("submit", (event) => {
  event.preventDefault(); // biar halaman tidak reload
  const judul = inputJudul.value.trim();

  // Validasi sederhana
  if (judul === "") {
    pesanError.textContent = "Judul tugas tidak boleh kosong!";
    pesanError.hidden = false;
    return;
  }
  if (judul.length < 3) {
    pesanError.textContent = "Judul minimal 3 huruf ya!";
    pesanError.hidden = false;
    return;
  }

  pesanError.hidden = true;
  tambahTugas(judul);
  inputJudul.value = "";
  inputJudul.focus();
});

// Event: klik tombol di dalam daftar (status / edit / hapus)
ulTugas.addEventListener("click", (event) => {
  const tombol = (event.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (!tombol) return;

  const id = Number(tombol.dataset.id);
  const aksi = tombol.dataset.aksi;

  if (aksi === "status") ubahStatus(id);
  if (aksi === "hapus") hapusTugas(id);
  if (aksi === "edit") {
    const tugas = cariBerdasarkanId<Tugas>(daftarTugas, id);
    const judulBaru = prompt("Edit judul tugas:", tugas?.judul);
    if (judulBaru !== null) editTugas(id, judulBaru);
  }
});

// Event: klik tombol filter
const tombolFilter = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    filterAktif = tombol.dataset.filter as Filter;
    tombolFilter.forEach((t) => t.classList.remove("aktif"));
    tombol.classList.add("aktif");
    render();
  });
});

// ============================================
// 7. RENDER (menampilkan data ke layar)
// ============================================

function render(): void {
  // Conditional rendering: saring tugas sesuai filter aktif
  const tugasTampil = daftarTugas.filter((t) => {
    if (filterAktif === "belum") return !t.selesai;
    if (filterAktif === "selesai") return t.selesai;
    return true;
  });

  // List rendering: map() array → HTML, join() gabungkan
  ulTugas.innerHTML = tugasTampil
    .map(
      (t) => `
      <li class="${t.selesai ? "selesai" : ""}">
        <button class="cek" data-id="${t.id}" data-aksi="status">${t.selesai ? "✅" : "⬜"}</button>
        <span class="judul">${t.judul}</span>
        <button class="aksi" data-id="${t.id}" data-aksi="edit">✏️</button>
        <button class="aksi" data-id="${t.id}" data-aksi="hapus">🗑️</button>
      </li>`
    )
    .join("");

  // Empty state: pesan kalau daftar kosong
  teksKosong.hidden = tugasTampil.length > 0;
}

render(); // tampilkan pertama kali saat aplikasi dibuka