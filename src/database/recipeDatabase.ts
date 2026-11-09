import { getDatabase } from './database'

export interface RecipeData {
  id: number
  name: string
  image: string
  category: string
  description: string
}

// Menyimpan resep dari Public Recipe API ke SQLite
export const saveRecipeToDatabase = async (recipe: RecipeData) => {
  try {
    const db = getDatabase()

    if (!db) {
      console.log('❌ Database belum tersedia')
      return
    }

    await db.run(
      `
      INSERT OR REPLACE INTO recipes
      (id, name, image, category, description)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        recipe.id,
        recipe.name,
        recipe.image,
        recipe.category,
        recipe.description
      ]
    )

    console.log(`✅ Resep "${recipe.name}" disimpan ke SQLite`)
  } catch (error) {
    console.error('❌ Gagal menyimpan resep:', error)
  }
}

// Mengambil semua resep dari SQLite
export const getRecipesFromDatabase = async () => {
  try {
    const db = getDatabase()

    if (!db) {
      console.log('❌ Database belum tersedia')
      return []
    }

    const result = await db.query(`
      SELECT *
      FROM recipes
      ORDER BY id DESC
    `)

    return result.values || []
  } catch (error) {
    console.error('❌ Gagal mengambil resep:', error)
    return []
  }
}