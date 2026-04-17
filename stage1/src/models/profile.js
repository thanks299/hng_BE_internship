import { getDb } from '../db/database.js';

class Profile {
  static async create(profileData) {
    const db = getDb();
    const { id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at } = profileData;
    
    await db.run(
      `INSERT INTO profiles (id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name.toLowerCase(), gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at]
    );
    
    return this.findById(id);
  }

  static async findByName(name) {
    const db = getDb();
    return await db.get(
      'SELECT * FROM profiles WHERE name = ?',
      [name.toLowerCase()]
    );
  }

  static async findById(id) {
    const db = getDb();
    return await db.get('SELECT * FROM profiles WHERE id = ?', [id]);
  }

  static async findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT id, name, gender, age, age_group, country_id FROM profiles WHERE 1=1';
    const params = [];

    if (filters.gender) {
      query += ' AND LOWER(gender) = LOWER(?)';
      params.push(filters.gender);
    }
    if (filters.country_id) {
      query += ' AND LOWER(country_id) = LOWER(?)';
      params.push(filters.country_id);
    }
    if (filters.age_group) {
      query += ' AND LOWER(age_group) = LOWER(?)';
      params.push(filters.age_group);
    }

    return await db.all(query, params);
  }

  static async delete(id) {
    const db = getDb();
    const result = await db.run('DELETE FROM profiles WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

export default Profile;