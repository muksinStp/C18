import { DosenModel } from "../Models/DosenModel.js";
import { KontrakModel } from "../Models/KontrakModel.js";
import { MahasiswaModel } from "../Models/MahasiswaModel.js";
import { MatakuliahModel } from "../Models/MatakuliahModel.js";
import { DosenView } from "../Views/DosenView.js";
import { KontrakView } from "../Views/KontrakView.js";
import { MahasiswaView } from "../Views/MahasiswaView.js";
import { MatakuliahView } from "../Views/MatakuliahView.js";
import { MainMenuController } from "./MainMenuController.js";

export const KontrakController = {
  menuKontrak: (rl) => {
    KontrakView.optMenuKontrak();
    rl.question(KontrakView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          KontrakController.getAllKontrak(rl);
          break;
        case "2":
          KontrakController.cariKontrak(rl);
          break;
        case "3":
          KontrakController.tambahKontrak(rl);
          break;
        case "4":
          KontrakController.hapusKontrak(rl);
          break;
        case "5":
          KontrakController.updateNilai(rl);
          break;
        case "6":
          MainMenuController.mainMenu(rl);
          break;
        default:
          KontrakView.printInvalidInput();
          KontrakController.menuKontrak(rl);
      }
    });
  },
  getAllKontrak: (rl) => {
    KontrakModel.getAll((rows) => {
      KontrakView.printKontrak(rows);
      return KontrakController.menuKontrak(rl);
    });
  },
  cariKontrak: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      rl.question("Masukan NIM: ", (nim) => {
        KontrakModel.getByNim(nim, (rows) => {
            if(!rows.find((row) => row.nim == nim)){
                MahasiswaView.printMahasiswaNotFound(nim);
                // return askNIM();
                return KontrakController.menuKontrak(rl);
        //   KontrakView.printKontrakDetail(rows);
        //   return KontrakController.menuKontrak(rl);
            }
            if(rows.find((row) => row.nim == nim)){
                KontrakView.printKontrakDetail(rows);
                return KontrakController.menuKontrak(rl);
                  }
        });
      });
    });
  },
  tambahKontrak: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      console.log(`Lengkapi data di bawah ini:`);
      const askNIM = () => {
        rl.question("NIM: ", (nim) => {
          const validNIM = /^\d+$/;
          if (!validNIM.test(nim)) {
            KontrakView.printInvalidInput();
            return askNIM();
          }
          if (!rows.find((row) => row.nim === nim)) {
            MahasiswaView.printMahasiswaNotFound(nim);
            return askNIM();
          }
          askIDMatakuliah(nim);
        });
      };
      const askIDMatakuliah = (nim) => {
        MatakuliahModel.getAll((rows) => {
          MatakuliahView.printMatakuliah(rows);
          rl.question("ID Matakuliah: ", (id_mata_kuliah) => {
            const validIdMk = /^[A-Za-z0-9]+$/;
            if (!validIdMk.test(id_mata_kuliah)) {
              KontrakView.printInvalidInput();
              return askIDMatakuliah(nim);
            }
            if (!rows.find((row) => row.id_mata_kuliah === id_mata_kuliah)) {
              MatakuliahView.printMatakuliahNotFound(id_mata_kuliah);
              return askIDMatakuliah(nim);
            }
            askIDDosen(nim, id_mata_kuliah);
          });
        });
      };
      const askIDDosen = (nim, id_mata_kuliah) => {
        DosenModel.getAll((rows) => {
          DosenView.printDosen(rows);
          rl.question("ID Dosen: ", (nip) => {
            const validIdD = /^[A-Za-z0-9]+$/;
            if (!validIdD.test(nip)) {
              KontrakView.printInvalidInput();
              return askIDDosen(nim, id_mata_kuliah);
            }
            if (!rows.find((row) => row.nip === nip)) {
              DosenView.printDosenNotFound(nip);
              return askIDDosen(nim, id_mata_kuliah);
            }
            KontrakModel.add(nim, id_mata_kuliah, nip, () => {
              KontrakView.printKontrakAdded(id_mata_kuliah);
              return KontrakController.menuKontrak(rl);
            });
          });
        });
      };
      askNIM();
    });
  },
  hapusKontrak: (rl) => {
    rl.question("Masukan ID Kontrak: ", (id) => {
      KontrakModel.delete(id, (changes) => {
        if (changes > 0) {
          KontrakView.printKontrakDeleted(id);
        } else {
          KontrakView.printKontrakNotFound(id);
        }
        return KontrakController.menuKontrak(rl);
      });
    });
  },
  updateNilai: (rl) => {
    KontrakModel.getAll((rows) => {
      KontrakView.printKontrak(rows);
      rl.question("Masukan NIM Mahasiswa: ", (nim) => {
        if (!rows.find((row) => row.nim === nim)) {
          MahasiswaView.printMahasiswaNotFound(nim);
          return KontrakController.updateNilai(rl);
        }
        KontrakModel.getMatakuliahByNim(nim, (rows) => {
          console.log(`Detail mahasiswa dengan NIM '${nim}':`);
          KontrakView.printNilaiMahasiswa(rows);
          const askID = () => {
            rl.question("Masukan ID yang akan diubah nilainya: ", (id) => {
              const validID = /^\d+$/;
              if (!validID.test(id)) {
                KontrakView.printInvalidInput();
                return askID();
              }
              askNilai(id);
            });
          };
          const askNilai = (id) => {
            rl.question("Tulis nilai yang baru: ", (nilai) => {
              const validNilai = /^[A-Z+-]{1,2}$/;
              if (!validNilai.test(nilai)) {
                KontrakView.printInvalidInput();
                return askNilai(id);
              }
              KontrakModel.update(id, nilai, (changes) => {
                if (changes > 0) {
                  KontrakView.printKontrakUpdated(id);
                } else {
                  KontrakView.printKontrakNotFound(id);
                  KontrakModel.getAll((rows) => {
                    KontrakView.printKontrak(rows);
                  });
                }
                return KontrakController.menuKontrak(rl);
              });
            });
          };
          askID();
        });
      });
    });
  },
};
