# Connexion aux Bases de Données en Java (JDBC)

Avant d'utiliser Spring Boot, il est bon de comprendre comment Java se connecte nativement à une base de données avec **JDBC** (Java Database Connectivity).

## 1. Prérequis
Vous devez ajouter le driver (pilote) correspondant à votre base de données dans vos dépendances (ex: MySQL, PostgreSQL).
*(En Maven, cela se trouve dans le `pom.xml`)*

## 2. Connexion basique

### Etape 1 : Les informations de connexion
```java
String url = "jdbc:mysql://localhost:3306/ma_base";
String utilisateur = "root";
String motDePasse = "password";
```

### Etape 2 : Établir la connexion et exécuter une requête
Le bon usage nécessite l'utilisation du bloc `try-with-resources` pour s'assurer que les connexions sont bien fermées, même en cas d'erreur.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BddExemple {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/mabase";
        String user = "postgres";
        String password = "pwd";

        // Requête SQL paramétrée (très important pour éviter l'injection SQL)
        String sql = "SELECT id, nom FROM utilisateurs WHERE age > ?";

        try (
            Connection conn = DriverManager.getConnection(url, user, password);
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            // Remplacer le '?' de la requête par la valeur 18
            pstmt.setInt(1, 18);

            // Exécution de la requête
            try (ResultSet rs = pstmt.executeQuery()) {
                // Parcours des résultats
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nom = rs.getString("nom");
                    System.out.println("ID: " + id + ", Nom: " + nom);
                }
            }

        } catch (SQLException e) {
            System.err.println("Erreur de connexion ou de requête : " + e.getMessage());
        }
    }
}
```

## 3. Insérer des données (Update)
Pour les opérations `INSERT`, `UPDATE` ou `DELETE`, on utilise `executeUpdate()`.

```java
String sqlInsert = "INSERT INTO utilisateurs (nom, age) VALUES (?, ?)";

try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {
    
    pstmt.setString(1, "Alice");
    pstmt.setInt(2, 25);
    
    int lignesModifiees = pstmt.executeUpdate();
    System.out.println(lignesModifiees + " ligne(s) ajoutée(s).");
    
} catch (SQLException e) {
    e.printStackTrace();
}
```
