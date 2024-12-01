import Table from "cli-table";
import { centerText } from "./Utils/viewUtils.js";

export const DosenView = {
  optMenuDosen: () => {
    console.log(`\n${centerText("**Menu Dosen**")}`);
    console.log("[1] Tampilkan Daftar Dosen");
    console.log("[2] Cari Dosen");
    console.log("[3] Tambah Dosen");
    console.log("[4] Hapus Dosen");
    console.log("[5] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printDosen: (rows) => {
    const table = new Table({
      head: ["ID Dosen", "Nama Dosen"],
      colWidths: [15, 30],
    });
    rows.forEach((row) => {
      table.push([row.nip, row.name_dosen]);
    });
    console.log(table.toString());
  },
  printDosenDetail: (row) => {
    console.log(`ID Dosen   : ${row.nip}`);
    console.log(`Nama Dosen : ${row.name_dosen}`);
  },
  printDosenAdded: (nip) => {
    console.log(`Dosen dengan ID '${nip}' berhasil ditambahkan`);
  },
  printDosenDeleted: (nip) => {
    console.log(`Dosen dengan ID '${nip}' berhasil dihapus`);
  },
  printDosenNotFound: (nip) => {
    console.log(`Dosen dengan ID '${nip}' tidak ditemukan`);
  },
  printDosenExist: (nip) => {
    console.log(`Dosen dengan ID '${nip}' sudah ada`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
