import { test, expect } from '@playwright/test';

test.describe('Work Orders', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should display work orders list', async ({ page }) => {
    await page.goto('/work-orders');
    await expect(page.getByText('Work Orders')).toBeVisible();
  });

  test('should create new work order', async ({ page }) => {
    await page.goto('/work-orders/new');
    
    // Fill basic info
    await page.selectOption('select[id="serviceType"]', 'maintenance');
    await page.selectOption('select[id="priority"]', 'medium');
    
    // Fill customer info
    await page.fill('input[id="customerName"]', 'John Doe');
    await page.fill('input[id="email"]', 'john@example.com');
    await page.fill('input[id="phone"]', '(555) 123-4567');
    
    // Fill machine info
    await page.fill('input[id="model"]', 'SRX');
    await page.fill('input[id="serialNumber"]', 'SRX123456');
    
    await page.click('button:has-text("Save Work Order")');
    
    await expect(page.getByText('Work order created successfully')).toBeVisible();
  });
});