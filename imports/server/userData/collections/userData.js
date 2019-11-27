import userData from '/imports/lib/collections/userData.js';

userData.allow({
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

export default userData;
