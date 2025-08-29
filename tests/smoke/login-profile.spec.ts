import { test, expect } from '@playwright/test';

test.describe('Auth smoke', () => {
  test('login with quick user and open profile', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Probar usuario (recomendado)' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toHaveCount(0);

    await page.goto('/profile');
    await expect(page.getByText('le.tester+123@example.com')).toBeVisible();
  });
});
