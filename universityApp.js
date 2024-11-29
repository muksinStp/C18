
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const Table = require("cli-table3");

// Buat Koneksi Database
const db = new sqlite3.Database("university.db");


// Buat Table users jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL)`);


// Buat Interface Readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Class utama untuk sistem universitas
class UniversityApp {
  constructor() {
    this.currentUser = null;
  }

  // Method untuk memulai Program
  start() {
    console.log("==========================================");
    console.log(
      "Welcome to Universitas Pendidikan Indonesia \nJl. Setiabudhi No.255"
    );
    this.login();
  }

  // Method Untuk Login
  login() {
    rl.question("Username: ", (username) => {
      // Cek Username di database
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!user) {
            console.log("Username tidak terdaftar");
            this.login();
            return;
          }

          rl.question("Password: ", (password) => {
            if (password === user.password) {
              this.currentUser = user;
              console.log(
                `Welcome, ${user.username}. Your Access Level is : ${user.role}`
              );
              this.showMainMenu();
            } else {
              console.log("Password Salah");
              this.login();
            }
          });
        }
      );
    });
  }

  // Method untuk menampilkan Menu Utama
  showMainMenu() {
    console.log("====================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("[1] Mahasiswa");
    console.log("[2] Jurusan");
    console.log("[3] Dosen");
    console.log("[4] Matakuliah");
    console.log("[5] Kontrak");
    console.log("[6] Keluar");
    console.log("====================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (opsi) => {
      switch (opsi) {
        case "1":
          new MahasiswaMenu().show();
          break;
        case "2":
          new JurusanMenu().show();
          break;
        case "3":
          new DosenMenu().show();
          break;
        case "4":
          new MatakuliahMenu().show();
          break;
        case "5":
          new KontrakMenu().show();
          break;
        case "6":
          console.log("Anda Telah Keluar dari Program!");
          this.start();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.showMainMenu();
      }
    });
  }
}

// Class untuk Menu Mahasiswa
class MahasiswaMenu {
  show() {
    console.log("======================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("[1] Daftar mahasiswa");
    console.log("[2] Cari mahasiswa");
    console.log("[3] Tambah mahasiswa");
    console.log("[4] Hapus mahasiswa");
    console.log("[5] Kembali");
    console.log("======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (opsi) => {
      switch (opsi) {
        case "1":
          this.listMahasiswa();
          break;
        case "2":
          this.cariMahasiswa();
          break;
        case "3":
          this.tambahMahasiswa();
          break;
        case "4":
          this.hapusMahasiswa();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show();
          break;
      }
    });
  }


  // Method CRUD mahasiswa
  listMahasiswa() {
    db.all(
      `select*from mahasiswa left join jurusan using(id_jurusan)`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: [
            "NIM",
            "Nama",
            "Tanggal Lahir",
            "Alamat",
            "Kode Jurusan",
            "Nama Jurusan",
          ],
        });

        rows.forEach((row) => {
          table.push([
            row.nim,
            row.name_mahasiswa,
            row.tanggal_lahir,
            row.alamat,
            row.id_jurusan,
            row.name_jurusan,
          ]);
        });

