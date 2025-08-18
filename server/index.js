// Import library yang dibutuhkan
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import midtransclient from 'midtrans-client';

// --- INISIALISASI ---
// Memuat variabel environment dari file .env
dotenv.config();

// Membuat instance aplikasi Express
const app = express();
const PORT = process.env.PORT || 8080;

// Membuat instance Prisma Client untuk berinteraksi dengan database
const prisma = new PrismaClient();

// Inisialisasi Midtrans Snap client
const snap = new midtransclient.Snap({
    isProduction: false, // Set true jika sudah di production
    serverKey: process.env.MIDTRANS_SERVER_KEY
});


// --- MIDDLEWARE ---
// Mengaktifkan CORS agar frontend bisa mengakses API ini
app.use(cors());
// Mengaktifkan middleware untuk membaca request body dalam format JSON
app.use(express.json());

// Middleware untuk mencatat setiap permintaan (bisa dihapus jika sudah tidak dibutuhkan)
app.use((req, res, next) => {
  console.log(`Request Diterima: ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware untuk otentikasi JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'Akses ditolak, tidak ada token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Format token salah.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan payload token ke object request
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token tidak valid.' });
  }
};

// Middleware untuk memeriksa peran Admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ msg: 'Akses ditolak. Hanya untuk Admin.' });
  }
};


// --- API ENDPOINTS ---

// Endpoint dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.send('Server API "Ada Ayam" berjalan!');
});

// --- Rute Otentikasi ---
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Harap isi semua field yang dibutuhkan.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah terdaftar.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: { fullName, email, passwordHash },
    });
    res.status(201).json({
      msg: 'Registrasi berhasil!',
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Harap isi email dan password.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Email atau password salah.' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email atau password salah.' });
    }
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      msg: 'Login berhasil!',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, fullName: true, email: true, role: true }
    });
    if (!user) {
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
});

// --- Rute Pengguna ---
app.put('/api/users/profile', authMiddleware, async (req, res) => {
    const { fullName, phoneNumber, address } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                fullName,
                phoneNumber,
                address,
            },
            select: { id: true, fullName: true, email: true, role: true, phoneNumber: true, address: true }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error saat update profil:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

// --- Rute Produk ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });
    res.json(products);
  } catch (error) {
    console.error('Error saat mengambil produk:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: id },
        });
        if (!product) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, pricePerKg, category, imageUrl, stockKg } = req.body;
  if (!name || !pricePerKg || !category || !stockKg) {
    return res.status(400).json({ msg: 'Field nama, harga, kategori, dan stok wajib diisi.' });
  }
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        pricePerKg: parseInt(pricePerKg),
        category,
        imageUrl,
        stockKg: parseFloat(stockKg),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error saat menambah produk:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
});

app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, description, pricePerKg, category, imageUrl, stockKg, isActive } = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                name,
                description,
                pricePerKg: pricePerKg ? parseInt(pricePerKg) : undefined,
                category,
                imageUrl,
                stockKg: stockKg ? parseFloat(stockKg) : undefined,
                isActive,
            },
        });
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error saat memperbarui produk:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.update({
            where: { id: id },
            data: { isActive: false },
        });
        res.json({ msg: 'Produk berhasil dinonaktifkan.' });
    } catch (error) {
        console.error('Error saat menghapus produk:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.get('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
        });
        res.json(products);
    } catch (error) {
        console.error('Error saat mengambil semua produk (admin):', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { // Sertakan data pengguna yang memesan
                    select: { fullName: true, email: true }
                },
                orderItems: { // Sertakan item di dalam pesanan
                    include: {
                        product: { // Sertakan detail produk untuk setiap item
                            select: { name: true }
                        }
                    }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error('Error saat mengambil semua pesanan (admin):', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status yang masuk
    const allowedStatus = ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!status || !allowedStatus.includes(status)) {
        return res.status(400).json({ msg: 'Status tidak valid.' });
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: id },
            data: { status: status },
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error saat update status pesanan:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});



// --- Rute Pesanan (Orders) ---
app.post('/api/orders', authMiddleware, async (req, res) => {
    const { cartItems, shippingAddress } = req.body;
    const userId = req.user.userId;

    if (!cartItems || cartItems.length === 0 || !shippingAddress) {
        return res.status(400).json({ msg: 'Keranjang belanja dan alamat pengiriman tidak boleh kosong.' });
    }

    try {
        let totalAmount = 0;
        const orderItemsData = [];
        for (const item of cartItems) {
            const product = await prisma.product.findUnique({ where: { id: item.id } });
            if (!product) {
                return res.status(404).json({ msg: `Produk dengan ID ${item.id} tidak ditemukan.` });
            }
            const subtotal = product.pricePerKg * item.quantity;
            totalAmount += subtotal;
            orderItemsData.push({
                productId: item.id,
                quantityKg: item.quantity,
                priceAtPurchase: product.pricePerKg,
                subtotal: subtotal,
            });
        }

        const midtransOrderId = `ADAAYAM-${Date.now()}`;
        const newOrder = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                shippingAddress,
                midtransOrderId,
                orderItems: {
                    create: orderItemsData,
                },
            },
        });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const parameter = {
            transaction_details: {
                order_id: midtransOrderId,
                gross_amount: totalAmount,
            },
            customer_details: {
                first_name: user.fullName,
                email: user.email,
                phone: user.phoneNumber || 'N/A',
            },
        };

        const token = await snap.createTransactionToken(parameter);

        await prisma.order.update({
            where: { id: newOrder.id },
            data: { midtransSnapToken: token },
        });

        res.json({ token });

    } catch (error) {
        console.error('Error saat membuat pesanan:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

app.get('/api/orders/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: { select: { name: true } }
                    }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error('Error saat mengambil riwayat pesanan:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
    }
});

// --- Rute Notifikasi Midtrans (Webhook) ---
app.post('/api/midtrans-notification', async (req, res) => {
    try {
        console.log('--- Notifikasi Midtrans Diterima ---');
        console.log('Body Notifikasi:', JSON.stringify(req.body, null, 2));

        // Verifikasi notifikasi dari Midtrans
        const statusResponse = await snap.transaction.notification(req.body);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Notifikasi Terverifikasi untuk order_id: ${orderId}, status: ${transactionStatus}, fraud: ${fraudStatus}`);

        const order = await prisma.order.findUnique({
            where: { midtransOrderId: orderId },
        });

        if (!order) {
            console.log(`Order dengan midtransOrderId: ${orderId} tidak ditemukan.`);
            return res.status(404).send('Order not found.');
        }

        // Logika pembaruan status pesanan
        if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
            if (fraudStatus == 'accept') {
                console.log(`Memperbarui status order ${orderId} menjadi PAID.`);
                await prisma.order.update({
                    where: { midtransOrderId: orderId },
                    data: { status: 'PAID' },
                });
            }
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            console.log(`Memperbarui status order ${orderId} menjadi CANCELLED.`);
            await prisma.order.update({
                where: { midtransOrderId: orderId },
                data: { status: 'CANCELLED' },
            });
        }

        console.log('--- Notifikasi Berhasil Diproses ---');
        res.status(200).send('Notification received successfully.');

    } catch (error) {
        console.error('!!! Error saat menangani notifikasi Midtrans:');
        console.error(error.message); // Cetak pesan error yang lebih jelas
        res.status(500).send('Internal Server Error');
    }
});


// --- Menjalankan Server ---
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
