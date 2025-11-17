-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2024 at 11:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carshowroommanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `BillingID` int(11) NOT NULL,
  `SalesOrderID` int(11) DEFAULT NULL,
  `BillingDate` date NOT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaymentStatus` enum('Paid','Unpaid') DEFAULT 'Unpaid',
  `serviceID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`BillingID`, `SalesOrderID`, `BillingDate`, `TotalAmount`, `PaymentStatus`, `serviceID`) VALUES
(16, 14, '2024-01-02', 175000.00, 'Paid', 17),
(17, 15, '2024-01-02', 30000.00, 'Paid', 18),
(18, 16, '2024-01-03', 151500.00, 'Paid', 19);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `BrandID` int(11) NOT NULL,
  `BrandName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`BrandID`, `BrandName`) VALUES
(3, 'Honda'),
(4, 'Hyundai'),
(2, 'Mercedes'),
(1, 'Toyota');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `FirstName`, `LastName`, `ContactNumber`, `Email`, `Address`) VALUES
(5, 'Phong', 'Đinh', '0987654321', 'phong@gmail.com', '285 Doi Can1'),
(6, 'Tuấn', 'Trần', '0123456789', 'tuan@gmail.com', '301 DBP'),
(7, 'Tuấn', 'Tú', '01472583698', 'tuantu@gmail.com', 'Ba Đình'),
(8, 'An ', 'Đỗ', '0321654987', 'ando@gmail.com', 'Sai Dong Long Bien'),
(17, 'Test', 'a', '0123456789', 'test@gmail.com', '312');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DateOfJoining` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeID`, `FirstName`, `LastName`, `ContactNumber`, `Email`, `DateOfJoining`) VALUES
(5, 'Tuấn ', 'Khỉ', '0123456789', 'tuan@gmail.com', '2024-10-01'),
(6, 'Long', 'Tròn', '0147258369', 'long@gmail.com', '2023-01-01'),
(7, 'An', 'Long Biên', '0258147369', 'an@gmail.com', '2023-01-01'),
(8, 'Phong', 'Ba', '0987654321', 'phong@gmail.com', '2023-01-01'),
(11, 'Test', '2', '123456789', 'tuan@gmail.com', '2024-10-14');

-- --------------------------------------------------------

--
-- Table structure for table `header`
--

CREATE TABLE `header` (
  `id` int(11) NOT NULL,
  `imgBanner` longtext NOT NULL,
  `Tile` varchar(1000) NOT NULL,
  `status` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `header`
--

INSERT INTO `header` (`id`, `imgBanner`, `Tile`, `status`) VALUES
(1, 'Uploads\\36e3e95d-0cd0-4e01-b196-875f54b01110.jpeg', 'Mercedes', 'Mercedes-Benz, commonly referred to simply as Mercedes and occasionally as Benz, is a German luxury and commercial vehicle brand that was founded in 1926'),
(2, 'Uploads\\2bd882b9-187b-4895-8b9b-0d850e65fa14.jpg', 'Hyundai', 'Hyundai America began selling cars in the United States on 20 February 1986.'),
(3, 'Uploads\\2bc4bfdc-d08a-489a-9b5d-697e2261f8d1.png', 'Honda', 'Honda is the worlds largest motorcycle manufacturer since 1959.');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`RoleID`, `RoleName`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `ServiceID` int(11) NOT NULL,
  `SalesOrderID` int(11) DEFAULT NULL,
  `ServiceType` varchar(50) DEFAULT NULL,
  `ServiceDate` date DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Cost` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`ServiceID`, `SalesOrderID`, `ServiceType`, `ServiceDate`, `Description`, `Cost`) VALUES
