import '/imports/lib/collections/schemas/userData.js';
import userData from '/imports/server/userData/collections/userData.js';

console.log('\n\n*** Begin schema and collection hook tests ***\n');
const insertTest = userData.insert({testInsert:new Date()});
const insertTestCheck = userData.findOne({_id:insertTest});
if (insertTestCheck.createdAt) {
	console.log('\nInserted userData document Id '+insertTest+' -- schema check successful *not* using direct method, createdAt present.\n');
} else {
	console.log('** Insert Test failed - createdAt was not set by autovalue');
}
userData.update({_id:insertTest}, {$set:{testUpdate:new Date()}});
const updateTestCheck = userData.findOne({_id:insertTest});
if (updateTestCheck.updatedAt) {
	console.log('\nUpdated userData document Id '+insertTest+' -- schema check successful *not* using direct method, updatedAt present.\n');
} else {
	console.log('** Update Test failed - updatedAt was not set by autovalue');
}
const insertTest2 = userData.direct.insert({testInsert:new Date()});
const insertTestCheck2 = userData.findOne({_id:insertTest2});
if (insertTestCheck2.createdAt) {
	console.log('\nInserted userData document Id '+insertTest2+' -- schema check successful, createdAt present.\n');
} else {
	console.log('\nInserted userData document Id '+insertTest2+' using "direct" method -- schema check FAILED, createdAt NOT present.\n');
}
userData.direct.update({_id:insertTest}, {$set:{testUpdate:new Date()}});
const updateTestCheck2 = userData.findOne({_id:insertTest2});
if (updateTestCheck2.updatedAt) {
	console.log('\nUpdated userData document Id '+insertTest2+' -- schema check successful, updatedAt present.\n');
} else {
	console.log('\nUpdate of userData document Id '+insertTest2+' using "direct" method -- schema check FAILED, updatedAt NOT present.\n');
}
userData.remove({});
console.log('\n*** End Schema and collection hook tests ***\n');
