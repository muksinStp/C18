CREATE TABLE jurusan(
    id_jurusan CHARACTER (4) PRIMARY KEY NOT NULL, 
    name_jurusan VARCHAR (50) NOT NULL 
    );
INSERT INTO jurusan VALUES
('J001','Fabrikasi Logam'),
('J002','Listrik Tenaga'),
('J003','Elektronika'),
('J004','Mekatronika'),
('J005','Otomotif'),
('J006','Informatika'),
('J007','Alat Berat'),
('J008','Gambar Bangunan'),
('J009','Arsitek'),
('J010','Teknik Metalurgi');


CREATE TABLE dosen(
    nip character(5) primary key not null, 
    name_dosen varchar(50) not NULL
);
INSERT INTO dosen VALUES
('D2201','Rubi'),
('D2202','Wildan'),
('D2203','Rizky'),
('D2204','Hilmi'),
('D2205','Bambang');


CREATE TABLE mahasiswa(
    nim CHARACTER(10) PRIMARY KEY NOT NULL,
    name_mahasiswa VARCHAR(50) NOT NULL, 
    tanggal_lahir DATE,
    alamat TEXT(100),
    id_jurusan CHARACTER(3),
    FOREIGN KEY(id_jurusan) REFERENCES jurusan(id_jurusan)
    );

INSERT INTO mahasiswa VALUES
('2022070001','Abaz','2002-09-12','Semarang','J001'),
('2022070002','Faisal','2021-11-30','Medan','J002'),
('2022070003','Lutfi','2000-12-23','Bali','J003'),
('2022070004','Dimas','1999-08-11','Surabaya','J004'),
('2022070005','Ikhsan','2000-01-29','Balikpapan','J005'),
('2022070006','Eril','2001-02-17','Makasar','J006'),
('2022070007','zafran','2001-06-01','Bandung','J007'),
('2022070008','Emir','2000-10-10','Cianjur','J009'),
('2022070009','Zakka','1998-12-07','Lampung','J010'),
('2022070010','Agung','2002-09-13','Bandung','J003');

CREATE TABLE mata_kuliah(
    id_mata_kuliah character(4) primary key not null, 
    name_mata_kuliah varchar(100), 
    sks INT NOT NULL
    );
INSERT INTO mata_kuliah VALUES
('MK01','Data Mining',4),
('MK02','Basic',4),
('MK03','Kerja Bengkel',4),
('MK04','Matematika',3),
('MK05','Bahasa Inggris',3);


CREATE TABLE kontrak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nim CHARACTER(10) NOT NULL,
    id_mata_kuliah CHARACTER(4) NOT NULL,
    nip CHARACTER (5) NOT NULL,
    nilai VARCHAR(3),
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim),
    FOREIGN KEY (id_mata_kuliah) REFERENCES mata_kuliah(id_mata_kuliah),
    FOREIGN KEY(nip) REFERENCES dosen(nip)
);

INSERT INTO kontrak (nim, id_mata_kuliah, nip,nilai) VALUES
('2022070001','MK01','D2201','C'),
('2022070002','MK01','D2201','A+'),
('2022070003','MK04','D2204','B'),
('2022070004','MK02','D2202','B+'),
('2022070010','MK03','D2205','A++'),
('2022070009','MK04','D2204','B+'),
('2022070008','MK01','D2203','A'),
('2022070007','MK05','D2202','B+'),
('2022070006','MK04','D2204','C+'),
('2022070005','MK01','D2203','A'),
('2022070001','MK02','D2202','A');


