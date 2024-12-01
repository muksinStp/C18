import Table from "cli-table";
import { centerText } from "./Utils/viewUtils.js";

export const JurusanView = {
  optMenuJurusan: () => {
    console.log(`\n${centerText("**Menu Jurusan**")}`);
    console.log("[1] Tampilkan Daftar Jurusan");
    console.log("[2] Cari Jurusan");
    console.log("[3] Tambah Jurusan");
    console.log("[4] Hapus Jurusan");
    console.log("[5] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printJurusan: (rows) => {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 30],
    });
    rows.forEach((row) => {
      table.push([row.id_jurusan, row.name_jurusan]);
    });
    console.log(table.toString());
  },
  printJurusanDetail: (row) => {
    console.log(`ID Jurusan   : ${row.id_jurusan}`);
    console.log(`Nama Jurusan : ${row.name_jurusan}`);
  },
  printJurusanAdded: (id_jurusan) => {
    console.log(`Jurusan dengan ID '${id_jurusan}' berhasil ditambahkan`);
  },
  printJurusanDeleted: (id_jurusan) => {
    console.log(`Jurusan dengan ID '${id_jurusan}' berhasil dihapus`);
  },
  printJurusanNotFound: (id_jurusan) => {
    console.log(`Jurusan dengan ID '${id_jurusan}' tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
