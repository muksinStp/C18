import Table from "cli-table";
import { centerText } from "./Utils/viewUtils.js";

export const MahasiswaView = {
  optMenuMahasiswa: () => {
    console.log(`\n${centerText("**Menu Mahasiswa**")}`);
    console.log("[1] Tampilkan Daftar Mahasiswa");
    console.log("[2] Cari Mahasiswa");
    console.log("[3] Tambah Mahasiswa");
    console.log("[4] Hapus Mahasiswa");
    console.log("[5] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printMahasiswa: (rows) => {
    const table = new Table({
      head: ["NIM", "Nama", "Tanggal Lahir", "Alamat", "Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 20, 15, 20, 15, 25],
    });
    rows.forEach((row) => {
      table.push([row.nim, row.name_mahasiswa, row.tanggal_lahir, row.alamat, row.id_jurusan, row.name_jurusan]);
    });
    console.log(table.toString());
  },
  printMahasiswaDetail: (data) => {
    console.log(`NIM            : ${data.nim}`);
    console.log(`Nama           : ${data.name_mahasiswa}`);
    console.log(`Tanggal Lahir  : ${data.tanggal_lahir}`);
    console.log(`Alamat         : ${data.alamat}`);
    console.log(`Jurusan        : ${data.name_jurusan}`);
  },
  printMahasiswaAdded: (nim) => {
    console.log(`Mahasiswa dengan NIM '${nim}' berhasil ditambahkan`);
  },
  printMahasiswaDeleted: (nim) => {
    console.log(`Mahasiswa dengan NIM '${nim}' berhasil dihapus`);
  },
  printMahasiswaNotFound: (nim) => {
    console.log(`Mahasiswa dengan NIM '${nim}' tidak ditemukan`);
  },
  printMahasiswaExist: (nim) => {
    console.log(`Mahasiswa dengan NIM '${nim}' sudah ada`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
