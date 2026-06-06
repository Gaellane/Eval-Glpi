# Exemples Pratiques - SQLite3

Collection d'exemples pratiques pour différents scénarios d'utilisation.

## Table des matières

- [Exemple 1: Base de données de boutique](#exemple-1--base-de-données-de-boutique)
- [Exemple 2: Gestion de blog](#exemple-2--gestion-de-blog)
- [Exemple 3: Gestion des stocks](#exemple-3--gestion-des-stocks)
- [Exemple 4: Utilisation en Python](#exemple-4--utilisation-en-python)

## Exemple 1: Base de données de boutique

### Schéma

```sql
-- Créer la table des clients
CREATE TABLE IF NOT EXISTS clients (
  client_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des produits
CREATE TABLE IF NOT EXISTS produits (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price > 0),
  stock INTEGER DEFAULT 0 CHECK(stock >= 0),
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des commandes
CREATE TABLE IF NOT EXISTS commandes (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Créer la table des détails de commande
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES commandes(order_id),
  FOREIGN KEY (product_id) REFERENCES produits(product_id)
);

-- Créer les index
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_commandes_status ON commandes(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### Requêtes utiles

```sql
-- 1. Insérer un nouveau client
INSERT INTO clients (first_name, last_name, email, phone, city, country)
VALUES ('Jean', 'Dupont', 'jean.dupont@example.com', '0123456789', 'Paris', 'France');

-- 2. Ajouter des produits
INSERT INTO produits (name, description, price, stock, category)
VALUES 
  ('Laptop', 'High performance laptop', 999.99, 10, 'Electronics'),
  ('Mouse', 'Wireless mouse', 29.99, 50, 'Accessories'),
  ('Keyboard', 'Mechanical keyboard', 79.99, 30, 'Accessories');

-- 3. Créer une commande
INSERT INTO commandes (client_id, total_amount, status)
VALUES (1, 1509.97, 'pending');

-- 4. Ajouter des articles à la commande
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES 
  (1, 1, 1, 999.99),  -- 1 Laptop
  (1, 3, 1, 79.99),   -- 1 Keyboard
  (1, 2, 5, 29.99);   -- 5 Mouse

-- 5. Récupérer toutes les commandes d'un client
SELECT 
  c.first_name,
  c.last_name,
  o.order_id,
  o.order_date,
  o.total_amount,
  o.status
FROM commandes o
JOIN clients c ON o.client_id = c.client_id
WHERE c.client_id = 1
ORDER BY o.order_date DESC;

-- 6. Détail d'une commande
SELECT 
  o.order_id,
  p.name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) as line_total
FROM order_items oi
JOIN commandes o ON oi.order_id = o.order_id
JOIN produits p ON oi.product_id = p.product_id
WHERE o.order_id = 1;

-- 7. Produits les plus vendus
SELECT 
  p.product_id,
  p.name,
  SUM(oi.quantity) as total_sold,
  SUM(oi.quantity * oi.unit_price) as revenue
FROM order_items oi
JOIN produits p ON oi.product_id = p.product_id
GROUP BY p.product_id
ORDER BY total_sold DESC
LIMIT 5;

-- 8. Clients principaux (par montant total)
SELECT 
  c.client_id,
  c.first_name,
  c.last_name,
  COUNT(o.order_id) as number_of_orders,
  SUM(o.total_amount) as total_spent
FROM clients c
LEFT JOIN commandes o ON c.client_id = o.client_id
GROUP BY c.client_id
ORDER BY total_spent DESC;

-- 9. Mises à jour de stock après une vente
UPDATE produits 
SET stock = stock - 1 
WHERE product_id = 1;

-- 10. Marquer une commande comme complétée
UPDATE commandes 
SET status = 'completed' 
WHERE order_id = 1;
```

## Exemple 2: Gestion de blog

### Schéma

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);

-- Index
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
```

### Requêtes utiles

```sql
-- 1. Articles les plus commentés
SELECT 
  p.post_id,
  p.title,
  u.username,
  COUNT(c.comment_id) as comment_count
FROM posts p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN comments c ON p.post_id = c.post_id
WHERE p.published = 1
GROUP BY p.post_id
ORDER BY comment_count DESC
LIMIT 10;

-- 2. Articles d'un auteur avec nombre de commentaires
SELECT 
  p.post_id,
  p.title,
  p.created_at,
  COUNT(c.comment_id) as comments
FROM posts p
LEFT JOIN comments c ON p.post_id = c.post_id
WHERE p.user_id = 1 AND p.published = 1
GROUP BY p.post_id
ORDER BY p.created_at DESC;

-- 3. Articles avec leurs tags
SELECT 
  p.post_id,
  p.title,
  GROUP_CONCAT(t.name, ', ') as tags
FROM posts p
LEFT JOIN post_tags pt ON p.post_id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.tag_id
WHERE p.published = 1
GROUP BY p.post_id;

-- 4. Derniers commentaires avec auteur et article
SELECT 
  c.comment_id,
  u.username as commenter,
  p.title,
  c.content,
  c.created_at
FROM comments c
JOIN users u ON c.user_id = u.user_id
JOIN posts p ON c.post_id = p.post_id
ORDER BY c.created_at DESC
LIMIT 20;
```

## Exemple 3: Gestion des stocks

### Schéma

```sql
CREATE TABLE IF NOT EXISTS warehouses (
  warehouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
  inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  last_restocked DATETIME,
  UNIQUE(warehouse_id, product_id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
  FOREIGN KEY (product_id) REFERENCES produits(product_id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL,
  movement_type TEXT CHECK(movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
);
```

### Requêtes utiles

```sql
-- 1. Articles avec stock faible
SELECT 
  p.name,
  i.quantity,
  i.reorder_level,
  w.name as warehouse
FROM inventory i
JOIN produits p ON i.product_id = p.product_id
JOIN warehouses w ON i.warehouse_id = w.warehouse_id
WHERE i.quantity <= i.reorder_level
ORDER BY i.quantity ASC;

-- 2. Stock total par produit
SELECT 
  p.name,
  SUM(i.quantity) as total_stock,
  COUNT(DISTINCT i.warehouse_id) as warehouses
FROM inventory i
JOIN produits p ON i.product_id = p.product_id
GROUP BY p.product_id
ORDER BY total_stock DESC;

-- 3. Historique des mouvements de stock
SELECT 
  p.name,
  w.name,
  sm.movement_type,
  sm.quantity,
  sm.reason,
  sm.created_at
FROM stock_movements sm
JOIN inventory i ON sm.inventory_id = i.inventory_id
JOIN produits p ON i.product_id = p.product_id
JOIN warehouses w ON i.warehouse_id = w.warehouse_id
ORDER BY sm.created_at DESC
LIMIT 50;

-- 4. Stocks par entrepôt
SELECT 
  w.name,
  COUNT(DISTINCT i.product_id) as product_count,
  SUM(i.quantity) as total_quantity,
  ROUND(100.0 * SUM(i.quantity) / w.capacity, 2) as usage_percentage
FROM warehouses w
LEFT JOIN inventory i ON w.warehouse_id = i.warehouse_id
GROUP BY w.warehouse_id;
```

## Exemple 4: Utilisation en Python

### Connecter et créer une table

```python
import sqlite3
from datetime import datetime

# Connexion
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Créer une table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

conn.commit()
```

### Insérer des données

```python
# Insérer un utilisateur
cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)',
               ('Alice Bernard', 'alice@example.com'))

# Insérer plusieurs utilisateurs
users = [
  ('Bob Chardin', 'bob@example.com'),
  ('Charlie Denis', 'charlie@example.com'),
  ('Diana Ebert', 'diana@example.com')
]

cursor.executemany('INSERT INTO users (name, email) VALUES (?, ?)', users)

conn.commit()
```

### Récupérer des données

```python
# Récupérer tous les utilisateurs
cursor.execute('SELECT * FROM users')
all_users = cursor.fetchall()
for user in all_users:
  print(user)

# Récupérer un utilisateur
cursor.execute('SELECT * FROM users WHERE email = ?', ('alice@example.com',))
user = cursor.fetchone()
print(user)

# Récupérer avec des colonnes nommées
conn.row_factory = sqlite3.Row
cursor.execute('SELECT * FROM users')
for row in cursor:
  print(f"{row['name']} - {row['email']}")
```

### Mettre à jour et supprimer

```python
# Mise à jour
cursor.execute('UPDATE users SET name = ? WHERE email = ?',
               ('Alice Bernard-Smith', 'alice@example.com'))

# Suppression
cursor.execute('DELETE FROM users WHERE id = ?', (1,))

conn.commit()
```

### Transactions

```python
try:
  cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)',
                 ('Eve Francois', 'eve@example.com'))
  
  cursor.execute('UPDATE users SET name = ? WHERE email = ?',
                 ('Eve Francoise', 'eve@example.com'))
  
  conn.commit()
  print("Transaction completed successfully")
except sqlite3.Error as e:
  conn.rollback()
  print(f"Error: {e}")
finally:
  conn.close()
```

### Agrégations et groupements

```python
# Compter les utilisateurs
cursor.execute('SELECT COUNT(*) FROM users')
count = cursor.fetchone()[0]
print(f"Total users: {count}")

# Grouper par domaine email
cursor.execute('''
SELECT SUBSTR(email, INSTR(email, '@') + 1) as domain, COUNT(*) as count
FROM users
GROUP BY domain
''')
for domain, count in cursor:
  print(f"{domain}: {count}")
```

---

*Pour plus d'exemples, consultez les autres fichiers de documentation.*
