const pool = require('../config/dbConnection');
// configure log
var log4js = require('log4js');
var log = log4js.getLogger('indexModels');
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
		log.info('indexModels:Fetch user details from db');
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
		log.info('indexModels: Insert villa into database');
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
		log.info('indexModels: Insert region into database');
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
		log.info('indexModels: Fetch villa count from database');
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
	// search villa count from db
	async searchVillaCount(villa) {
		log.info('indexModels: Search villa count from database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT COUNT(*) AS count FROM tb_featuredVillas WHERE villaName LIKE ?;',
				[villa],
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching search count from database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// region  count from db
	async fetchRegionCount() {
		log.info('indexModels: Region count from database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT COUNT(*) AS count FROM tb_region ;',
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching region count from database', error);
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
			'indexModels: Fetching villas with limit and offset from database',
		);
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT villaName,villaId FROM tb_featuredVillas ORDER BY villaId DESC LIMIT ? OFFSET ?;',
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
	// search villa by limit from db
	async searchVillaByLimit(villa, limit, offset) {
		log.info(
			'indexModels: Fetching villas with limit and offset from database',
		);
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT villaName,villaId FROM tb_featuredVillas  WHERE villaName LIKE ? ORDER BY villaId DESC LIMIT ? OFFSET ?;',
				[villa, limit, offset],
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
	//  region by limit from db
	async fetchRegionByLimit(limit, offset) {
		log.info(
			'indexModels: Fetching region with limit and offset from database',
		);
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT id,region FROM tb_region ORDER BY id DESC LIMIT ? OFFSET ?;',
				[limit, offset],
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching region  from database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
	// insert banner image into db
	async insertBannerImage(fileName) {
		log.info('indexModels: Insert banner image into database');
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
	// get banner image from db
	async fetchBannerImage() {
		log.info('indexModels: Get banner image from database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT id,bannerImage FROM tb_bannerImages;',
			);
			return results;
		} catch (error) {
			errorLog.error('Error fetching banner images from database', error);
			throw error;
		} finally {
			if (connection) {
				pool.release(connection);
			}
		}
	}
}
module.exports = indexModels;
