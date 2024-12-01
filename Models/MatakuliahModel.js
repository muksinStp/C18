import { db } from "./Config/db.js";

export class MatakuliahModel {
  static getAll(callback) {
    db.all(`SELECT * FROM mata_kuliah`, (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  }
  static getById(id_mata_kuliah, callback) {
    db.get(`SELECT * FROM mata_kuliah WHERE id_mata_kuliah = ?`, [id_mata_kuliah], (err, row) => {
      if (err) throw err;
      callback(row);
    });
  }
  static add(id_mata_kuliah, name_mata_kuliah, sks, callback) {
    db.run(
      `INSERT INTO mata_kuliah (id_mata_kuliah, name_mata_kuliah, sks) VALUES (?, ?, ?)`,
      [id_mata_kuliah, name_mata_kuliah, sks],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static delete(id_mata_kuliah, callback) {
    db.run("DELETE FROM mata_kuliah WHERE id_mata_kuliah = ?", [id_mata_kuliah], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
