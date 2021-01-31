DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
     id SERIAL PRIMARY KEY,
     comment TEXT NOT NULL, 
     username TEXT NOT NULL, 
     imageid INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
     time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
--     'funkychicken',
--     'Welcome to Spiced and the Future!',
--     'This photo brings back so many great memories.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
--     'discoduck',
--     'Elvis',
--     'We can''t go on together with suspicious minds.'
-- );

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
--     'discoduck',
--     'To be or not to be',
--     'That is the question.'
-- );
