-- CreateIndex
CREATE INDEX "booking_status_idx" ON "booking"("status");

-- CreateIndex
CREATE INDEX "booking_userId_status_idx" ON "booking"("userId", "status");

-- CreateIndex
CREATE INDEX "booking_createdAt_idx" ON "booking"("createdAt");

-- CreateIndex
CREATE INDEX "booking_status_createdAt_idx" ON "booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX "departure_status_startDate_idx" ON "departure"("status", "startDate");

-- CreateIndex
CREATE INDEX "package_isActive_idx" ON "package"("isActive");

-- CreateIndex
CREATE INDEX "package_packageType_idx" ON "package"("packageType");

-- CreateIndex
CREATE INDEX "package_isActive_packageType_idx" ON "package"("isActive", "packageType");

-- CreateIndex
CREATE INDEX "package_isActive_packageType_division_idx" ON "package"("isActive", "packageType", "division");

-- CreateIndex
CREATE INDEX "package_division_idx" ON "package"("division");

-- CreateIndex
CREATE INDEX "package_isBestseller_idx" ON "package"("isBestseller");

-- CreateIndex
CREATE INDEX "package_createdAt_idx" ON "package"("createdAt");
