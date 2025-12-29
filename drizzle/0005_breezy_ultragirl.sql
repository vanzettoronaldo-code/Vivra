ALTER TABLE `users` ADD `approvalPrefCriticalRecords` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `approvalPrefImportantDecisions` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `approvalPrefHighSeverity` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `approvalPrefAutoNotify` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifPrefNewRecords` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifPrefCriticalProblems` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifPrefWeeklySummary` boolean DEFAULT true NOT NULL;