const EventEmitter = require('events');

class OrderEventEmitter extends EventEmitter {
  emitOrderChange(orderId, changeType, data) {
    this.emit('orderChange', {
      orderId,
      changeType, // 'created', 'updated', 'item_added', 'status_changed', etc.
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitOrderItemChange(orderItemId, orderId, changeType, data) {
    this.emit('orderItemChange', {
      orderItemId,
      orderId,
      changeType,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

// Singleton instance
const orderEventEmitter = new OrderEventEmitter();

module.exports = orderEventEmitter;