(17, 14, 'Cleaning the car ', '2024-01-02', 'All cars ', 0.00),
(18, 15, 'All cars ', '2024-01-02', 'Cleaning the car ', 0.00),
(19, 16, 'All cars ', '2024-01-03', 'Cleaning the car ', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Fullname` varchar(255) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `IsApproved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Fullname`, `Username`, `Password`, `RoleID`, `IsApproved`) VALUES
(20, 'An', 'admin1', '$2a$11$liTQPUFdsq6l.N0ZJO9lt.1kxKad/wXTrivCof2fcCTPvW/L1GRmi', 1, 1),
(21, 'Long', 'admin2', '$2a$11$PlM6Hkqi0uCpzpR.YY9r0eyAZya8NnRWgrS7boQfaQ0rV5zCm6Ls2', 1, 1),
(22, 'Phong', 'admin3', '$2a$11$UCVA.jnN7T6HUcOxwd3M1.b2yXpani9UPKYvkTQ.GMn5FrnFnH13O', 1, 0),
(23, 'An', 'user1', '$2a$11$JsamE4LAaDszQSlSHEnYuONwljyDnuegChYZoInDYtB52PqXo8/yu', 2, 0),
(24, 'Long', 'user2', '$2a$11$XN5RHjMAPZJEQD0.E1Gf/ersGadAz1QepQy0vmobUqzXltOVQuQRS', 2, 0),
(25, 'Phong', 'user3', '$2a$11$mLBlCoAqfCTE/jK6w4PkOe9i7XZ4R3yPfu9.75knyuA1GrJzSqXiy', 2, 1),
(26, 'Tuan', 'user4', '$2a$11$XTWgCwvimiXmSYbTTqx2GesX7O5CsBpTxW0zcVLv7PX2BI/N/384m', 2, 0),
(27, 'Tuan', 'admin4', '$2a$11$HuLEm.vPYb85Q87fYiPC0eK15Suze/.MtCRS.vEY9RCME4a/SCBnO', 1, 0),
(28, 'Trần Tuấn', 'newadmin', '$2a$11$4EwmKqzcR.r9DIr.dfHWmu35VdC2ftBek5zVizeQyF1S8/XD6.wEe', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `VehicleID` int(11) NOT NULL,
  `ModelNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `ManufactureDate` date DEFAULT NULL,
  `Color` varchar(50) DEFAULT NULL,
  `Mileage` int(11) DEFAULT NULL,
  `EngineType` varchar(50) DEFAULT NULL,
  `Status` enum('Available','Sold') DEFAULT NULL,
  `Vehiclecondition` enum('New','Used') DEFAULT NULL,
  `RegistrationDate` date DEFAULT NULL,
  `BrandID` int(11) DEFAULT NULL,
  `ImagePath` varchar(10000) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`VehicleID`, `ModelNumber`, `Name`, `Price`, `ManufactureDate`, `Color`, `Mileage`, `EngineType`, `Status`, `Vehiclecondition`, `RegistrationDate`, `BrandID`, `ImagePath`, `Quantity`) VALUES
