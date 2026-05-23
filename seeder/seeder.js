import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

// Construct robust absolute path to .env file relative to this seeder script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Verify MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error('Gagal: MONGO_URI tidak ditemukan di file .env');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB terhubung untuk seeding...'))
  .catch((err) => {
    console.error(`Koneksi DB Gagal: ${err.message}`);
    process.exit(1);
  });

// Seed Data Definition
const importData = async () => {
  try {
    // 1. Destroy all current data to prevent duplication
    await User.deleteMany();
    await Recipe.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    console.log('Data lama berhasil dibersihkan.');

    // 2. Seed Users
    // Users are created using .create() to trigger the pre-save bcrypt hashing hook
    const adminUser = await User.create({
      namaLengkap: 'Admin Dapur Mama',
      email: 'admin@dapurmama.com',
      nomorWhatsApp: '089999999999',
      password: 'adminpassword123',
      role: 'admin',
      status: 'Siap Jualan'
    });

    const warga1 = await User.create({
      namaLengkap: 'Budi Santoso',
      email: 'budi@dapurmama.com',
      nomorWhatsApp: '081234567890',
      password: 'wargapassword123',
      role: 'warga',
      status: 'Belajar Memasak'
    });

    const warga2 = await User.create({
      namaLengkap: 'Siti Rahma',
      email: 'siti@dapurmama.com',
      nomorWhatsApp: '085678901234',
      password: 'wargapassword456',
      role: 'warga',
      status: 'Siap Jualan'
    });

    console.log('Seed data Users berhasil dimasukkan.');

    // 3. Seed Recipes (Linked to Admin)
    const recipe1 = await Recipe.create({
      judul: 'Soto Ayam Lamongan Gurih',
      kategori: 'Rumahan',
      tingkatKesulitan: 'Sedang',
      estimasiWaktu: 45,
      porsi: 4,
      bahan: [
        '1 ekor ayam kampung potong 4',
        '2 liter air',
        '3 lembar daun salam',
        '2 batang serai memarkan',
        'Bumbu halus: 8 bawang merah, 5 bawang putih, 4 kemiri sangrai, 2 cm jahe, 3 cm kunyit bakar, 1 sdt ketumbar'
      ],
      langkah: [
        'Rebus ayam bersama daun salam, daun jeruk, dan serai dengan api kecil.',
        'Tumis bumbu halus hingga harum dan matang, lalu masukkan ke dalam air rebusan ayam.',
        'Angkat ayam, suwir-suwir dagingnya.',
        'Sajikan kuah soto panas bersama suwiran ayam, soun, kol iris, telur rebus, dan koya.'
      ],
      estimasiModal: 45000,
      videoURL: 'https://youtube.com/watch?v=sotoayamlamongan',
      fotoURL: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea',
      author: adminUser._id
    });

    const recipe2 = await Recipe.create({
      judul: 'Cireng Rujak Crispy Anti Gagal',
      kategori: 'Camilan',
      tingkatKesulitan: 'Mudah',
      estimasiWaktu: 20,
      porsi: 6,
      bahan: [
        '200 gram tepung tapioka',
        '2 siung bawang putih haluskan',
        '1 batang daun bawang iris tipis',
        '150 ml air panas mendidih',
        'Bumbu rujak: 5 cabai rawit, 100 gram gula merah iris, 1 sdt asam jawa, garam'
      ],
      langkah: [
        'Biang: Campur 2 sdm tapioka dengan air, bawang putih, garam, rebus hingga mengental seperti lem.',
        'Tuang adonan biang panas ke sisa tapioka kering dan daun bawang, aduk asal rata (jangan terlalu kalis agar renyah).',
        'Bentuk bulat pipih, lalu goreng dalam minyak panas api sedang hingga kering.',
        'Sajikan cireng hangat bersama saus bumbu rujak pedas manis.'
      ],
      estimasiModal: 12000,
      videoURL: 'https://youtube.com/watch?v=cirengrujak',
      fotoURL: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027',
      author: adminUser._id
    });

    const recipe3 = await Recipe.create({
      judul: 'Martabak Manis Teplon Spesial Jualan',
      kategori: 'Ide Jualan',
      tingkatKesulitan: 'Mahir',
      estimasiWaktu: 35,
      porsi: 3,
      bahan: [
        '250 gram tepung terigu protein sedang',
        '300 ml air hangat',
        '3 sdm gula pasir',
        '1 butir telur ayam kocok lepas',
        '1/2 sdt baking powder dan 1/2 sdt baking soda'
      ],
      langkah: [
        'Kocok terigu, air, gula, dan telur dengan whisk hingga lembut, diamkan selama 1 jam.',
        'Sebelum menuang ke teplon, masukkan baking soda dan baking powder, aduk rata.',
        'Tuang adonan ke teplon panas dengan api kecil hingga muncul sarang semut, taburkan gula, lalu tutup teplon.',
        'Angkat martabak, oles margarin melimpah, beri keju parut, cokelat meses, dan susu kental manis.'
      ],
      estimasiModal: 20000,
      videoURL: 'https://youtube.com/watch?v=martabakteplon',
      fotoURL: 'https://images.unsplash.com/photo-1596797038530-2c107229654b',
      author: adminUser._id
    });

    console.log('Seed data Recipes berhasil dimasukkan.');

    // 4. Seed Blogs (Linked to Admin)
    const blog1 = await Blog.create({
      judul: 'Rahasia Kaldu Soto Ayam Kuning yang Bening, Gurih dan Harum',
      gambarBanner: 'https://images.unsplash.com/photo-1547592180-85f173990554',
      isiArtikel: 'Kunci utama soto ayam yang lezat terletak pada kuah kaldunya. Sebaiknya gunakan ayam kampung segar karena akan mengeluarkan kaldu gurih alami tanpa lemak berlebihan. Sangrai bumbu halus sebelum ditumis, dan gunakan teknik slow cooking (api kecil) saat merebus ayam bersama bumbu rempah. Penambahan daun jeruk purut segar dan serai yang dimemarkan di awal merebus juga akan menghilangkan bau amis ayam.',
      author: adminUser._id
    });

    const blog2 = await Blog.create({
      judul: 'Tips Sukses Memulai Usaha Kuliner Rumahan untuk Ibu Rumah Tangga',
      gambarBanner: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      isiArtikel: 'Memulai usaha kuliner dari rumah tidak membutuhkan modal yang fantastis. Langkah pertama adalah memilih produk yang dikuasai dengan baik (misalnya camilan cireng rujak atau lauk siap saji). Lakukan riset kecil di lingkungan RT/RW untuk menguji minat warga. Pastikan kemasan rapi dan bersih, serta manfaatkan pemasaran mulut ke mulut atau media WhatsApp warga untuk promosi gratis. Yang terpenting: konsistensi rasa dan kebersihan dapur!',
      author: adminUser._id
    });

    console.log('Seed data Blogs berhasil dimasukkan.');

    // 5. Seed Comments
    // Comment 1: Approved comment on Soto Ayam
    await Comment.create({
      userID: warga1._id,
      recipeID: recipe1._id,
      isiKomentar: 'Resep Soto Lamongan ini rasanya juara! Kuahnya segar dan koya-nya gurih banget pas buat keluarga di rumah.',
      isApproved: true
    });

    // Comment 2: Approved comment on Cireng
    await Comment.create({
      userID: warga2._id,
      recipeID: recipe2._id,
      isiKomentar: 'Cirengnya beneran kriuk di luar tapi gak keras di dalam! Saus rujaknya pedas manis mantap!',
      isApproved: true
    });

    // Comment 3: Pending comment on Martabak (Moderation Demo)
    await Comment.create({
      userID: warga1._id,
      recipeID: recipe3._id,
      isiKomentar: 'Admin, mau nanya dong kalau teplonnya ga dioles mentega pas awal numpahin adonan lengket ga ya?',
      isApproved: false
    });

    // Comment 4: Pending comment on Blog 1 (Moderation Demo)
    await Comment.create({
      userID: warga2._id,
      blogID: blog1._id,
      isiKomentar: 'Tips yang sangat bermanfaat! Saya biasanya numis bumbunya langsung, sekarang mau coba disangrai dulu.',
      isApproved: false
    });

    console.log('Seed data Comments berhasil dimasukkan.');
    console.log('Proses Seeding berhasil diselesaikan!');
    process.exit(0);
  } catch (error) {
    console.error(`Error saat import seed data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Recipe.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();

    console.log('Semua data database berhasil dihapus bersih!');
    process.exit(0);
  } catch (error) {
    console.error(`Error saat membersihkan database: ${error.message}`);
    process.exit(1);
  }
};

// Process CLI commands: node seeder/seeder.js -i (import) or -d (destroy)
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Silakan gunakan argumen berikut:');
  console.log('  node seeder/seeder.js -i   => Untuk mengimpor dummy seed data');
  console.log('  node seeder/seeder.js -d   => Untuk menghapus bersih seluruh data database');
  process.exit(0);
}
