import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  secondName: {type: String},
  email: {type: String},
  tel: {type: String},
  org: {type: String},
  createdAt: {type: Date},
});

const ImgSchema = new Schema({
  title: {type: String},
  number: {type: String},
  url: {type: String, required: true},
  createdAt: {type: Date},
});

const ImageSchema = new Schema({
  fieldname: {type: String, required: true},
  originalname: {type: String},
  encoding: {type: String},
  mimetype: {type: String},
  destination: {type: String},
  filename: {type: String},
  path: {type: String, required: true},
  size: {type: String, required: true},
  createdAt: {type: Date, default: new Date()},
});

const ItemSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  image: {type: String},
  deleted: {type: Boolean, default: false},
  expiriesDate: {type: Date, required: true},
  createdAt: {type: Date, default: new Date()},
  expiried: {type: Boolean, default: false},
});

mongoose.model('Img', ImgSchema);
mongoose.model('User', UserSchema);
mongoose.model('Item', ItemSchema);
mongoose.model('Image', ImageSchema);
