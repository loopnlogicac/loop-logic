SELECT COUNT(*) AS rows_found, SUM(amount_bdt) AS total_bdt,
    COALESCE(SUM(amount_bdt), 0.00) AS display_bdt
FROM payments WHERE order_id = 203;
