const Order = require('../models/Order');
const {User} = require('../SQLmodels/users')
exports.createOrder = async (req, res) => {
  try {
    const { price, state, notif_res, notif_cli, notif_del, Menu, Article, Client, Restaurateur, Delivery } = req.body;

    const order = new Order({
      price,
      state,
      notif_res,
      notif_cli,
      notif_del,
      Menu: Menu.map(menu => ({ menuId: menu.menuId, quantity: menu.quantity })),
      Article: Article.map(article => ({ articleId: article.articleId, quantity: article.quantity })),
      Client,
      Restaurateur,
      Delivery
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('Menu')
      .populate({
        path: 'Menu',
        populate: {
          path: 'Article',
        },
      })
      .populate('Article')
      .populate('Client')
      .populate('Restaurateur')
      .populate('Delivery');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getOrderUser = async (req, res) => {
  try {
    const orders = await Order.find().populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Delivery');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Delivery');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { price, state, notif_res, notif_cli, notif_del, Menu, Article, Client, Restaurateur, Delivery } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        price,
        state,
        notif_res,
        notif_cli,
        notif_del,
        Menu: Menu.map(menu => ({ menuId: menu.menuId, quantity: menu.quantity })),
        Article: Article.map(article => ({ articleId: article.articleId, quantity: article.quantity })),
        Client,
        Restaurateur,
        Delivery
      },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