        console.log(table.toString());
        this.show();
      }
    );
  }

  cariMahasiswa() {
    rl.question("Masukkan NIM mahasiswa: ", (nim) => {
      db.get(
        `select*from mahasiswa left join jurusan using(id_jurusan) where mahasiswa.nim=?`,
        [nim],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Mahasiswa dengan NIM ${nim} tidak terdaftar`);
          } else {
            console.log("========================================");
            console.log(`Detail Mahasiswa dengan NIM ${nim}`);
            console.log(`NIM      : ${row.nim}`);
            console.log(`Nama     : ${row.name_mahasiswa}`);
            console.log(`Alamat   : ${row.alamat}`);
            console.log(`Jurusan  : ${row.id_jurusan}`);
          }
          this.show();
        }
      );
    });
  }

  tambahMahasiswa() {

    console.log("Input Data Mahasiswa:");
    rl.question("NIM: ", (nim) => {
      // Cek Apakah NIM Sudah Ada ?
      db.get("SELECT nim FROM mahasiswa WHERE nim = ?", [nim], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        if (row) {
          console.log("NIM sudah terdaftar! Silahkan gunakan NIM lain.");
          this.show();
          return;
        }

        rl.question("Nama: ", (name_mahasiswa) => {
          rl.question("Tanggal Lahir (YYYY-MM-DD):", (tanggal_lahir) => {
            rl.question("Alamat: ", (alamat) => {
              db.all("SELECT * FROM jurusan", (err, jurusan) => {
                if (err) {
                  console.log(err);
                  return;
                }

                const table = new Table({
                  head: ["Kode Jurusan", "Nama Jurusan"],
                });

                jurusan.forEach((jurusan) => {
                  table.push([jurusan.id_jurusan, jurusan.name_jurusan]);
                });

                console.log("\nDaftar Jurusan:");
                console.log(table.toString());

                rl.question("Kode Jurusan: ", (id_jurusan) => {
                  db.run(
                    `INSERT INTO mahasiswa (nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan)
                    VALUES (?, ?, ?, ?, ?)`,
                    [nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan],
                    (err) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      console.log(
                        "Mahasiswa telah ditambahkan ke dalam database"
                      );
                      this.listMahasiswa();
                    }
                  );
                });
              });
            });
          });
        });
      });

    });
  }

  hapusMahasiswa() {
    rl.question("Masukkan NIM mahasiswa: ", (nim) => {
      
      db.get("SELECT * FROM mahasiswa WHERE nim = ?", [nim], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        // Jika row kosong/undefined, berarti id_jurusan tidak ditemukan
        if (!row) {
          console.log(`Jurusan dengan kode ${nim} tidak ditemukan dalam database`);
          return this.listMahasiswa();
        }
      
      db.run("DELETE FROM mahasiswa WHERE nim = ?", [nim], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Mahasiswa dengan NIM ${nim} berhasil dihapus`);
        this.show();
      });
    });
  })
}
}


