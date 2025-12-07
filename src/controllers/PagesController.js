/**
 * PagesController - Handles rendering of EJS pages
 * Reuses existing services - no code duplication
 */
import { UsersServices } from '../services/UsersServices.js';
import { ProductsServices } from '../services/ProductsServices.js';
import { SalesServices } from '../services/SalesServices.js';
import { InventoryServices } from '../services/InventoryServices.js';
import { SaleItemsServices } from '../services/SaleItemsServices.js';
import { WeatherService } from '../services/WeatherService.js';

// Import repositories
import { UsersRepository } from '../domain/repositories/UsersRepository.js';
import { ProductsRepository } from '../domain/repositories/ProductsRepository.js';
import { SalesRepository } from '../domain/repositories/SalesRepository.js';
import { InventoryRepository } from '../domain/repositories/InventoryRepository.js';
import { SaleItemsRepository } from '../domain/repositories/SaleItemsRepository.js';

// Initialize services (reuse existing logic)
const usersService = new UsersServices(new UsersRepository());
const productsService = new ProductsServices(new ProductsRepository());
const salesService = new SalesServices(new SalesRepository());
const inventoryService = new InventoryServices(new InventoryRepository());
const saleItemsService = new SaleItemsServices(new SaleItemsRepository());
const weatherService = new WeatherService();

export class PagesController {
  
  // ===== AUTHENTICATION =====
  
