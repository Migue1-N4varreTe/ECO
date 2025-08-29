import { test, expect } from '@playwright/test';

test.describe('Auth smoke', () => {
  test('login with quick user and open profile', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Probar usuario (recomendado)' }).click();
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 15000 });

    await page.goto('/profile');
    await expect(page.getByText('le.tester+123@example.com')).toBeVisible();
  });
});
