//Here you will require route files and export them as used in previous labs.

import { Router } from "express";
import adminDashboardRoutes from './adminDashboard.js';
import userDashboardRoutes from './userDashboard.js';

export const dashboardRoutes = (app) => {
    app.use('/dashboard/admin', adminDashboardRoutes);
    app.use('/dashboard/user', userDashboardRoutes);
};