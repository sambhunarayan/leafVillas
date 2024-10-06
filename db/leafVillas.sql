-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 04, 2024 at 05:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leafVillas`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_bannerImages`
--

CREATE TABLE `tb_bannerImages` (
  `id` int(11) NOT NULL,
  `bannerImage` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_bannerImages`
--

INSERT INTO `tb_bannerImages` (`id`, `bannerImage`) VALUES
(1, 'bannerImg1727083235765.jpeg'),
(2, 'bannerImg1727083415996.jpeg'),
(3, 'bannerImg1727083778522.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `tb_featuredVillas`
--

CREATE TABLE `tb_featuredVillas` (
  `villaId` int(11) NOT NULL,
  `villaName` varchar(30) NOT NULL,
  `roomNo` int(11) NOT NULL,
  `guestNo` int(11) NOT NULL,
  `propertyDescription` longtext NOT NULL,
  `location` varchar(200) NOT NULL,
  `petFriendly` tinyint(1) NOT NULL,
  `privatePool` tinyint(1) NOT NULL,
  `privateLawn` tinyint(1) NOT NULL,
  `luxury` tinyint(1) NOT NULL,
  `isVerified` tinyint(1) NOT NULL,
  `amenities` longtext NOT NULL,
  `houseRules` longtext NOT NULL,
  `policies` longtext NOT NULL,
  `services` longtext NOT NULL,
  `nearbyAttractions` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_featuredVillas`
--

INSERT INTO `tb_featuredVillas` (`villaId`, `villaName`, `roomNo`, `guestNo`, `propertyDescription`, `location`, `petFriendly`, `privatePool`, `privateLawn`, `luxury`, `isVerified`, `amenities`, `houseRules`, `policies`, `services`, `nearbyAttractions`) VALUES
(1, 'Nashik Villa', 3, 2, 'The 3.5 BHK Ekostay Kingfisher Villa in Lonavala provides an ideal staycation experience, allowing you to immerse yourself in the picturesque valleys and breathtaking views that Lonavala has to offer.', 'Mathoshri Villa, Ambey valley road, Ahead of Tiger Point, Lonavala 412108', 0, 0, 0, 0, 0, '', '', '', '', ''),
(2, 'Lonavala Villa', 2, 6, 'Situated beyond Tiger Point on Amby Valley Road, this villa offers a private indoor pool for you to relax in with your loved ones, all while soaking in the beauty of the hills, trees, and fireflies.', 'Mathoshri Villa, Ambey valley road, Ahead of Tiger Point, Lonavala 412108', 0, 0, 0, 0, 0, '', '', '', '', ''),
(3, 'test', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(4, 'ARIA LAKE VIEW', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(5, 'BAGA BEACH VILLA', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(6, 'COCONUT GROOVE VILLA', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(7, 'DREAM VILLA', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(8, 'EAST COAST VILLA', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test'),
(9, 'GRAND VILLA', 1, 2, 'test', 'test', 0, 1, 0, 1, 0, 'test', 'test', 'test', 'test', 'test');

-- --------------------------------------------------------

--
-- Table structure for table `tb_images`
--

CREATE TABLE `tb_images` (
  `imageId` int(11) NOT NULL,
  `imageName` varchar(50) NOT NULL,
  `villaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_images`
--

INSERT INTO `tb_images` (`imageId`, `imageName`, `villaId`) VALUES
(1, 'IMG-20240607-WA0075.jpg', 1),
(2, 'IMG-20240607-WA0076.jpg', 2),
(3, 'IMG-20240607-WA0077.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_login`
--

CREATE TABLE `tb_login` (
  `loginId` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `type` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_login`
--

INSERT INTO `tb_login` (`loginId`, `username`, `password`, `type`, `status`) VALUES
(1, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_region`
--

CREATE TABLE `tb_region` (
  `id` int(11) NOT NULL,
  `region` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_region`
--

INSERT INTO `tb_region` (`id`, `region`) VALUES
(1, 'test'),
(2, 'Alibaug'),
(3, 'Himachal'),
(4, 'Igatpuri'),
(5, 'Karjat'),
(6, 'Lonavala');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_bannerImages`
--
ALTER TABLE `tb_bannerImages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_featuredVillas`
--
ALTER TABLE `tb_featuredVillas`
  ADD PRIMARY KEY (`villaId`);

--
-- Indexes for table `tb_images`
--
ALTER TABLE `tb_images`
  ADD PRIMARY KEY (`imageId`);

--
-- Indexes for table `tb_login`
--
ALTER TABLE `tb_login`
  ADD PRIMARY KEY (`loginId`);

--
-- Indexes for table `tb_region`
--
ALTER TABLE `tb_region`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_bannerImages`
--
ALTER TABLE `tb_bannerImages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_featuredVillas`
--
ALTER TABLE `tb_featuredVillas`
  MODIFY `villaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tb_images`
--
ALTER TABLE `tb_images`
  MODIFY `imageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_login`
--
ALTER TABLE `tb_login`
  MODIFY `loginId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_region`
--
ALTER TABLE `tb_region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
