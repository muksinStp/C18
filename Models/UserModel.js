import { db } from "./Config/db.js";

export class UserModel {
  static login(username, callback) {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err) throw err;
      callback(user);
    });
  }
}