(37, 'mv250', 'Mercedes V250 AMG ', 151000.00, '2024-01-01', 'black', 0, 'I4 (1991 cc)', 'Available', 'New', NULL, 2, '/uploads/vehicles/305e35e3-c7fe-4389-a44c-889a7c60092b.jpg', 5),
(38, 'ms650', 'Mercedes maybach s650', 604000.00, '2024-01-01', 'white', 0, 'V12', 'Available', 'New', NULL, 2, '/uploads/vehicles/b572ade0-6650-46e8-a39b-f510757ef5b8.jpg', 1),
(39, 'ms600', 'Mercedes maybach s600', 555000.00, '2024-01-01', 'brown', 0, 'V12', 'Available', 'New', NULL, 2, '/uploads/vehicles/729ba92d-0a31-45ac-8aff-58c50f300a10.jpg', 1),
(40, 'ms63', 'Mercedes S63', 200000.00, '2024-01-01', 'customer white black', 300, 'V12', 'Available', 'Used', NULL, 2, '/uploads/vehicles/8104e66a-d09f-4ac3-84bb-aead7eeaa624.jpg', 1),
(41, 'mgclass', 'Mercedes G-Class', 400000.00, '2024-01-01', 'blue', 50000, 'V8', 'Available', 'Used', NULL, 2, '/uploads/vehicles/6f765f1c-68e2-4749-a4ac-09bd9929eba0.jpg', 1),
(42, 'mg63', 'Mercedes G-63', 420000.00, '2024-01-01', 'black', 5050, 'V8', 'Available', 'Used', NULL, 2, '/uploads/vehicles/1a6740d9-59f2-4dfb-a2dc-ae361c976ee7.jpg', 1),
(43, 'mc200', 'Mercedes C200', 55000.00, '2024-01-01', 'white', 0, 'I4', 'Available', 'New', NULL, 2, '/uploads/vehicles/b06bfdfc-63b6-4f2e-a30e-24267a2d4210.jpg', 3),
(44, 'me300', 'Mercedes e300', 80000.00, '2024-01-01', 'white', 0, 'I4 (1991 cc)', 'Available', 'New', NULL, 2, '/uploads/vehicles/0e0f55e4-d293-4e75-99d3-5c949a8d8f63.jpg', 4),
(45, 'mc300', 'Mercedes C300', 60000.00, '2024-01-01', 'white', 0, 'I4 (1991 cc)', 'Available', 'New', NULL, 2, '/uploads/vehicles/1b87fbb6-222e-4391-ae70-084682f33b7e.jpg', 5),
(46, 'mamg-gt', 'Mercedes AMG-GT', 129000.00, '2024-01-01', 'black', 5000, 'V8', 'Available', 'Used', NULL, 2, '/uploads/vehicles/d025a62a-e0a9-46c1-bc01-a9f72ca626a4.jpg', 1),
(47, 'htucson', 'Hyundai Tucson', 32000.00, '2024-01-01', 'black', 0, '2.0 L', 'Available', 'New', NULL, 4, '/uploads/vehicles/6a65b459-4529-415b-8114-b2d21d31ab3c.jpg', 2),
(48, 'hsolati', 'Solati', 44345.00, '2024-01-01', 'black', 10000, 'D4CB Euro IV', 'Available', 'Used', NULL, 4, '/uploads/vehicles/5b7b5581-727a-4046-9d5d-10cadc953ee3.jpg', 1),
(49, 'hsantafe', 'Hyundai Santa Fe', 42000.00, '2024-01-01', 'blue', 0, 'Smartstream G2.5 Turbo', 'Available', 'New', NULL, 4, '/uploads/vehicles/37576dfe-5124-47e3-a126-0fb09720881f.jpg', 5),
(50, 'hsantaCruz', 'Hyundai Santa Cruz', 40000.00, '2024-01-01', 'blue', 0, ' 2.5L Turbocharged 4-cylinder', 'Available', 'New', NULL, 4, '/uploads/vehicles/848be5be-3b36-4e83-8b92-2aa083641b29.jpg', 2),
(51, 'hkona', 'Hyundai Kona', 28000.00, '2024-01-01', 'red', 0, '2.0L 4-cylinder, 4-cylinder', 'Available', 'New', NULL, 4, '/uploads/vehicles/4183d805-254f-495a-a4a5-bb91779047cf.jpg', 4),
(52, 'hds2000', 'Honda S2000', 30000.00, '2024-01-01', 'grey customer', 10000, 'V-TEC 2.2L', 'Sold', 'Used', '2024-10-13', 3, '/uploads/vehicles/41b237b9-b78e-46f7-861a-f2da416cdd8b.jpg', 0),
(53, 'hdridgeline', 'Honda Ridgeline', 50500.00, '2024-01-01', 'red', 0, 'V-TEC V6 3.5L', 'Sold', 'New', '2024-10-13', 3, '/uploads/vehicles/c17e0f0c-efb4-4f31-9bde-7928975ae36c.jpg', 0),
(54, 'hdjdm', 'Honda Jdm', 25000.00, '2024-01-01', 'blue', 50000, '2.5', 'Sold', 'Used', '2024-10-14', 3, '/uploads/vehicles/f515648e-e69b-4840-94f0-e044e63acffa.webp', 0),
(55, 'dhcrv', 'Honda CRV', 45000.00, '2024-01-01', 'white', 0, 'Hybrid', 'Sold', 'New', NULL, 3, '/uploads/vehicles/d8bc8e31-4373-497a-9230-e24860caa8fe.jpg', 0),
(56, 'dhcivic', 'Honda Civic', 60471.00, '2024-01-01', 'white', 0, '1.5L DOHC VTEC TURBO', 'Available', 'New', NULL, 3, '/uploads/vehicles/ae855b46-17e5-43b0-8a2f-014a9e98c984.jpg', 2),
(57, 'hdaccord', 'Honda Accord', 53000.00, '2024-01-01', 'black', 0, '1.5L DOHC VTEC TURBO', 'Available', 'New', NULL, 3, '/uploads/vehicles/0798dab8-ec14-41da-a93d-64ccfeb9213d.jpg', 3),
(58, 'ttacoma', 'Toyota Tacoma', 33000.00, '2024-01-01', 'white', 0, '2.4 I4', 'Available', 'New', NULL, 1, '/uploads/vehicles/62e73455-d53c-41ac-bd15-e6f057e16b36.png', 2),
(59, 'tSupra', 'Toyota Supra', 51303.00, '2024-01-01', 'grey customer', 5000, ' 2JZ', 'Sold', 'Used', NULL, 1, '/uploads/vehicles/37fb3550-89d5-4b83-bdf2-6b8ab756d12a.jpg', 0),
(60, 'tHighlander', 'Toyota Highlander', 65000.00, '2024-01-01', 'grey, black ', 0, '2.4L', 'Available', 'New', NULL, 1, '/uploads/vehicles/126618ee-eb91-4ba6-94e2-93f0bed06da5.webp', 1),
(61, 'tCruiser', 'Toyota Land Cruiser', 175000.00, '2024-01-01', 'white', 10000, 'V8', 'Sold', 'Used', NULL, 1, '/uploads/vehicles/897e721a-6e7c-4ac1-bae1-4652d8da4d34.jpg', 0),
(62, 'tCros', 'Toyota Cros', 32000.00, '2024-01-01', 'white', 0, '1.8L', 'Available', 'New', NULL, 1, '/uploads/vehicles/14eb41bc-4c79-417a-8268-78dd9ba12ca8.jpg', 6),
(63, 'tcorona', 'Toyota corona', 33500.00, '2024-01-01', 'white', 0, '1.8L', 'Available', 'New', NULL, 1, '/uploads/vehicles/c787a10c-9831-439a-8671-15216f70e83f.jpg', 1),
(64, 'tcamry', 'Toyota Camry', 45500.00, '2024-01-01', 'black', 0, '2.5 HEV', 'Available', 'New', NULL, 1, '/uploads/vehicles/17e265f0-71f4-44fd-9f7d-fb913e89860f.jpg', 10);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_import_orders`
--

CREATE TABLE `vehicle_import_orders` (
  `PurchaseOrderID` int(11) NOT NULL,
  `VehicleID` int(11) NOT NULL,
  `OrderDate` date NOT NULL,
  `Quantity` int(11) NOT NULL,
  `TotalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_import_orders`
--

INSERT INTO `vehicle_import_orders` (`PurchaseOrderID`, `VehicleID`, `OrderDate`, `Quantity`, `TotalPrice`) VALUES
(16, 37, '2024-01-02', 5, 525000.00),
(17, 40, '2024-01-02', 1, 180000.00),
(18, 38, '2024-01-02', 1, 550000.00),
(19, 39, '2024-01-02', 1, 500000.00),
(20, 41, '2024-01-02', 1, 388000.00),
(21, 42, '2024-01-02', 1, 410000.00),
(22, 43, '2024-01-02', 3, 150000.00),
(23, 44, '2024-01-02', 4, 280000.00),
(24, 45, '2024-01-02', 5, 275000.00),
(25, 46, '2024-01-02', 1, 111000.00),
(26, 52, '2024-01-02', 1, 25000.00),
(27, 53, '2024-02-01', 3, 125000.00),
(28, 54, '2024-01-02', 1, 20000.00),
(29, 55, '2024-01-02', 7, 240000.00),
(30, 56, '2024-01-02', 2, 100000.00),
(31, 57, '2024-01-02', 3, 130000.00),
(32, 47, '2024-01-02', 2, 55000.00),
(33, 48, '2024-01-02', 1, 40000.00),
(34, 49, '2024-01-02', 5, 175000.00),
(35, 50, '2024-01-02', 2, 65000.00),
(36, 51, '2024-01-02', 4, 100000.00),
(37, 58, '2024-01-02', 2, 60000.00),
(38, 59, '2024-01-02', 1, 48800.00),
(39, 60, '2024-01-02', 1, 60000.00),
(40, 61, '2024-01-02', 1, 166000.00),
(41, 62, '2024-01-02', 6, 165000.00),
(42, 63, '2024-01-02', 1, 30000.00),
(43, 64, '2024-01-02', 10, 400000.00);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_sales_orders`
--

