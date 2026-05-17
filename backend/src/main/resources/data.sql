-- =============================================
-- DEVARAKONDI SILKS — SEED DATA
-- =============================================

-- CATEGORIES (slugs must match nav tab href ?category=XYZ)
INSERT INTO categories (id, name, slug, image_url, description) VALUES
(1, 'Molakalmur Silks', 'molakalmur-silks', 'images/saree-molakalmur-1.jpg', 'Traditional handwoven silk sarees straight from Molakalmur magga, Karnataka'),
(2, 'Kanchipuram',      'kanchipuram',      'images/saree-kanchipuram-1.jpg', 'Authentic Kanchipuram pure silk sarees with traditional temple motifs'),
(3, 'Soft Silk',        'soft-silk',        'images/saree-soft-silk-1.jpg',   'Lightweight soft silk sarees perfect for festivals and special occasions'),
(4, 'Bridal',           'bridal',           'images/saree-bridal-1.jpg',      'Statement bridal silk sarees for your most cherished day'),
(5, 'Organza',          'organza',          'images/saree-organza-1.jpg',     'Sheer and elegant organza silk sarees with floral embroidery'),
(6, 'Cotton',           'cotton',           'images/saree-cotton-1.jpg',      'Breathable handloom cotton and cotton-silk sarees for daily wear');

-- =============================================
-- PRODUCTS
-- =============================================
INSERT INTO products (id, name, category_id, fabric, occasion, price, original_price, stock, origin, design, description, is_new, is_bestseller, is_magga, created_at) VALUES

-- MOLAKALMUR SILKS (cat 1)
(1,  'Molakalmur Heritage Zari',      1, 'Pure Silk',    'Bridal',   18500, 22000, 3,  'Molakalmur, Karnataka', 'Peacock & Mango Zari on Maroon',
     'A masterpiece woven on traditional pit looms at our Molakalmur magga. Features intricate gold zari peacock and mango motifs on deep maroon silk — a true heirloom piece.',
     false, true,  true,  NOW()),

(2,  'Midnight Zari Grand',            1, 'Pure Silk',    'Bridal',   24000, 28500, 2,  'Molakalmur, Karnataka', 'All-over Gold Zari on Midnight Black',
     'A statement saree in deep midnight black with all-over gold zari elephant and floral work. The ultimate power drape for weddings and grand occasions.',
     false, true,  true,  NOW()),

(3,  'Heritage Checks Silk',           1, 'Pure Silk',    'Festival', 14500, 17000, 4,  'Molakalmur, Karnataka', 'Traditional Checks with Korvai Border',
     'A timeless checks silk saree handwoven with the korvai technique for a seamlessly joined border. Authentic Molakalmur weave in every thread.',
     false, false, true,  NOW()),

(4,  'Indigo Kasuti Silk',             1, 'Pure Silk',    'Festival', 16800, 19500, 3,  'Molakalmur, Karnataka', 'Indigo Blue with Kasuti Embroidery',
     'Deep indigo silk adorned with traditional Karnataka Kasuti embroidery. A rare celebration of regional craft carried across generations in our family magga.',
     false, false, true,  NOW()),

-- KANCHIPURAM (cat 2)
(5,  'Royal Blue Kanchipuram',         2, 'Pure Silk',    'Festival', 16500, 19000, 4,  'Molakalmur, Karnataka', 'Royal Blue with Temple Border & Peacock Pallu',
     'Rich royal blue Kanchipuram silk woven with traditional temple border and an elaborate peacock & lotus pallu. Authenticated with silk mark.',
     true,  true,  false, NOW()),

(6,  'Emerald Silk Kanchipuram',       2, 'Pure Silk',    'Bridal',   22000, 26000, 2,  'Molakalmur, Karnataka', 'Emerald Green with Gold Gopuram Border',
     'Deep emerald green Kanchipuram silk with a classic gopuram (temple tower) border and full gold zari pallu. A bridal masterpiece steeped in tradition.',
     false, true,  true,  NOW()),

(7,  'Champagne Zari Kanchi',          2, 'Pure Silk',    'Festival', 13800, 16000, 5,  'Mysore, Karnataka',     'Champagne Gold with Fine Zari Butta',
     'Luminous champagne gold Kanchipuram silk with scattered gold zari butta and a classically woven border. Perfect for engagements and festive occasions.',
     true,  false, false, NOW()),

-- SOFT SILK (cat 3)
(8,  'Blush Pink Soft Silk',           3, 'Pure Silk',    'Casual',    7200, NULL,  6,  'Mysore, Karnataka',     'Blush Pink with Antique Gold Paisley Border',
     'A dreamy blush pink soft silk saree with antique gold paisley border. Feather-light and effortlessly elegant for evening occasions.',
     true,  false, false, NOW()),

