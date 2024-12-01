const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const Table = require("cli-table3");

// Buat Koneksi Database
const db = new sqlite3.Database("university.db");
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
                // this.showMainMenu();
              } else {
                console.log("Password Salah");
                this.login();
              }
            });
          }
        );
      });
    }
}
 // Mulai Program
const university = new UniversityApp();
university.start(); 