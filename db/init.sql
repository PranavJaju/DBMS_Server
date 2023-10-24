
create table users(
    user_id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	mobile_number VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL,
    otp VARCHAR(1000),
    blood VARCHAR(6),
    gender VARCHAR(1),
    medical_issue varchar(1000),
    dob Date,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
)

create table donation(
    id int GENERATED ALWAYS AS IDENTITY UNIQUE,
    fk_user int,
    blood varchar(6),
    donation_date Date,
    quantity NUMERIC(10, 2),
    hospital VARCHAR(1000),
    is_available BOOLEAN,
    CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(user_id) ON DELETE CASCADE
)

create table receive(
    fk_user int,
    receive_date Date,
    hospital VARCHAR(1000),
    quantity NUMERIC(10, 2),
    CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(user_id) ON DELETE CASCADE
)


create table transaction(
    donar_id int,
    receiver_id int,
    blood varchar(6),
    quantity NUMERIC(10, 2),
    created_at TIMESTAMP NOT NULL
    CONSTRAINT donar_id FOREIGN KEY(donar_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT receiver_id  FOREIGN KEY(receiver_id ) REFERENCES user(user_id) ON DELETE CASCADE
);

create table user_token(
    id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	token VARCHAR(255) NOT NULL,
	is_valid BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	fk_user INT,
	CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(user_id) ON DELETE CASCADE
)