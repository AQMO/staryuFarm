package com.staryu.service;

import com.staryu.dao.*;
import com.staryu.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BusinessService {

    @Autowired private UserDao userDao;
    @Autowired private ModuleConfigDao moduleConfigDao;
    @Autowired private RoomDao roomDao;
    @Autowired private FoodDao foodDao;
    @Autowired private FoodCategoryDao foodCategoryDao;
    @Autowired private ProductDao productDao;
    @Autowired private ProductCategoryDao productCategoryDao;
    @Autowired private FruitTreeDao fruitTreeDao;
    @Autowired private PlotDao plotDao;
    @Autowired private OrderDao orderDao;
    @Autowired private CartDao cartDao;
    @Autowired private AddressDao addressDao;
    @Autowired private MenuDao menuDao;
    @Autowired private RoleMenuDao roleMenuDao;
    @Autowired private PaymentRecordDao paymentRecordDao;

    // ===== Module Config =====
    public List<ModuleConfig> getAllModules() {
        return moduleConfigDao.findAll();
    }

    public List<ModuleConfig> getEnabledModules() {
        return moduleConfigDao.findEnabled();
    }

    public ModuleConfig updateModuleConfig(Integer id, ModuleConfig config) {
        ModuleConfig existing = moduleConfigDao.findById(id).orElse(null);
        if (existing == null) return null;
        if (config.getModuleName() != null) existing.setModuleName(config.getModuleName());
        if (config.getIsEnabled() != null) existing.setIsEnabled(config.getIsEnabled());
        if (config.getSort() != null) existing.setSort(config.getSort());
        if (config.getIcon() != null) existing.setIcon(config.getIcon());
        if (config.getDescription() != null) existing.setDescription(config.getDescription());
        return moduleConfigDao.save(existing);
    }

    // ===== Rooms =====
    public List<Room> getAllRooms() { return roomDao.findAll(); }
    public Room getRoomById(Integer id) { return roomDao.findById(id).orElse(null); }
    public Room saveRoom(Room room) { return roomDao.save(room); }
    public void deleteRoom(Integer id) { roomDao.deleteById(id); }

    // ===== Food =====
    public List<Food> getAllFood() { return foodDao.findAll(); }
    public List<Food> getFoodByCategory(Integer categoryId) { return foodDao.findByField("categoryId", categoryId); }
    public Food getFoodById(Integer id) { return foodDao.findById(id).orElse(null); }
    public Food saveFood(Food food) { return foodDao.save(food); }
    public void deleteFood(Integer id) { foodDao.deleteById(id); }

    // ===== Food Category =====
    public List<FoodCategory> getAllFoodCategories() { return foodCategoryDao.findAll(); }
    public FoodCategory saveFoodCategory(FoodCategory fc) { return foodCategoryDao.save(fc); }
    public void deleteFoodCategory(Integer id) { foodCategoryDao.deleteById(id); }

    // ===== Products =====
    public List<Product> getAllProducts() { return productDao.findAll(); }
    public List<Product> getProductsByCategory(Integer categoryId) { return productDao.findByField("categoryId", categoryId); }
    public Product getProductById(Integer id) { return productDao.findById(id).orElse(null); }
    public Product saveProduct(Product product) { return productDao.save(product); }
    public void deleteProduct(Integer id) { productDao.deleteById(id); }

    // ===== Product Category =====
    public List<ProductCategory> getAllProductCategories() { return productCategoryDao.findAll(); }
    public ProductCategory saveProductCategory(ProductCategory pc) { return productCategoryDao.save(pc); }
    public void deleteProductCategory(Integer id) { productCategoryDao.deleteById(id); }

    // ===== Fruit Trees =====
    public List<FruitTree> getAllFruitTrees() { return fruitTreeDao.findAll(); }
    public FruitTree getFruitTreeById(Integer id) { return fruitTreeDao.findById(id).orElse(null); }
    public FruitTree saveFruitTree(FruitTree ft) { return fruitTreeDao.save(ft); }
    public void deleteFruitTree(Integer id) { fruitTreeDao.deleteById(id); }

    // ===== Plots =====
    public List<Plot> getAllPlots() { return plotDao.findAll(); }
    public Plot getPlotById(Integer id) { return plotDao.findById(id).orElse(null); }
    public Plot savePlot(Plot plot) { return plotDao.save(plot); }
    public void deletePlot(Integer id) { plotDao.deleteById(id); }

    // ===== Orders =====
    public List<Order> getAllOrders() { return orderDao.findAll(); }
    public List<Order> getOrdersByUserId(Integer userId) { return orderDao.findByUserId(userId); }
    public List<Order> getOrdersByStatus(String status) { return orderDao.findByStatus(status); }
    public Order getOrderById(Integer id) { return orderDao.findById(id).orElse(null); }

    public Order createOrder(Order order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus("pending");
        return orderDao.save(order);
    }

    public Order updateOrderStatus(Integer id, String status) {
        Order order = orderDao.findById(id).orElse(null);
        if (order == null) return null;
        order.setStatus(status);
        return orderDao.save(order);
    }

    private String generateOrderNo() {
        return "SY" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%04d", new Random().nextInt(10000));
    }

    // ===== Cart =====
    public List<Cart> getCartByUserId(Integer userId) { return cartDao.findByField("userId", userId); }

    public Cart addToCart(Cart cart) {
        List<Cart> existing = cartDao.findByFields(
            Map.of("userId", cart.getUserId(), "itemId", cart.getItemId(), "itemType", cart.getItemType())
        );
        if (!existing.isEmpty()) {
            Cart item = existing.get(0);
            item.setQuantity(item.getQuantity() + cart.getQuantity());
            return cartDao.save(item);
        }
        return cartDao.save(cart);
    }

    public void updateCartQuantity(Integer id, Integer quantity) {
        cartDao.findById(id).ifPresent(cart -> {
            cart.setQuantity(quantity);
            cartDao.save(cart);
        });
    }

    public void deleteCartItem(Integer id) { cartDao.deleteById(id); }
    public void clearCart(Integer userId) {
        cartDao.findByField("userId", userId).forEach(cartDao::delete);
    }

    // ===== Address =====
    public List<Address> getAddressByUserId(Integer userId) { return addressDao.findByField("userId", userId); }
    public Address saveAddress(Address address) { return addressDao.save(address); }
    public void deleteAddress(Integer id) { addressDao.deleteById(id); }

    // ===== Users =====
    public List<User> getAllUsers() { return userDao.findAll(); }
    public User getUserById(Integer id) { return userDao.findById(id).orElse(null); }
    public User saveUser(User user) { return userDao.save(user); }
    public User findUserByUsername(String username) { return userDao.findByUsername(username); }

    // ===== Stats =====
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        Map<String, Long> counts = new LinkedHashMap<>();
        counts.put("rooms", roomDao.count());
        counts.put("food", foodDao.count());
        counts.put("products", productDao.count());
        counts.put("fruit_trees", fruitTreeDao.count());
        counts.put("plots", plotDao.count());
        counts.put("orders", orderDao.count());
        counts.put("users", userDao.count());
        stats.put("counts", counts);
        stats.put("pendingOrders", orderDao.countByField("status", "pending"));
        stats.put("todayRevenue", 0);
        return stats;
    }

    // ===== Menu =====
    public List<Menu> getAllMenus() {
        return menuDao.findAll().stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder() != null ? a.getSortOrder() : 0, b.getSortOrder() != null ? b.getSortOrder() : 0))
                .collect(Collectors.toList());
    }

    public List<Menu> getEnabledMenus() {
        return menuDao.findByField("isVisible", 1).stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder() != null ? a.getSortOrder() : 0, b.getSortOrder() != null ? b.getSortOrder() : 0))
                .collect(Collectors.toList());
    }

    public Menu getMenuById(Integer id) {
        return menuDao.findById(id).orElse(null);
    }

    public Menu saveMenu(Menu menu) {
        return menuDao.save(menu);
    }

    public void deleteMenu(Integer id) {
        roleMenuDao.deleteByMenuId(id);
        menuDao.deleteById(id);
    }

    public List<Menu> getMenusByRole(String role) {
        List<RoleMenu> roleMenus = roleMenuDao.findByRole(role);
        List<Integer> menuIds = roleMenus.stream().map(RoleMenu::getMenuId).collect(Collectors.toList());
        if (menuIds.isEmpty()) return new ArrayList<>();
        return menuDao.findAll().stream()
                .filter(m -> menuIds.contains(m.getId()) && (m.getIsVisible() == null || m.getIsVisible() == 1))
                .sorted((a, b) -> Integer.compare(a.getSortOrder() != null ? a.getSortOrder() : 0, b.getSortOrder() != null ? b.getSortOrder() : 0))
                .collect(Collectors.toList());
    }

    // ===== RoleMenu =====
    public List<RoleMenu> getRoleMenus(String role) {
        return roleMenuDao.findByRole(role);
    }

    public void saveRoleMenus(String role, List<Integer> menuIds) {
        roleMenuDao.deleteByRole(role);
        for (Integer menuId : menuIds) {
            RoleMenu rm = new RoleMenu();
            rm.setRole(role);
            rm.setMenuId(menuId);
            roleMenuDao.save(rm);
        }
    }

    // ===== Payment Records =====
    public PaymentRecord createPaymentRecord(PaymentRecord record) {
        return paymentRecordDao.save(record);
    }

    public PaymentRecord getPaymentRecordById(Integer id) {
        return paymentRecordDao.findById(id).orElse(null);
    }

    public PaymentRecord getPaymentByPaymentNo(String paymentNo) {
        return paymentRecordDao.findByPaymentNo(paymentNo);
    }

    public PaymentRecord getPaymentByOrderId(Integer orderId) {
        return paymentRecordDao.findByOrderId(orderId);
    }

    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordDao.findAll();
    }

    public PaymentRecord updatePaymentRecord(PaymentRecord record) {
        return paymentRecordDao.save(record);
    }

    public void updateOrder(Order order) {
        orderDao.save(order);
    }
}
