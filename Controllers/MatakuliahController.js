import { MatakuliahModel } from "../Models/MatakuliahModel.js";
import { MatakuliahView } from "../Views/MatakuliahView.js";
import { MainMenuController } from "./MainMenuController.js";

export const MatakuliahController = {
  menuMatakuliah: (rl) => {
    MatakuliahView.optMenuMatakuliah();
    rl.question(MatakuliahView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          MatakuliahController.getAllMatakuliah(rl);
          break;
        case "2":
          MatakuliahController.cariMatakuliah(rl);
          break;
        case "3":
          MatakuliahController.tambahMatakuliah(rl);
          break;
        case "4":
          MatakuliahController.hapusMatakuliah(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          MatakuliahView.printInvalidInput();
          MatakuliahController.menuMatakuliah(rl);
      }
    });
  },
  getAllMatakuliah: (rl) => {
    MatakuliahModel.getAll((rows) => {
      MatakuliahView.printMatakuliah(rows);
      return MatakuliahController.menuMatakuliah(rl);
    });
  },
  cariMatakuliah: (rl) => {
    rl.question("Masukan ID Matakuliah: ", (id_mata_kuliah) => {
      MatakuliahModel.getById(id_mata_kuliah, (row) => {
        if (row) {
          console.log(`\nDetail Matakuliah dengan ID '${id_mata_kuliah}':`);
          MatakuliahView.printMatakuliahDetail(row);
        } else {
          MatakuliahView.printMatakuliahNotFound(id_mata_kuliah);
        }
        return MatakuliahController.menuMatakuliah(rl);
      });
    });
  },

  tambahMatakuliah: (rl) => {
    MatakuliahModel.getAll((rows) => {
      MatakuliahView.printMatakuliah(rows);
      console.log(`Lengkapi data Matakuliah di bawah ini:`);
      const askID = () => {
        rl.question("Masukan ID Matakuliah: ", (id_mata_kuliah) => {
          const validID = /^MK\d{2}$/;
          if (!validID.test(id_mata_kuliah)) {
            MatakuliahView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.id_mata_kuliah === id_mata_kuliah)) {
            MatakuliahView.printMatakuliahExist(id_mata_kuliah);
            return askID();
          }
          askNama(id_mata_kuliah);
        });
      };
      const askNama = (id_mata_kuliah) => {
        rl.question("Masukan Nama Matakuliah: ", (name_mata_kuliah) => {
          const validNama = /^[A-Za-z0-9\s'.-]+$/;
          if (!validNama.test(name_mata_kuliah)) {
            MatakuliahView.printInvalidInput();
            return askNama(id_mata_kuliah);
          }
          if (rows.find((row) => row.name_mata_kuliah === name_mata_kuliah)) {
            MatakuliahView.printMatakuliahExist(name_mata_kuliah);
            return askNama(name_mata_kuliah);
          }
          askSKS(id_mata_kuliah, name_mata_kuliah);
        });
      };
      const askSKS = (id_mata_kuliah, name_mata_kuliah) => {
        rl.question("SKS: ", (sks) => {
          const validSKS = /^\d{1,1}$/;
          if (!validSKS.test(sks)) {
            MatakuliahView.printInvalidInput();
            return askSKS(id_mata_kuliah, name_mata_kuliah);
          }
          MatakuliahModel.add(id_mata_kuliah, name_mata_kuliah, sks, () => {
            MatakuliahView.printMatakuliahAdded(id_mata_kuliah);
            return MatakuliahController.menuMatakuliah(rl);
          });
        });
      };
      askID();
    });
  },
  hapusMatakuliah: (rl) => {
    rl.question("Masukan ID Matakuliah: ", (id_mata_kuliah) => {
      MatakuliahModel.delete(id_mata_kuliah, (changes) => {
        if (changes > 0) {
          MatakuliahView.printMatakuliahDeleted(id_mata_kuliah);
        } else {
          MatakuliahView.printMatakuliahNotFound(id_mata_kuliah);
        }
        return MatakuliahController.menuMatakuliah(rl);
      });
    });
  },
};