CREATE TABLE `vehicle_sales_orders` (
  `SalesOrderID` int(11) NOT NULL,
  `VehicleID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `OrderDate` date NOT NULL,
  `SalesStatus` enum('Pending','Confirmed') DEFAULT 'Pending',
  `TotalPrice` decimal(10,2) NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_sales_orders`
--

INSERT INTO `vehicle_sales_orders` (`SalesOrderID`, `VehicleID`, `CustomerID`, `OrderDate`, `SalesStatus`, `TotalPrice`, `EmployeeID`, `Quantity`) VALUES
(14, 61, 6, '2024-02-29', 'Confirmed', 175000.00, 5, 1),
(15, 52, 5, '2024-01-03', 'Confirmed', 30000.00, 5, 1),
(16, 53, 7, '2024-02-02', 'Confirmed', 151500.00, 5, 3),
(17, 59, 8, '2024-01-03', 'Pending', 51303.00, 5, 1),
(18, 55, 7, '2024-01-03', 'Pending', 45000.00, 5, 1),
(19, 55, 7, '2024-01-03', 'Pending', 270000.00, 5, 6),
(20, 54, 8, '2024-01-03', 'Pending', 25000.00, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `view`
--

CREATE TABLE `view` (
  `contact` mediumtext NOT NULL,
  `contactmap` mediumtext NOT NULL,
  `mail` mediumtext NOT NULL,
  `showroomType` mediumtext NOT NULL,
  `footerslogan` mediumtext NOT NULL,
  `ShopIntroduction` mediumtext NOT NULL,
  `Id` int(11) NOT NULL,
  `mapType` mediumtext NOT NULL,
  `urlFace` varchar(1000) NOT NULL,
  `urltwitter` varchar(1000) NOT NULL,
  `urlinstagram` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `view`
--

INSERT INTO `view` (`contact`, `contactmap`, `mail`, `showroomType`, `footerslogan`, `ShopIntroduction`, `Id`, `mapType`, `urlFace`, `urltwitter`, `urlinstagram`) VALUES
('01 234 567 88', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9242787860853!2d105.81645427596987!3d21.0357155875383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab145bf89bd7%3A0xd94a869b494c04b6!2zMjg1IFAuIMSQ4buZaSBD4bqlbiwgTGnhu4V1IEdpYWksIEJhIMSQw6xuaCwgSMOgIE7hu5lpIDEwMDAwMCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1728456855359!5m2!1sen!2s', 'info@example.com', 'Auto Group2', 'If you want beautiful, durable, and reputable cars, come to us.', ' AUTO Group2 JOINT STOCK COMPANY (AUTO Group2) specializes in importing and distributing used & new cars. Currently, Auto 568 owns a large scale in terms of personnel and modern equipment.\nAlways try to bring customers satisfaction in terms of service style along with professional staff.\nSome of the outstanding models of Auto Group2 currently on sale:\nAuto Group2 specializes in famous car models in the world such as: Rolls-Royce, Ferrari, Bentley, Porsche, Jaguar, Land Rover, Audi, Lexus, Mercedes-Benz, BMW, Toyota, Acura, Jeep, Lincoln, Volvo, Ford, Tesla, Maserati, etc.\nSome of the models sold at Auto Group2 include: Bentley Flying Spur W12; Toyota Land Cruiser VX V8; Porsche 911 Carrera; Porsche Macan.\nAuto Group2\'s commitments to customers:\n- We always put the interests of our customers and reputation first.\n- A wide variety of car models from luxury car brands.\n- Committed to distributing cars that meet quality standards.\n- Prices are always competitive.\n- On time to hand over the car.\n- We support free delivery of cars nationwide to customers.\nIt is a pleasure to serve. Thank you for your trust when using Auto Group2\'s car services. Coming to us, you are completely assured by honest and professional advice.', 1, '285 Doi Can Street, Lieu Giai Street, Ba Dinh District, Hanoi City.', 'https://www.facebook.com', 'https://www.twitter.com', 'https://www.instagram.com');

-- --------------------------------------------------------

--
-- Table structure for table `waitinglist`
--

CREATE TABLE `waitinglist` (
  `WaitingListID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `VehicleID` int(11) DEFAULT NULL,
  `RequestDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waitinglist`
--

INSERT INTO `waitinglist` (`WaitingListID`, `CustomerID`, `VehicleID`, `RequestDate`) VALUES
(10, 5, 57, '2024-10-13'),
(11, 5, 39, '2024-01-03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`BillingID`),
  ADD KEY `SalesOrderID` (`SalesOrderID`),
  ADD KEY `fk_billing_service` (`serviceID`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`BrandID`),
  ADD UNIQUE KEY `BrandName` (`BrandName`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `header`
--
ALTER TABLE `header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`RoleID`),
  ADD UNIQUE KEY `RoleName` (`RoleName`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`ServiceID`),
  ADD KEY `SalesOrderID` (`SalesOrderID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `RoleID` (`RoleID`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`VehicleID`),
  ADD UNIQUE KEY `ModelNumber` (`ModelNumber`),
  ADD KEY `BrandID` (`BrandID`);

--
-- Indexes for table `vehicle_import_orders`
--
ALTER TABLE `vehicle_import_orders`
  ADD PRIMARY KEY (`PurchaseOrderID`),
  ADD KEY `VehicleID` (`VehicleID`);

--
-- Indexes for table `vehicle_sales_orders`
--
ALTER TABLE `vehicle_sales_orders`
  ADD PRIMARY KEY (`SalesOrderID`),
  ADD KEY `VehicleID` (`VehicleID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `view`
--
ALTER TABLE `view`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `waitinglist`
--
ALTER TABLE `waitinglist`
  ADD PRIMARY KEY (`WaitingListID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `VehicleID` (`VehicleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `BillingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `BrandID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `EmployeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `header`
--
ALTER TABLE `header`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `ServiceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `VehicleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `vehicle_import_orders`
--
ALTER TABLE `vehicle_import_orders`
  MODIFY `PurchaseOrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `vehicle_sales_orders`
--
ALTER TABLE `vehicle_sales_orders`
  MODIFY `SalesOrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `view`
--
ALTER TABLE `view`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `waitinglist`
--
ALTER TABLE `waitinglist`
  MODIFY `WaitingListID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`SalesOrderID`) REFERENCES `vehicle_sales_orders` (`SalesOrderID`),
  ADD CONSTRAINT `fk_billing_service` FOREIGN KEY (`serviceID`) REFERENCES `services` (`ServiceID`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`SalesOrderID`) REFERENCES `vehicle_sales_orders` (`SalesOrderID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`BrandID`) REFERENCES `brands` (`BrandID`);

--
-- Constraints for table `vehicle_import_orders`
--
ALTER TABLE `vehicle_import_orders`
  ADD CONSTRAINT `vehicle_import_orders_ibfk_1` FOREIGN KEY (`VehicleID`) REFERENCES `vehicles` (`VehicleID`);

--
-- Constraints for table `vehicle_sales_orders`
--
ALTER TABLE `vehicle_sales_orders`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  ADD CONSTRAINT `vehicle_sales_orders_ibfk_1` FOREIGN KEY (`VehicleID`) REFERENCES `vehicles` (`VehicleID`),
  ADD CONSTRAINT `vehicle_sales_orders_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`);

--
-- Constraints for table `waitinglist`
--
ALTER TABLE `waitinglist`
  ADD CONSTRAINT `waitinglist_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  ADD CONSTRAINT `waitinglist_ibfk_2` FOREIGN KEY (`VehicleID`) REFERENCES `vehicles` (`VehicleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
