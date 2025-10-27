-- Seed fake data for uploads table
-- This creates sample image records for testing

INSERT INTO uploads (filename, original_name, mimetype, size, url) VALUES
('file-1640000000000-123456789.jpg', 'osh.jpg', 'image/jpeg', 245678, 'http://localhost:3001/uploads/file-1640000000000-123456789.jpg'),
('file-1640000100000-234567890.jpg', 'somsa.jpg', 'image/jpeg', 189234, 'http://localhost:3001/uploads/file-1640000100000-234567890.jpg'),
('file-1640000200000-345678901.jpg', 'manti.jpg', 'image/jpeg', 298765, 'http://localhost:3001/uploads/file-1640000200000-345678901.jpg'),
('file-1640000300000-456789012.jpg', 'lagman.jpg', 'image/jpeg', 312456, 'http://localhost:3001/uploads/file-1640000300000-456789012.jpg'),
('file-1640000400000-567890123.jpg', 'shashlik.jpg', 'image/jpeg', 278934, 'http://localhost:3001/uploads/file-1640000400000-567890123.jpg'),
('file-1640000500000-678901234.jpg', 'salat.jpg', 'image/jpeg', 156789, 'http://localhost:3001/uploads/file-1640000500000-678901234.jpg'),
('file-1640000600000-789012345.jpg', 'non.jpg', 'image/jpeg', 198765, 'http://localhost:3001/uploads/file-1640000600000-789012345.jpg'),
('file-1640000700000-890123456.jpg', 'shorva.jpg', 'image/jpeg', 234567, 'http://localhost:3001/uploads/file-1640000700000-890123456.jpg'),
('file-1640000800000-901234567.jpg', 'kebab.jpg', 'image/jpeg', 267890, 'http://localhost:3001/uploads/file-1640000800000-901234567.jpg'),
('file-1640000900000-012345678.jpg', 'chuchvara.jpg', 'image/jpeg', 223456, 'http://localhost:3001/uploads/file-1640000900000-012345678.jpg'),
('file-1640001000000-112345679.png', 'tea.png', 'image/png', 145678, 'http://localhost:3001/uploads/file-1640001000000-112345679.png'),
('file-1640001100000-212345680.jpg', 'compot.jpg', 'image/jpeg', 178901, 'http://localhost:3001/uploads/file-1640001100000-212345680.jpg');

-- Display the inserted records
SELECT * FROM uploads ORDER BY id;

