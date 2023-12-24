# jaybhagavati-be

For Exporting database from offline database
mongodump -d database_name -o directory_to_store_dumps

For importing data from database use the following command mongorestore -d myfirstdb ./mongo-backup-new/myFirstDatabase


For Exporting database from online database
mongodump --uri "mongodb+srv://Admin:MYPASS@appcluster.15lf4.mongodb.net/mytestdb" -o ./mongo-backup

For Importing database from online database
mongorestore --uri "mongodb+srv://Admin:MYPASS@appcluster.15lf4.mongodb.net/mytestdb" ./mongo-backup/mytestdb
