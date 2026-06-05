package com.staryu.dao;

import com.staryu.entity.PaymentRecord;
import org.springframework.stereotype.Repository;

@Repository
public class PaymentRecordDao extends BaseDao<PaymentRecord, Integer> {

    public PaymentRecordDao() {
        super(PaymentRecord.class);
    }

    public PaymentRecord findByPaymentNo(String paymentNo) {
        return findByField("paymentNo", paymentNo).stream().findFirst().orElse(null);
    }

    public PaymentRecord findByOrderId(Integer orderId) {
        return findByField("orderId", orderId).stream().findFirst().orElse(null);
    }
}
