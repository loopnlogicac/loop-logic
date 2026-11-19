CREATE TABLE buildings (building_id INT PRIMARY KEY, building_name VARCHAR(40) NOT NULL);
CREATE TABLE rooms (
    building_id INT NOT NULL,
    room_number INT NOT NULL,
    seats INT NOT NULL,
    PRIMARY KEY (building_id, room_number),
    FOREIGN KEY (building_id) REFERENCES buildings(building_id)
);
INSERT INTO buildings VALUES (1, 'Academic East'), (2, 'Academic West');
INSERT INTO rooms VALUES (1, 101, 40), (2, 101, 30);
SELECT building_id, room_number, seats FROM rooms ORDER BY building_id, room_number;
