const pool = require("../config/db_connection");
// configure log
var log4js = require("log4js");
var log = log4js.getLogger();
log4js.configure("./log.json");
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
                    fv.villa_id ASC'
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


    async login(username, password) {
        log.info("Login Details");
        try {
            const connection = await pool.acquire();
            const [results] = await connection.query(
                "SELECT * FROM tb_login WHERE username=? AND password=?",
                [username, password]
            );
            pool.release(connection);
            return results;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = indexModels;