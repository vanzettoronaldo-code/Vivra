CREATE TABLE `service_providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('manutencao','limpeza','seguranca','eletrica','hidraulica','climatizacao','jardinagem','outros') NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`document` varchar(20),
	`address` text,
	`rating` decimal(2,1) DEFAULT '0.0',
	`totalServices` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`providerId` int NOT NULL,
	`assetId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pendente','andamento','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
	`priority` enum('baixa','media','alta','urgente') NOT NULL DEFAULT 'media',
	`scheduledDate` timestamp,
	`completedDate` timestamp,
	`cost` decimal(10,2),
	`rating` int,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
