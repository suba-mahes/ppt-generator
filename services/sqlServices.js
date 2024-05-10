const sql_connection = require("../model/connection_db.js");

module.exports.getImageURL = (ids) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT image_url FROM contentfileimage WHERE content IN (${ids})`;
    //const sqlQuery = `SELECT image_url FROM contentfileimage`;
    sql_connection.query(sqlQuery,
      (err, results) => {
        if (err) {
          console.error(err);
          reject("Oops! Something went wrong. Please try again later");
        } else {
          //console.log(results);
          const imageURLs = results.map((result) => result.image_url);
          resolve(imageURLs);
        }
      }
    );
  });
};
