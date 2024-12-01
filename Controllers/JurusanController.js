import { JurusanModel } from "../Models/JurusanModel.js";
import { JurusanView } from "../views/JurusanView.js";
import { MainMenuController } from "./MainMenuController.js";

export const JurusanController = {
  menuJurusan: (rl) => {
    JurusanView.optMenuJurusan();
    rl.question(JurusanView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          JurusanController.getAllJurusan(rl);
          break;
        case "2":
          JurusanController.cariJurusan(rl);
          break;
        case "3":
          JurusanController.tambahJurusan(rl);
          break;
        case "4":
          JurusanController.hapusJurusan(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          JurusanView.printInvalidInput();
          JurusanController.menuJurusan(rl);
      }
    });
  },
  getAllJurusan: (rl) => {
    JurusanModel.getAll((rows) => {
      JurusanView.printJurusan(rows);
      return JurusanController.menuJurusan(rl);
    });
  },
  cariJurusan: (rl) => {
    rl.question("Masukan ID Jurusan: ", (id_jurusan) => {
      JurusanModel.getById(id_jurusan, (row) => {
        if (row) {
          console.log(`\nDetail Jurusan dengan ID '${id_jurusan}':`);
          JurusanView.printJurusanDetail(row);
        } else {
          JurusanView.printJurusanNotFound(id_jurusan);
        }
        return JurusanController.menuJurusan(rl);
      });
    });
  },
  tambahJurusan: (rl) => {
    JurusanModel.getAll((rows) => {
      JurusanView.printJurusan(rows);
      console.log(`Lengkapi data Jurusan di bawah ini:`);
      const askID = () => {
        rl.question("ID Jurusan: ", (id_jurusan) => {
          const validID = /^J\d{3}$/;
          if (!validID.test(id_jurusan)) {
            JurusanView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.id_jurusan === id_jurusan)) {
            JurusanView.printJurusanExist(id_jurusan);
            return askID();
          }
          askNama(id_jurusan);
        });
      };
      const askNama = (id_jurusan) => {
        rl.question("Nama Jurusan: ", (name_jurusan) => {
          const validNama = /^[A-Za-z0-9\s]+$/;
          if (!validNama.test(name_jurusan)) {
            JurusanView.printInvalidInput();
            return askNama(id_jurusan);
          }
          JurusanModel.add(id_jurusan, name_jurusan, () => {
            JurusanView.printJurusanAdded(id_jurusan);
            return JurusanController.menuJurusan(rl);
          });
        });
      };

      askID();
    });
  },
  hapusJurusan: (rl) => {
    rl.question("Masukan ID Jurusan: ", (id_jurusan) => {
      JurusanModel.delete(id_jurusan, (changes) => {
        if (changes > 0) {
          JurusanView.printJurusanDeleted(id_jurusan);
        } else {
          JurusanView.printJurusanNotFound(id_jurusan);
        }
        return JurusanController.menuJurusan(rl);
      });
    });
  },
};
