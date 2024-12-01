import { db } from "../Models/Config/db.js";

export class JurusanModel {
  static getAll(callback) {
    db.all(`SELECT * FROM jurusan`, (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  }
  static getById(id_jurusan, callback) {
    db.get(`SELECT * FROM jurusan WHERE id_jurusan = ?`, [id_jurusan], (err, row) => {
      if (err) throw err;
      callback(row);
    });
  }
  static add(id_jurusan, name_jurusan, callback) {
    db.run(
      `INSERT INTO jurusan (id_jurusan, name_jurusan)
            VALUES (?, ?)`,
      [id_jurusan, name_jurusan],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static delete(id_jurusan, callback) {
    db.run("DELETE FROM jurusan WHERE id_jurusan = ?", [id_jurusan], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
