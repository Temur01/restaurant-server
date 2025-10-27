import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function seedUploads() {
  try {
    console.log('🌱 Seeding uploads table with fake data...');

    const fakeUploads = [
      {
        filename: 'file-1640000000000-123456789.jpg',
        original_name: 'osh.jpg',
        mimetype: 'image/jpeg',
        size: 245678,
        url: 'http://localhost:3001/uploads/file-1640000000000-123456789.jpg'
      },
      {
        filename: 'file-1640000100000-234567890.jpg',
        original_name: 'somsa.jpg',
        mimetype: 'image/jpeg',
        size: 189234,
        url: 'http://localhost:3001/uploads/file-1640000100000-234567890.jpg'
      },
      {
        filename: 'file-1640000200000-345678901.jpg',
        original_name: 'manti.jpg',
        mimetype: 'image/jpeg',
        size: 298765,
        url: 'http://localhost:3001/uploads/file-1640000200000-345678901.jpg'
      },
      {
        filename: 'file-1640000300000-456789012.jpg',
        original_name: 'lagman.jpg',
        mimetype: 'image/jpeg',
        size: 312456,
        url: 'http://localhost:3001/uploads/file-1640000300000-456789012.jpg'
      },
      {
        filename: 'file-1640000400000-567890123.jpg',
        original_name: 'shashlik.jpg',
        mimetype: 'image/jpeg',
        size: 278934,
        url: 'http://localhost:3001/uploads/file-1640000400000-567890123.jpg'
      },
      {
        filename: 'file-1640000500000-678901234.jpg',
        original_name: 'salat.jpg',
        mimetype: 'image/jpeg',
        size: 156789,
        url: 'http://localhost:3001/uploads/file-1640000500000-678901234.jpg'
      },
      {
        filename: 'file-1640000600000-789012345.jpg',
        original_name: 'non.jpg',
        mimetype: 'image/jpeg',
        size: 198765,
        url: 'http://localhost:3001/uploads/file-1640000600000-789012345.jpg'
      },
      {
        filename: 'file-1640000700000-890123456.jpg',
        original_name: 'shorva.jpg',
        mimetype: 'image/jpeg',
        size: 234567,
        url: 'http://localhost:3001/uploads/file-1640000700000-890123456.jpg'
      },
      {
        filename: 'file-1640000800000-901234567.jpg',
        original_name: 'kebab.jpg',
        mimetype: 'image/jpeg',
        size: 267890,
        url: 'http://localhost:3001/uploads/file-1640000800000-901234567.jpg'
      },
      {
        filename: 'file-1640000900000-012345678.jpg',
        original_name: 'chuchvara.jpg',
        mimetype: 'image/jpeg',
        size: 223456,
        url: 'http://localhost:3001/uploads/file-1640000900000-012345678.jpg'
      },
      {
        filename: 'file-1640001000000-112345679.png',
        original_name: 'tea.png',
        mimetype: 'image/png',
        size: 145678,
        url: 'http://localhost:3001/uploads/file-1640001000000-112345679.png'
      },
      {
        filename: 'file-1640001100000-212345680.jpg',
        original_name: 'compot.jpg',
        mimetype: 'image/jpeg',
        size: 178901,
        url: 'http://localhost:3001/uploads/file-1640001100000-212345680.jpg'
      }
    ];

    // Insert each fake upload
    for (const upload of fakeUploads) {
      await pool.query(
        `INSERT INTO uploads (filename, original_name, mimetype, size, url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [upload.filename, upload.original_name, upload.mimetype, upload.size, upload.url]
      );
    }

    console.log(`✅ Successfully seeded ${fakeUploads.length} fake upload records`);

    // Display the seeded data
    const result = await pool.query('SELECT * FROM uploads ORDER BY id');
    console.log('\n📋 Current uploads in database:');
    console.table(result.rows);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedUploads();

