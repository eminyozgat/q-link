const menuModel = require('../models/menuModel');

async function getMenu(req, res, next) {
  try {
    const [items, categories] = await Promise.all([
      menuModel.getActiveItems(),
      menuModel.getAllCategories()
    ]);
    res.json({ items, categories });
  } catch (e) { next(e); }
}

async function getMenuItem(req, res, next) {
  try {
    const item = await menuModel.getItemById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Ürün bulunamadı' });
    res.json(item);
  } catch (e) { next(e); }
}

async function createMenuItem(req, res, next) {
  try {
    const { name, price, categoryName, estimatedServiceMinutes, description, imageUrl } = req.body;
    if (!name || !price || !categoryName || !estimatedServiceMinutes) {
      return res.status(400).json({ error: 'Ad, fiyat, kategori ve tahmini süre zorunlu' });
    }
    let category = await menuModel.getCategoryByName(categoryName.trim());
    if (!category) category = await menuModel.createCategory(categoryName.trim());
    const item = await menuModel.createItem({
      categoryId:               category.id,
      name,
      price:                    Math.round(Number(price) * 100) / 100,
      description,
      imageUrl,
      estimatedServiceMinutes:  Math.round(Number(estimatedServiceMinutes))
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
}

async function updateMenuItem(req, res, next) {
  try {
    const { name, price, categoryName, estimatedServiceMinutes, description, imageUrl } = req.body;
    if (!name || !price || !categoryName) {
      return res.status(400).json({ error: 'Ad, fiyat ve kategori zorunlu' });
    }
    let category = await menuModel.getCategoryByName(categoryName.trim());
    if (!category) category = await menuModel.createCategory(categoryName.trim());
    const item = await menuModel.updateItem(Number(req.params.id), {
      categoryId:              category.id,
      name,
      price:                   Math.round(Number(price) * 100) / 100,
      description,
      imageUrl,
      estimatedServiceMinutes: estimatedServiceMinutes ? Math.round(Number(estimatedServiceMinutes)) : null
    });
    res.json(item);
  } catch (e) { next(e); }
}

async function deleteMenuItem(req, res, next) {
  try {
    await menuModel.deactivateItem(Number(req.params.id));
    res.json({ success: true });
  } catch (e) { next(e); }
}

async function getCategories(req, res, next) {
  try {
    res.json(await menuModel.getAllCategories());
  } catch (e) { next(e); }
}

async function createCategory(req, res, next) {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Kategori adı zorunlu' });
    if (await menuModel.getCategoryByName(name)) {
      return res.status(409).json({ error: 'Kategori zaten var' });
    }
    res.status(201).json(await menuModel.createCategory(name));
  } catch (e) { next(e); }
}

async function updateCategory(req, res, next) {
  try {
    const id      = Number(req.params.id);
    const newName = (req.body.name || '').trim();
    if (!newName) return res.status(400).json({ error: 'Kategori adı zorunlu' });
    const existing = await menuModel.getCategoryById(id);
    if (!existing) return res.status(404).json({ error: 'Kategori bulunamadı' });
    const duplicate = await menuModel.getCategoryByName(newName);
    if (duplicate && duplicate.id !== id) {
      return res.status(409).json({ error: 'Bu isimde kategori zaten var' });
    }
    await menuModel.updateCategory(id, newName);
    res.json({ id, name: newName });
  } catch (e) { next(e); }
}

async function deleteCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await menuModel.getCategoryById(id);
    if (!existing) return res.status(404).json({ error: 'Kategori bulunamadı' });
    await menuModel.deleteCategoryById(id);
    res.json({ success: true });
  } catch (e) { next(e); }
}

module.exports = {
  getMenu, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem,
  getCategories, createCategory, updateCategory, deleteCategory
};
