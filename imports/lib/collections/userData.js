import { Mongo } from 'meteor/mongo';

const userData = new Mongo.Collection('userdata');

export default userData;
