CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`companyId` int NOT NULL,
	`recurrenceAnalysisId` int,
	`title` varchar(255) NOT NULL,
	`message` text,
	`severity` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`location` varchar(255),
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`companyId` int NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`url` text NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileName` varchar(255),
	`fileSize` int,
	`attachmentType` enum('photo','audio') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`ownerUserId` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurrence_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`companyId` int NOT NULL,
	`problemKeyword` varchar(255) NOT NULL,
	`occurrenceCount` int NOT NULL DEFAULT 0,
	`lastOccurrenceDate` timestamp,
	`frequency` varchar(50),
	`isAlertActive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurrence_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeline_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`companyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('problem','maintenance','decision','inspection') NOT NULL,
	`authorId` int NOT NULL,
	`transcription` text,
	`recordedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `userRole` enum('admin','collaborator','viewer') DEFAULT 'collaborator' NOT NULL;