(9,  'Sage Green Organza Soft',        3, 'Pure Silk',    'Festival',  8900, 10500, 5,  'Mysore, Karnataka',     'Sage with Nakshi Floral Border',
     'Soft silk in sage green with a delicate nakshi floral woven border. Carries the quiet elegance of hand-block printed sarees in a rich silk format.',
     true,  false, false, NOW()),

(10, 'Ivory Soft Silk Drape',          3, 'Pure Silk',    'Festival', 12800, 15000, 5,  'Molakalmur, Karnataka', 'Ivory Champagne with Gold Zari Border',
     'Effortlessly elegant soft silk saree in ivory and champagne tones with a delicate gold zari border. A timeless choice for every festive wardrobe.',
     false, true,  true,  NOW()),

(11, 'Copper Rose Soft Silk',          3, 'Pure Silk',    'Casual',    6400, NULL,  8,  'Mysore, Karnataka',     'Copper Rose with Minimal Zari Border',
     'Lightweight soft silk in warm copper rose tone with minimalist zari border. Perfect for corporate gatherings and casual outings with grace.',
     false, false, false, NOW()),

-- BRIDAL (cat 4)
(12, 'Royal Bridal Kanjivaram',        4, 'Pure Silk',    'Bridal',   38500, 45000, 2,  'Molakalmur, Karnataka', 'Deep Maroon with Broad Gold Zari Pallu',
     'The pinnacle of bridal elegance. Woven with pure zari threads on our ancestral looms in Molakalmur. A once-in-a-lifetime saree crafted for the most special day.',
     false, true,  true,  NOW()),

(13, 'Bridal Crimson Kanjivaram',      4, 'Pure Silk',    'Bridal',   42000, 50000, 1,  'Molakalmur, Karnataka', 'Crimson Red with Full Zari Pallu & Mango Buttas',
     'The most coveted bridal piece in our collection. Pure Kanchipuram silk in deep crimson with a magnificent full-zari pallu featuring mango buttas and peacock motifs.',
     false, true,  true,  NOW()),

(14, 'Grand Bridal Ivory Silk',        4, 'Pure Silk',    'Bridal',   35000, 40000, 2,  'Molakalmur, Karnataka', 'Ivory White with Temple Border & Gold Zari',
     'A timeless ivory bridal Kanchipuram with a wide golden temple border. For the bride who chooses grace over grandeur. Running blouse included.',
     true,  true,  true,  NOW()),

-- ORGANZA (cat 5)
(15, 'Sage Organza Floral',            5, 'Organza',      'Festival',  8900, 10500, 5,  'Mysore, Karnataka',     'Sage Green with Hand Embroidered Gold Floral',
     'Sheer organza silk in sage green with delicate hand-embroidered gold floral border. Ethereally beautiful — designed for the woman who commands attention without trying.',
     true,  false, false, NOW()),

(16, 'Ivory Organza Pearl',            5, 'Organza',      'Festival', 11200, 13000, 3,  'Mysore, Karnataka',     'Ivory Organza with Pearl & Sequin Border',
     'Translucent ivory organza with a delicate pearl and gold sequin border. Creates a floating, dreamlike silhouette at receptions and sangeet ceremonies.',
     true,  false, false, NOW()),

(17, 'Rose Gold Organza',              5, 'Organza',      'Casual',    9400, NULL,  6,  'Mysore, Karnataka',     'Rose Gold with Cutwork Border',
     'Contemporary rose gold organza saree with delicate cutwork border detailing. Bridges traditional weaving with modern fashion-forward sensibilities.',
     false, false, false, NOW()),

-- COTTON (cat 6)
(18, 'Terracotta Village Cotton',      6, 'Cotton Silk',  'Casual',    2800, NULL, 20,  'Mysore, Karnataka',     'Earthy Terracotta with Teal Contrast Border',
     'Breathable cotton-silk blend in earthy terracotta with a contrasting teal woven border. Comfortable for everyday wear without compromising on style.',
     true,  false, false, NOW()),

(19, 'Teal Buta Cotton Silk',          6, 'Cotton Silk',  'Casual',    4200, NULL, 12,  'Mysore, Karnataka',     'Teal with Gold Buta Weave Pattern',
     'A versatile everyday saree in vibrant teal with subtle buta weave and a fine gold border. Handloom certified and soft on the skin.',
     true,  false, false, NOW()),

(20, 'Marigold Festival Cotton',       6, 'Cotton Silk',  'Festival',  3500, NULL, 15,  'Mysore, Karnataka',     'Sunny Marigold with Temple Woven Border',
     'Bright marigold yellow cotton-silk saree with a classic woven temple border. Perfect for festivals, pujas, and summer celebrations.',
     false, false, false, NOW()),

(21, 'Tangerine Handloom Cotton',      6, 'Cotton Silk',  'Casual',    3200, NULL, 14,  'Mysore, Karnataka',     'Tangerine with Maroon Contrast Border',
     'Vibrant tangerine handloom cotton-silk saree with a contrasting maroon border. Fun, fresh, and everyday-ready.',
     false, false, false, NOW());

