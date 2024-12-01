import { db } from "./Config/db.js";

export class KontrakModel {
  static getAll(callback) {
    db.all(
    //   `SELECT nm.id_nilai, nm.nim, m.nama AS nama_mahasiswa, mk.nama AS nama_matakuliah, d.nama AS nama_dosen, nm.nilai
    //    FROM nilai_mahasiswa nm
    //    JOIN mahasiswa m ON nm.nim = m.nim
    //    JOIN matakuliah mk ON nm.id_matakuliah = mk.id_matakuliah
    //    JOIN dosen d ON nm.id_dosen = d.id_dosen`,

       `SELECT id, nim, name_mahasiswa, name_mata_kuliah, name_dosen, nilai
      FROM kontrak 
      JOIN mahasiswa  using(nim)
      JOIN mata_kuliah using(id_mata_kuliah)
      JOIN dosen using(nip)`,
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static getByNim(nim, callback) {
    db.all(
    //   `SELECT nm.id_nilai, nm.nim, nm.id_matakuliah, nm.id_dosen, nm.nilai
    //    FROM nilai_mahasiswa nm
    //    WHERE nm.nim = ?`,

       `SELECT id, nim, id_mata_kuliah, nip, nilai
            FROM kontrak 
            JOIN mahasiswa using(nim)
            JOIN mata_kuliah using(id_mata_kuliah)
            JOIN dosen using(nip) where nim=?`,
      [nim],
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static getMatakuliahByNim(nim, callback) {
    db.all(
    //   `SELECT nm.id_nilai, nm.nim, mk.nama AS nama_matakuliah, nm.nilai
    //    FROM nilai_mahasiswa nm
    //    JOIN matakuliah mk ON nm.id_matakuliah = mk.id_matakuliah
    //    WHERE nm.nim = ?`,

       `SELECT id, name_mata_kuliah, nilai
            FROM kontrak 
            JOIN mata_kuliah using(id_mata_kuliah) where nim=?`,
      [nim],
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static add(nim, id_mata_kuliah, nip, callback) {
    db.run(
    //   `INSERT INTO nilai (nim, id_mata_kuliah, id_dosen) VALUES (?, ?, ?)`,
      `INSERT INTO kontrak (nim, id_mata_kuliah, nip)
      VALUES (?, ?, ?)`,


      [nim, id_mata_kuliah, nip],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static update(id, nilai, callback) {
    db.run(
      "UPDATE kontrak SET nilai = ? WHERE id = ?",
      [nilai, id],
      function (err) {
        if (err) throw err;
        callback(this.changes);
      }
    );
  }
  static delete(id, callback) {
    db.run("DELETE FROM kontrak WHERE id = ?", [id], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
