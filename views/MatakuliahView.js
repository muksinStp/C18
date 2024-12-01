import Table from "cli-table";
import { centerText } from "./Utils/viewUtils.js";

export const MatakuliahView = {
  optMenuMatakuliah: () => {
    console.log(`\n${centerText("**Menu Matakuliah**")}`);
    console.log("[1] Tampilkan Daftar Matakuliah");
    console.log("[2] Cari Matakuliah");
    console.log("[3] Tambah Matakuliah");
    console.log("[4] Hapus Matakuliah");
    console.log("[5] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printMatakuliah: (rows) => {
    const table = new Table({
      head: ["ID Matakuliah", "Nama Matakuliah", "SKS"],
      colWidths: [15, 30, 5],
    });
    rows.forEach((row) => {
      table.push([row.id_mata_kuliah, row.name_mata_kuliah, row.sks]);
    });
    console.log(table.toString());
  },
  printMatakuliahDetail: (row) => {
    console.log(`ID Matakuliah    : ${row.id_mata_kuliah}`);
    console.log(`Nama Matakuliah  : ${row.name_mata_kuliah}`);
    console.log(`SKS              : ${row.sks}`);
  },
  printMatakuliahAdded: (id_mata_kuliah) => {
    console.log(`Matakuliah dengan ID '${id_mata_kuliah}' berhasil ditambahkan`);
  },
  printMatakuliahDeleted: (id_mata_kuliah) => {
    console.log(`Matakuliah dengan ID '${id_mata_kuliah}' berhasil dihapus`);
  },
  printMatakuliahNotFound: (id_mata_kuliah) => {
    console.log(`Matakuliah dengan ID '${id_mata_kuliah}' tidak ditemukan`);
  },
  printMatakuliahExist: (id_mata_kuliah) => {
    console.log(`Matakuliah dengan ID '${id_mata_kuliah}' sudah ada`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
