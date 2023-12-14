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
  database: "recommandation",
  timezone : "utc"
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

app.get("/utilisateur", (req, res) => {
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

app.get("/benefs", (req, res) => {
  const benefsql = "SELECT * FROM béneficiaire"
  db.query(benefsql,(err, data) => {
    if(err) return res.status(500).json({error:"internal Server Error"});
    return res.json(data)
  })
})

app.get("/envoi", (req, res) => {
  const envoisql = "SELECT *FROM envoi"
  db.query(envoisql,(err, data) => {
    if (err) return res.status(500).json({error : "internal Server Error"});
    return res.json(data)
  })
})


app.get("/fonctions", (req, res) => {
  const functionsql = "SELECT * FROM fonction"
  db.query(functionsql,(err, data) => {
    if (err) return res.status(500).json({error :"internal Server Error"});
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

  // Update a group
app.put("/groupement/:id", (req, res) => {
  const groupId = req.params.id;
  const { Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type } = req.body;

  // Validation
  if (!Grp_nom || !Grp_code || !Grp_adresse || !Grp_responsable || !Grp_contact || !Grp_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Update SQL query
  const sql = `
    UPDATE groupement
    SET Grp_nom = ?, Grp_code = ?, Grp_adresse = ?, Grp_responsable = ?, Grp_contact = ?, Grp_type = ?
    WHERE Grp_id = ?`;

  db.query(sql, [Grp_nom, Grp_code, Grp_adresse, Grp_responsable, Grp_contact, Grp_type, groupId], (err, result) => {
    if (err) {
      console.error("Error updating group:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      // If no rows were affected, the group with the specified ID was not found
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: "Group updated successfully" });
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
  
      // Fetch the added user based on the userId
      const fetchUserSql = "SELECT * FROM utilisateur WHERE Us_id = ?";
      db.query(fetchUserSql, [result.insertId], (fetchErr, userData) => {
        if (fetchErr) {
          console.error("Error fetching added user:", fetchErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        // Return the added user data
        return res.status(201).json({ message: "User added successfully", user: userData[0] });
      });
    });
  });
  // POST endpoint to add a new envoi
  app.post("/envoi", (req, res) => {
    const { Env_num, Env_poids, Env_exp, Env_dest, Env_date_depot } = req.body;
  
    // Log the received Env_date_depot
    console.log('Received Env_date_depot:', Env_date_depot);
  
    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
  
    const sql = "INSERT INTO envoi (Env_num, Env_poids, Env_exp, Env_dest, Env_date_depot) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [Env_num, Env_poids, Env_exp, Env_dest, Env_date_depot], (err, result) => {
      if (err) {
        console.error("Error adding envoi:", err);
  
        // Send the error details in the response for debugging purposes
        return res.status(500).json({ error: "Internal Server Error", details: err });
      }
  
      return res.status(201).json({ message: "Envoi added successfully", envoiId: result.insertId });
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
