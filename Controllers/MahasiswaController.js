import { JurusanModel } from "../Models/JurusanModel.js";
import { MahasiswaModel } from "../Models/MahasiswaModel.js";
import { JurusanView } from "../views/JurusanView.js";
import { MahasiswaView } from "../Views/MahasiswaView.js";
import { MainMenuController } from "./MainMenuController.js";

export const MahasiswaController = {
  menuMahasiswa: (rl) => {
    MahasiswaView.optMenuMahasiswa();
    rl.question(MahasiswaView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          MahasiswaController.getAllMahasiswa(rl);
          break;
        case "2":
          MahasiswaController.cariMahasiswa(rl);
          break;
        case "3":
          MahasiswaController.tambahMahasiswa(rl);
          break;
        case "4":
          MahasiswaController.hapusMahasiswa(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          MahasiswaView.printInvalidInput();
          MahasiswaController.menuMahasiswa(rl);
      }
    });
  },
  getAllMahasiswa: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      return MahasiswaController.menuMahasiswa(rl);
    });
  },
  cariMahasiswa: (rl) => {
    rl.question("Masukan NIM: ", (nim) => {
      MahasiswaModel.getByNim(nim, (row) => {
        if (row) {
          console.log(`\nDetail Mahasiswa dengan NIM '${nim}':`);
          MahasiswaView.printMahasiswaDetail(row);
        } else {
          MahasiswaView.printMahasiswaNotFound(nim);
        }
        return MahasiswaController.menuMahasiswa(rl);
      });
    });
  },
  tambahMahasiswa: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      console.log(`Lengkapi data Mahasiswa di bawah ini:`);
      const askNIM = () => {
        rl.question("NIM: ", (nim) => {
          const validNIM = /^\d+$/;
          if (!validNIM.test(nim)) {
            MahasiswaView.printInvalidInput();
            return askNIM();
          }
          if (rows.find((row) => row.nim === nim)) {
            MahasiswaView.printMahasiswaExist(nim);
            return askNIM();
          }
          askNama(nim);
        });
      };
      const askNama = (nim) => {
        rl.question("Nama: ", (name_mahasiswa) => {
          const validNama = /^[A-Za-z\s'.-]+$/;
          if (!validNama.test(name_mahasiswa)) {
            MahasiswaView.printInvalidInput();
            return askNama(nim);
          }
          askTglLahir(nim, name_mahasiswa);
        });
      };
      const askTglLahir = (nim, name_mahasiswa) => {
        rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tanggal_lahir) => {
          const validTgl = /^\d{4}-\d{2}-\d{2}$/;
          if (!validTgl.test(tanggal_lahir)) {
            MahasiswaView.printInvalidInput();
            return askTglLahir(nim, name_mahasiswa);
          }
          askAlamat(nim, name_mahasiswa, tanggal_lahir);
        });
      };
      const askAlamat = (nim, name_mahasiswa, tanggal_lahir) => {
        rl.question("Alamat: ", (alamat) => {
          const validAlamat = /.+/;
          if (!validAlamat.test(alamat)) {
            MahasiswaView.printInvalidInput();
            return askAlamat(nim, name_mahasiswa, tanggal_lahir);
          }
          askJurusan(nim, name_mahasiswa, tanggal_lahir, alamat);
        });
      };
      const askJurusan = (nim, name_mahasiswa, tanggal_lahir, alamat) => {
        JurusanModel.getAll((rows) => {
          JurusanView.printJurusan(rows);
          rl.question("ID Jurusan: ", (id_jurusan) => {
            MahasiswaModel.add(nim, name_mahasiswa, tanggal_lahir, alamat, id_jurusan, () => {
              MahasiswaView.printMahasiswaAdded(nim);
              return MahasiswaController.menuMahasiswa(rl);
            });
          });
        });
      };
      askNIM();
    });
  },
  hapusMahasiswa: (rl) => {
    rl.question("Masukan NIM: ", (nim) => {
      MahasiswaModel.delete(nim, (changes) => {
        if (changes > 0) {
          MahasiswaView.printMahasiswaDeleted(nim);
        } else {
          MahasiswaView.printMahasiswaNotFound(nim);
        }
        return MahasiswaController.menuMahasiswa(rl);
      });
    });
  },
};
