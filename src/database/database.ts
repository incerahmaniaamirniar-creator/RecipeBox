import { Capacitor } from '@capacitor/core'
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite'

const sqlite = new SQLiteConnection(CapacitorSQLite)

let db: SQLiteDBConnection | null = null

// Membuka / membuat database RecipeBox
export const initDatabase = async () => {
  try {
    // SQLite tidak dijalankan ketika masih di browser
    if (Capacitor.getPlatform() === 'web') {
      console.log('SQLite: mode browser')
      return
    }

    // Membuat koneksi database
    db = await sqlite.createConnection(
      'recipebox',
      false,
      'no-encryption',
      1,
      false
    )

    // Membuka database
    await db.open()

    // Membuat tabel-tabel RecipeBox
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        category TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS shopping_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient TEXT NOT NULL,
        checked INTEGER DEFAULT 0
      );
    `)

    console.log('✅ SQLite RecipeBox berhasil dibuat')
    console.log('✅ Tabel users berhasil dibuat')
    console.log('✅ Tabel categories berhasil dibuat')
    console.log('✅ Tabel recipes berhasil dibuat')
    console.log('✅ Tabel favorites berhasil dibuat')
    console.log('✅ Tabel shopping_lists berhasil dibuat')

  } catch (error) {
    console.error('❌ Gagal membuat database SQLite:', error)
  }
}

// Mengambil koneksi database
export const getDatabase = () => {
  return db
}