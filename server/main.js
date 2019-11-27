import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const userDataTest = new Mongo.Collection('userdatatest');


userDataTest.after.update(function (userId, doc, fieldNames, modifier) {
	console.log('userDataTest.after.update hook!');
}, { fetchPrevious: false });


const userDataSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		// denyUpdate: true,
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
		// denyInsert: true,
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

let failed;

console.log('\n\n*** Begin schema and collection hook tests ***\n');
const insertTest = userDataTest.insert({testInsert:new Date()});
const insertTestCheck = userDataTest.findOne({_id:insertTest});
if (insertTestCheck.createdAt) {
	console.log('\nInserted userDataTest document Id '+insertTest+' -- schema check successful *not* using direct method, createdAt present.\n');
} else {
	console.log('\nInserted userDataTest document Id '+insertTest+' -- schema check FAILED *not* using direct method, createdAt is not present (shouldnt happen!)\n');
}
userDataTest.update({_id:insertTest}, {$set:{testUpdate:new Date()}});
const updateTestCheck = userDataTest.findOne({_id:insertTest});
if (updateTestCheck.updatedAt) {
	console.log('\nUpdated userDataTest document Id '+insertTest+' -- schema check successful *not* using direct method, updatedAt present.\n');
} else {
	console.log('\nUpdated userDataTest document Id '+insertTest+' -- schema check FAILED *not* using direct method, updatedAt NOT present (shouldnt ever happen!).\n');
}
const insertTest2 = userDataTest.direct.insert({testInsert2:new Date()});
const insertTestCheck2 = userDataTest.findOne({_id:insertTest2});
if (insertTestCheck2.createdAt) {
	console.log('\nInserted userDataTest document Id '+insertTest2+' using "direct" method -- schema check successful, createdAt is present.\n');
} else {
	failed = true;
	console.log('\nInserted userDataTest document Id '+insertTest2+' using "direct" method -- schema check FAILED, createdAt NOT present.\n');
}
userDataTest.direct.update({_id:insertTest2}, {$set:{testUpdate2:new Date()}});
const updateTestCheck2 = userDataTest.findOne({_id:insertTest2});
if (updateTestCheck2.updatedAt) {
	console.log('\nUpdate of userDataTest document Id '+insertTest2+' using "direct" method -- schema check successful, updatedAt is present.\n');
} else {
	failed = true;
	console.log('\nUpdate of userDataTest document Id '+insertTest2+' using "direct" method -- schema check FAILED, updatedAt NOT present.\n');
}
if (failed) {
	console.log('\nIf you now swap the order of packages in .meteor/packackages so that "aldeed:collection2" loads BEFORE "matb33:collection-hooks" you should find running the app now succeeds.\n')
} else {
	console.log('\nIf you now swap the order of packages in .meteor/packackages so that "aldeed:collection2" loads AFTER "matb33:collection-hooks" you should find running the app FAILS.\n')
}
userDataTest.remove({});
console.log('\n*** End Schema and collection hook tests ***\n');