// Class Untuk Menu Jurusan
class JurusanMenu {
  show() {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("[1] Daftar Jurusan");
    console.log("[2] Cari Jurusan");
    console.log("[3] Tambah Jurusan");
    console.log("[4] Hapus Jurusan");
    console.log("[5] Kembali");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (opsi) => {
      switch (opsi) {
        case "1":
          this.listJurusan();
          break;
        case "2":
          this.cariJurusan();
          break;
        case "3":
          this.tambahJurusan();
          break;
        case "4":
          this.hapusJurusan();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Jurusan
  listJurusan() {
    db.all("SELECT * FROM jurusan", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode Jurusan", "Nama Jurusan"],
      });

      rows.forEach((row) => {
        table.push([row.id_jurusan, row.name_jurusan]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariJurusan() {
    rl.question("Masukkan kode Jurusan: ", (id_jurusan) => {
      db.get(
        "SELECT * FROM jurusan WHERE id_jurusan = ?",
        [id_jurusan],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Jurusan dengan Kode ${id_jurusan} tidak ditemukan`);
          } else {
            console.log("=======================================");
            console.log(`Detail Jurusan dengan Kode '${id_jurusan}'`);
            console.log(`Kode Jurusan: ${row.id_jurusan}`);
            console.log(`Nama Juruasn: ${row.name_jurusan}`);
          }
          this.show();
        }
      );
    });
  }

  tambahJurusan() {
    db.all("SELECT * FROM jurusan", (err, row) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode Jurusan", "Nama Jurusan"],
      });

      row.forEach((row) => {
        table.push([row.id_jurusan, row.name_jurusan]);
      });
      console.log(table.toString());
      console.log("\nInput Data Jurusan Baru:");

      rl.question("Kode Jurusan: ", (id_jurusan) => {
        rl.question("Nama Jurusan: ", (name_jurusan) => {
          db.run(
            "INSERT INTO jurusan (id_jurusan, name_jurusan) VALUES (?, ?)",
            [id_jurusan, name_jurusan],
            (err,) => {
              if (err) {
                console.log('Kode Jurusan yang anda input sudah terdaftar');
                return this.show();
              }
              console.log("Jurusan telah ditambahkan ke dalam database");
              this.listJurusan();
            }
          );
        });
      });
    });
  }


  hapusJurusan() {
    rl.question("Masukkan Kode Jurusan: ", (id_jurusan) => {
      // Cek dulu apakah id_jurusan ada
      db.get("SELECT * FROM Jurusan WHERE id_jurusan = ?", [id_jurusan], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        // Jika row kosong/undefined, berarti id_jurusan tidak ditemukan
        if (!row) {
          console.log(`Jurusan dengan kode ${id_jurusan} tidak ditemukan dalam database`);
          return this.listJurusan();
        }

        // Jika ditemukan, lakukan penghapusan
        db.run("DELETE FROM Jurusan WHERE id_jurusan = ?", [id_jurusan], (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Jurusan dengan kode ${id_jurusan} berhasil dihapus`);
          return this.listJurusan();
        });
      });
    });
  }
}

// Class untuk Menu Dosen
class DosenMenu {
  show() {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("[1] Daftar Dosen");
    console.log("[2] Cari Dosen");
    console.log("[3] Tambah Dosen");
    console.log("[4] Hapus Dosen");
    console.log("[5] Kembali ke Menu Utama");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listDosen();
          break;
        case "2":
          this.cariDosen();
          break;
        case "3":
          this.tambahDosen();
          break;
        case "4":
          this.hapusDosen();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan Tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Dosen
  listDosen() {
    db.all("SELECT * FROM dosen", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["NIP", "Nama Dosen"],
      });

      rows.forEach((row) => {
        table.push([row.nip, row.name_dosen]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariDosen() {
    rl.question("Masukkan NIP dosen: ", (nip) => {
      db.get("SELECT * FROM dosen WHERE nip = ?", [nip], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!row) {
          console.log(`Dosen dengan NIP ${nip} tidak ditemukan`);
        } else {
          console.log("======================================");
          console.log(`Detail Dosen dengan NIP ${nip}`);
          console.log(`NIP: ${row.nip}`);
          console.log(`Nama: ${row.name_dosen}`);
        }
        this.show();
      });
    });
  }

  tambahDosen() {
    console.log("Input Data Dosen: ");
    rl.question("NIP: ", (nip) => {
      rl.question("Nama Dosen: ", (name_dosen) => {
        db.run(
          "INSERT INTO dosen (nip, name_dosen) VALUES (?, ?)",
          [nip, name_dosen],
          (err) => {
            if (err) {
              console.log('NIP yang anda input sudah terdaftar ');
              return this.show();
            }
            console.log("Dosen telah ditambahkan ke dalam database");
            this.listDosen();
          }
        );
      });
    });
  }

  hapusDosen() {
    rl.question("Masukkan NIP dosen: ", (nip) => {
      db.get("SELECT * FROM dosen WHERE nip = ?", [nip], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        // Jika row kosong/undefined, berarti id_jurusan tidak ditemukan
        if (!row) {
          console.log(`Jurusan dengan kode ${nip} tidak ditemukan dalam database`);
          return this.listDosen();
        }

      db.run("DELETE FROM dosen WHERE nip = ?", [nip], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Dosen dengan NIP ${nip} berhasil dihapus`);
        this.listDosen();
      });
    });
  });
  }
}

// Class untuk Menu Matakuliah
class MatakuliahMenu {
  show() {
    console.log("==========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("[1] Daftar Matakuliah");
    console.log("[2] Cari Matakuliah");
    console.log("[3] Tambah Matakuliah");
    console.log("[4] Hapus Matakuliah");
    console.log("[5] Kembali ke Menu Utama");
    console.log("==========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (opsi) => {
      switch (opsi) {
        case "1":
          this.listMatakuliah();
          break;
        case "2":
          this.cariMatakuliah();
          break;
        case "3":
          this.tambahMatakuliah();
          break;
        case "4":
          this.hapusMatakuliah();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan Tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Matakuliah
  listMatakuliah() {
    db.all("SELECT * FROM mata_kuliah", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode MK", "Nama Matakuliah", "SKS"],
      });

      rows.forEach((row) => {
        table.push([row.id_mata_kuliah, row.name_mata_kuliah, row.sks]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariMatakuliah() {
    rl.question("Masukkan Kode Matakuliah: ", (id_mata_kuliah) => {
      db.get(
        "SELECT * FROM mata_kuliah WHERE id_mata_kuliah = ?",
        [id_mata_kuliah],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Matakuliah dengan kode ${id_mata_kuliah} tidak ditemukan`);
          } else {
            console.log("===================================");
            console.log(`Detail Matakuliah dengan Kode ${id_mata_kuliah}`);
            console.log(`Kode: ${row.id_mata_kuliah}`);
            console.log(`Nama: ${row.name_mata_kuliah}`);
            console.log(`SKS: ${row.sks}`);
          }
          this.show();
        }
      );
    });
  }

  tambahMatakuliah() {
    console.log("Input Data Matakuliah:");
    rl.question("Kode Mata kuliah: ", (id_mata_kuliah) => {
      rl.question("Nama Mata kuliah: ", (name_mata_kuliah) => {
        rl.question("SKS: ", (sks) => {
          db.run(
            "INSERT INTO mata_kuliah (id_mata_kuliah, name_mata_kuliah, sks) VALUES (?, ?, ?)",
            [id_mata_kuliah, name_mata_kuliah, sks],
            (err) => {
              if (err) {
                console.log('Kode Mata Kuliah yang anda Input sudah terdaftar');
                return this.show();
              }
              console.log("Matakuliah telah ditambahkan ke dalam database:");
              this.listMatakuliah();
            }
          );
        });
      });
    });
  }

  hapusMatakuliah() {
    rl.question("Masukkan Kode Matakuliah: ", (id_mata_kuliah) => {
      db.get("SELECT * FROM mata_kuliah WHERE id_mata_kuliah = ?", [id_mata_kuliah], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        // Jika row kosong/undefined, berarti id_jurusan tidak ditemukan
        if (!row) {
          console.log(`Kode mata kuliah ${id_mata_kuliah} yang anda input tidak ditemukan dalam database`);
          return this.listMatakuliah();
        }

      db.run("DELETE FROM mata_kuliah WHERE id_mata_kuliah = ?", [id_mata_kuliah], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Matakuliah dengan kode ${id_mata_kuliah} berhasil dihapus:`);
        this.listMatakuliah();
      });
    });
  });
  }
}

// Class untuk Menu Kontrak
class KontrakMenu {
  show() {
    console.log("=======================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("{1] Daftar Kontrak");
    console.log("[2] Cari Kontrak");
    console.log("[3] Tambah Kontrak");
    console.log("[4] Hapus Kontrak");
    console.log("[5] Update Nilai");
    console.log("[6] Kembali");
    console.log("=======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (opsi) => {
      switch (opsi) {
        case "1":
          this.listKontrak();
          break;
        case "2":
          this.cariKontrak();
          break;
        case "3":
          this.tambahKontrak();
          break;
        case "4":
          this.hapusKontrak();
          break;
        case "5":
          this.updateNilai();
          break;
        case "6":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Kontrak
  listKontrak() {
    db.all(
      `SELECT id, nim, name_mahasiswa, name_mata_kuliah, name_dosen, nilai
      FROM kontrak 
      JOIN mahasiswa  using(nim)
      JOIN mata_kuliah using(id_mata_kuliah)
      JOIN dosen using(nip)`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.name_mahasiswa,
            row.name_mata_kuliah,
            row.name_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());
        this.show();
      }
    );
  }

  cariKontrak() {
    console.log("\nDaftar Kontrak yang ada:");
    db.all(
      `SELECT id, nim, name_mahasiswa, name_mata_kuliah, name_dosen, nilai
      FROM kontrak 
      JOIN mahasiswa using(nim)
      JOIN mata_kuliah using(id_mata_kuliah)
      JOIN dosen using(nip)`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.name_mahasiswa,
            row.name_mata_kuliah,
            row.name_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());

        rl.question("\nMasukkan NIM Mahasiswa: ", (nim) => {
          db.all(
            `SELECT id, nim, id_mata_kuliah, nip, nilai
            FROM kontrak 
            JOIN mahasiswa using(nim)
            JOIN mata_kuliah using(id_mata_kuliah)
            JOIN dosen using(nip) where nim=?`,
            [nim],
            (err, rows) => {
              if (err) {
                console.log(err);
                return;
              }

              if (rows.length === 0) {
                console.log(
                  `Tidak ada kontrak untuk mahasiswa dengan NIM ${nim}`
                );
              } else {
                console.log("======================================");
                console.log(
                  `Daftar Kontrak mahasiswa dengan NIM ${nim} adalah:`
                );

                const table = new Table({
                  head: ["ID", "NIM", "Kode MK", "NIP", "Nilai"],
                });

                rows.forEach((row) => {
                  table.push([
                    row.id,
                    row.nim,
                    row.id_mata_kuliah,
                    row.nip,
                    row.nilai || "Belum ada Nilai",
                  ]);
                });

                console.log(table.toString());
              }
              this.show();
            }
          );
        });
      }
    );
  }

  tambahKontrak() {
    console.log("Input Data Kontrak:");
    db.all(
      `select*from mahasiswa left join jurusan using(id_jurusan)`,

      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: [
            "NIM",
            "Nama",
            "Tanggal Lahir",
            "Alamat",
            "Kode Jurusan",
            "Nama Jurusan",
          ],
        });

        rows.forEach((row) => {
          table.push([
            row.nim,
            row.name_mahasiswa,
            row.tanggal_lahir,
            row.alamat,
            row.id_jurusan,
            row.name_jurusan || "Belum ada jurusan",
          ]);
        });

        console.log(table.toString());

        rl.question("Masukkan NIM: ", (nim) => {
          db.get("SELECT * FROM mahasiswa WHERE nim = ?", [nim], (err, mahasiswa) => {
            if (err) {
              console.log(err);
              this.show();
              return;
            }

            if (!mahasiswa) {
              console.log("Mahasiswa tidak ditemukan");
              this.show();
              return;
            }

            console.log("\nDaftar Mata kuliah:");
            db.all("SELECT * FROM mata_kuliah", (err, rows) => {
              if (err) {
                console.log(err);
                this.show();
                return;
              }

              const tableMK = new Table({
                head: ["Kode MK", "Nama MK", "SKS"],
              });

              rows.forEach((row) => {
                tableMK.push([
                  row.id_mata_kuliah,
                  row.name_mata_kuliah,
                  row.sks]);
              });

              console.log(tableMK.toString());

              rl.question("\nMasukkan Kode Mata kuliah: ", (id_mata_kuliah) => {
                db.get(
                  "SELECT * FROM mata_kuliah WHERE id_mata_kuliah = ?",
                  [id_mata_kuliah],
                  (err, row) => {
                    if (err || !row) {
                      console.log("Matakuliah tidak ditemukan");
                      this.show();
                      return;
                    }

                    console.log("\nDaftar Dosen:");
                    db.all("SELECT * FROM dosen", (err, dosen) => {
                      if (err) {
                        console.log(err);
                        this.show();
                        return;
                      }

                      const tableDosen = new Table({
                        head: ["NIP", "Nama Dosen"],
                      });

                      dosen.forEach((d) => {
                        tableDosen.push([d.nip, d.name_dosen]);
                      });

                      console.log(tableDosen.toString());

                      rl.question("\nMasukkan NIP Dosen: ", (nip) => {
                        db.get(
                          "SELECT * FROM dosen WHERE nip = ?",
                          [nip],
                          (err, dsn) => {
                            if (err || !dsn) {
                              console.log("Dosen tidak ditemukan!");
                              this.show();
                              return;
                            }

                            db.run(
                              `INSERT INTO kontrak (nim, id_mata_kuliah, nip)
                              VALUES (?, ?, ?)`,
                              [nim, id_mata_kuliah, nip],
                              (err) => {
                                if (err) {
                                  console.log(
                                    err
                                  );
                                  this.show();
                                  return;
                                }
                                console.log("Kontrak berhasil ditambahkan");
                                this.listKontrak();
                              }
                            );
                          }
                        );
                      });
                    });
                  }
                );
              });
            });
          });
        });
      }
    );
  }

  hapusKontrak() {
    rl.question("Masukkan ID Kontrak: ", (id) => {

      db.get("SELECT * FROM kontrak WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

      
        if (!row) {
          console.log(`ID ${id} tidak ditemukan dalam database`);
          return this.listKontrak();
        }




      db.run("DELETE FROM kontrak WHERE id = ?", [id], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Kontrak dengan ID ${id} berhasil dihapus`);
        this.listKontrak();
      });
    });
  });
  }

  updateNilai() {
    db.all(
      `SELECT id, nim, name_mahasiswa, name_mata_kuliah, name_dosen, nilai
      FROM kontrak 
      JOIN mahasiswa  using(nim)
      JOIN mata_kuliah using(id_mata_kuliah)
      JOIN dosen using(nip)`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.name_mahasiswa,
            row.name_mata_kuliah,
            row.name_dosen,
            row.nilai || "",
          ]);
        });

        console.log(table.toString());

        rl.question("Masukkan ID Mata Kuliah: ", (id) => {
          db.get(
            `SELECT id, nim, name_mahasiswa, name_mata_kuliah, name_dosen, nilai
            FROM kontrak 
            JOIN mahasiswa  using(nim)
            JOIN mata_kuliah using(id_mata_kuliah)
            JOIN dosen using(nip) where id=?`,
            [id],
            (err, kontrak) => {
              if (err) {
                console.log(err);
                this.show();
                return;
              }

              if (!kontrak) {
                console.log("NIM tidak ditemukan");
                this.show();
                return;
              }

              console.log("======================================");
              console.log("Detail Kontrak:");
              console.log(`ID: ${kontrak.id}`);
              console.log(`NIM: ${kontrak.nim}`);
              console.log(`Nama: ${kontrak.name_mahasiswa}`);
              console.log(`Mata Kuliah: ${kontrak.name_mata_kuliah}`);
              console.log(`Dosen: ${kontrak.name_dosen}`);
              console.log(
                `Nilai Saat ini: ${kontrak.nilai || ""}`
              );
              console.log("======================================");

              rl.question(
                "Masukkan Nilai Baru (A/A+/A++/B/B+/B+/C/C+/D/D+/E): ",
                (nilai) => {
                  // Validasi Nilai
                  const validNilai = [
                    "A",
                    "A+",
                    "A++",
                    "B",
                    "B+",
                    "C",
                    "C+",
                    "D",
                    "D+",
                    "E",
                  ];
                  if (!validNilai.includes(nilai.toUpperCase())) {
                    console.log(
                      "Nilai tidak valid! Gunakan (A/A+/A++/B/B+/B+/C/C+/D/D+/E)"
                    );
                    this.show();
                    return;
                  }

                  db.run(
                    "UPDATE kontrak SET nilai = ? WHERE id = ?",
                    [nilai.toUpperCase(), id],
                    (err) => {
                      if (err) {
                        console.log(err);
                        this.show();
                        return;
                      }
                      console.log("Nilai berhasil di update");
                      this.listKontrak();
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  }
}

// Mulai Program
const university = new UniversityApp();
university.start();