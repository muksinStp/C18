import { db } from "./Config/db.js";

export class MahasiswaModel {
  static getAll(callback) {
    db.all(
    //   `SELECT m.nim, m.nama, m.tgllahir, m.alamat, j.id_jurusan, j.namajurusan 
    //     FROM mahasiswa m
    //     JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,

        `select*from mahasiswa left join jurusan using(id_jurusan)`,


      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static getByNim(nim, callback) {
    db.get(
    //   `SELECT m.nim, m.nama, m.tgllahir, m.alamat, j.namajurusan
    //    FROM mahasiswa m
    //    JOIN jurusan j ON m.id_jurusan = j.id_jurusan
    //    WHERE m.nim = ?`,
       `select*from mahasiswa left join jurusan using(id_jurusan) where nim=?`,


      [nim],
      (err, row) => {
        if (err) throw err;
        callback(row);
      }
    );
  }
  static add(nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan, callback) {
    db.run(
      `INSERT INTO mahasiswa (nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan)
       VALUES (?, ?, ?, ?, ?)`,
      [nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static delete(nim, callback) {
    db.run("DELETE FROM mahasiswa WHERE nim = ?", [nim], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