-- =============================================
-- PRODUCT IMAGES (primary + fabric/pallu/blouse detail shots)
-- Using our 6 generated images; zoomed variants reuse category images for now
-- =============================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES

-- Product 1: Molakalmur Heritage Zari
(1, 'images/saree-molakalmur-1.jpg', true,  0),
(1, 'images/saree-kanchipuram-1.jpg', false, 1),
(1, 'images/saree-bridal-1.jpg',     false, 2),

-- Product 2: Midnight Zari Grand
(2, 'images/saree-molakalmur-1.jpg', true,  0),
(2, 'images/saree-bridal-1.jpg',     false, 1),
(2, 'images/saree-kanchipuram-1.jpg',false, 2),

-- Product 3: Heritage Checks Silk
(3, 'images/saree-kanchipuram-1.jpg',true,  0),
(3, 'images/saree-molakalmur-1.jpg', false, 1),

-- Product 4: Indigo Kasuti Silk
(4, 'images/saree-kanchipuram-1.jpg',true,  0),
(4, 'images/saree-molakalmur-1.jpg', false, 1),

-- Product 5: Royal Blue Kanchipuram
(5, 'images/saree-kanchipuram-1.jpg',true,  0),
(5, 'images/saree-molakalmur-1.jpg', false, 1),
(5, 'images/saree-bridal-1.jpg',     false, 2),

-- Product 6: Emerald Silk Kanchipuram
(6, 'images/saree-bridal-1.jpg',     true,  0),
(6, 'images/saree-kanchipuram-1.jpg',false, 1),
(6, 'images/saree-molakalmur-1.jpg', false, 2),

-- Product 7: Champagne Zari Kanchi
(7, 'images/saree-soft-silk-1.jpg',  true,  0),
(7, 'images/saree-kanchipuram-1.jpg',false, 1),

-- Product 8: Blush Pink Soft Silk
(8, 'images/saree-soft-silk-1.jpg',  true,  0),
(8, 'images/saree-organza-1.jpg',    false, 1),

-- Product 9: Sage Green Organza Soft
(9, 'images/saree-organza-1.jpg',    true,  0),
(9, 'images/saree-soft-silk-1.jpg',  false, 1),

-- Product 10: Ivory Soft Silk Drape
(10,'images/saree-soft-silk-1.jpg',  true,  0),
(10,'images/saree-kanchipuram-1.jpg',false, 1),
(10,'images/saree-bridal-1.jpg',     false, 2),

-- Product 11: Copper Rose Soft Silk
(11,'images/saree-soft-silk-1.jpg',  true,  0),
(11,'images/saree-organza-1.jpg',    false, 1),

-- Product 12: Royal Bridal Kanjivaram
(12,'images/saree-bridal-1.jpg',     true,  0),
(12,'images/saree-molakalmur-1.jpg', false, 1),
(12,'images/saree-kanchipuram-1.jpg',false, 2),

-- Product 13: Bridal Crimson Kanjivaram
(13,'images/saree-bridal-1.jpg',     true,  0),
(13,'images/saree-molakalmur-1.jpg', false, 1),
(13,'images/saree-kanchipuram-1.jpg',false, 2),

-- Product 14: Grand Bridal Ivory Silk
(14,'images/saree-bridal-1.jpg',     true,  0),
(14,'images/saree-soft-silk-1.jpg',  false, 1),
(14,'images/saree-kanchipuram-1.jpg',false, 2),

-- Product 15: Sage Organza Floral
(15,'images/saree-organza-1.jpg',    true,  0),
(15,'images/saree-soft-silk-1.jpg',  false, 1),

-- Product 16: Ivory Organza Pearl
(16,'images/saree-organza-1.jpg',    true,  0),
(16,'images/saree-soft-silk-1.jpg',  false, 1),

-- Product 17: Rose Gold Organza
(17,'images/saree-organza-1.jpg',    true,  0),
(17,'images/saree-bridal-1.jpg',     false, 1),

-- Product 18: Terracotta Village Cotton
(18,'images/saree-cotton-1.jpg',     true,  0),
(18,'images/saree-molakalmur-1.jpg', false, 1),

-- Product 19: Teal Buta Cotton Silk
(19,'images/saree-cotton-1.jpg',     true,  0),
(19,'images/saree-kanchipuram-1.jpg',false, 1),

-- Product 20: Marigold Festival Cotton
(20,'images/saree-cotton-1.jpg',     true,  0),
(20,'images/saree-soft-silk-1.jpg',  false, 1),

-- Product 21: Tangerine Handloom Cotton
(21,'images/saree-cotton-1.jpg',     true,  0),
(21,'images/saree-organza-1.jpg',    false, 1);