  loginPage = (req, res) => {
    res.render('auth/login', { 
      title: 'Login',
      layout: 'layouts/auth'
    });
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await usersService.loginUser(email, password);
      
      req.session.user = result.user;
      req.flash('success', `Welcome back, ${result.user.first_name}!`);
      
      // Redirect based on role
      if (result.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      }
      res.redirect('/dashboard');
      
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/login');
    }
  };
  guestLogin = (req, res) => {
    // Create guest session (no database needed)
    req.session.user = {
      user_id: null,
      first_name: 'Guest',
      last_name: 'User',
      email: null,
      role: 'guest'
    };
    
    req.flash('info', 'Browsing as guest. Register to place orders.');
    res.redirect('/products');
  };
  
  productDetails = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await this.productsService.getProductById(productId);
      
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/products');
      }
      
      res.render('products/details', {
        title: product.product_name,
        product
      });
      
    } catch (error) {
      next(error);
    }
  };

  registerPage = (req, res) => {
    res.render('auth/register', { 
      title: 'Register',
      layout: 'layouts/auth'
    });
  };

  register = async (req, res) => {
    try {
      // Only allow customer or guest registration (no admin)
      const userData = {
        ...req.body,
        role: req.body.role === 'guest' ? 'guest' : 'customer'
      };
      
      await usersService.registerUser(userData);
      req.flash('success', 'Registration successful! Please login.');
      res.redirect('/login');
      
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/register');
    }
  };

  logout = (req, res) => {
    const firstName = req.session.user?.first_name;
    req.session.destroy((err) => {
      if (err) console.error(err);
      res.redirect('/login');
    });
  };

  // ===== DASHBOARDS =====
  
  // Admin dashboard
  adminDashboard = async (req, res, next) => {
    try {
      const [allSales, products, inventory] = await Promise.all([
        salesService.getAllSales(),
        productsService.getAllProducts(),
        inventoryService.getAllInventory()
      ]);

      const city = req.query.city || 'Beirut, LB';
      const weather = await weatherService.fetchCurrentWeather(city);

      const lowStock = await inventoryService.getLowStockProducts(10);

      const stats = {
        totalRevenue: allSales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0),
        totalSales: allSales.length,
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        todaySales: allSales.filter(s => {
          const saleDate = s.sale_date;
          const today = new Date().toLocaleDateString('en-GB').split('/').join('/');
          return saleDate === today;
        }).length
      };

      // Recent sales (last 10)
      const recentSales = allSales.slice(0, 10);

      res.render('dashboard-admin', {
        title: 'Admin Dashboard',
        stats,
        recentSales,
        lowStock: lowStock.slice(0, 5),
        weather: weather.data,
        weatherError: weather.error,
        weatherCity: city
      });
      
    } catch (error) {
      next(error);
    }
  };

  // Customer dashboard
  customerDashboard = async (req, res, next) => {
    try {
      const userId = req.session.user.user_id;
      
      const allSales = await salesService.getAllSales();
      const mySales = allSales.filter(s => s.user_id === userId);

      const city = req.query.city || 'Beirut, LB';
      const weather = await weatherService.fetchCurrentWeather(city);

      const myStats = {
        totalOrders: mySales.length,
        totalSpent: mySales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0),
        recentOrders: mySales.slice(0, 5)
      };

      res.render('dashboard-customer', {
        title: 'My Dashboard',
        stats: myStats,
        weather: weather.data,
        weatherError: weather.error,
        weatherCity: city
      });
      
    } catch (error) {
      next(error);
    }
  };

  // ===== PRODUCTS =====
  
  // Public catalog (everyone can view)
  productsCatalog = async (req, res, next) => {
    try {
      const products = await productsService.getAllProducts();
      const availableProducts = products.filter(p => p.status === 'available');
      
      res.render('products/catalog', {
        title: 'Our Products',
        products: availableProducts,
        showPrices: !!req.session.user // Show prices only if logged in
      });
      
    } catch (error) {
      next(error);
    }
  };

  weatherPage = async (req, res, next) => {
    try {
      const city = req.query.city || 'Beirut, LB';
      const weather = await weatherService.fetchCurrentWeather(city);

      res.render('weather', {
        title: 'Roastery Weather',
        weather: weather.data,
        weatherError: weather.error,
        city
      });
    } catch (error) {
      next(error);
    }
  };

  // Admin product management
  productsListAdmin = async (req, res, next) => {
    try {
      const products = await productsService.getAllProducts();
      
      res.render('products/list', {
        title: 'Manage Products',
        products
      });
      
    } catch (error) {
      next(error);
    }
  };

  productsCreatePage = (req, res) => {
    res.render('products/create', {
      title: 'Add New Product'
    });
  };

  productsCreate = async (req, res) => {
    try {
      // Extract inventory quantity from request body
      const { quantity_in_stock, ...productData } = req.body;
      
      // Step 1: Create the product
      const product = await productsService.createProduct(productData);
      
      // Step 2: Create or update inventory record if quantity is provided
      if (quantity_in_stock !== undefined && quantity_in_stock !== null && quantity_in_stock !== '') {
        const stockQuantity = parseInt(quantity_in_stock) || 0;
        if (stockQuantity >= 0) {
          // Check if inventory already exists for this product
          const existingInventory = await inventoryService.getInventoryByProduct(product.product_id);
          
          if (existingInventory) {
            // Update existing inventory
            await inventoryService.updateInventory(product.product_id, stockQuantity);
          } else {
            // Create new inventory record
            await inventoryService.createInventoryRecord(product.product_id, stockQuantity);
          }
        }
      }
      
      req.flash('success', 'Product and inventory created successfully');
      res.redirect('/admin/products');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/products/create');
    }
  };

  productsEditPage = async (req, res, next) => {
    try {
      const product = await productsService.getProductById(req.params.id);
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/admin/products');
      }
      
      // Get inventory for this product
      const inventory = await inventoryService.getInventoryByProduct(product.product_id);
      
      res.render('products/edit', {
        title: 'Edit Product',
        product,
        inventory
      });
      
    } catch (error) {
      next(error);
    }
  };

  productsEdit = async (req, res) => {
    try {
      await productsService.updateProduct(req.params.id, req.body);
      req.flash('success', 'Product updated successfully');
      res.redirect('/admin/products');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect(`/admin/products/edit/${req.params.id}`);
    }
  };

  productsDelete = async (req, res) => {
    try {
      await productsService.deleteProduct(req.params.id);
      req.flash('success', 'Product deleted successfully');
      res.redirect('/admin/products');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/products');
    }
  };

  // ===== SALES / ORDERS =====
  
  // Create sale page (customer selects products)
  salesCreatePage = async (req, res, next) => {
    try {
      const products = await productsService.getAllProducts();
      const availableProducts = products.filter(p => p.status === 'available');
      
      res.render('sales/create', {
        title: 'Place Order',
        products: availableProducts
      });
      
    } catch (error) {
      next(error);
    }
  };

  salesCreate = async (req, res) => {
    try {
      const userId = req.session.user.user_id;
      const { items, discount_percentage } = req.body;
      
      // items = [{ product_id, quantity, price }]
      // Parse if it's JSON string
      const cartItems = typeof items === 'string' ? JSON.parse(items) : items;
      
      if (!cartItems || cartItems.length === 0) {
        req.flash('error', 'Please add at least one product');
        return res.redirect('/sales/create');
      }

      // Step 1: Create sale
      const sale = await salesService.createSale(userId);
      
      // Step 2: Add items
      for (const item of cartItems) {
        await saleItemsService.createSaleItem(
          sale.sale_id,
          item.product_id,
          item.quantity,
          item.price
        );
      }

      // Step 3: Apply discount if provided
      if (discount_percentage && discount_percentage > 0) {
        await salesService.applyDiscount(sale.sale_id, parseFloat(discount_percentage));
      }

      req.flash('success', 'Order placed successfully!');
      res.redirect(`/sales/${sale.sale_id}`);
      
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/sales/create');
    }
  };

  // Customer views their own orders
  myOrders = async (req, res, next) => {
    try {
      const userId = req.session.user.user_id;
      const allSales = await salesService.getAllSales();
      const mySales = allSales.filter(s => s.user_id === userId);
      
      res.render('sales/my-orders', {
        title: 'My Orders',
        sales: mySales
      });
      
    } catch (error) {
      next(error);
    }
  };

  // Admin views all orders
  allOrders = async (req, res, next) => {
    try {
      const allSales = await salesService.getAllSales();
      
      res.render('sales/all-orders', {
        title: 'All Orders',
        sales: allSales
      });
      
    } catch (error) {
      next(error);
    }
  };

  // Order details / receipt
  saleDetails = async (req, res, next) => {
    try {
      const saleId = req.params.id;
      const userId = req.session.user.user_id;
      const isAdmin = req.session.user.role === 'admin';
      
      const sale = await salesService.getSaleById(saleId);
      if (!sale) {
        req.flash('error', 'Order not found');
        return res.redirect('/sales');
      }

      // Check permission: customer can only view own sales
      if (!isAdmin && sale.user_id !== userId) {
        return res.status(403).render('403', { title: 'Access Denied' });
      }

      const saleItems = await saleItemsService.getSaleItemsBySaleId(saleId);
      
      res.render('sales/receipt', {
        title: `Order #${saleId}`,
        sale,
        items: saleItems
      });
      
    } catch (error) {
      next(error);
    }
  };

  // Apply discount to order (admin only)
  applyOrderDiscount = async (req, res) => {
    try {
      const { sale_id } = req.params;
      const { discount_percentage } = req.body;
      
      await salesService.applyDiscount(sale_id, parseFloat(discount_percentage));
      req.flash('success', `Discount of ${discount_percentage}% applied to order successfully`);
      res.redirect(`/sales/${sale_id}`);
    } catch (error) {
      req.flash('error', error.message);
      res.redirect(`/sales/${req.params.sale_id}`);
    }
  };

  // ===== INVENTORY (Admin Only) =====
  
  inventoryList = async (req, res, next) => {
    try {
      // Use getAllWithDetails to get product names
      const inventory = await inventoryService.getAllWithDetails();
      
      res.render('inventory/list', {
        title: 'Inventory Management',
        inventory
      });
      
    } catch (error) {
      next(error);
    }
  };

  inventoryLowStock = async (req, res, next) => {
    try {
      const threshold = req.query.threshold || 10;
      const lowStock = await inventoryService.getLowStockProducts(threshold);
      
      res.render('inventory/low-stock', {
        title: 'Low Stock Alert',
        lowStock,
        threshold
      });
      
    } catch (error) {
      next(error);
    }
  };

  inventoryUpdate = async (req, res) => {
    try {
      const { product_id } = req.params;
      const { quantity_in_stock } = req.body;
      
      await inventoryService.updateInventory(product_id, parseInt(quantity_in_stock));
      req.flash('success', 'Inventory updated');
      res.redirect('/admin/inventory');
      
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/inventory');
    }
  };

  // ===== USERS (Admin Only) =====
  
  usersList = async (req, res, next) => {
    try {
      const users = await usersService.listUsers();
      
      res.render('users/list', {
        title: 'User Management',
        users
      });
      
    } catch (error) {
      next(error);
    }
  };

  // ===== PROFILE =====
  
  profile = async (req, res, next) => {
    try {
      const userId = req.session.user.user_id;
      const user = await usersService.getUserById(userId);
      
      res.render('profile', {
        title: 'My Profile',
        user
      });
      
    } catch (error) {
      next(error);
    }
  };
}