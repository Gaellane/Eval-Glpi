# Lecture et Écriture de Fichiers (I/O)

L'API `java.nio.file` (NIO.2) introduite dans Java 7 est la méthode recommandée pour manipuler les fichiers.

## 1. Les concepts fondamentaux : Path et Paths

Un objet `Path` représente le chemin vers un fichier ou un dossier.
```java
import java.nio.file.Path;
import java.nio.file.Paths;

// Chemin relatif (au dossier d'exécution)
Path cheminRelatif = Paths.get("dossier", "monFichier.txt");

// Chemin absolu
Path cheminAbsolu = Paths.get("/home/user/documents/test.txt");
```

## 2. Écrire dans un fichier

La classe `Files` propose des méthodes statiques utilitaires pour lire, écrire, créer et supprimer.

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.io.IOException;
import java.util.List;

public class FichierEcriture {
    public static void main(String[] args) {
        Path chemin = Paths.get("data.txt");
        
        try {
            // 1. Écrire une simple chaîne de caractères (Java 11+)
            Files.writeString(chemin, "Bonjour le monde !\n");
            
            // 2. Ajouter du texte à un fichier existant (Append)
            Files.writeString(chemin, "Ligne suivante.\n", StandardOpenOption.APPEND);
            
            // 3. Écrire une liste de lignes
            List<String> lignes = List.of("Ligne 1", "Ligne 2");
            Files.write(chemin, lignes, StandardOpenOption.APPEND);
            
            System.out.println("Écriture terminée avec succès !");
            
        } catch (IOException e) {
            System.err.println("Erreur d'écriture : " + e.getMessage());
        }
    }
}
```

## 3. Lire un fichier

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;

public class FichierLecture {
    public static void main(String[] args) {
        Path chemin = Paths.get("data.txt");
        
        try {
            // S'assurer que le fichier existe avant de lire
            if (Files.exists(chemin)) {
                
                // 1. Lire tout le contenu en une seule chaine (Java 11+)
                String contenu = Files.readString(chemin);
                System.out.println("Contenu Complet:\n" + contenu);
                
                // 2. Lire ligne par ligne dans une liste
                List<String> lignes = Files.readAllLines(chemin);
                System.out.println("Nombre de lignes : " + lignes.size());
                
            } else {
                System.out.println("Le fichier n'existe pas.");
            }
            
        } catch (IOException e) {
            System.err.println("Erreur de lecture : " + e.getMessage());
        }
    }
}
```

## 4. Manipulations de base (Créer dossier, Supprimer, Vérifier)

```java
try {
    // Créer un dossier (et ses parents si nécessaires)
    Path dossier = Paths.get("logs/archives");
    Files.createDirectories(dossier);
    
    // Supprimer un fichier (échoue s'il n'existe pas)
    Path aSupprimer = Paths.get("temp.txt");
    Files.deleteIfExists(aSupprimer);
    
    // Vérifier si c'est un dossier
    boolean estDossier = Files.isDirectory(dossier);
    
} catch (IOException e) {
    e.printStackTrace();
}
```

## 5. Importer des fichiers CSV et XLSX

Pour des données tabulaires, le CSV peut souvent être lu avec `Files`, tandis que le format XLSX nécessite en général une bibliothèque externe comme Apache POI.

### 5.1 Importer un fichier CSV

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class ImportCsv {
    public static void main(String[] args) {
        Path chemin = Paths.get("clients.csv");

        try {
            List<String> lignes = Files.readAllLines(chemin);

            for (String ligne : lignes) {
                // Exemple simple : séparation par virgule
                // Pour des CSV complexes (guillemets, virgules dans les valeurs), utiliser une librairie dédiée.
                String[] colonnes = ligne.split(",");
                System.out.println("Nom: " + colonnes[0] + ", Email: " + colonnes[1]);
            }
        } catch (IOException e) {
            System.err.println("Erreur lors de la lecture du CSV : " + e.getMessage());
        }
    }
}
```

### 5.2 Importer un fichier XLSX

Pour lire un fichier Excel `.xlsx`, ajoutez Apache POI à votre projet.

**Maven** :

```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>
```

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ImportXlsx {
    public static void main(String[] args) {
        Path chemin = Paths.get("clients.xlsx");

        try (FileInputStream fis = new FileInputStream(chemin.toFile());
             Workbook workbook = WorkbookFactory.create(fis)) {

            Sheet feuille = workbook.getSheetAt(0);

            for (Row row : feuille) {
                Cell nom = row.getCell(0);
                Cell email = row.getCell(1);

                System.out.println("Nom: " + nom + ", Email: " + email);
            }
        } catch (IOException e) {
            System.err.println("Erreur lors de la lecture du fichier XLSX : " + e.getMessage());
        }
    }
}
```

### 5.3 Bonnes pratiques

- Pour les CSV complexes, utilisez une bibliothèque comme OpenCSV plutôt que `split(",")`.
- Pour les gros fichiers, préférez une lecture en streaming afin d'éviter de charger tout le contenu en mémoire.
- Vérifiez toujours l'existence du fichier et gérez les exceptions d'entrée/sortie.
