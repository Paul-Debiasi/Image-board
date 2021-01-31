var spicedPg = require('spiced-pg')
var db = spicedPg(
  process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/imageboard`
)

module.exports.imagesInfo = (title, description, username, url) => {
  return db.query(
    `INSERT INTO images (title, description, username, url)
		VALUES($1,$2,$3,$4)
		RETURNING *`,
    [title, description, username, url]
  )
}
module.exports.getImages = () => {
  return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`)
}
module.exports.getSingleImage = (id) => {
  return db.query(`SELECT * FROM images WHERE id = $1`, [id])
}
module.exports.addComments = (comment, username, imageId) => {
  return db.query(
    `INSERT INTO comments (comment, username, imageId) 
        VALUES ($1, $2, $3) 
        RETURNING *;
`,
    [comment, username, imageId]
  )
}
module.exports.getCommentId = (imageId) => {
  return db.query(
    `SELECT * FROM comments WHERE  imageid = $1 ORDER BY id DESC`,
    [imageId]
  )
}

module.exports.getMoreImages = (id) => {
  return db.query(
    `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId",
        (
        SELECT id FROM images
        ORDER BY id DESC
        LIMIT 1
        ) AS "highestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6;
`,
    [id]
  )
}
