package com.staryu.controller;

import com.staryu.entity.Order;
import com.staryu.entity.PaymentRecord;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private BusinessService service;

    // ===== 创建支付（选择支付方式并发起支付） =====
    @PostMapping("/create")
    public Map<String, Object> createPayment(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            Integer orderId = body.get("orderId") != null ? Integer.valueOf(body.get("orderId").toString()) : null;
            String payMethod = (String) body.get("payMethod"); // wechat / alipay

            if (orderId == null || payMethod == null) {
                result.put("error", "缺少必要参数: orderId, payMethod");
                return result;
            }
            if (!"wechat".equals(payMethod) && !"alipay".equals(payMethod)) {
                result.put("error", "不支持的支付方式，仅支持 wechat/alipay");
                return result;
            }

            Order order = service.getOrderById(orderId);
            if (order == null) {
                result.put("error", "订单不存在");
                return result;
            }
            if ("paid".equals(order.getStatus()) || "completed".equals(order.getStatus())) {
                result.put("error", "订单已支付，无需重复支付");
                return result;
            }

            // 检查是否已有待支付的支付记录
            PaymentRecord existing = service.getPaymentByOrderId(orderId);
            if (existing != null && "pending".equals(existing.getStatus())) {
                result.put("data", existing);
                result.put("paymentNo", existing.getPaymentNo());
                return result;
            }

            // 创建支付记录
            PaymentRecord record = new PaymentRecord();
            record.setPaymentNo(generatePaymentNo(payMethod));
            record.setOrderId(orderId);
            record.setOrderNo(order.getOrderNo());
            record.setUserId(order.getUserId());
            record.setPayMethod(payMethod);
            record.setAmount(order.getTotalPrice() != null ? order.getTotalPrice() : order.getTotalAmount());
            record.setStatus("pending");

            PaymentRecord saved = service.createPaymentRecord(record);

            // 更新订单支付方式
            order.setPayMethod(payMethod);
            service.updateOrder(order);

            result.put("data", saved);
            result.put("paymentNo", saved.getPaymentNo());
        } catch (Exception e) {
            result.put("error", "创建支付失败: " + e.getMessage());
        }
        return result;
    }

    // ===== 模拟支付（开发环境使用，模拟支付成功） =====
    @PostMapping("/simulate-pay")
    public Map<String, Object> simulatePay(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String paymentNo = (String) body.get("paymentNo");
            if (paymentNo == null) {
                result.put("error", "缺少必要参数: paymentNo");
                return result;
            }

            PaymentRecord record = service.getPaymentByPaymentNo(paymentNo);
            if (record == null) {
                result.put("error", "支付记录不存在");
                return result;
            }
            if ("success".equals(record.getStatus())) {
                result.put("error", "已支付成功，请勿重复支付");
                return result;
            }

            // 模拟支付成功
            record.setStatus("success");
            record.setTransactionId("SIM_" + record.getPayMethod().toUpperCase() + "_" + System.currentTimeMillis());
            record.setPaidAt(LocalDateTime.now());
            record.setCallbackData("{\"simulate\":true,\"method\":\"" + record.getPayMethod() + "\"}");
            service.updatePaymentRecord(record);

            // 更新订单状态为已支付
            Order order = service.getOrderById(record.getOrderId());
            if (order != null) {
                order.setStatus("paid");
                order.setPayMethod(record.getPayMethod());
                order.setPaidAt(LocalDateTime.now());
                service.updateOrder(order);
            }

            result.put("data", record);
            result.put("success", true);
        } catch (Exception e) {
            result.put("error", "支付失败: " + e.getMessage());
        }
        return result;
    }

    // ===== 微信支付回调（生产环境由微信服务器调用） =====
    @PostMapping("/callback/wechat")
    public String wechatCallback(@RequestBody String xmlData) {
        try {
            // 生产环境: 解析微信支付回调XML，验签，更新支付状态
            // 开发环境: 此接口预留，实际使用 simulate-pay
            return "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        } catch (Exception e) {
            return "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[" + e.getMessage() + "]]></return_msg></xml>";
        }
    }

    // ===== 支付宝回调（生产环境由支付宝服务器调用） =====
    @PostMapping("/callback/alipay")
    public String alipayCallback(@RequestBody String formData) {
        try {
            // 生产环境: 验证支付宝签名，更新支付状态
            // 开发环境: 此接口预留，实际使用 simulate-pay
            return "success";
        } catch (Exception e) {
            return "fail";
        }
    }

    // ===== 查询支付状态 =====
    @GetMapping("/status/{paymentNo}")
    public Map<String, Object> getPaymentStatus(@PathVariable String paymentNo) {
        Map<String, Object> result = new LinkedHashMap<>();
        PaymentRecord record = service.getPaymentByPaymentNo(paymentNo);
        if (record != null) {
            result.put("data", record);
        } else {
            result.put("error", "支付记录不存在");
        }
        return result;
    }

    // ===== 查询订单的支付记录 =====
    @GetMapping("/order/{orderId}")
    public Map<String, Object> getByOrderId(@PathVariable Integer orderId) {
        Map<String, Object> result = new LinkedHashMap<>();
        PaymentRecord record = service.getPaymentByOrderId(orderId);
        if (record != null) {
            result.put("data", record);
        } else {
            result.put("data", null);
        }
        return result;
    }

    // ===== 支付记录列表（管理后台用） =====
    @GetMapping("/list")
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                     @RequestParam(required = false) String payMethod) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<PaymentRecord> records = service.getAllPaymentRecords();
        if (status != null) {
            records = records.stream().filter(r -> status.equals(r.getStatus())).toList();
        }
        if (payMethod != null) {
            records = records.stream().filter(r -> payMethod.equals(r.getPayMethod())).toList();
        }
        result.put("data", records);
        result.put("total", records.size());
        return result;
    }

    // ===== 支付统计（管理后台用） =====
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<PaymentRecord> records = service.getAllPaymentRecords();
        
        long totalPayments = records.size();
        long successCount = records.stream().filter(r -> "success".equals(r.getStatus())).count();
        long refundedCount = records.stream().filter(r -> "refunded".equals(r.getStatus())).count();
        long wechatCount = records.stream().filter(r -> "wechat".equals(r.getPayMethod())).count();
        long alipayCount = records.stream().filter(r -> "alipay".equals(r.getPayMethod())).count();
        double totalAmount = records.stream()
                .filter(r -> "success".equals(r.getStatus()))
                .mapToDouble(r -> r.getAmount().doubleValue())
                .sum();
        
        Map<String, Object> statsData = new LinkedHashMap<>();
        statsData.put("totalPayments", totalPayments);
        statsData.put("successCount", successCount);
        statsData.put("refundedCount", refundedCount);
        statsData.put("wechatCount", wechatCount);
        statsData.put("alipayCount", alipayCount);
        statsData.put("totalAmount", totalAmount);
        result.put("data", statsData);
        return result;
    }

    // ===== 申请退款 =====
    @PostMapping("/refund/{id}")
    public Map<String, Object> refund(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            PaymentRecord record = service.getPaymentRecordById(id);
            if (record == null) {
                result.put("error", "支付记录不存在");
                return result;
            }
            if (!"success".equals(record.getStatus())) {
                result.put("error", "仅可对支付成功的记录进行退款");
                return result;
            }

            record.setStatus("refunded");
            service.updatePaymentRecord(record);

            // 更新订单状态
            Order order = service.getOrderById(record.getOrderId());
            if (order != null) {
                order.setStatus("cancelled");
                service.updateOrder(order);
            }

            result.put("data", record);
            result.put("success", true);
        } catch (Exception e) {
            result.put("error", "退款失败: " + e.getMessage());
        }
        return result;
    }

    private String generatePaymentNo(String payMethod) {
        String prefix = "wechat".equals(payMethod) ? "WX" : "AL";
        return prefix + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%04d", new Random().nextInt(10000));
    }
}
