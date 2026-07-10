import { test, expect } from '@playwright/test';

test.describe('CareerLensAI End-to-End User Flow', () => {
  test('Complete Candidate Journey (Signup -> Login -> Upload -> Dashboard -> Logout)', async ({ page }) => {
    // Generate unique credentials for registration
    const uniqueId = Math.random().toString(36).substring(7);
    const email = `e2e_${uniqueId}@example.com`;
    const fullName = `E2E Tester ${uniqueId}`;
    const password = `SecurePass123!`;

    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/CareerLensAI/);

    // 2. Click primary CTA to trigger Login page
    await page.click('text=Log In');
    await expect(page).toHaveURL(/\/login/);

    // 3. Navigate to Signup from Login screen link
    await page.click('text=Create Account');
    await expect(page).toHaveURL(/\/signup/);

    // 4. Fill registration form
    await page.fill('input[placeholder="Samarth"]', fullName);
    await page.fill('input[placeholder="samarth@example.com"]', email);
    // Find passwords by type or placeholder
    const passInputs = page.locator('input[type="password"]');
    await passInputs.nth(0).fill(password);
    await passInputs.nth(1).fill(password);
    // Check Terms checkbox
    await page.click('input[type="checkbox"]', { force: true });
    // Submit registration
    await page.click('button[type="submit"]');

    // 5. Registration Success Modal should transition back to Login
    await page.waitForURL(/\/verify-email|\/login/, { timeout: 8000 });
    
    // If it navigates to verify-email, click back to login or let the app redirect
    if (page.url().includes('verify-email')) {
      await page.goto('/login');
    }

    // 6. Login with registered credentials
    await page.fill('input[placeholder="samarth@example.com"]', email);
    await page.locator('input[type="password"]').fill(password);
    await page.click('button[type="submit"]');

    // 7. Verify login success and redirection to upload workspace
    await page.waitForURL(/\/upload/, { timeout: 8000 });
    await expect(page.locator('h1')).toContainText(/Scan Your Resume/);

    // 8. Upload mock PDF resume document
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Browse Files")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'E2E_Resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 mock text Python, SQL, React developer details')
    });

    // 9. Watch processing states and wait for Success transition screen
    await expect(page.locator('button:has-text("View Dashboard")')).toBeVisible({ timeout: 15000 });

    // 10. Click explore to load dashboard
    await page.click('button:has-text("View Dashboard")');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // 11. Verify dashboard features
    await expect(page.locator('h3:has-text("ATS Score")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Integration"), span:has-text("E2E")').first()).toBeVisible();

    // 12. Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL(/\//);
  });
});
