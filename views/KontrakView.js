import Table from "cli-table";
import { centerText } from "./Utils/viewUtils.js";

export const KontrakView = {
  optMenuKontrak: () => {
    console.log(`\n${centerText("**Menu Kontrak**")}`);
    console.log("[1] Daftar Kontrak");
    console.log("[2] Cari Kontrak");
    console.log("[3] Tambah Kontrak");
    console.log("[4] Hapus Kontrak");
    console.log("[5] Update Nilai");
    console.log("[6] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printKontrak: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
      colWidths: [5, 20, 20, 20, 20, 10],
    });
    rows.forEach((row) => {
      table.push([
        row.id,
        row.nim,
        row.name_mahasiswa,
        row.name_mata_kuliah,
        row.name_dosen,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },
  printKontrakDetail: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Kode Matakuliah", "Kode Dosen", "Nilai"],
      colWidths: [5, 20, 10, 11, 5],
    });
    rows.forEach((row) => {
      table.push([
        row.id,
        row.nim,
        row.id_mata_kuliah,
        row.nip,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },
  printNilaiMahasiswa: (rows) => {
    const table = new Table({
      head: ["ID", "Nama Mata Kuliah", "Nilai"],
      colWidths: [5, 20, 10],
    });
    rows.forEach((row) => {
      table.push([row.id, row.name_mata_kuliah, row.nilai != null ? row.nilai : ""]);
    });
    console.log(table.toString());
  },
  printKontrakAdded: () => {
    console.log(`Kontrak berhasil ditambahkan`);
  },
  printKontrakUpdated: (id) => {
    console.log(`Kontrak dengan ID '${id}' berhasil diupdate`);
  },
  printKontrakDeleted: (id) => {
    console.log(`Kontrak dengan ID '${id}' berhasil dihapus`);
  },
  printKontrakNotFound: (id) => {
    console.log(`Kontrak dengan ID '${id}' tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
  printMahasiswaNotFound: (nim) => {
    console.log(`Mahasiswa dengan NIM '${nim}' tidak ditemukan`);
  },
};
