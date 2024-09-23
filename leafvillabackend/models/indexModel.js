const pool = require('../config/db_connection');
// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
const errorLog = log4js.getLogger('error');
log4js.configure('./log.json');
class indexModels {
	// Find Featured Villa List
	async getFeaturedVillaList() {
		log.info('Fetch Featured Villa List');
		try {
			const connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT \
                    fv.villa_id, \
                    fv.villa_name, \
                    fv.villa_description, \
                    fv.villa_address, \
                    GROUP_CONCAT(i.image_name SEPARATOR ",") AS images \
                FROM \
                    tb_images i \
                JOIN \
                    tb_featured_villas fv \
                ON \
                    fv.villa_id = i.villa_id \
                GROUP BY \
                    fv.villa_id \
                ORDER BY \
                    fv.villa_id ASC',
			);
			pool.release(connection);

			// Post-process the results to convert the images string into an array
			results.forEach(result => {
				result.images = result.images ? result.images.split(',') : [];
			});

			return results;
		} catch (error) {
			log.error('Error fetching featured villa list: ', error);
			throw error;
		}
	}
	// check for user
	async login(username, password) {
		log.info('Login Details');
		try {
			const connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT * FROM tb_login WHERE username=? AND password=?',
				[username, password],
			);
			pool.release(connection);
			return results;
		} catch (error) {
			throw error;
		}
	}
	// insert villa into db
	async insertVilla(
		villaName,
		roomNo,
		guestNo,
		propertyDescription,
		location,
		petFriendly,
		privatePool,
		privateLawn,
		luxury,
		isVerified,
		amenities,
		houseRules,
		policies,
		services,
		nearbyAttractions,
	) {
		log.info('Index models: Insert villa into database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'INSERT INTO tb_featuredVillas (villaName, roomNo, guestNo, propertyDescription, location, petFriendly, privatePool, privateLawn, luxury, isVerified, amenities, houseRules, policies, services, nearbyAttractions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
				[
					villaName,
					roomNo,
					guestNo,
					propertyDescription,
					location,
					petFriendly,
					privatePool,
					privateLawn,
					luxury,
					isVerified,
					amenities,
					houseRules,
					policies,
					services,
					nearbyAttractions,
				],
			);
			return results;
		} catch (error) {
			errorLog.error('Error inserting villa into database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// insert villa into db
	async insertRegion(region) {
		log.info('Index models: Insert region into database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'INSERT INTO tb_region (region) VALUES (?);',
				[region],
			);
			return results;
		} catch (error) {
			errorLog.error('Error inserting region into database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// fetch villa count from db
	async fetchVillaCount() {
		log.info('Index models: Fetch villa count from database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT COUNT(*) AS count FROM tb_featuredVillas;',
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching count from database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// fetch villa by limit from db
	async fetchVillaByLimit(limit, offset) {
		log.info(
			'Index models: Fetching villas with limit and offset from database',
		);
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT villaName,villaId FROM tb_featuredVillas LIMIT ? OFFSET ?;',
				[limit, offset],
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching villas  from database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// insert banner image into db
	async insertBannerImage(fileName) {
		log.info('Index models: Insert banner image into database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'INSERT INTO tb_bannerImages (bannerImage) VALUES (?);',
				[fileName],
			);
			return results;
		} catch (error) {
			errorLog.error('Error inserting banner image into database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
}
module.exports = indexModels;
