import mongoose from 'mongoose';
import config from '../../etc/config.json';
import '../models/Model';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Image = mongoose.model('Image');

/**
 * Установка соединения с базой
 */
export function setUpConnection() {
  mongoose.connect(`mongodb://${config.db.username}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`);
}

/**
 * Поиск юзеров по username
 * @param {int} name - username
 * @return {Array} - массив пользователей
 */
export function getUserByUserName(name) {
  if (name) {
    return User.find({name}).sort('createdAt');
  }
  return null;
}

/**
 * Поиск всех юзеров в базе
 * @param {int} page - страница выдачи
 * @return {Array} - массив пользователей
 */
export function listUsers(page = 0) {
  // номер страницы с 0
  let items;
  if (page !== undefined) {
    items = page * 10;
  } else {
    items = 0;
  }

  return User.find().sort('createdAt').skip(items).limit(10);
}

/**
 * Сохранение пользователя
 * @param {object} data - Объект с данными юзера по схеме User
 * @return {object} - Объект с данными юзера по схеме User
 */
export async function createUser(data) {
  const findOtherUsersWithThisUserName = await getUserByUserName(data.name);
  if (Array.isArray(findOtherUsersWithThisUserName) && findOtherUsersWithThisUserName.length > 0) {
    return {error: {code: 409, message: 'User already exists'}};
  }
  const hash = await bcrypt.hash(data.password, saltRounds);
  const user = new User({
    name: data.name,
    number: data.number,
    password: hash,
    secondName: data.secondName,
    email: data.email,
    tel: data.tel,
    org: data.org,
    createdAt: new Date(),
  });
  return user.save();
}

/**
 * Поиск картинки по id
 * @param {string} id - Image id
 * @return {object} - Image object
 */
export function getImage(id) {
  return Image.findOne({_id: id});
}

/**
 * Поиск всех картинок
 * @param {int} page - страница выдачи
 * @return {Array} - массив Image
 */
export function listImages(page = 0) {
  const images = page * 10;

  return Image.find().sort('createdAt').skip(images).limit(10);
}

/**
 * Сохранение новой картинки
 * @param {object} file - Объект с данными по схеме Image
 * @return {object} - Объект с данными по схеме Image
 */
export function createImage(file) {
  const newImage = new Image({
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    destination: file.destination,
    filename: file.filename,
    path: file.path,
    size: file.size,
    createdAt: new Date(),
  });
  return newImage.save();
}

/**
 * Обновление объекта картинки
 * @param {string} id - Image id
 * @param {object} params - Объект с данными по схеме Image
 * @return {object} - Объект с данными по схеме Image
 */
export function updateImage(id, params) {
  return Image.findOneAndUpdate({_id: id}, {$set: params}, {new: true});
}

/**
 * Поиск всех юзеров в базе
 * @param {int} page - страница выдачи
 * @param {object} expiried - expiried params
 * @return {Array} - массив Image
 */
export function listItems(page = 0, expiried) {
  const item = page * 10;
  const expiredValue = expiried ? {'expiried': expiried, 'deleted': false} : {'deleted': false};
  return Item.find(expiredValue).sort('createdAt').skip(item).limit(10);
}

/**
 * Поиск всех юзеров в базе
 * @param {string} id - Item id
 * @return {object} - Item object
 */
export function getItems(id) {
  return Item.findOne({_id: id});
}

/**
 * Поиск всех юзеров в базе
 * @param {object} data - Объект с данными по схеме Item
 * @return {object} - Объект с данными по схеме Item
 */
export function createItems(data) {
  const item = new Item({
    title: data.title,
    description: data.description,
    deleted: data.deleted,
    expiriesDate: data.expiriesDate,
    image: data.image,
  });
  return item.save();
}

/**
 * Обновление Item
 * @param {string} id - страница выдачи
 * @param {object} params - обновляемые параметры
 * @return {object} - обновленный объект
 */
export function updateItems(id, params) {
  return Item.findOneAndUpdate({_id: id}, {$set: params}, {new: true});
}

/**
 * Проверка на expired
 * @return {Array} - Массив с expired items
 */
export async function checkExpired() {
  return listItems()
      .then(
          (data) => {
            const filterItems = data.filter((item) => {
              const newDate = new Date(item.expiriesDate);
              newDate.setMonth(newDate.getMonth() - 3); // минус три месяца на реализацию
              return newDate < new Date();
            });
            return filterItems;
          },
      )
      .catch(
          (err) => err,
      );
}
