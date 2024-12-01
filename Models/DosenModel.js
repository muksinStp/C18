import { db } from "./Config/db.js";

export class DosenModel {
  static getAll(callback) {
    db.all(`SELECT * FROM dosen`, (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  }
  static getById(nip, callback) {
    db.get(`SELECT * FROM dosen WHERE nip = ?`, [nip], (err, row) => {
      if (err) throw err;
      callback(row);
    });
  }
  static add(nip, name_dosen, callback) {
    db.run(`INSERT INTO dosen (nip, name_dosen) VALUES (?, ?)`, [nip, name_dosen], (err) => {
      if (err) throw err;
      callback();
    });
  }
  static delete(nip, callback) {
    db.run("DELETE FROM dosen WHERE nip = ?", [nip], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
