SELECT exchange_time, exchange_date
FROM MessageExchange
WHERE message_id = @message_id;
