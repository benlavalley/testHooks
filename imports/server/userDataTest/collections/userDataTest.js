import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const userDataTest = new Mongo.Collection('userdata');

const userDataSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		autoValue() {
			const value = this.isInsert && new Date() || this.isUpsert && { $setOnInsert: new Date() };
			if (value) {
				console.log('SimpleSchema - createdAt autovalue function processing for insert operation...');
				return value;
			}
			return this.unset();
		},
	},
	updatedAt: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isUpdate) {
				console.log('SimpleSchema - updatedAt autovalue function processing for update operation...');
				return new Date();
			}
			return this.unset();
		},
	},
});

userDataTest.attachSchema(userDataSchema);

userDataTest.allow({
	insert(userId, doc) {
		console.log('allowing insert for userId '+userId+' on docId '+doc._id);
		return true;
	},
	update(userId, doc, fields, modifier) {
		console.log('allowing update for userId '+userId+' on docId '+doc._id);
		return true;
	},
	remove(userId, doc) {
		console.log('allowing remove for userId '+userId+' on docId '+doc._id);
		return true;
	},
});


export default userDataTest;
