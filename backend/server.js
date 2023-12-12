const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());  // Enable JSON request parsing

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "recommandation"
});

// GET endpoint to retrieve users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM utilisateur";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json(data);
  });
});

// GET endpoint to retrieve groupement
app.get("/groupement", (req, res) => {
  const sql = "SELECT * FROM groupement";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json(data);
  });
});
app.get("/utilisateur", (rea, res) => {
  const usersql = "SELECT * FROM utilisateur"
  db.query(usersql,(err, data) => {
    if (err) return res.status(500).json({error : "oay lelena"});
    return res.json(data)
  })
})
app.get("/admin", (req,res) => {
  const adminsql = "SELECT * FROM adinistrator"
  db.query(adminsql,(err, data) => {
    if(err) return res.status(500).json({error:"internal Server Error"});
    return res.json(data)
  })
})

// POST endpoint to add a new group

app.post("/groupement", (req, res) => {
    const { Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type } = req.body;
  
    // Validation
    if (!Grp_nom || !Grp_code || !Grp_adresse || !Grp_responsable || !Grp_contact || !Grp_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const sql = "INSERT INTO groupement (Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type], (err, result) => {
      if (err) {
        console.error("Error adding group:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(201).json({ message: "Group added successfully", groupId: result.insertId });
    });
  });
  app.delete("/groupement/:id", (req, res) => {
    const groupId = req.params.id;
  
    // Add logic to delete the group with the specified ID from the database
    const sql = "DELETE FROM groupement WHERE Grp_id = ?";
    
    db.query(sql, [groupId], (err, result) => {
      if (err) {
        console.error("Error deleting group:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the group with the specified ID was not found
        return res.status(404).json({ error: "Group not found" });
      }
  
      res.json({ message: "Group deleted successfully" });
    });
  });
  app.post("/utilisateur", (req, res) => {
    const { Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id } = req.body;
  
    // Validation
    if (!Us_nom || !Us_matricule || !Us_login || !Us_mail || !Us_pwd || !Fo_id || !Grp_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const userSql = "INSERT INTO utilisateur (Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(userSql, [Us_nom, Us_matricule, Us_login, Us_mail, Us_pwd, Fo_id, Grp_id], (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      const userId = result.insertId;
  
      // Fetch the added user based on the userId
      const fetchUserSql = "SELECT * FROM utilisateur WHERE Us_id = ?";
      db.query(fetchUserSql, [userId], (fetchErr, userData) => {
        if (fetchErr) {
          console.error("Error fetching added user:", fetchErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        // Return the added user data
        return res.status(201).json({ message: "User added successfully", user: userData[0] });
      });
    });
  });
  
  
  // Delete a user
  app.delete("/utilisateur/:id", (req, res) => {
    const userId = req.params.id;
  
    const deleteSql = "DELETE FROM utilisateur WHERE Us_id = ?";
    db.query(deleteSql, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.json({ message: "User deleted successfully" });
    });
  });

app.listen(8081, () => {
  console.log("listening");
});
