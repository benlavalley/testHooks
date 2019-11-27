import userData from '/imports/lib/collections/userData.js';
import SimpleSchema from 'simpl-schema';

const userDataSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		denyUpdate: true,
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
		denyInsert: true,
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

userData.attachSchema(userDataSchema);
