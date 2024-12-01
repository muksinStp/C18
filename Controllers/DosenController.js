import { DosenModel } from "../Models/DosenModel.js";
import { DosenView } from "../Views/DosenView.js";
import { MainMenuController } from "./MainMenuController.js";

export const DosenController = {
  menuDosen: (rl) => {
    DosenView.optMenuDosen();
    rl.question(DosenView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          DosenController.getAllDosen(rl);
          break;
        case "2":
          DosenController.cariDosen(rl);
          break;
        case "3":
          DosenController.tambahDosen(rl);
          break;
        case "4":
          DosenController.hapusDosen(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          DosenView.printInvalidInput();
          DosenController.menuDosen(rl);
      }
    });
  },
  getAllDosen: (rl) => {
    DosenModel.getAll((rows) => {
      DosenView.printDosen(rows);
      return DosenController.menuDosen(rl);
    });
  },
  cariDosen: (rl) => {
    rl.question("Masukan ID Dosen: ", (nip) => {
      DosenModel.getById(nip, (row) => {
        if (row) {
          console.log(`\nDetail Dosen dengan ID '${nip}':`);
          DosenView.printDosenDetail(row);
        } else {
          DosenView.printDosenNotFound(nip);
        }
        return DosenController.menuDosen(rl);
      });
    });
  },
  tambahDosen: (rl) => {
    DosenModel.getAll((rows) => {
      DosenView.printDosen(rows);
      console.log(`Lengkapi data Dosen di bawah ini:`);
      const askID = () => {
        rl.question("Masukan ID Dosen: ", (nip) => {
          const validID = /^[A-Z0-9]+$/;
          if (!validID.test(nip)) {
            DosenView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.nip === nip)) {
            DosenView.printDosenExist(nip);
            return askID();
          }
          askNama(nip);
        });
      };
      const askNama = (nip) => {
        rl.question("Masukan Nama Dosen: ", (name_dosen) => {
          const validNama = /^[A-Za-z\s'.-]+$/;
          if (!validNama.test(name_dosen)) {
            DosenView.printInvalidInput();
            return askNama(nip);
          }
          DosenModel.add(nip, name_dosen, () => {
            DosenView.printDosenAdded(nip);
            return DosenController.menuDosen(rl);
          });
        });
      };
      askID();
    });
  },
  hapusDosen: (rl) => {
    rl.question("Masukan ID Dosen: ", (nip) => {
      DosenModel.delete(nip, (changes) => {
        if (changes > 0) {
          DosenView.printDosenDeleted(nip);
        } else {
          DosenView.printDosenNotFound(nip);
        }
        return DosenController.menuDosen(rl);
      });
    });
  },
};
