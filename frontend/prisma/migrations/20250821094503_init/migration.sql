-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "preferences" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "buses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "busNumber" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "gpsDeviceId" TEXT NOT NULL,
    "currentLocation" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "polyline" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "stops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "location" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "stops_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "busId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "daysActive" INTEGER NOT NULL,
    "frequencyMin" INTEGER,
    "baseEtaProfile" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "schedules_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "schedules_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "telemetry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "busId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "location" JSONB NOT NULL,
    "speed" REAL,
    "heading" REAL,
    "trafficLevel" INTEGER,
    "delayMin" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "telemetry_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "fromStopId" TEXT NOT NULL,
    "toStopId" TEXT NOT NULL,
    "seatType" TEXT NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "fare" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "holdExpiresAt" DATETIME,
    "paymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_fromStopId_fkey" FOREIGN KEY ("fromStopId") REFERENCES "stops" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_toStopId_fkey" FOREIGN KEY ("toStopId") REFERENCES "stops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "orderId" TEXT,
    "paymentId" TEXT,
    "signature" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'created',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "metrics" JSONB,
    "artifactPath" TEXT,
    "featureSchema" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "analytics_cache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportType" TEXT NOT NULL,
    "paramsHash" TEXT NOT NULL,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "buses_busNumber_key" ON "buses"("busNumber");

-- CreateIndex
CREATE UNIQUE INDEX "buses_registrationNo_key" ON "buses"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "buses_gpsDeviceId_key" ON "buses"("gpsDeviceId");

-- CreateIndex
CREATE INDEX "stops_routeId_idx" ON "stops"("routeId");

-- CreateIndex
CREATE INDEX "stops_index_idx" ON "stops"("index");

-- CreateIndex
CREATE INDEX "schedules_busId_idx" ON "schedules"("busId");

-- CreateIndex
CREATE INDEX "schedules_routeId_idx" ON "schedules"("routeId");

-- CreateIndex
CREATE INDEX "telemetry_busId_idx" ON "telemetry"("busId");

-- CreateIndex
CREATE INDEX "telemetry_timestamp_idx" ON "telemetry"("timestamp");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_busId_idx" ON "bookings"("busId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_bookingId_idx" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_paymentId_idx" ON "payments"("paymentId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "ai_models_modelName_idx" ON "ai_models"("modelName");

-- CreateIndex
CREATE INDEX "ai_models_version_idx" ON "ai_models"("version");

-- CreateIndex
CREATE INDEX "analytics_cache_reportType_idx" ON "analytics_cache"("reportType");

-- CreateIndex
CREATE INDEX "analytics_cache_computedAt_idx" ON "analytics_cache"("computedAt");
